@extends('layouts.admin')

@section('title', __('admin.news.title'))

@php $section = 'news'; @endphp

@section('content')
    <x-admin.panel icon="newspaper" :title="__('admin.news.title')" :subtitle="__('admin.news.subtitle')">
        @permission('news:write')
            <x-slot:actions>
                <a href="{{ route('admin.news.create') }}"
                   class="flex items-center gap-1.5 rounded-xl bg-saudi-700 px-4 py-2 text-xs font-bold text-white transition hover:bg-saudi-800">
                    <x-lucide-plus class="size-3.5" aria-hidden="true" />
                    <span>{{ __('admin.news.create') }}</span>
                </a>
            </x-slot:actions>
        @endpermission

        <nav class="flex flex-wrap items-center gap-1.5" aria-label="{{ __('common.filter') }}">
            @foreach ($statusOptions as $value => $label)
                <a href="{{ route('admin.news.index', $value === 'all' ? [] : ['status' => $value]) }}"
                   @if ($status === $value) aria-current="page" @endif
                   class="{{ $status === $value ? 'bg-saudi-700 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200' }} rounded-xl px-3.5 py-2 text-xs font-bold transition">
                    {{ $label }}
                </a>
            @endforeach
        </nav>

        <ul class="space-y-3">
            @forelse ($articles as $article)
                <li class="flex flex-wrap items-start justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs">
                    <div class="flex min-w-0 flex-1 items-start gap-3">
                        @if (filled($article->image_url))
                            <img src="{{ $article->image_url }}" alt="" width="96" height="64"
                                 class="hidden size-16 shrink-0 rounded-xl object-cover sm:block"
                                 loading="lazy" referrerpolicy="no-referrer">
                        @endif

                        <div class="min-w-0 space-y-1">
                            <div class="flex flex-wrap items-center gap-2">
                                <x-badge tone="saudi">{{ $article->categoryLabel() }}</x-badge>
                                <x-badge :tone="match ($article->status) { 'published' => 'emerald', 'archived' => 'slate', default => 'amber' }">
                                    {{ __('news.statuses.'.$article->status) }}
                                </x-badge>
                                @if ($article->is_featured)
                                    <x-badge tone="sand" icon="star">{{ __('pages.news.featured') }}</x-badge>
                                @endif
                            </div>

                            <p class="truncate text-sm font-bold text-slate-900">{{ $article->title_ar }}</p>
                            <p class="numeric text-[11px] text-slate-500">
                                {{ $article->publish_date?->toDateString() }} · {{ $article->author_ar }}
                            </p>
                        </div>
                    </div>

                    <div class="flex shrink-0 flex-wrap items-center gap-2">
                        @permission('news:write')
                            <form method="post" action="{{ route('admin.news.status', $article) }}" class="inline">
                                @csrf
                                @method('PATCH')
                                <input type="hidden" name="status" value="{{ $article->status === 'published' ? 'draft' : 'published' }}">
                                <button type="submit"
                                        @disabled($article->status !== 'published' && ! auth()->user()->canPublishContent())
                                        class="{{ $article->status === 'published'
                                            ? 'border-amber-200 bg-amber-50 text-amber-800 hover:bg-amber-100'
                                            : 'border-saudi-200 bg-saudi-50 text-saudi-800 hover:bg-saudi-100' }} flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-bold transition disabled:opacity-40">
                                    <x-lucide-eye class="size-3.5" aria-hidden="true" />
                                    <span>{{ $article->status === 'published' ? __('admin.news.unpublish') : __('admin.news.publish') }}</span>
                                </button>
                            </form>
                        @endpermission

                        <a href="{{ route('admin.news.edit', $article) }}"
                           class="flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-50">
                            <x-lucide-pencil class="size-3.5" aria-hidden="true" />
                            <span>{{ auth()->user()->hasPermission('news:write') ? __('common.edit') : __('common.view') }}</span>
                        </a>

                        @if ($article->status === 'published')
                            <a href="{{ route('news.show', $article) }}" target="_blank" rel="noopener"
                               class="rounded-xl border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-50 hover:text-saudi-700"
                               aria-label="{{ __('common.view') }}">
                                <x-lucide-external-link class="size-3.5" aria-hidden="true" />
                            </a>
                        @endif

                        @permission('news:write')
                            <x-admin.delete-button :action="route('admin.news.destroy', $article)" label="" />
                        @endpermission
                    </div>
                </li>
            @empty
                <li class="py-10 text-center text-xs text-slate-400">{{ __('pages.news.empty') }}</li>
            @endforelse
        </ul>

        {{ $articles->links() }}
    </x-admin.panel>
@endsection
