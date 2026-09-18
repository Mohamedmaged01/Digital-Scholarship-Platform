@extends('layouts.public')

@section('title', __('pages.faq.title'))
@section('description', __('pages.faq.subtitle'))

@section('content')
    <div class="mx-auto max-w-5xl space-y-8 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">

        <x-page-hero icon="circle-help"
                     :eyebrow="__('pages.faq.eyebrow')"
                     :title="__('pages.faq.title')"
                     :subtitle="__('pages.faq.subtitle')">
            <form method="get" class="max-w-xl">
                <input type="hidden" name="category" value="{{ $category }}">
                <label class="relative block">
                    <span class="sr-only">{{ __('faq.search_placeholder') }}</span>
                    <x-lucide-search class="pointer-events-none absolute inset-y-0 start-4 my-auto size-5 text-slate-400" aria-hidden="true" />
                    <input type="search" name="q" value="{{ $term }}" placeholder="{{ __('faq.search_placeholder') }}"
                           class="w-full rounded-2xl border border-white/20 bg-white/10 py-3.5 pe-4 ps-12 text-sm text-white placeholder:text-slate-400 focus:border-sand-300 focus:outline-none">
                </label>
            </form>
        </x-page-hero>

        <nav class="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none" aria-label="{{ __('common.filter') }}">
            @foreach ($categories as $slug => $count)
                <a href="{{ route('faq.index', array_filter(['category' => $slug === 'all' ? null : $slug, 'q' => $term ?: null])) }}"
                   @if ($category === $slug) aria-current="page" @endif
                   class="{{ $category === $slug ? 'bg-saudi-700 text-white shadow-2xs' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50 hover:text-slate-900' }} flex shrink-0 items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition">
                    <span>{{ __('faq_categories.'.$slug) }}</span>
                    <span class="numeric {{ $category === $slug ? 'bg-white/20' : 'bg-slate-100' }} rounded px-1.5 py-0.5 text-[10px]">{{ $count }}</span>
                </a>
            @endforeach
        </nav>

        @if (filled($term))
            <p class="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-xs text-slate-600">
                <span>{{ __('pages.search.summary', ['query' => $term]) }} — <span class="numeric font-bold">{{ $faqs->count() }}</span></span>
                <a href="{{ route('faq.index', $category === 'all' ? [] : ['category' => $category]) }}" class="font-bold text-saudi-700 transition hover:underline">
                    {{ __('catalog.filters.reset') }}
                </a>
            </p>
        @endif

        <x-faq-accordion :faqs="$faqs" :open-id="$openId" />

        <section class="flex flex-col items-center justify-between gap-4 rounded-3xl border border-saudi-800/40 bg-gradient-to-r from-saudi-950 via-saudi-700 to-slate-900 p-6 text-white shadow-md sm:flex-row">
            <div class="flex items-center gap-3.5">
                <span class="flex size-12 shrink-0 items-center justify-center rounded-xl border border-saudi-400/30 bg-saudi-500/20">
                    <x-lucide-bot class="size-6 text-saudi-300" aria-hidden="true" />
                </span>
                <div>
                    <h2 class="text-sm font-bold sm:text-base">{{ __('faq.ask_ai_advisor') }}</h2>
                    <p class="mt-0.5 text-xs text-saudi-100/80">{{ __('ai_chat.subtitle') }}</p>
                </div>
            </div>

            <button type="button" @click="$dispatch('open-advisor')"
                    class="flex shrink-0 items-center gap-1.5 rounded-xl bg-sand-300 px-5 py-2.5 text-xs font-bold text-slate-950 shadow-md transition hover:bg-sand-200">
                <x-lucide-sparkles class="size-3.5" aria-hidden="true" />
                <span>{{ __('ai_chat.title') }}</span>
            </button>
        </section>

        <section class="grid grid-cols-1 gap-4 sm:grid-cols-3">
            @foreach ($aiSuggestions as $prompt)
                <button type="button"
                        @click="$dispatch('open-advisor')"
                        class="rounded-2xl border border-slate-200 bg-white p-4 text-start text-xs font-semibold text-slate-700 shadow-2xs transition hover:border-saudi-300 hover:text-saudi-700">
                    <x-lucide-message-circle-question-mark class="mb-2 size-4 text-saudi-600" aria-hidden="true" />
                    {{ $prompt }}
                </button>
            @endforeach
        </section>
    </div>
@endsection
