<?php

namespace App\Http\Controllers;

use App\Models\NewsArticle;
use App\Services\PlatformAnalytics;
use Illuminate\Contracts\View\View;
use Illuminate\Http\Request;

class NewsController extends Controller
{
    public function index(Request $request, PlatformAnalytics $analytics): View
    {
        $analytics->recordPageView($request->path());

        $category = $request->string('category')->toString() ?: 'all';

        $query = NewsArticle::published()->latestFirst();

        if ($category !== 'all') {
            $query->where('category', $category);
        }

        $articles = $query->paginate(9)->withQueryString();

        return view('news.index', [
            'articles' => $articles,
            'featured' => $category === 'all' && $articles->currentPage() === 1
                ? NewsArticle::published()->latestFirst()->where('is_featured', true)->first()
                : null,
            'category' => $category,
            'categories' => $this->categories(),
        ]);
    }

    public function show(Request $request, NewsArticle $article, PlatformAnalytics $analytics): View
    {
        abort_unless($article->status === 'published', 404);

        $analytics->recordPageView($request->path(), 'NEWS', $article->id);

        return view('news.show', [
            'article' => $article,
            'related' => NewsArticle::published()
                ->latestFirst()
                ->where('category', $article->category)
                ->whereKeyNot($article->id)
                ->limit(3)
                ->get(),
        ]);
    }

    /** @return array<string, string> */
    protected function categories(): array
    {
        $used = NewsArticle::published()->distinct()->pluck('category');

        return collect(['all' => __('pages.news.all_categories')])
            ->merge($used->mapWithKeys(fn (string $c): array => [$c => __('news.categories.'.$c)]))
            ->all();
    }
}
