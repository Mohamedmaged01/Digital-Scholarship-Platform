<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AiConfig;
use App\Models\AiTelemetry;
use App\Models\Faq;
use App\Models\UnansweredQuestion;
use App\Services\Ai\AiAdvisor;
use App\Services\AuditLogger;
use Illuminate\Contracts\View\View;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

/**
 * Tunes the AI advisor and turns the questions it could not answer into official
 * FAQ entries, which in turn become part of its knowledge base.
 */
class AiManagerController extends Controller
{
    public function __construct(
        protected AuditLogger $audit,
        protected AiAdvisor $advisor,
    ) {}

    public function index(): View
    {
        return view('admin.ai.index', [
            'config' => AiConfig::current(),
            'driver' => $this->advisor->activeDriver(),
            'pending' => UnansweredQuestion::query()->pending()->limit(20)->get(),
            'answered' => UnansweredQuestion::query()->answered()->limit(10)->get(),
            'telemetry' => AiTelemetry::query()->newestFirst()->limit(15)->get(),
            'averageLatency' => (int) round((float) AiTelemetry::query()->avg('latency_ms')),
            'successRate' => $this->successRate(),
        ]);
    }

    public function updateConfig(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'model_name' => ['required', 'string', 'max:120'],
            'temperature' => ['required', 'numeric', 'min:0', 'max:2'],
            'max_output_tokens' => ['required', 'integer', 'min:128', 'max:8192'],
            'system_prompt_ar' => ['required', 'string'],
            'system_prompt_en' => ['nullable', 'string'],
            'fallback_message_ar' => ['required', 'string', 'max:600'],
            'fallback_message_en' => ['nullable', 'string', 'max:600'],
            'suggested_prompts_ar' => ['nullable', 'string'],
            'suggested_prompts_en' => ['nullable', 'string'],
            'is_enabled' => ['nullable', 'boolean'],
            'use_faq_knowledge_base' => ['nullable', 'boolean'],
            'log_unanswered' => ['nullable', 'boolean'],
        ]);

        $config = AiConfig::current();

        $config->fill([
            ...$data,
            'suggested_prompts_ar' => $this->lines($data['suggested_prompts_ar'] ?? null),
            'suggested_prompts_en' => $this->lines($data['suggested_prompts_en'] ?? null),
            'is_enabled' => $request->boolean('is_enabled'),
            'use_faq_knowledge_base' => $request->boolean('use_faq_knowledge_base'),
            'log_unanswered' => $request->boolean('log_unanswered'),
        ])->save();

        $this->audit->recordModel('UPDATE', 'AI', $config, __('admin.ai.config'), 'تعديل إعدادات المستشار الذكي');

        return back()->with('status', __('common.updated'));
    }

    /** Try a question against the live advisor without leaving the console. */
    public function test(Request $request): JsonResponse
    {
        $data = $request->validate([
            'message' => ['required', 'string', 'max:500'],
        ]);

        $result = $this->advisor->ask($data['message'], 'admin-test-'.$request->user()->id);

        return response()->json([
            'answer' => $result['answer'],
            'source' => $result['source'],
        ]);
    }

    /**
     * Publish an official answer: the question becomes a live FAQ entry and is
     * marked as handled.
     */
    public function answerQuestion(Request $request, UnansweredQuestion $question): RedirectResponse
    {
        $data = $request->validate([
            'answer' => ['required', 'string'],
            'question_en' => ['nullable', 'string'],
            'answer_en' => ['nullable', 'string'],
            'category' => ['required', 'string', 'max:64'],
        ]);

        // The English fields are optional; fall back to what the visitor asked
        // and to the Arabic answer so the FAQ is never half-populated.
        $questionEn = $data['question_en'] ?? null;
        $answerEn = $data['answer_en'] ?? null;

        $faq = Faq::create([
            'id' => 'faq-'.Str::lower(Str::random(8)),
            'question_ar' => $question->language === 'ar' ? $question->question : ($questionEn ?: $question->question),
            'question_en' => $questionEn ?: $question->question,
            'answer_ar' => $data['answer'],
            'answer_en' => $answerEn ?: $data['answer'],
            'category' => $data['category'],
            'tags' => [],
            'sort_order' => (int) Faq::query()->max('sort_order') + 1,
            'is_published' => true,
        ]);

        $question->forceFill([
            'official_answer' => $data['answer'],
            'answered_by' => $request->user()->full_name_ar,
            'answered_at' => now(),
        ])->save();

        $this->audit->record(
            action: 'ANSWER',
            entityType: 'AI',
            entityId: (string) $question->id,
            entityLabel: Str::limit($question->question, 60),
            summary: 'نشر إجابة رسمية وإضافتها لقاعدة المعرفة (سؤال شائع '.$faq->id.')',
        );

        return back()->with('status', __('admin.ai.answered'));
    }

    public function destroyQuestion(UnansweredQuestion $question): RedirectResponse
    {
        $label = Str::limit($question->question, 60);
        $question->delete();

        $this->audit->record('DELETE', 'AI', null, $label, 'حذف سؤال من قائمة الأسئلة غير المجابة');

        return back()->with('status', __('common.deleted'));
    }

    protected function successRate(): int
    {
        $total = AiTelemetry::query()->count();

        if ($total === 0) {
            return 100;
        }

        return (int) round((AiTelemetry::query()->where('status', 'SUCCESS')->count() / $total) * 100);
    }

    /** @return list<string> */
    protected function lines(?string $value): array
    {
        return collect(preg_split('/\r?\n/', (string) $value))
            ->map(fn (string $line): string => trim($line))
            ->filter()
            ->values()
            ->all();
    }
}
