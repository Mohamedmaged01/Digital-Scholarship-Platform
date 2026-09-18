<?php

namespace App\Http\Controllers;

use App\Models\CulturalMission;
use App\Models\Faq;
use App\Models\NewsArticle;
use App\Models\ScholarshipTrack;
use App\Models\University;
use App\Services\PlatformAnalytics;
use Illuminate\Contracts\View\View;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;

/**
 * Cross-catalog search over tracks, universities, FAQs, news and missions.
 */
class SearchController extends Controller
{
    public function __invoke(Request $request, PlatformAnalytics $analytics): View
    {
        $term = trim($request->string('q')->toString());

        $results = $term === '' ? [] : $this->search($term);
        $total = collect($results)->sum(fn ($group) => $group->count());

        if ($term !== '') {
            $analytics->recordSearch($term, $total);
        }

        return view('search.index', [
            'term' => $term,
            'results' => $results,
            'total' => $total,
        ]);
    }

    /** @return array<string, Collection> */
    protected function search(string $term): array
    {
        $like = '%'.$term.'%';

        return [
            'tracks' => ScholarshipTrack::published()
                ->where(fn ($query) => $query
                    ->where('name_ar', 'like', $like)
                    ->orWhere('name_en', 'like', $like)
                    ->orWhere('description_ar', 'like', $like)
                    ->orWhere('description_en', 'like', $like)
                    ->orWhere('target_sectors_ar', 'like', $like)
                    ->orWhere('target_sectors_en', 'like', $like))
                ->ordered()
                ->get(),

            'universities' => University::active()
                ->filter(['q' => $term])
                ->orderBy('qs_rank')
                ->limit(8)
                ->get(),

            'faqs' => Faq::published()->search($term)->ordered()->limit(8)->get(),

            'news' => NewsArticle::published()
                ->where(fn ($query) => $query
                    ->where('title_ar', 'like', $like)
                    ->orWhere('title_en', 'like', $like)
                    ->orWhere('summary_ar', 'like', $like))
                ->latestFirst()
                ->limit(5)
                ->get(),

            'missions' => CulturalMission::query()
                ->where('is_active', true)
                ->where(fn ($query) => $query
                    ->where('country_ar', 'like', $like)
                    ->orWhere('country_en', 'like', $like)
                    ->orWhere('city_ar', 'like', $like)
                    ->orWhere('title_ar', 'like', $like))
                ->limit(5)
                ->get(),
        ];
    }
}
