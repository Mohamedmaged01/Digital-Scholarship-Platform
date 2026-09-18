<?php

namespace App\Services\Ai;

use Illuminate\Support\Facades\Http;
use RuntimeException;

/**
 * Thin wrapper over the Gemini generateContent endpoint.
 *
 * The advisor works without it — when no key is configured this client reports
 * itself unavailable and the caller answers from the knowledge engine instead.
 */
class GeminiClient
{
    public function isConfigured(): bool
    {
        return filled(config('kasp.ai.gemini.key'));
    }

    /**
     * @param  list<array{role: string, text: string}>  $history
     *
     * @throws RuntimeException when the call fails or returns no usable text.
     */
    public function generate(string $prompt, string $systemInstruction, array $history = [], array $options = []): string
    {
        if (! $this->isConfigured()) {
            throw new RuntimeException('Gemini is not configured.');
        }

        $contents = [];

        foreach ($history as $turn) {
            $contents[] = [
                'role' => $turn['role'] === 'assistant' ? 'model' : 'user',
                'parts' => [['text' => $turn['text']]],
            ];
        }

        $contents[] = ['role' => 'user', 'parts' => [['text' => $prompt]]];

        $model = $options['model'] ?? config('kasp.ai.gemini.model');
        $endpoint = rtrim((string) config('kasp.ai.gemini.endpoint'), '/')."/{$model}:generateContent";

        $response = Http::asJson()
            ->timeout((int) config('kasp.ai.gemini.timeout', 20))
            ->withHeaders(['x-goog-api-key' => (string) config('kasp.ai.gemini.key')])
            ->post($endpoint, [
                'systemInstruction' => ['parts' => [['text' => $systemInstruction]]],
                'contents' => $contents,
                'generationConfig' => [
                    'temperature' => (float) ($options['temperature'] ?? 0.4),
                    'maxOutputTokens' => (int) ($options['max_output_tokens'] ?? 1024),
                ],
            ]);

        if ($response->failed()) {
            throw new RuntimeException('Gemini request failed with status '.$response->status().'.');
        }

        $text = collect($response->json('candidates.0.content.parts', []))
            ->pluck('text')
            ->filter()
            ->implode("\n");

        if (blank($text)) {
            throw new RuntimeException('Gemini returned an empty response.');
        }

        return trim($text);
    }
}
