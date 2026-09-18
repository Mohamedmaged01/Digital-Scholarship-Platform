<?php

namespace App\Http\Controllers;

use App\Models\ScholarshipTrack;
use App\Services\EligibilityEngine;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class EligibilityController extends Controller
{
    public function __invoke(Request $request, EligibilityEngine $engine): JsonResponse
    {
        $validated = $request->validate([
            'track_id' => ['required', 'exists:scholarship_tracks,id'],
            'gpa' => ['required', 'numeric', 'min:1', 'max:5'],
            'ielts_score' => ['nullable', 'numeric', 'min:1', 'max:9'],
            'age' => ['nullable', 'integer', 'min:16', 'max:70'],
            'degree_level' => ['nullable', 'string', 'max:32'],
            'university_rank' => ['nullable', 'integer', 'min:1', 'max:2000'],
            'admission_type' => ['nullable', 'in:unconditional,conditional_language,conditional_academic'],
            'university_id' => ['nullable', 'exists:universities,id'],
        ]);

        $track = ScholarshipTrack::findOrFail($validated['track_id']);
        $sessionId = $request->hasSession() ? $request->session()->getId() : 'api-'.sha1((string) $request->ip());
        $report = $engine->evaluate($track, $validated, $sessionId);

        return response()->json([
            'track' => ['id' => $track->id, 'name' => $track->name],
            'decision' => $report['decision'],
            'decision_label' => __('eligibility.decisions.'.$report['decision']),
            'score' => $report['score'],
            'matched' => $report['matched'],
            'failed' => $report['failed'],
            'warnings' => $report['warnings'],
        ]);
    }
}
