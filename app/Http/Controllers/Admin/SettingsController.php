<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SiteSetting;
use App\Services\AuditLogger;
use Illuminate\Contracts\View\View;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class SettingsController extends Controller
{
    public function __construct(protected AuditLogger $audit) {}

    public function edit(): View
    {
        return view('admin.settings.edit', [
            'settings' => SiteSetting::allValues(),
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'site_name_ar' => ['required', 'string', 'max:190'],
            'site_name_en' => ['required', 'string', 'max:190'],
            'tagline_ar' => ['nullable', 'string', 'max:300'],
            'tagline_en' => ['nullable', 'string', 'max:300'],
            'primary_color' => ['required', 'string', 'regex:/^#[0-9A-Fa-f]{6}$/'],
            'support_email' => ['required', 'email', 'max:190'],
            'support_phone' => ['required', 'string', 'max:32'],
            'official_apply_url' => ['required', 'url', 'max:2048'],
            'moe_portal_url' => ['required', 'url', 'max:2048'],
            'vision_2030_url' => ['required', 'url', 'max:2048'],
            'social_links.x_twitter' => ['nullable', 'url', 'max:2048'],
            'social_links.youtube' => ['nullable', 'url', 'max:2048'],
            'social_links.linkedin' => ['nullable', 'url', 'max:2048'],
            'social_links.instagram' => ['nullable', 'url', 'max:2048'],
            'announcement_banner.text_ar' => ['nullable', 'string', 'max:300'],
            'announcement_banner.text_en' => ['nullable', 'string', 'max:300'],
            'announcement_banner.action_url' => ['nullable', 'url', 'max:2048'],
            'cache_ttl_seconds' => ['required', 'integer', 'min:0', 'max:86400'],
        ]);

        $before = SiteSetting::allValues();

        $payload = [
            ...collect($data)->except(['social_links', 'announcement_banner'])->all(),
            'maintenance_mode' => $request->boolean('maintenance_mode'),
            'allow_public_ai_chat' => $request->boolean('allow_public_ai_chat'),
            'social_links' => $data['social_links'] ?? [],
            'announcement_banner' => [
                'is_active' => $request->boolean('announcement_banner.is_active'),
                'text_ar' => $data['announcement_banner']['text_ar'] ?? null,
                'text_en' => $data['announcement_banner']['text_en'] ?? null,
                'action_url' => $data['announcement_banner']['action_url'] ?? null,
            ],
        ];

        foreach ($payload as $key => $value) {
            SiteSetting::put($key, $value);
        }

        $changed = collect($payload)
            ->filter(fn ($value, string $key): bool => ($before[$key] ?? null) !== $value)
            ->keys()
            ->all();

        $this->audit->record(
            action: 'SETTINGS_CHANGE',
            entityType: 'SETTINGS',
            entityId: 'site',
            entityLabel: __('admin.settings.title'),
            summary: $changed === []
                ? 'حفظ الإعدادات دون تغييرات'
                : 'تحديث الإعدادات: '.implode('، ', $changed),
            before: collect($before)->only($changed)->all() ?: null,
            after: collect($payload)->only($changed)->all() ?: null,
        );

        return back()->with('status', __('common.updated'));
    }
}
