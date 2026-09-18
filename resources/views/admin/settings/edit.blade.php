@extends('layouts.admin')

@section('title', __('admin.settings.title'))

@php
    $section = 'settings';
    $canEdit = auth()->user()->hasPermission('settings:write');
    $canBackup = auth()->user()->hasPermission('backup:manage');
    $banner = $settings['announcement_banner'] ?? [];
    $social = $settings['social_links'] ?? [];
@endphp

@section('content')
    <form method="post" action="{{ route('admin.settings.update') }}" class="space-y-6">
        @csrf
        @method('PUT')

        <x-admin.panel icon="settings" :title="__('admin.settings.identity')" :subtitle="__('admin.settings.subtitle')">
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <x-admin.field :label="__('common.name').' — '.__('common.arabic')" name="site_name_ar" required>
                    <x-admin.input name="site_name_ar" value="{{ old('site_name_ar', $settings['site_name_ar'] ?? '') }}" required :disabled="! $canEdit" />
                </x-admin.field>

                <x-admin.field :label="__('common.name').' — '.__('common.english')" name="site_name_en" required>
                    <x-admin.input name="site_name_en" value="{{ old('site_name_en', $settings['site_name_en'] ?? '') }}" required dir="ltr" :disabled="! $canEdit" />
                </x-admin.field>

                <x-admin.field :label="__('common.description').' — '.__('common.arabic')" name="tagline_ar">
                    <x-admin.input name="tagline_ar" value="{{ old('tagline_ar', $settings['tagline_ar'] ?? '') }}" :disabled="! $canEdit" />
                </x-admin.field>

                <x-admin.field :label="__('common.description').' — '.__('common.english')" name="tagline_en">
                    <x-admin.input name="tagline_en" value="{{ old('tagline_en', $settings['tagline_en'] ?? '') }}" dir="ltr" :disabled="! $canEdit" />
                </x-admin.field>

                <x-admin.field :label="app()->getLocale() === 'ar' ? 'اللون الأساسي' : 'Primary colour'" name="primary_color" required>
                    <x-admin.input type="color" name="primary_color" value="{{ old('primary_color', $settings['primary_color'] ?? '#005A36') }}"
                                   required :disabled="! $canEdit" class="h-11 p-1" />
                </x-admin.field>

                <x-admin.field :label="app()->getLocale() === 'ar' ? 'مدة التخزين المؤقت (ثانية)' : 'Cache TTL (seconds)'" name="cache_ttl_seconds" required>
                    <x-admin.input type="number" name="cache_ttl_seconds" value="{{ old('cache_ttl_seconds', $settings['cache_ttl_seconds'] ?? 3600) }}"
                                   min="0" max="86400" required :disabled="! $canEdit" />
                </x-admin.field>
            </div>
        </x-admin.panel>

        <x-admin.panel icon="headphones" :title="__('admin.settings.contact')">
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <x-admin.field :label="__('pages.help.email')" name="support_email" required>
                    <x-admin.input type="email" name="support_email" value="{{ old('support_email', $settings['support_email'] ?? '') }}" required dir="ltr" :disabled="! $canEdit" />
                </x-admin.field>

                <x-admin.field :label="__('pages.help.hotline')" name="support_phone" required>
                    <x-admin.input name="support_phone" value="{{ old('support_phone', $settings['support_phone'] ?? '') }}" required dir="ltr" :disabled="! $canEdit" />
                </x-admin.field>
            </div>
        </x-admin.panel>

        <x-admin.panel icon="link" :title="__('admin.settings.links')">
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <x-admin.field :label="__('pages.help.official_portal')" name="official_apply_url" required>
                    <x-admin.input type="url" name="official_apply_url" value="{{ old('official_apply_url', $settings['official_apply_url'] ?? '') }}" required dir="ltr" :disabled="! $canEdit" />
                </x-admin.field>

                <x-admin.field label="Ministry of Education" name="moe_portal_url" required>
                    <x-admin.input type="url" name="moe_portal_url" value="{{ old('moe_portal_url', $settings['moe_portal_url'] ?? '') }}" required dir="ltr" :disabled="! $canEdit" />
                </x-admin.field>

                <x-admin.field label="Vision 2030" name="vision_2030_url" required>
                    <x-admin.input type="url" name="vision_2030_url" value="{{ old('vision_2030_url', $settings['vision_2030_url'] ?? '') }}" required dir="ltr" :disabled="! $canEdit" />
                </x-admin.field>
            </div>

            <fieldset class="space-y-3">
                <legend class="text-xs font-bold text-slate-700">{{ __('admin.settings.social') }}</legend>

                <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    @foreach (['x_twitter' => 'X (Twitter)', 'youtube' => 'YouTube', 'linkedin' => 'LinkedIn', 'instagram' => 'Instagram'] as $key => $label)
                        <x-admin.field :label="$label" name="social_links.{{ $key }}">
                            <x-admin.input type="url" name="social_links[{{ $key }}]"
                                           value="{{ old('social_links.'.$key, $social[$key] ?? '') }}" dir="ltr" :disabled="! $canEdit" />
                        </x-admin.field>
                    @endforeach
                </div>
            </fieldset>
        </x-admin.panel>

        <x-admin.panel icon="megaphone" :title="__('admin.settings.banner')">
            <x-admin.toggle name="announcement_banner[is_active]" :label="__('admin.settings.banner_active')"
                            :checked="(bool) ($banner['is_active'] ?? false)" />

            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <x-admin.field :label="__('common.title').' — '.__('common.arabic')" name="announcement_banner.text_ar">
                    <x-admin.input name="announcement_banner[text_ar]" value="{{ old('announcement_banner.text_ar', $banner['text_ar'] ?? '') }}" :disabled="! $canEdit" />
                </x-admin.field>

                <x-admin.field :label="__('common.title').' — '.__('common.english')" name="announcement_banner.text_en">
                    <x-admin.input name="announcement_banner[text_en]" value="{{ old('announcement_banner.text_en', $banner['text_en'] ?? '') }}" dir="ltr" :disabled="! $canEdit" />
                </x-admin.field>
            </div>

            <x-admin.field label="URL" name="announcement_banner.action_url">
                <x-admin.input type="url" name="announcement_banner[action_url]"
                               value="{{ old('announcement_banner.action_url', $banner['action_url'] ?? '') }}" dir="ltr" :disabled="! $canEdit" />
            </x-admin.field>
        </x-admin.panel>

        <x-admin.panel icon="wrench" :title="__('admin.settings.maintenance')">
            <x-admin.toggle name="maintenance_mode" :label="__('admin.settings.maintenance')"
                            :hint="__('admin.settings.maintenance_hint')"
                            :checked="(bool) ($settings['maintenance_mode'] ?? false)" />

            <x-admin.toggle name="allow_public_ai_chat" :label="__('admin.ai.enabled')"
                            :hint="__('ai_chat.subtitle')"
                            :checked="(bool) ($settings['allow_public_ai_chat'] ?? true)" />
        </x-admin.panel>

        @if ($canEdit)
            <div class="flex items-center justify-end">
                <x-admin.submit>{{ __('common.update') }}</x-admin.submit>
            </div>
        @endif
    </form>

    {{-- Backup is a separate permission, so it lives outside the settings form. --}}
    @if ($canBackup)
        <x-admin.panel icon="database" :title="__('admin.settings.backup')" :subtitle="__('admin.settings.backup_hint')">
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <a href="{{ route('admin.backup.export') }}"
                   class="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-xs font-bold text-slate-800 transition hover:bg-slate-100">
                    <x-lucide-download class="size-4 text-saudi-700" aria-hidden="true" />
                    <span>{{ __('admin.settings.export') }}</span>
                </a>

                <form method="post" action="{{ route('admin.backup.import') }}" enctype="multipart/form-data"
                      class="space-y-2 rounded-2xl border border-amber-200 bg-amber-50/60 p-4"
                      onsubmit="return confirm(@js(__('admin.settings.import_hint')));">
                    @csrf
                    <label class="block space-y-1.5">
                        <span class="block text-xs font-bold text-amber-900">{{ __('admin.settings.import') }}</span>
                        <input type="file" name="backup" accept="application/json,.json" required
                               class="w-full rounded-xl border border-amber-300 bg-white px-3 py-2 text-xs file:me-3 file:rounded-lg file:border-0 file:bg-amber-600 file:px-3 file:py-1.5 file:text-xs file:font-bold file:text-white">
                    </label>

                    <p class="text-[11px] leading-relaxed text-amber-800">{{ __('admin.settings.import_hint') }}</p>

                    <button type="submit"
                            class="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-600 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-amber-700">
                        <x-lucide-upload class="size-4" aria-hidden="true" />
                        <span>{{ __('admin.settings.import') }}</span>
                    </button>
                </form>
            </div>
        </x-admin.panel>
    @endif
@endsection
