<?php

namespace App\Http\Controllers;

use App\Models\CmsPage;
use App\Models\Country;
use App\Models\Faq;
use App\Models\NewsArticle;
use App\Models\ScholarshipTrack;
use App\Models\University;
use App\Services\Ai\AiAdvisor;
use App\Services\PlatformAnalytics;
use Illuminate\Contracts\View\View;
use Illuminate\Http\Request;

class HomeController extends Controller
{
    public function index(Request $request, PlatformAnalytics $analytics, AiAdvisor $advisor): View
    {
        $analytics->recordPageView($request->path());

        // The home page is assembled from CMS blocks, so an editor can hide a
        // section from the page builder without a deploy.
        $page = CmsPage::with('blocks')->where('slug', 'home')->first();

        return view('home.index', [
            'page' => $page,
            'tracks' => ScholarshipTrack::published()->ordered()->get(),
            'universities' => University::active()->orderBy('qs_rank')->limit(6)->get(),
            'universitiesTotal' => University::active()->count(),
            'countries' => Country::query()->where('is_active', true)->orderByDesc('is_popular')->limit(8)->get(),
            'faqs' => Faq::published()->ordered()->limit(8)->get(),
            'faqCategories' => $this->faqCategories(),
            'news' => NewsArticle::published()->latestFirst()->limit(3)->get(),
            'aiSuggestions' => $advisor->suggestions(),
            'journeySteps' => $this->journeySteps(),
            'strategyPillars' => $this->strategyPillars(),
        ]);
    }

    /** The eight stops of the scholarship journey, in display order. */
    protected function journeySteps(): array
    {
        return collect(range(1, 8))
            ->map(fn (int $step): array => [
                'number' => str_pad((string) $step, 2, '0', STR_PAD_LEFT),
                'title' => __("journey.step{$step}_title"),
                'description' => __("journey.step{$step}_desc"),
                'icon' => [
                    1 => 'compass', 2 => 'layers', 3 => 'circle-check', 4 => 'file-text',
                    5 => 'cloud-upload', 6 => 'clock', 7 => 'award', 8 => 'plane-takeoff',
                ][$step],
            ])
            ->all();
    }

    protected function strategyPillars(): array
    {
        return [
            ['title' => __('strategy.pillar1_title'), 'description' => __('strategy.pillar1_desc'), 'icon' => 'globe', 'tone' => 'emerald'],
            ['title' => __('strategy.pillar2_title'), 'description' => __('strategy.pillar2_desc'), 'icon' => 'target', 'tone' => 'amber'],
            ['title' => __('strategy.pillar3_title'), 'description' => __('strategy.pillar3_desc'), 'icon' => 'microscope', 'tone' => 'purple'],
            ['title' => __('strategy.pillar4_title'), 'description' => __('strategy.pillar4_desc'), 'icon' => 'cpu', 'tone' => 'teal'],
        ];
    }

    /** @return array<string, string> */
    protected function faqCategories(): array
    {
        $used = Faq::published()->distinct()->pluck('category');

        return collect(['all'])
            ->merge($used)
            ->mapWithKeys(fn (string $category): array => [$category => __('faq_categories.'.$category)])
            ->all();
    }
}
