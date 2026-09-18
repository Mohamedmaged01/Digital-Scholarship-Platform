@extends('layouts.admin')

@section('title', $page->title_ar)

@php
    $section = 'pages';
    $canEdit = auth()->user()->hasPermission('pages:write');
    $canPublish = auth()->user()->canPublishContent();
@endphp

@section('content')
    <nav class="flex items-center gap-2 text-xs text-slate-500">
        <a href="{{ route('admin.pages.index') }}" class="transition hover:text-saudi-700">{{ __('admin.nav.pages') }}</a>
        <x-lucide-chevron-right class="size-3 flip-rtl" aria-hidden="true" />
        <span class="font-bold text-slate-700">{{ $page->title_ar }}</span>
    </nav>

    {{-- Page metadata and SEO --}}
    <form method="post" action="{{ route('admin.pages.update', $page) }}">
        @csrf
        @method('PUT')

        <x-admin.panel icon="layers" :title="$page->title_ar" :subtitle="'/'.$page->slug">
            <x-slot:actions>
                <x-badge :tone="$page->isPublished() ? 'emerald' : 'amber'">{{ __('news.statuses.'.$page->status) }}</x-badge>
            </x-slot:actions>

            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <x-admin.field :label="__('common.title').' — '.__('common.arabic')" name="title_ar" required>
                    <x-admin.input name="title_ar" value="{{ old('title_ar', $page->title_ar) }}" required :disabled="! $canEdit" />
                </x-admin.field>

                <x-admin.field :label="__('common.title').' — '.__('common.english')" name="title_en">
                    <x-admin.input name="title_en" value="{{ old('title_en', $page->title_en) }}" dir="ltr" :disabled="! $canEdit" />
                </x-admin.field>

                <x-admin.field :label="__('common.description').' — '.__('common.arabic')" name="description_ar">
                    <x-admin.textarea name="description_ar" rows="3" :disabled="! $canEdit">{{ old('description_ar', $page->description_ar) }}</x-admin.textarea>
                </x-admin.field>

                <x-admin.field :label="__('common.description').' — '.__('common.english')" name="description_en">
                    <x-admin.textarea name="description_en" rows="3" dir="ltr" :disabled="! $canEdit">{{ old('description_en', $page->description_en) }}</x-admin.textarea>
                </x-admin.field>

                <x-admin.field label="SEO title" name="seo_title">
                    <x-admin.input name="seo_title" value="{{ old('seo_title', $page->seo_title) }}" :disabled="! $canEdit" />
                </x-admin.field>

                <x-admin.field label="SEO description" name="seo_description">
                    <x-admin.textarea name="seo_description" rows="2" maxlength="400" :disabled="! $canEdit">{{ old('seo_description', $page->seo_description) }}</x-admin.textarea>
                </x-admin.field>
            </div>

            <div class="flex flex-wrap items-end justify-between gap-3">
                <x-admin.field :label="__('common.status')" name="status" required
                               :hint="$canPublish ? null : __('admin.news.cannot_publish')">
                    <x-admin.select name="status" required :disabled="! $canEdit">
                        @foreach (['draft', 'published', 'archived'] as $value)
                            <option value="{{ $value }}"
                                    @selected(old('status', $page->status) === $value)
                                    @disabled($value === 'published' && ! $canPublish)>{{ __('news.statuses.'.$value) }}</option>
                        @endforeach
                    </x-admin.select>
                </x-admin.field>

                @if ($canEdit)
                    <x-admin.submit>{{ __('common.update') }}</x-admin.submit>
                @endif
            </div>
        </x-admin.panel>
    </form>

    {{-- Blocks --}}
    <x-admin.panel icon="grid-2x2" :title="__('admin.pages.blocks')"
                   :subtitle="app()->getLocale() === 'ar'
                        ? 'العناصر المخفية لا تظهر للزوار على البوابة العامة.'
                        : 'Hidden blocks do not render for visitors on the public portal.'">
        @if ($page->blocks->isEmpty())
            <p class="text-xs text-slate-500">{{ __('common.empty') }}</p>
        @else
            <ol class="space-y-3">
                @foreach ($page->blocks as $block)
                    <li class="rounded-2xl border {{ $block->is_enabled ? 'border-slate-200 bg-white' : 'border-dashed border-slate-300 bg-slate-50/60' }} p-4 shadow-2xs">
                        <div class="flex flex-wrap items-start justify-between gap-3">
                            <div class="flex items-start gap-3">
                                <span class="numeric flex size-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-xs font-bold text-slate-600">
                                    {{ $block->sort_order }}
                                </span>

                                <div class="space-y-0.5">
                                    <div class="flex flex-wrap items-center gap-2">
                                        <h3 class="text-sm font-bold text-slate-900">{{ $block->title_ar ?: $block->typeLabel() }}</h3>
                                        <code class="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-600">{{ $block->type }}</code>
                                        <x-badge :tone="$block->is_enabled ? 'emerald' : 'slate'">
                                            {{ $block->is_enabled ? __('admin.pages.enabled') : __('admin.pages.disabled') }}
                                        </x-badge>
                                    </div>

                                    @if (filled($block->content_ar))
                                        <p class="line-clamp-2 text-[11px] leading-relaxed text-slate-600">{{ $block->content_ar }}</p>
                                    @endif
                                </div>
                            </div>

                            @if ($canEdit)
                                <div class="flex shrink-0 items-center gap-1.5">
                                    <form method="post" action="{{ route('admin.pages.blocks.move', [$page, $block]) }}" class="inline">
                                        @csrf
                                        @method('PATCH')
                                        <input type="hidden" name="direction" value="up">
                                        <button type="submit" class="rounded-lg border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-50"
                                                aria-label="{{ __('admin.pages.move_up') }}" title="{{ __('admin.pages.move_up') }}">
                                            <x-lucide-chevron-up class="size-3.5" aria-hidden="true" />
                                        </button>
                                    </form>

                                    <form method="post" action="{{ route('admin.pages.blocks.move', [$page, $block]) }}" class="inline">
                                        @csrf
                                        @method('PATCH')
                                        <input type="hidden" name="direction" value="down">
                                        <button type="submit" class="rounded-lg border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-50"
                                                aria-label="{{ __('admin.pages.move_down') }}" title="{{ __('admin.pages.move_down') }}">
                                            <x-lucide-chevron-down class="size-3.5" aria-hidden="true" />
                                        </button>
                                    </form>

                                    <form method="post" action="{{ route('admin.pages.blocks.toggle', [$page, $block]) }}" class="inline">
                                        @csrf
                                        @method('PATCH')
                                        <button type="submit"
                                                class="{{ $block->is_enabled ? 'border-amber-200 bg-amber-50 text-amber-800' : 'border-saudi-200 bg-saudi-50 text-saudi-800' }} flex items-center gap-1.5 rounded-lg border px-2.5 py-2 text-[11px] font-bold transition">
                                            <x-lucide-eye class="size-3.5" x-cloak aria-hidden="true" />
                                            <span>{{ __('admin.pages.toggle') }}</span>
                                        </button>
                                    </form>
                                </div>
                            @endif
                        </div>

                        @if ($canEdit)
                            <details class="mt-3 border-t border-slate-100 pt-3">
                                <summary class="cursor-pointer text-[11px] font-bold text-saudi-700">{{ __('common.edit') }}</summary>

                                <form method="post" action="{{ route('admin.pages.blocks.update', [$page, $block]) }}" class="mt-3 space-y-3">
                                    @csrf
                                    @method('PUT')

                                    <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                        <x-admin.field :label="__('common.title').' — '.__('common.arabic')" name="title_ar">
                                            <x-admin.input name="title_ar" value="{{ $block->title_ar }}" />
                                        </x-admin.field>

                                        <x-admin.field :label="__('common.title').' — '.__('common.english')" name="title_en">
                                            <x-admin.input name="title_en" value="{{ $block->title_en }}" dir="ltr" />
                                        </x-admin.field>

                                        <x-admin.field :label="__('common.description').' — '.__('common.arabic')" name="subtitle_ar">
                                            <x-admin.input name="subtitle_ar" value="{{ $block->subtitle_ar }}" />
                                        </x-admin.field>

                                        <x-admin.field :label="__('common.description').' — '.__('common.english')" name="subtitle_en">
                                            <x-admin.input name="subtitle_en" value="{{ $block->subtitle_en }}" dir="ltr" />
                                        </x-admin.field>
                                    </div>

                                    <x-admin.field :label="app()->getLocale() === 'ar' ? 'المحتوى — العربية' : 'Content — Arabic'" name="content_ar">
                                        <x-admin.textarea name="content_ar" rows="3">{{ $block->content_ar }}</x-admin.textarea>
                                    </x-admin.field>

                                    <x-admin.field :label="app()->getLocale() === 'ar' ? 'المحتوى — الإنجليزية' : 'Content — English'" name="content_en">
                                        <x-admin.textarea name="content_en" rows="3" dir="ltr">{{ $block->content_en }}</x-admin.textarea>
                                    </x-admin.field>

                                    <x-admin.submit>{{ __('common.save') }}</x-admin.submit>
                                </form>
                            </details>
                        @endif
                    </li>
                @endforeach
            </ol>
        @endif
    </x-admin.panel>

    {{-- Versions --}}
    <x-admin.panel icon="history" :title="__('admin.pages.versions')">
        @if ($canEdit)
            <x-slot:actions>
                <form method="post" action="{{ route('admin.pages.versions.store', $page) }}" class="flex flex-wrap items-end gap-2">
                    @csrf
                    <label>
                        <span class="sr-only">{{ __('admin.pages.version_label') }}</span>
                        <x-admin.input name="label" placeholder="{{ __('admin.pages.version_label') }}" class="w-44" />
                    </label>
                    <label>
                        <span class="sr-only">{{ __('admin.pages.version_notes') }}</span>
                        <x-admin.input name="changelog_notes" placeholder="{{ __('admin.pages.version_notes') }}" class="w-56" />
                    </label>
                    <x-admin.submit icon="camera">{{ __('admin.pages.create_version') }}</x-admin.submit>
                </form>
            </x-slot:actions>
        @endif

        @if ($page->versions->isEmpty())
            <p class="text-xs text-slate-500">{{ __('common.empty') }}</p>
        @else
            <ol class="space-y-2">
                @foreach ($page->versions as $version)
                    <li class="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 p-4 text-xs">
                        <div class="space-y-0.5">
                            <div class="flex items-center gap-2">
                                <span class="numeric rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-600">v{{ $version->version_number }}</span>
                                <p class="font-bold text-slate-900">{{ $version->label }}</p>
                            </div>
                            <p class="text-[11px] text-slate-500">
                                {{ $version->changelog_notes }}
                                @if ($version->created_by)
                                    — {{ $version->created_by }}
                                @endif
                            </p>
                        </div>

                        <div class="flex items-center gap-3">
                            <time class="numeric text-[11px] text-slate-400" datetime="{{ $version->created_at?->toIso8601String() }}">
                                {{ $version->created_at?->diffForHumans() }}
                            </time>

                            @if ($canEdit)
                                <form method="post" action="{{ route('admin.pages.versions.restore', [$page, $version]) }}" class="inline"
                                      onsubmit="return confirm(@js(__('admin.pages.restore_version') . '؟'));">
                                    @csrf
                                    <button type="submit"
                                            class="flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-50">
                                        <x-lucide-rotate-ccw class="size-3.5" aria-hidden="true" />
                                        <span>{{ __('admin.pages.restore_version') }}</span>
                                    </button>
                                </form>
                            @endif
                        </div>
                    </li>
                @endforeach
            </ol>
        @endif
    </x-admin.panel>
@endsection
