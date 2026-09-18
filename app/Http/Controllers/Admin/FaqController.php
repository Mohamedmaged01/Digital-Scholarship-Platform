<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Faq;
use App\Models\ScholarshipTrack;
use App\Services\AuditLogger;
use Illuminate\Contracts\View\View;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class FaqController extends Controller
{
    public function __construct(protected AuditLogger $audit) {}

    public function index(Request $request): View
    {
        $category = $request->string('category')->toString() ?: 'all';
        $term = $request->string('q')->toString();

        return view('admin.faqs.index', [
            'faqs' => Faq::query()->category($category)->search($term)->ordered()->paginate(15)->withQueryString(),
            'category' => $category,
            'term' => $term,
            'categories' => $this->categoryOptions(),
        ]);
    }

    public function create(): View
    {
        return view('admin.faqs.form', [
            'faq' => new Faq([
                'category' => 'general',
                'tags' => [],
                'is_published' => true,
                'sort_order' => (int) Faq::query()->max('sort_order') + 1,
            ]),
            ...$this->formOptions(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $faq = Faq::create([
            ...$this->validated($request),
            'id' => 'faq-'.Str::lower(Str::random(8)),
        ]);

        $this->audit->recordModel('CREATE', 'FAQ', $faq, Str::limit($faq->question_ar, 60), 'إضافة سؤال شائع');

        return redirect()->route('admin.faqs.index')->with('status', __('common.created'));
    }

    public function edit(Faq $faq): View
    {
        return view('admin.faqs.form', [
            'faq' => $faq,
            ...$this->formOptions(),
        ]);
    }

    public function update(Request $request, Faq $faq): RedirectResponse
    {
        $faq->fill($this->validated($request))->save();

        $this->audit->recordModel('UPDATE', 'FAQ', $faq, Str::limit($faq->question_ar, 60), 'تعديل سؤال شائع');

        return back()->with('status', __('common.updated'));
    }

    public function destroy(Faq $faq): RedirectResponse
    {
        $label = Str::limit($faq->question_ar, 60);
        $faq->delete();

        $this->audit->record('DELETE', 'FAQ', $faq->id, $label, 'حذف سؤال شائع');

        return redirect()->route('admin.faqs.index')->with('status', __('common.deleted'));
    }

    protected function validated(Request $request): array
    {
        $data = $request->validate([
            'question_ar' => ['required', 'string'],
            'question_en' => ['required', 'string'],
            'answer_ar' => ['required', 'string'],
            'answer_en' => ['required', 'string'],
            'category' => ['required', Rule::in(array_keys($this->categoryOptions()))],
            'tags' => ['nullable', 'string', 'max:500'],
            'related_track_id' => ['nullable', 'exists:scholarship_tracks,id'],
            'sort_order' => ['required', 'integer', 'min:1', 'max:999'],
            'is_featured' => ['nullable', 'boolean'],
            'is_published' => ['nullable', 'boolean'],
        ]);

        $data['tags'] = collect(explode(',', (string) ($data['tags'] ?? '')))
            ->map(fn (string $tag): string => trim($tag))
            ->filter()
            ->values()
            ->all();

        $data['is_featured'] = $request->boolean('is_featured');
        $data['is_published'] = $request->boolean('is_published');

        return $data;
    }

    /** @return array<string, string> */
    protected function categoryOptions(): array
    {
        return collect([
            'general', 'admission', 'tracks', 'requirements', 'universities',
            'documents', 'nomination', 'post_nomination', 'official_channels',
            'travel_prep', 'services',
        ])->mapWithKeys(fn (string $c): array => [$c => __('faq_categories.'.$c)])->all();
    }

    protected function formOptions(): array
    {
        return [
            'categories' => $this->categoryOptions(),
            'tracks' => ScholarshipTrack::query()->orderBy('sort_order')->get(),
        ];
    }
}
