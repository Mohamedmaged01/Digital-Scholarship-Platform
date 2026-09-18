@extends('layouts.public')

@section('title', __('pages.missions.title'))
@section('description', __('pages.missions.subtitle'))

@section('content')
    <div class="mx-auto max-w-7xl space-y-8 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">

        <x-page-hero icon="building-2"
                     :eyebrow="__('pages.missions.eyebrow')"
                     :title="__('pages.missions.title')"
                     :subtitle="__('pages.missions.subtitle')">
            <dl class="grid grid-cols-2 gap-4 sm:grid-cols-3">
                <div class="rounded-2xl border border-white/10 bg-white/5 p-3">
                    <dt class="text-[11px] font-semibold text-saudi-300">{{ __('pages.missions.title') }}</dt>
                    <dd class="numeric text-xl font-black text-white">{{ $missions->count() }}</dd>
                </div>
                <div class="rounded-2xl border border-white/10 bg-white/5 p-3">
                    <dt class="text-[11px] font-semibold text-saudi-300">{{ __('pages.missions.active_scholars') }}</dt>
                    <dd class="numeric text-xl font-black text-white">{{ number_format($totalScholars) }}</dd>
                </div>
                <div class="rounded-2xl border border-white/10 bg-white/5 p-3">
                    <dt class="text-[11px] font-semibold text-saudi-300">{{ __('pages.help.hotline') }}</dt>
                    <dd class="numeric text-xl font-black text-white">{{ $settings['support_phone'] ?? config('kasp.support.phone') }}</dd>
                </div>
            </dl>
        </x-page-hero>

        <form method="get" class="flex flex-col items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs sm:flex-row">
            <label class="relative w-full flex-1">
                <span class="sr-only">{{ __('pages.missions.search_placeholder') }}</span>
                <x-lucide-search class="pointer-events-none absolute inset-y-0 start-4 my-auto size-4 text-slate-400" aria-hidden="true" />
                <input type="search" name="q" value="{{ $term }}"
                       placeholder="{{ __('pages.missions.search_placeholder') }}"
                       class="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pe-4 ps-11 text-xs transition focus:border-saudi-600 focus:bg-white focus:outline-none sm:text-sm">
            </label>

            <div class="flex w-full shrink-0 items-center gap-2 sm:w-auto">
                <button type="submit" class="flex-1 rounded-xl bg-saudi-700 px-5 py-2.5 text-xs font-bold text-white transition hover:bg-saudi-800 sm:flex-none">
                    {{ __('common.search') }}
                </button>
                @if (filled($term))
                    <a href="{{ route('missions.index') }}" class="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-600 transition hover:bg-slate-50">
                        {{ __('catalog.filters.reset') }}
                    </a>
                @endif
            </div>
        </form>

        @if ($missions->isEmpty())
            <x-empty-state icon="search-x" :title="__('common.no_results')" :body="__('pages.missions.search_placeholder')" />
        @else
            <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                @foreach ($missions as $mission)
                    @include('missions.partials.card', ['mission' => $mission])
                @endforeach
            </div>
        @endif
    </div>
@endsection
