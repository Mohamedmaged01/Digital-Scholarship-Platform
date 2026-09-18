<?php

namespace App\Services\Ai;

use App\Models\AiConfig;
use App\Models\AiTelemetry;
use App\Models\AnalyticsCounter;
use App\Models\Faq;
use App\Models\ScholarshipTrack;
use App\Models\UnansweredQuestion;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Throwable;

/**
 * Answers a visitor's question, in this order:
 *
 *   1. the published FAQ bank, when it holds a close match;
 *   2. Gemini, when a key is configured and the admin enabled that driver;
 *   3. the rule-based knowledge engine.
 *
 * Every call is timed into ai_telemetry, and anything the platform could not
 * answer confidently is queued for the AI manager to turn into an official FAQ.
 */
class AiAdvisor
{
    public function __construct(
        protected ScholarshipKnowledgeEngine $engine,
        protected GeminiClient $gemini,
    ) {}

    /**
     * @param  list<array{role: string, text: string}>  $history
     * @return array{answer: string, source: string, suggestions: list<string>, request_id: string}
     */
    public function ask(string $question, ?string $sessionId = null, array $history = []): array
    {
        $config = AiConfig::current();
        $locale = $this->detectLocale($question);
        $requestId = 'chat_'.Str::lower(Str::random(10));
        $startedAt = microtime(true);

        if (! $config->is_enabled) {
            return $this->result(
                $requestId,
                $config->localized('fallback_message', $locale) ?: $this->engine->greeting($locale),
                'disabled',
                $config,
                $locale,
                $startedAt,
            );
        }

        if ($config->use_faq_knowledge_base && $faq = $this->matchFaq($question, $locale)) {
            return $this->result($requestId, $faq, 'faq', $config, $locale, $startedAt);
        }

        if (config('kasp.ai.driver') === 'gemini' && $this->gemini->isConfigured()) {
            try {
                $answer = $this->gemini->generate(
                    $question,
                    $this->systemInstruction($config, $locale),
                    $history,
                    [
                        'model' => $config->model_name,
                        'temperature' => $config->temperature,
                        'max_output_tokens' => $config->max_output_tokens,
                    ],
                );

                return $this->result($requestId, $answer, 'gemini', $config, $locale, $startedAt);
            } catch (Throwable $exception) {
                Log::warning('AI advisor fell back to the knowledge engine.', [
                    'request_id' => $requestId,
                    'reason' => $exception->getMessage(),
                ]);

                $this->recordTelemetry($requestId, 'CHATBOT', 'gemini', $startedAt, 'FAILED', $exception->getMessage());
            }
        }

        $answer = $this->engine->answer($question, $locale);

        if ($config->log_unanswered && $this->engine->isFallback($question) && Str::length(trim($question)) > 8) {
            $this->queueUnanswered($question, $locale, $sessionId);
        }

        return $this->result($requestId, $answer, 'engine', $config, $locale, $startedAt);
    }

    public function suggestions(?string $locale = null): array
    {
        $config = AiConfig::current();
        $locale ??= app()->getLocale();

        $prompts = $config->localized('suggested_prompts', $locale);

        return filled($prompts) ? array_values((array) $prompts) : [];
    }

    public function greeting(?string $locale = null): string
    {
        return $this->engine->greeting($locale ?? app()->getLocale());
    }

    /** Which engine is live right now — surfaced in the AI manager. */
    public function activeDriver(): string
    {
        return config('kasp.ai.driver') === 'gemini' && $this->gemini->isConfigured() ? 'gemini' : 'engine';
    }

    // ------------------------------------------------------------------ Internals

    /**
     * Score published FAQs against the question and accept the best one only when
     * it clears a meaningful overlap, so unrelated questions fall through.
     */
    protected function matchFaq(string $question, string $locale): ?string
    {
        $words = collect(preg_split('/\s+/u', Str::lower($question), -1, PREG_SPLIT_NO_EMPTY))
            ->map(fn (string $word): string => trim($word, "؟?.,،!:؛\"'()[]"))
            ->filter(fn (string $word): bool => Str::length($word) > 3)
            ->unique();

        if ($words->count() < 1) {
            return null;
        }

        $best = null;
        $bestScore = 0.0;
        $bestHits = 0;

        foreach (Faq::published()->get() as $faq) {
            $haystack = Str::lower(implode(' ', [
                $faq->question_ar,
                $faq->question_en,
                implode(' ', $faq->tags ?? []),
            ]));

            $hits = $words->filter(fn (string $word): bool => Str::contains($haystack, $word))->count();
            $score = $hits / max(1, $words->count());

            if ($score > $bestScore) {
                $bestScore = $score;
                $bestHits = $hits;
                $best = $faq;
            }
        }

        // Two or more substantial words must line up. A single shared word is
        // coincidence, and the knowledge engine answers those better.
        if ($best === null || $bestHits < 2 || $bestScore < 0.6) {
            return null;
        }

        return $locale === 'ar' ? $best->answer_ar : ($best->answer_en ?: $best->answer_ar);
    }

    protected function systemInstruction(AiConfig $config, string $locale): string
    {
        $prompt = $config->localized('system_prompt', $locale) ?: '';

        $context = collect(ScholarshipTrack::published()->ordered()->get())
            ->map(fn ($track): string => sprintf(
                '- %s (%s): top %d, GPA >= %s/5, IELTS >= %s, degrees: %s',
                $track->name_en ?: $track->name_ar,
                $track->name_ar,
                $track->top_universities_rank_limit,
                $track->min_gpa,
                $track->required_ielts,
                implode('/', $track->required_degrees),
            ))
            ->implode("\n");

        return trim($prompt."\n\nPublished tracks and thresholds:\n".$context.
            "\n\nApplications are submitted only at ".config('kasp.apply_url').
            '. Answer in '.($locale === 'ar' ? 'Arabic' : 'English').'.');
    }

    protected function queueUnanswered(string $question, string $locale, ?string $sessionId): void
    {
        $existing = UnansweredQuestion::query()->where('question', $question)->first();

        if ($existing) {
            $existing->increment('hits');

            return;
        }

        UnansweredQuestion::create([
            'question' => $question,
            'language' => $locale,
            'category' => $this->guessCategory($question),
            'session_id' => $sessionId,
        ]);
    }

    protected function guessCategory(string $question): string
    {
        $clean = Str::lower($question);

        return match (true) {
            Str::contains($clean, ['جامع', 'universit']) => 'universities',
            Str::contains($clean, ['مسار', 'track']) => 'tracks',
            Str::contains($clean, ['مستند', 'وثيق', 'document']) => 'documents',
            Str::contains($clean, ['تأشير', 'visa']) => 'travel_prep',
            Str::contains($clean, ['شرط', 'معدل', 'requirement', 'gpa']) => 'requirements',
            default => 'general',
        };
    }

    /**
     * Answer in the language the question was asked in, whichever way the portal
     * happens to be switched at the time.
     */
    protected function detectLocale(string $text): string
    {
        if (preg_match('/\p{Arabic}/u', $text) === 1) {
            return 'ar';
        }

        return preg_match('/[A-Za-z]/', $text) === 1 ? 'en' : app()->getLocale();
    }

    protected function result(
        string $requestId,
        string $answer,
        string $source,
        AiConfig $config,
        string $locale,
        float $startedAt,
    ): array {
        if ($source !== 'disabled') {
            $this->recordTelemetry($requestId, 'CHATBOT', $source, $startedAt);
            AnalyticsCounter::bump('ai.chat_sessions');
        }

        return [
            'answer' => $answer,
            'source' => $source,
            'suggestions' => array_values((array) ($config->localized('suggested_prompts', $locale) ?: [])),
            'request_id' => $requestId,
        ];
    }

    public function recordTelemetry(
        string $requestId,
        string $operation,
        string $driver,
        float $startedAt,
        string $status = 'SUCCESS',
        ?string $error = null,
    ): void {
        AiTelemetry::create([
            'request_id' => $requestId,
            'operation' => $operation,
            'model' => $driver === 'gemini' ? config('kasp.ai.gemini.model') : 'kasp-knowledge-engine',
            'driver' => $driver,
            'latency_ms' => (int) round((microtime(true) - $startedAt) * 1000),
            'status' => $status,
            'error_message' => $error,
        ]);
    }
}
