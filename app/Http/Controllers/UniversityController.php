<?php

namespace App\Http\Controllers;

use App\Models\Country;
use App\Models\ScholarshipTrack;
use App\Models\University;
use App\Services\PlatformAnalytics;
use Illuminate\Contracts\View\View;
use Illuminate\Http\Request;

class UniversityController extends Controller
{
    public function index(Request $request, PlatformAnalytics $analytics): View
    {
        $analytics->recordPageView($request->path());

        $filters = [
            'q' => $request->string('q')->toString(),
            'country' => $request->string('country')->toString() ?: 'all',
            'track' => $request->string('track')->toString() ?: 'all',
            'degree' => $request->string('degree')->toString() ?: 'all',
            'tier' => $request->string('tier')->toString() ?: 'all',
        ];

        $universities = University::active()
            ->filter($filters)
            ->with('tracks:id,name_ar,name_en,badge_color')
            ->orderBy('qs_rank')
            ->paginate(9)
            ->withQueryString();

        if (filled($filters['q'])) {
            $analytics->recordSearch($filters['q'], $universities->total());
        }

        return view('universities.index', [
            'universities' => $universities,
            'filters' => $filters,
            'view' => $request->string('view')->toString() === 'list' ? 'list' : 'grid',
            'countries' => Country::query()->where('is_active', true)->orderBy('name_ar')->get(),
            'tracks' => ScholarshipTrack::published()->ordered()->get(['id', 'name_ar', 'name_en']),
            'degreeOptions' => collect(['all', 'Bachelor', 'Master', 'PhD', 'Fellowship'])
                ->mapWithKeys(fn (string $value): array => [$value => __('catalog.degrees.'.$value)])
                ->all(),
            'tierOptions' => collect(['all', 'top30', 'top100', 'top200'])
                ->mapWithKeys(fn (string $value): array => [$value => __('catalog.tiers.'.$value)])
                ->all(),
        ]);
    }

    public function show(Request $request, University $university, PlatformAnalytics $analytics): View
    {
        abort_unless($university->is_active, 404);

        $analytics->recordPageView($request->path(), 'UNIVERSITY', $university->id);

        $university->load(['tracks', 'hostCountry', 'culturalMission']);

        return view('universities.show', [
            'university' => $university,
            'similar' => University::active()
                ->where('country_code', $university->country_code)
                ->whereKeyNot($university->id)
                ->orderBy('qs_rank')
                ->limit(4)
                ->get(),
        ]);
    }
}
