@extends('layouts.admin')

@section('title', __('admin.media.title'))

@php
    $section = 'media';
    $canEdit = auth()->user()->hasPermission('media:write');
@endphp

@section('content')
    @if ($canEdit)
        <x-admin.panel icon="upload" :title="__('admin.media.upload')" :subtitle="__('admin.media.upload_hint')">
            <form method="post" action="{{ route('admin.media.store') }}" enctype="multipart/form-data"
                  class="grid grid-cols-1 items-end gap-4 sm:grid-cols-2 lg:grid-cols-4">
                @csrf

                <x-admin.field :label="__('common.name')" name="file" required>
                    <input type="file" name="file" required
                           accept=".jpg,.jpeg,.png,.webp,.gif,.svg,.pdf"
                           class="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs file:me-3 file:rounded-lg file:border-0 file:bg-saudi-700 file:px-3 file:py-1.5 file:text-xs file:font-bold file:text-white">
                </x-admin.field>

                <x-admin.field :label="__('admin.media.folder')" name="folder" required>
                    <x-admin.select name="folder" required>
                        @foreach (\App\Http\Controllers\Admin\MediaController::FOLDERS as $folderOption)
                            <option value="{{ $folderOption }}">{{ __('admin.media.folders.'.$folderOption) }}</option>
                        @endforeach
                    </x-admin.select>
                </x-admin.field>

                <x-admin.field :label="app()->getLocale() === 'ar' ? 'النص البديل — العربية' : 'Alt text — Arabic'"
                               name="alt_text_ar" required :hint="__('admin.media.alt_text_required')">
                    <x-admin.input name="alt_text_ar" value="{{ old('alt_text_ar') }}" required />
                </x-admin.field>

                <div class="flex items-end gap-2">
                    <x-admin.field :label="app()->getLocale() === 'ar' ? 'النص البديل — الإنجليزية' : 'Alt text — English'" name="alt_text_en">
                        <x-admin.input name="alt_text_en" value="{{ old('alt_text_en') }}" dir="ltr" />
                    </x-admin.field>
                </div>

                <div class="sm:col-span-2 lg:col-span-4">
                    <x-admin.submit icon="upload">{{ __('admin.media.upload') }}</x-admin.submit>
                </div>
            </form>
        </x-admin.panel>
    @endif

    <x-admin.panel icon="image" :title="__('admin.media.title')" :subtitle="__('admin.media.subtitle')">
        <x-slot:actions>
            <nav class="flex flex-wrap items-center gap-1.5" aria-label="{{ __('common.filter') }}">
                @foreach ($folders as $value => $label)
                    <a href="{{ route('admin.media.index', $value === 'all' ? [] : ['folder' => $value]) }}"
                       @if ($folder === $value) aria-current="page" @endif
                       class="{{ $folder === $value ? 'bg-saudi-700 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200' }} rounded-xl px-3 py-1.5 text-[11px] font-bold transition">
                        {{ $label }}
                    </a>
                @endforeach
            </nav>
        </x-slot:actions>

        @if ($items->isEmpty())
            <p class="py-10 text-center text-xs text-slate-400">{{ __('common.empty') }}</p>
        @else
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                @foreach ($items as $item)
                    <figure class="space-y-3 overflow-hidden rounded-2xl border border-slate-200 bg-white p-3 shadow-2xs">
                        <div class="flex aspect-16/10 items-center justify-center overflow-hidden rounded-xl bg-slate-100">
                            @if ($item->isImage())
                                <img src="{{ $item->url }}" alt="{{ $item->alt_text ?: $item->file_name }}"
                                     class="size-full object-cover" loading="lazy" referrerpolicy="no-referrer">
                            @else
                                <x-lucide-file-text class="size-10 text-slate-400" aria-hidden="true" />
                            @endif
                        </div>

                        <figcaption class="space-y-1">
                            <p class="truncate text-xs font-bold text-slate-900" dir="ltr" title="{{ $item->file_name }}">{{ $item->file_name }}</p>
                            <p class="numeric flex items-center gap-2 text-[11px] text-slate-500">
                                <span>{{ $item->humanSize() }}</span>
                                @if ($item->dimensions)
                                    <span aria-hidden="true">·</span>
                                    <span>{{ $item->dimensions }}</span>
                                @endif
                                <x-badge tone="slate">{{ __('admin.media.folders.'.$item->folder) }}</x-badge>
                            </p>
                            <p class="line-clamp-1 text-[11px] text-slate-600">{{ $item->alt_text_ar ?: '—' }}</p>
                        </figcaption>

                        <div class="flex items-center gap-2 border-t border-slate-100 pt-2">
                            <div x-data="copyToClipboard(@js($item->url), @js(__('common.copied')))" class="flex-1">
                                <button type="button" @click="copy()"
                                        class="flex w-full items-center justify-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2 text-[11px] font-bold text-slate-700 transition hover:bg-slate-50">
                                    <x-lucide-copy class="size-3.5" x-show="!copied" aria-hidden="true" />
                                    <x-lucide-check class="size-3.5 text-saudi-600" x-show="copied" x-cloak aria-hidden="true" />
                                    <span x-text="copied ? confirmedLabel : @js(__('admin.media.copy_url'))"></span>
                                </button>
                            </div>

                            @if ($canEdit)
                                <x-admin.delete-button :action="route('admin.media.destroy', $item)" label="" />
                            @endif
                        </div>

                        @if ($canEdit)
                            <details class="border-t border-slate-100 pt-2">
                                <summary class="cursor-pointer text-[11px] font-bold text-saudi-700">{{ __('admin.media.edit') }}</summary>

                                <form method="post" action="{{ route('admin.media.update', $item) }}" class="mt-2 space-y-2">
                                    @csrf
                                    @method('PUT')

                                    <x-admin.field :label="app()->getLocale() === 'ar' ? 'النص البديل — العربية' : 'Alt text — Arabic'" name="alt_text_ar" required>
                                        <x-admin.input name="alt_text_ar" value="{{ $item->alt_text_ar }}" required />
                                    </x-admin.field>

                                    <x-admin.field :label="app()->getLocale() === 'ar' ? 'النص البديل — الإنجليزية' : 'Alt text — English'" name="alt_text_en">
                                        <x-admin.input name="alt_text_en" value="{{ $item->alt_text_en }}" dir="ltr" />
                                    </x-admin.field>

                                    <x-admin.field :label="__('admin.media.folder')" name="folder" required>
                                        <x-admin.select name="folder" required>
                                            @foreach (\App\Http\Controllers\Admin\MediaController::FOLDERS as $folderOption)
                                                <option value="{{ $folderOption }}" @selected($item->folder === $folderOption)>
                                                    {{ __('admin.media.folders.'.$folderOption) }}
                                                </option>
                                            @endforeach
                                        </x-admin.select>
                                    </x-admin.field>

                                    <x-admin.submit class="w-full">{{ __('common.save') }}</x-admin.submit>
                                </form>
                            </details>
                        @endif
                    </figure>
                @endforeach
            </div>

            {{ $items->links() }}
        @endif
    </x-admin.panel>
@endsection
