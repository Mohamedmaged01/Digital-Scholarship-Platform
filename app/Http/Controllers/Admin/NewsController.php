<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\NewsArticle;
use App\Services\AuditLogger;
use Illuminate\Contracts\View\View;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class NewsController extends Controller
{
    public function __construct(protected AuditLogger $audit) {}

    public function index(Request $request): View
    {
        $status = $request->string('status')->toString() ?: 'all';

        return view('admin.news.index', [
            'articles' => NewsArticle::query()
                ->when($status !== 'all', fn ($query) => $query->where('status', $status))
                ->latestFirst()
                ->paginate(15)
                ->withQueryString(),
            'status' => $status,
            'statusOptions' => $this->statusOptions(),
        ]);
    }

    public function create(): View
    {
        return view('admin.news.form', [
            'article' => new NewsArticle([
                'category' => 'announcement',
                'status' => 'draft',
                'publish_date' => now()->toDateString(),
                'author_ar' => 'وكالة الوزارة للابتعاث',
                'author_en' => 'Scholarship Agency',
            ]),
            ...$this->formOptions(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $article = NewsArticle::create($this->validated($request));

        $this->audit->recordModel('CREATE', 'NEWS', $article, Str::limit($article->title_ar, 60), 'إضافة خبر');

        return redirect()->route('admin.news.index')->with('status', __('common.created'));
    }

    public function edit(NewsArticle $article): View
    {
        return view('admin.news.form', [
            'article' => $article,
            ...$this->formOptions(),
        ]);
    }

    public function update(Request $request, NewsArticle $article): RedirectResponse
    {
        $article->fill($this->validated($request, $article))->save();

        $this->audit->recordModel('UPDATE', 'NEWS', $article, Str::limit($article->title_ar, 60), 'تعديل خبر');

        return back()->with('status', __('common.updated'));
    }

    /**
     * Publish / unpublish. An editor without publishing rights can only move an
     * article back to draft, matching the original role matrix.
     */
    public function updateStatus(Request $request, NewsArticle $article): RedirectResponse
    {
        $data = $request->validate([
            'status' => ['required', Rule::in(['draft', 'published', 'archived'])],
        ]);

        if ($data['status'] === 'published' && ! $request->user()->canPublishContent()) {
            return back()->withErrors(['status' => __('admin.news.cannot_publish')]);
        }

        $previous = $article->status;
        $article->forceFill(['status' => $data['status']])->save();

        $this->audit->record(
            action: $data['status'] === 'published' ? 'PUBLISH' : 'UNPUBLISH',
            entityType: 'NEWS',
            entityId: $article->id,
            entityLabel: Str::limit($article->title_ar, 60),
            summary: 'تغيير حالة الخبر من '.$previous.' إلى '.$data['status'],
            before: ['status' => $previous],
            after: ['status' => $data['status']],
        );

        return back()->with('status', __('common.updated'));
    }

    public function destroy(NewsArticle $article): RedirectResponse
    {
        $label = Str::limit($article->title_ar, 60);
        $article->delete();

        $this->audit->record('DELETE', 'NEWS', $article->id, $label, 'حذف خبر');

        return redirect()->route('admin.news.index')->with('status', __('common.deleted'));
    }

    protected function validated(Request $request, ?NewsArticle $article = null): array
    {
        $data = $request->validate([
            'title_ar' => ['required', 'string', 'max:190'],
            'title_en' => ['nullable', 'string', 'max:190'],
            'summary_ar' => ['required', 'string', 'max:600'],
            'summary_en' => ['nullable', 'string', 'max:600'],
            'content_ar' => ['required', 'string'],
            'content_en' => ['nullable', 'string'],
            'category' => ['required', Rule::in(['announcement', 'admission', 'event', 'strategy'])],
            'publish_date' => ['required', 'date'],
            'author_ar' => ['required', 'string', 'max:120'],
            'author_en' => ['nullable', 'string', 'max:120'],
            'image_url' => ['nullable', 'string', 'max:2048'],
            'is_featured' => ['nullable', 'boolean'],
            'status' => ['required', Rule::in(['draft', 'published', 'archived'])],
        ]);

        $data['is_featured'] = $request->boolean('is_featured');

        // Publishing is a separate capability from editing.
        if ($data['status'] === 'published' && ! $request->user()->canPublishContent()) {
            $data['status'] = $article?->status === 'published' ? 'published' : 'draft';
        }

        return $data;
    }

    /** @return array<string, string> */
    protected function statusOptions(): array
    {
        return ['all' => __('common.all')] + collect(['draft', 'published', 'archived'])
            ->mapWithKeys(fn (string $s): array => [$s => __('news.statuses.'.$s)])
            ->all();
    }

    protected function formOptions(): array
    {
        return [
            'categories' => collect(['announcement', 'admission', 'event', 'strategy'])
                ->mapWithKeys(fn (string $c): array => [$c => __('news.categories.'.$c)])
                ->all(),
            'statuses' => collect(['draft', 'published', 'archived'])
                ->mapWithKeys(fn (string $s): array => [$s => __('news.statuses.'.$s)])
                ->all(),
        ];
    }
}
