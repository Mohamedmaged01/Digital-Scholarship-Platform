<?php

namespace App\Http\Controllers;

use App\Models\Faq;
use App\Models\ScholarshipTrack;
use App\Services\PlatformAnalytics;
use Illuminate\Contracts\View\View;
use Illuminate\Http\Request;

class TrackController extends Controller
{
    public function index(Request $request, PlatformAnalytics $analytics): View
    {
        $analytics->recordPageView($request->path());

        $degree = $request->string('degree')->toString() ?: 'all';

        $tracks = ScholarshipTrack::published()->ordered()->get()
            ->when(
                $degree !== 'all',
                fn ($collection) => $collection->filter(
                    fn (ScholarshipTrack $track): bool => in_array($degree, $track->required_degrees, true),
                ),
            );

        return view('tracks.index', [
            'tracks' => $tracks->values(),
            'degree' => $degree,
            'degreeOptions' => $this->degreeOptions(),
        ]);
    }

    public function show(Request $request, ScholarshipTrack $track, PlatformAnalytics $analytics): View
    {
        abort_unless($track->is_active && $track->is_published, 404);

        $analytics->recordPageView($request->path(), 'TRACK', $track->id);

        $track->load(['rules' => fn ($query) => $query->where('is_active', true)]);

        return view('tracks.show', [
            'track' => $track,
            'universities' => $track->universities()
                ->active()
                ->orderBy('qs_rank')
                ->limit(9)
                ->get(),
            'universitiesCount' => $track->universities()->active()->count(),
            'faqs' => Faq::published()
                ->where(fn ($query) => $query->where('related_track_id', $track->id)->orWhere('category', 'tracks'))
                ->ordered()
                ->limit(5)
                ->get(),
            'otherTracks' => ScholarshipTrack::published()->ordered()->whereKeyNot($track->id)->get(),
        ]);
    }

    /** @return array<string, string> */
    protected function degreeOptions(): array
    {
        return collect(['all', 'Bachelor', 'Master', 'PhD', 'Fellowship'])
            ->mapWithKeys(fn (string $value): array => [$value => __('catalog.degrees.'.$value)])
            ->all();
    }
}
