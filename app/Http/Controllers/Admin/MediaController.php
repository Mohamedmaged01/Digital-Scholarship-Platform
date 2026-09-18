<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\MediaItem;
use App\Services\AuditLogger;
use Illuminate\Contracts\View\View;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

/**
 * Media library. Uploads land on the public disk; Arabic alt text is mandatory on
 * images so the portal stays accessible.
 */
class MediaController extends Controller
{
    public const FOLDERS = ['banners', 'tracks', 'universities', 'logos', 'documents'];

    public function __construct(protected AuditLogger $audit) {}

    public function index(Request $request): View
    {
        $folder = $request->string('folder')->toString() ?: 'all';

        return view('admin.media.index', [
            'items' => MediaItem::query()
                ->when($folder !== 'all', fn ($query) => $query->where('folder', $folder))
                ->latest()
                ->paginate(24)
                ->withQueryString(),
            'folder' => $folder,
            'folders' => ['all' => __('common.all')] + collect(self::FOLDERS)
                ->mapWithKeys(fn (string $f): array => [$f => __('admin.media.folders.'.$f)])
                ->all(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'file' => ['required', 'file', 'max:8192', 'mimes:jpg,jpeg,png,webp,gif,svg,pdf'],
            'folder' => ['required', Rule::in(self::FOLDERS)],
            'alt_text_ar' => ['required', 'string', 'max:190'],
            'alt_text_en' => ['nullable', 'string', 'max:190'],
        ]);

        $file = $request->file('file');
        $path = $file->store('media/'.$data['folder'], 'public');

        $item = MediaItem::create([
            'file_name' => $file->getClientOriginalName(),
            'url' => Storage::disk('public')->url($path),
            'folder' => $data['folder'],
            'mime_type' => $file->getClientMimeType(),
            'extension' => Str::lower($file->getClientOriginalExtension()),
            'size_bytes' => $file->getSize(),
            'dimensions' => $this->dimensions($file->getRealPath()),
            'alt_text_ar' => $data['alt_text_ar'],
            'alt_text_en' => $data['alt_text_en'] ?? null,
            'uploaded_by' => $request->user()->full_name_ar,
        ]);

        $this->audit->recordModel('CREATE', 'MEDIA', $item, $item->file_name, 'رفع ملف إلى مكتبة الوسائط ('.$item->humanSize().')');

        return back()->with('status', __('common.created'));
    }

    public function update(Request $request, MediaItem $item): RedirectResponse
    {
        $data = $request->validate([
            'alt_text_ar' => ['required', 'string', 'max:190'],
            'alt_text_en' => ['nullable', 'string', 'max:190'],
            'folder' => ['required', Rule::in(self::FOLDERS)],
        ]);

        $item->fill($data)->save();

        $this->audit->recordModel('UPDATE', 'MEDIA', $item, $item->file_name, 'تحديث النصوص البديلة للوصولية');

        return back()->with('status', __('common.updated'));
    }

    public function destroy(MediaItem $item): RedirectResponse
    {
        $label = $item->file_name;

        // Only files this library stored are removed from disk; seeded records
        // point at remote URLs and simply lose their catalog entry.
        $relative = Str::after($item->url, '/storage/');

        if ($relative !== $item->url && Storage::disk('public')->exists($relative)) {
            Storage::disk('public')->delete($relative);
        }

        $item->delete();

        $this->audit->record('DELETE', 'MEDIA', $item->id, $label, 'حذف ملف من مكتبة الوسائط');

        return back()->with('status', __('common.deleted'));
    }

    protected function dimensions(?string $path): ?string
    {
        if ($path === null || ! is_file($path)) {
            return null;
        }

        $size = @getimagesize($path);

        return $size ? $size[0].'x'.$size[1] : null;
    }
}
