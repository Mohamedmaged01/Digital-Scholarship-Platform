<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\AiTelemetry;
use App\Models\ScholarshipTrack;
use App\Models\University;
use Illuminate\Http\JsonResponse;

class SystemController extends Controller
{
    public function health(): JsonResponse
    {
        return response()->json([
            'status' => 'HEALTHY',
            'service' => 'kasp-scholarship-portal',
            'version' => '2.0.0',
            'stack' => 'laravel/blade',
            'timestamp' => now()->toIso8601String(),
            'database' => ['status' => 'CONNECTED', 'driver' => config('database.default')],
        ]);
    }

    public function metrics(): JsonResponse
    {
        return response()->json([
            'tracks' => ScholarshipTrack::query()->count(),
            'universities' => University::query()->count(),
            'ai_calls' => AiTelemetry::query()->count(),
            'ai_avg_latency_ms' => (int) round((float) AiTelemetry::query()->avg('latency_ms')),
            'memory_peak_bytes' => memory_get_peak_usage(true),
        ]);
    }
}
