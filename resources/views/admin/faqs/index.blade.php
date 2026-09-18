@extends('layouts.admin')

@section('title', __('admin.faqs.title'))

@php $section = 'faqs'; @endphp

@section('content')
    <x-admin.panel icon="circle-help" :title="__('admin.faqs.title')" :subtitle="__('admin.faqs.subtitle')">
        @permission('faqs:write')
            <x-slot:actions>
                <a href="{{ route('admin.faqs.create') }}"
                   class="flex items-center gap-1.5 rounded-xl bg-saudi-700 px-4 py-2 text-xs font-bold text-white transition hover:bg-saudi-800">
                    <x-lucide-plus class="size-3.5" aria-hidden="true" />
                    <span>{{ __('admin.faqs.create') }}</span>
                </a>
            </x-slot:actions>
        @endpermission

        <form method="get" class="grid grid-cols-1 gap-3 rounded-2xl border border-slate-200 bg-slate-50/60 p-4 sm:grid-cols-3">
            <label class="sm:col-span-2">
                <span class="mb-1 block text-[11px] font-bold text-slate-600">{{ __('common.search') }}</span>
                <x-admin.input type="search" name="q" value="{{ $term }}" placeholder="{{ __('faq.search_placeholder') }}" />
            </label>

            <label>
                <span class="mb-1 block text-[11px] font-bold text-slate-600">{{ __('common.category') }}</span>
                <div class="flex items-center gap-2">
                    <x-admin.select name="category">
                        <option value="all">{{ __('faq_categories.all') }}</option>
                        @foreach ($categories as $value => $label)
                            <option value="{{ $value }}" @selected($category === $value)>{{ $label }}</option>
                        @endforeach
                    </x-admin.select>
                    <button type="submit" class="shrink-0 rounded-xl bg-saudi-700 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-saudi-800">
                        {{ __('common.filter') }}
                    </button>
                </div>
            </label>
        </form>

        <ul class="space-y-3">
            @forelse ($faqs as $faq)
                <li class="space-y-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs">
                    <div class="flex flex-wrap items-start justify-between gap-3">
                        <div class="space-y-1">
                            <div class="flex flex-wrap items-center gap-2">
                                <x-badge tone="saudi">{{ __('faq_categories.'.$faq->category) }}</x-badge>
                                <x-badge :tone="$faq->is_published ? 'emerald' : 'slate'">
                                    {{ $faq->is_published ? __('common.published') : __('common.draft') }}
                                </x-badge>
                                @if ($faq->is_featured)
                                    <x-badge tone="sand" icon="star">{{ __('pages.news.featured') }}</x-badge>
                                @endif
                            </div>

                            <p class="text-sm font-bold text-slate-900">{{ $faq->question_ar }}</p>
                            <p class="text-[11px] text-slate-500" dir="ltr">{{ $faq->question_en }}</p>
                        </div>

                        <div class="flex shrink-0 items-center gap-2">
                            <a href="{{ route('admin.faqs.edit', $faq) }}"
                               class="flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-50">
                                <x-lucide-pencil class="size-3.5" aria-hidden="true" />
                                <span>{{ auth()->user()->hasPermission('faqs:write') ? __('common.edit') : __('common.view') }}</span>
                            </a>

                            @permission('faqs:write')
                                <x-admin.delete-button :action="route('admin.faqs.destroy', $faq)" label="" />
                            @endpermission
                        </div>
                    </div>

                    <p class="line-clamp-2 border-t border-slate-100 pt-2 text-xs leading-relaxed text-slate-600">{{ $faq->answer_ar }}</p>
                </li>
            @empty
                <li class="py-10 text-center text-xs text-slate-400">{{ __('common.no_results') }}</li>
            @endforelse
        </ul>

        {{ $faqs->links() }}
    </x-admin.panel>
@endsection
