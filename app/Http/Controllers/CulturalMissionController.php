<?php

namespace App\Http\Controllers;

use App\Models\CulturalMission;
use App\Models\University;
use App\Services\PlatformAnalytics;
use Illuminate\Contracts\View\View;
use Illuminate\Http\Request;

class CulturalMissionController extends Controller
{
    public function index(Request $request, PlatformAnalytics $analytics): View
    {
        $analytics->recordPageView($request->path());

        $term = $request->string('q')->toString();

        $missions = CulturalMission::query()
            ->where('is_active', true)
            ->when(filled($term), function ($query) use ($term): void {
                $like = '%'.trim($term).'%';
                $query->where(function ($inner) use ($like): void {
                    $inner->where('country_ar', 'like', $like)
                        ->orWhere('country_en', 'like', $like)
                        ->orWhere('city_ar', 'like', $like)
                        ->orWhere('city_en', 'like', $like)
                        ->orWhere('attache_name_ar', 'like', $like)
                        ->orWhere('title_ar', 'like', $like);
                });
            })
            ->orderByDesc('active_students_count')
            ->get();

        return view('missions.index', [
            'missions' => $missions,
            'term' => $term,
            'totalScholars' => CulturalMission::query()->sum('active_students_count'),
        ]);
    }

    public function show(Request $request, CulturalMission $mission, PlatformAnalytics $analytics): View
    {
        $analytics->recordPageView($request->path(), 'MISSION', $mission->id);

        return view('missions.show', [
            'mission' => $mission,
            'universities' => University::active()
                ->where('cultural_mission_id', $mission->id)
                ->orderBy('qs_rank')
                ->get(),
        ]);
    }
}
