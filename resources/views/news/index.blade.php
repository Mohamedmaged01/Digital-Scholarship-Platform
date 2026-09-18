@extends('layouts.public')

@section('title', __('pages.news.title'))
@section('description', __('pages.news.subtitle'))

@section('content')
    <div class="mx-auto max-w-7xl space-y-8 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">

        <x-page-hero icon="newspaper"
                     :eyebrow="__('pages.news.eyebrow')"
                     :title="__('pages.news.title')"
                     :subtitle="__('pages.news.subtitle')" />

        <nav class="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none" aria-label="{{ __('common.filter') }}">
            @foreach ($categories as $slug => $label)
                <a href="{{ route('news.index', $slug === 'all' ? [] : ['category' => $slug]) }}"
                   @if ($category === $slug) aria-current="page" @endif
                   class="{{ $category === $slug ? 'bg-saudi-700 text-white shadow-2xs' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50' }} shrink-0 rounded-xl px-3.5 py-2 text-xs font-bold transition">
                    {{ $label }}
                </a>
            @endforeach
        </nav>

        @if ($featured)
            <article class="grid grid-cols-1 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-md lg:grid-cols-2">
                @if (filled($featured->image_url))
                    <div class="aspect-16/10 overflow-hidden bg-slate-100 lg:aspect-auto">
                        <img src="{{ $featured->image_url }}" alt="{{ $featured->title }}"
                             class="size-full object-cover" loading="eager" decoding="async" referrerpolicy="no-referrer">
                    </div>
                @endif

                <div class="flex flex-col justify-center gap-4 p-6 sm:p-10">
                    <div class="flex flex-wrap items-center gap-2">
                        <x-badge tone="sand" icon="star">{{ __('pages.news.featured') }}</x-badge>
                        <x-badge tone="saudi">{{ $featured->categoryLabel() }}</x-badge>
                    </div>

                    <h2 class="text-xl font-black leading-snug text-slate-900 sm:text-2xl">
                        <a href="{{ route('news.show', $featured) }}" class="transition hover:text-saudi-700">{{ $featured->title }}</a>
                    </h2>

                    <p class="text-sm leading-relaxed text-slate-600">{{ $featured->summary }}</p>

                    <div class="flex items-center gap-4 text-[11px] text-slate-500">
                        <time datetime="{{ $featured->publish_date?->toDateString() }}" class="numeric">
                            {{ $featured->publish_date?->translatedFormat('d MMMM y') }}
                        </time>
                        <span>{{ $featured->author }}</span>
                    </div>

                    <a href="{{ route('news.show', $featured) }}"
                       class="inline-flex w-fit items-center gap-2 rounded-xl bg-saudi-700 px-5 py-2.5 text-xs font-bold text-white transition hover:bg-saudi-800">
                        <span>{{ __('pages.news.read_more') }}</span>
                        <x-lucide-arrow-right class="size-3.5 flip-rtl" aria-hidden="true" />
                    </a>
                </div>
            </article>
        @endif

        @if ($articles->isEmpty())
            <x-empty-state icon="newspaper" :title="__('pages.news.empty')" />
        @else
            <div class="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                @foreach ($articles as $article)
                    <article class="group flex flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-2xs transition-all hover:-translate-y-0.5 hover:border-saudi-300 hover:shadow-md">
                        @if (filled($article->image_url))
                            <div class="aspect-16/9 overflow-hidden bg-slate-100">
                                <img src="{{ $article->image_url }}" alt="{{ $article->title }}"
                                     loading="lazy" decoding="async" referrerpolicy="no-referrer"
                                     class="size-full object-cover transition-transform duration-500 group-hover:scale-105">
                            </div>
                        @endif

                        <div class="flex flex-1 flex-col justify-between gap-3 p-5">
                            <div class="space-y-2">
                                <x-badge tone="saudi">{{ $article->categoryLabel() }}</x-badge>

                                <h2 class="text-base font-bold leading-snug text-slate-900 transition group-hover:text-saudi-700">
                                    <a href="{{ route('news.show', $article) }}">{{ $article->title }}</a>
                                </h2>

                                <p class="line-clamp-3 text-xs leading-relaxed text-slate-600">{{ $article->summary }}</p>
                            </div>

                            <div class="flex items-center justify-between border-t border-slate-100 pt-3 text-[11px] text-slate-500">
                                <time datetime="{{ $article->publish_date?->toDateString() }}" class="numeric">
                                    {{ $article->publish_date?->translatedFormat('d MMMM y') }}
                                </time>
                                <span class="flex items-center gap-1">
                                    <x-lucide-clock class="size-3" aria-hidden="true" />
                                    <span class="numeric">{{ $article->read_time_minutes }}</span>
                                    <span>{{ app()->getLocale() === 'ar' ? 'دقائق' : 'min' }}</span>
                                </span>
                            </div>
                        </div>
                    </article>
                @endforeach
            </div>
        @endif

        {{ $articles->links() }}
    </div>
@endsection
