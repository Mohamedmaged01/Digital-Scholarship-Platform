@extends('layouts.admin')

@section('title', __('admin.pages.title'))

@php $section = 'pages'; @endphp

@section('content')
    <x-admin.panel icon="layers" :title="__('admin.pages.title')" :subtitle="__('admin.pages.subtitle')">
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            @foreach ($pages as $page)
                <a href="{{ route('admin.pages.show', $page) }}"
                   class="group space-y-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs transition hover:-translate-y-0.5 hover:border-saudi-300 hover:shadow-md">
                    <div class="flex items-start justify-between gap-3">
                        <div class="space-y-1">
                            <h3 class="text-sm font-bold text-slate-900 transition group-hover:text-saudi-700">{{ $page->title_ar }}</h3>
                            <code class="text-[11px] text-slate-500">/{{ $page->slug }}</code>
                        </div>

                        <x-badge :tone="$page->isPublished() ? 'emerald' : 'amber'">
                            {{ __('news.statuses.'.$page->status) }}
                        </x-badge>
                    </div>

                    @if (filled($page->description_ar))
                        <p class="line-clamp-2 text-xs leading-relaxed text-slate-600">{{ $page->description_ar }}</p>
                    @endif

                    <dl class="grid grid-cols-3 gap-3 border-t border-slate-100 pt-3 text-[11px]">
                        <div>
                            <dt class="font-semibold text-slate-400">{{ __('admin.pages.blocks') }}</dt>
                            <dd class="numeric font-bold text-slate-800">{{ $page->blocks_count }}</dd>
                        </div>
                        <div>
                            <dt class="font-semibold text-slate-400">{{ __('admin.pages.versions') }}</dt>
                            <dd class="numeric font-bold text-slate-800">{{ $page->versions_count }}</dd>
                        </div>
                        <div>
                            <dt class="font-semibold text-slate-400">{{ __('admin.audit.when') }}</dt>
                            <dd class="numeric font-bold text-slate-800">{{ $page->updated_at?->diffForHumans() }}</dd>
                        </div>
                    </dl>
                </a>
            @endforeach
        </div>
    </x-admin.panel>
@endsection
