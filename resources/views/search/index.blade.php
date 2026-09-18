@extends('layouts.public')

@section('title', __('pages.search.title'))

@section('content')
    <div class="mx-auto max-w-5xl space-y-8 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">

        <x-page-hero icon="search" :eyebrow="__('common.search')" :title="__('pages.search.title')">
            <form method="get" class="max-w-2xl">
                <label class="relative block">
                    <span class="sr-only">{{ __('pages.search.placeholder') }}</span>
                    <x-lucide-search class="pointer-events-none absolute inset-y-0 start-4 my-auto size-5 text-slate-400" aria-hidden="true" />
                    <input type="search" name="q" value="{{ $term }}" autofocus
                           placeholder="{{ __('pages.search.placeholder') }}"
                           class="w-full rounded-2xl border border-white/20 bg-white/10 py-3.5 pe-28 ps-12 text-sm text-white placeholder:text-slate-400 focus:border-sand-300 focus:outline-none">
                    <button type="submit" class="absolute inset-y-1.5 end-1.5 rounded-xl bg-sand-300 px-5 text-xs font-bold text-slate-950 transition hover:bg-sand-200">
                        {{ __('common.search') }}
                    </button>
                </label>
            </form>
        </x-page-hero>

        @if ($term === '')
            <x-empty-state icon="search" :title="__('pages.search.placeholder')" :body="__('pages.search.empty')" />
        @elseif ($total === 0)
            <x-empty-state icon="search-x" :title="__('common.no_results')" :body="__('pages.search.empty')">
                <button type="button" @click="$dispatch('open-advisor')"
                        class="inline-flex items-center gap-2 rounded-xl bg-saudi-700 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-saudi-800">
                    <x-lucide-bot class="size-4" aria-hidden="true" />
                    <span>{{ __('pages.search.ask_ai') }}</span>
                </button>
            </x-empty-state>
        @else
            <p class="text-sm text-slate-600">
                {{ __('pages.search.summary', ['query' => $term]) }} — <span class="numeric font-bold text-slate-900">{{ $total }}</span>
            </p>

            @if ($results['tracks']->isNotEmpty())
                <section class="space-y-3">
                    <h2 class="text-sm font-bold uppercase tracking-wide text-slate-500">{{ __('pages.search.groups.tracks') }}</h2>
                    <ul class="space-y-2">
                        @foreach ($results['tracks'] as $track)
                            <li>
                                <a href="{{ route('tracks.show', $track) }}"
                                   class="group flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs transition hover:border-saudi-300">
                                    <span class="flex items-center gap-3">
                                        <span class="flex size-9 shrink-0 items-center justify-center rounded-xl bg-saudi-50 text-saudi-700">
                                            <x-dynamic-component :component="'lucide-'.$track->icon_name" class="size-4" aria-hidden="true" />
                                        </span>
                                        <span>
                                            <span class="block text-sm font-bold text-slate-900 transition group-hover:text-saudi-700">{{ $track->name }}</span>
                                            <span class="line-clamp-1 block text-[11px] text-slate-500">{{ $track->description }}</span>
                                        </span>
                                    </span>
                                    <x-lucide-chevron-right class="size-4 shrink-0 flip-rtl text-slate-400" aria-hidden="true" />
                                </a>
                            </li>
                        @endforeach
                    </ul>
                </section>
            @endif

            @if ($results['universities']->isNotEmpty())
                <section class="space-y-3">
                    <h2 class="text-sm font-bold uppercase tracking-wide text-slate-500">{{ __('pages.search.groups.universities') }}</h2>
                    <ul class="space-y-2">
                        @foreach ($results['universities'] as $university)
                            <li>
                                <a href="{{ route('universities.show', $university) }}"
                                   class="group flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs transition hover:border-saudi-300">
                                    <span>
                                        <span class="numeric block text-[11px] font-bold text-sand-500">#{{ $university->qs_rank }}</span>
                                        <span class="block text-sm font-bold text-slate-900 transition group-hover:text-saudi-700">{{ $university->name }}</span>
                                        <span class="block text-[11px] text-slate-500">{{ $university->city }}, {{ $university->country }}</span>
                                    </span>
                                    <x-lucide-chevron-right class="size-4 shrink-0 flip-rtl text-slate-400" aria-hidden="true" />
                                </a>
                            </li>
                        @endforeach
                    </ul>
                </section>
            @endif

            @if ($results['faqs']->isNotEmpty())
                <section class="space-y-3">
                    <h2 class="text-sm font-bold uppercase tracking-wide text-slate-500">{{ __('pages.search.groups.faqs') }}</h2>
                    <x-faq-accordion :faqs="$results['faqs']" />
                </section>
            @endif

            @if ($results['news']->isNotEmpty())
                <section class="space-y-3">
                    <h2 class="text-sm font-bold uppercase tracking-wide text-slate-500">{{ __('pages.search.groups.news') }}</h2>
                    <ul class="space-y-2">
                        @foreach ($results['news'] as $article)
                            <li>
                                <a href="{{ route('news.show', $article) }}"
                                   class="group flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs transition hover:border-saudi-300">
                                    <span>
                                        <span class="numeric block text-[11px] text-slate-500">{{ $article->publish_date?->translatedFormat('d MMMM y') }}</span>
                                        <span class="block text-sm font-bold text-slate-900 transition group-hover:text-saudi-700">{{ $article->title }}</span>
                                    </span>
                                    <x-lucide-chevron-right class="size-4 shrink-0 flip-rtl text-slate-400" aria-hidden="true" />
                                </a>
                            </li>
                        @endforeach
                    </ul>
                </section>
            @endif

            @if ($results['missions']->isNotEmpty())
                <section class="space-y-3">
                    <h2 class="text-sm font-bold uppercase tracking-wide text-slate-500">{{ __('pages.search.groups.missions') }}</h2>
                    <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
                        @foreach ($results['missions'] as $mission)
                            @include('missions.partials.card', ['mission' => $mission])
                        @endforeach
                    </div>
                </section>
            @endif
        @endif
    </div>
@endsection
