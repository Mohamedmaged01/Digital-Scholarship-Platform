<?php

namespace App\Http\Controllers;

use App\Models\Faq;
use App\Services\Ai\AiAdvisor;
use App\Services\PlatformAnalytics;
use Illuminate\Contracts\View\View;
use Illuminate\Http\Request;

class FaqController extends Controller
{
    public function index(Request $request, PlatformAnalytics $analytics, AiAdvisor $advisor): View
    {
        $analytics->recordPageView($request->path());

        $term = $request->string('q')->toString();
        $category = $request->string('category')->toString() ?: 'all';

        $faqs = Faq::published()->category($category)->search($term)->ordered()->get();

        if (filled($term)) {
            $analytics->recordSearch($term, $faqs->count());
        }

        return view('faq.index', [
            'faqs' => $faqs,
            'term' => $term,
            'category' => $category,
            'categories' => $this->categories(),
            'openId' => $request->string('open')->toString() ?: $faqs->first()?->id,
            'aiSuggestions' => $advisor->suggestions(),
        ]);
    }

    /** @return array<string, int> category slug => number of published entries */
    protected function categories(): array
    {
        $counts = Faq::published()
            ->selectRaw('category, count(*) as total')
            ->groupBy('category')
            ->pluck('total', 'category')
            ->all();

        return ['all' => array_sum($counts)] + $counts;
    }
}
