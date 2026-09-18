<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CmsPage;
use App\Models\PageBlock;
use App\Models\PageVersion;
use App\Services\AuditLogger;
use Illuminate\Contracts\View\View;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

/**
 * The CMS page builder: reorder and toggle the blocks a public page is made of,
 * then snapshot or roll back the arrangement.
 */
class PageBuilderController extends Controller
{
    public function __construct(protected AuditLogger $audit) {}

    public function index(): View
    {
        return view('admin.pages.index', [
            'pages' => CmsPage::query()->withCount(['blocks', 'versions'])->orderBy('slug')->get(),
        ]);
    }

    public function show(CmsPage $page): View
    {
        $page->load(['blocks', 'versions']);

        return view('admin.pages.show', [
            'page' => $page,
        ]);
    }

    public function update(Request $request, CmsPage $page): RedirectResponse
    {
        $data = $request->validate([
            'title_ar' => ['required', 'string', 'max:190'],
            'title_en' => ['nullable', 'string', 'max:190'],
            'description_ar' => ['nullable', 'string'],
            'description_en' => ['nullable', 'string'],
            'seo_title' => ['nullable', 'string', 'max:190'],
            'seo_description' => ['nullable', 'string', 'max:400'],
            'status' => ['required', Rule::in(['draft', 'published', 'archived'])],
        ]);

        if ($data['status'] === 'published' && ! $request->user()->canPublishContent()) {
            $data['status'] = $page->status;
        }

        $previousStatus = $page->status;
        $page->fill([...$data, 'last_updated_by' => $request->user()->full_name_ar])->save();

        $this->audit->recordModel(
            $previousStatus !== $page->status && $page->status === 'published' ? 'PUBLISH' : 'UPDATE',
            'PAGE',
            $page,
            $page->title_ar,
            'تحديث بيانات الصفحة وإعدادات محركات البحث',
        );

        return back()->with('status', __('common.updated'));
    }

    public function updateBlock(Request $request, CmsPage $page, PageBlock $block): RedirectResponse
    {
        abort_unless($block->page_id === $page->id, 404);

        $data = $request->validate([
            'title_ar' => ['nullable', 'string', 'max:190'],
            'title_en' => ['nullable', 'string', 'max:190'],
            'subtitle_ar' => ['nullable', 'string', 'max:300'],
            'subtitle_en' => ['nullable', 'string', 'max:300'],
            'content_ar' => ['nullable', 'string'],
            'content_en' => ['nullable', 'string'],
        ]);

        $block->fill($data)->save();

        $this->audit->recordModel('UPDATE', 'PAGE', $block, $page->title_ar.' — '.$block->typeLabel(), 'تعديل محتوى عنصر في الصفحة');

        return back()->with('status', __('common.updated'));
    }

    public function toggleBlock(CmsPage $page, PageBlock $block): RedirectResponse
    {
        abort_unless($block->page_id === $page->id, 404);

        $block->forceFill(['is_enabled' => ! $block->is_enabled])->save();

        $this->audit->record(
            action: $block->is_enabled ? 'PUBLISH' : 'UNPUBLISH',
            entityType: 'PAGE',
            entityId: $block->id,
            entityLabel: $page->title_ar.' — '.$block->typeLabel(),
            summary: $block->is_enabled ? 'إظهار عنصر في الصفحة' : 'إخفاء عنصر من الصفحة',
        );

        return back()->with('status', __('common.updated'));
    }

    /**
     * Swap a block with its neighbour. Keeping ordering server-side means the
     * arrangement survives without JavaScript.
     */
    public function moveBlock(Request $request, CmsPage $page, PageBlock $block): RedirectResponse
    {
        abort_unless($block->page_id === $page->id, 404);

        $direction = $request->validate([
            'direction' => ['required', Rule::in(['up', 'down'])],
        ])['direction'];

        $neighbour = $page->blocks()
            ->where('id', '!=', $block->id)
            ->when(
                $direction === 'up',
                fn ($query) => $query->where('sort_order', '<', $block->sort_order)->orderByDesc('sort_order'),
                fn ($query) => $query->where('sort_order', '>', $block->sort_order)->orderBy('sort_order'),
            )
            ->first();

        if ($neighbour) {
            $blockOrder = $block->sort_order;
            $block->forceFill(['sort_order' => $neighbour->sort_order])->save();
            $neighbour->forceFill(['sort_order' => $blockOrder])->save();

            $this->audit->record(
                action: 'REORDER',
                entityType: 'PAGE',
                entityId: $page->id,
                entityLabel: $page->title_ar,
                summary: 'إعادة ترتيب عنصر «'.$block->typeLabel().'»',
            );
        }

        return back();
    }

    public function storeVersion(Request $request, CmsPage $page): RedirectResponse
    {
        $data = $request->validate([
            'label' => ['nullable', 'string', 'max:120'],
            'changelog_notes' => ['nullable', 'string', 'max:500'],
        ]);

        $version = PageVersion::create([
            'page_id' => $page->id,
            'version_number' => (int) $page->versions()->max('version_number') + 1,
            'label' => $data['label'] ?: 'نسخة '.now()->format('Y-m-d H:i'),
            'snapshot' => ['blocks' => $page->blocks()->get()->toArray()],
            'status' => $page->status,
            'changelog_notes' => $data['changelog_notes'] ?? null,
            'created_by' => $request->user()->full_name_ar,
        ]);

        $this->audit->record('CREATE', 'PAGE', $version->id, $page->title_ar, 'إنشاء نسخة احتياطية للصفحة: '.$version->label);

        return back()->with('status', __('common.saved'));
    }

    public function restoreVersion(CmsPage $page, PageVersion $version): RedirectResponse
    {
        abort_unless($version->page_id === $page->id, 404);

        foreach (data_get($version->snapshot, 'blocks', []) as $snapshot) {
            if (! isset($snapshot['id'])) {
                continue;
            }

            $page->blocks()->whereKey($snapshot['id'])->update([
                'title_ar' => $snapshot['title_ar'] ?? null,
                'title_en' => $snapshot['title_en'] ?? null,
                'subtitle_ar' => $snapshot['subtitle_ar'] ?? null,
                'subtitle_en' => $snapshot['subtitle_en'] ?? null,
                'content_ar' => $snapshot['content_ar'] ?? null,
                'content_en' => $snapshot['content_en'] ?? null,
                'sort_order' => $snapshot['sort_order'] ?? 1,
                'is_enabled' => $snapshot['is_enabled'] ?? true,
            ]);
        }

        $this->audit->record('RESTORE', 'PAGE', $page->id, $page->title_ar, 'استعادة إصدار الصفحة: '.$version->label);

        return back()->with('status', __('admin.pages.restored'));
    }
}
