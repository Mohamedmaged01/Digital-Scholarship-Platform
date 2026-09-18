<?php

namespace App\Http\Controllers;

use App\Models\SiteSetting;
use App\Services\Ai\AiAdvisor;
use App\Services\Ai\TrackRecommender;
use App\Support\AdvisorMarkdown;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

/**
 * Endpoints behind the chat widget and the track recommender wizard.
 *
 * Both features degrade to full page loads without JavaScript; these routes are
 * what the Alpine components call when it is available.
 */
class AiAdvisorController extends Controller
{
    public function chat(Request $request, AiAdvisor $advisor): JsonResponse
    {
        abort_unless(SiteSetting::get('allow_public_ai_chat', true), 403);

        $validated = $request->validate([
            'message' => ['required', 'string', 'max:1000'],
            'history' => ['nullable', 'array', 'max:12'],
            'history.*.role' => ['required_with:history', Rule::in(['user', 'assistant'])],
            'history.*.text' => ['required_with:history', 'string', 'max:4000'],
        ]);

        $result = $advisor->ask(
            $validated['message'],
            // API consumers have no session; fall back to the client address.
            $request->hasSession() ? $request->session()->getId() : 'api-'.sha1((string) $request->ip()),
            $validated['history'] ?? [],
        );

        return response()->json([
            'answer' => $result['answer'],
            'html' => AdvisorMarkdown::toHtml($result['answer']),
            'source' => $result['source'],
            'suggestions' => $result['suggestions'],
        ]);
    }

    public function recommend(Request $request, TrackRecommender $recommender): JsonResponse
    {
        $validated = $request->validate([
            'degree' => ['required', Rule::in(['Bachelor', 'Master', 'PhD', 'Fellowship'])],
            'field' => ['required', Rule::in(array_keys(TrackRecommender::FIELDS))],
            'gpa' => ['required', 'numeric', 'min:1', 'max:5'],
            'english' => ['required', 'numeric', 'min:1', 'max:9'],
            'goal' => ['required', Rule::in(array_keys(TrackRecommender::GOALS))],
            'destination' => ['required', Rule::in(array_keys(TrackRecommender::DESTINATIONS))],
        ]);

        $result = $recommender->recommend($validated);

        return response()->json([
            'track' => [
                'id' => $result['track']->id,
                'name' => $result['track']->name,
                'code' => $result['track']->code,
                'badge_color' => $result['track']->badge_color,
                'url' => route('tracks.show', $result['track']),
                'apply_url' => $result['track']->applyUrl(),
            ],
            'score' => $result['score'],
            'reasons' => $result['reasons'],
            'criteria' => $result['criteria'],
            'universities' => $result['universities']->map(fn ($university): array => [
                'name' => $university->name,
                'rank' => $university->qs_rank,
                'country' => $university->country,
                'url' => route('universities.show', $university),
            ])->all(),
            'runner_ups' => collect($result['runner_ups'])->map(fn (array $entry): array => [
                'name' => $entry['track']->name,
                'score' => $entry['score'],
                'url' => route('tracks.show', $entry['track']),
            ])->all(),
        ]);
    }
}
