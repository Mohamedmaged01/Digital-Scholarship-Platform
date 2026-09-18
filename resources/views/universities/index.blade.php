@extends('layouts.public')

@section('title', __('pages.universities.title'))
@section('description', __('pages.universities.subtitle'))

@section('content')
    <div class="mx-auto max-w-7xl space-y-8 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">

        <x-page-hero icon="globe"
                     :eyebrow="__('pages.universities.eyebrow')"
                     :title="__('pages.universities.title')"
                     :subtitle="__('pages.universities.subtitle')" />

        {{-- Filters: a plain GET form, so every result set is a shareable URL. --}}
        <form method="get" class="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-2xs">
            <div class="flex flex-col items-center gap-4 md:flex-row">
                <label class="relative w-full md:flex-1">
                    <span class="sr-only">{{ __('pages.universities.eyebrow') }}</span>
                    <x-lucide-search class="pointer-events-none absolute inset-y-0 start-4 my-auto size-5 text-slate-400" aria-hidden="true" />
                    <input type="search" name="q" value="{{ $filters['q'] }}"
                           placeholder="{{ __('universities.search_placeholder') }}"
                           class="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3.5 pe-4 ps-12 text-sm transition focus:border-saudi-600 focus:bg-white focus:outline-none">
                </label>

                <div class="flex shrink-0 items-center gap-1 rounded-2xl border border-slate-200 bg-slate-100 p-1.5">
                    @foreach (['grid' => 'layout-grid', 'list' => 'list'] as $mode => $icon)
                        <button type="submit" name="view" value="{{ $mode }}"
                                class="{{ $view === $mode ? 'bg-white text-saudi-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900' }} flex items-center gap-1.5 rounded-xl p-2 text-xs font-bold transition">
                            <x-dynamic-component :component="'lucide-'.$icon" class="size-4" aria-hidden="true" />
                            <span class="hidden sm:inline">{{ __('catalog.view_modes.'.$mode) }}</span>
                        </button>
                    @endforeach
                </div>
            </div>

            <div class="grid grid-cols-1 gap-3 border-t border-slate-100 pt-4 sm:grid-cols-2 lg:grid-cols-4">
                <label class="space-y-1.5">
                    <span class="block text-[11px] font-bold text-slate-500">{{ __('catalog.filters.country') }}</span>
                    <select name="country" class="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-semibold text-slate-800 focus:border-saudi-600 focus:outline-none">
                        <option value="all">{{ __('catalog.filters.all_countries') }}</option>
                        @foreach ($countries as $country)
                            <option value="{{ $country->code }}" @selected($filters['country'] === $country->code)>
                                {{ $country->flag_emoji }} {{ $country->name }}
                            </option>
                        @endforeach
                    </select>
                </label>

                <label class="space-y-1.5">
                    <span class="block text-[11px] font-bold text-slate-500">{{ __('catalog.filters.track') }}</span>
                    <select name="track" class="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-semibold text-slate-800 focus:border-saudi-600 focus:outline-none">
                        <option value="all">{{ __('catalog.filters.all_tracks') }}</option>
                        @foreach ($tracks as $track)
                            <option value="{{ $track->id }}" @selected($filters['track'] === $track->id)>{{ $track->name }}</option>
                        @endforeach
                    </select>
                </label>

                <label class="space-y-1.5">
                    <span class="block text-[11px] font-bold text-slate-500">{{ __('catalog.filters.degree') }}</span>
                    <select name="degree" class="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-semibold text-slate-800 focus:border-saudi-600 focus:outline-none">
                        @foreach ($degreeOptions as $value => $label)
                            <option value="{{ $value }}" @selected($filters['degree'] === $value)>{{ $label }}</option>
                        @endforeach
                    </select>
                </label>

                <label class="space-y-1.5">
                    <span class="block text-[11px] font-bold text-slate-500">{{ __('catalog.filters.tier') }}</span>
                    <select name="tier" class="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-semibold text-slate-800 focus:border-saudi-600 focus:outline-none">
                        @foreach ($tierOptions as $value => $label)
                            <option value="{{ $value }}" @selected($filters['tier'] === $value)>{{ $label }}</option>
                        @endforeach
                    </select>
                </label>
            </div>

            <div class="flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
                <p class="text-xs font-semibold text-slate-500">
                    {{ __('catalog.filters.results_count', ['count' => $universities->total()]) }}
                </p>

                <div class="flex items-center gap-2">
                    <a href="{{ route('universities.index') }}"
                       class="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 transition hover:bg-slate-50">
                        {{ __('catalog.filters.reset') }}
                    </a>
                    <button type="submit" class="flex items-center gap-1.5 rounded-xl bg-saudi-700 px-5 py-2 text-xs font-bold text-white transition hover:bg-saudi-800">
                        <x-lucide-funnel class="size-3.5" aria-hidden="true" />
                        {{ __('catalog.filters.apply') }}
                    </button>
                </div>
            </div>
        </form>

        @if ($universities->isEmpty())
            <x-empty-state icon="search-x" :title="__('catalog.filters.empty')" :body="__('catalog.filters.empty_hint')">
                <a href="{{ route('universities.index') }}" class="inline-flex items-center gap-2 rounded-xl bg-saudi-700 px-4 py-2 text-xs font-bold text-white transition hover:bg-saudi-800">
                    {{ __('catalog.filters.reset') }}
                </a>
            </x-empty-state>
        @elseif ($view === 'list')
            <div class="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xs">
                <table class="w-full text-start text-xs">
                    <caption class="sr-only">{{ __('pages.universities.title') }}</caption>
                    <thead class="bg-slate-50 text-[11px] uppercase tracking-wide text-slate-500">
                        <tr>
                            <th scope="col" class="px-4 py-3 text-start font-bold">{{ __('catalog.university.rank') }}</th>
                            <th scope="col" class="px-4 py-3 text-start font-bold">{{ __('common.name') }}</th>
                            <th scope="col" class="px-4 py-3 text-start font-bold">{{ __('catalog.university.country') }}</th>
                            <th scope="col" class="hidden px-4 py-3 text-start font-bold lg:table-cell">{{ __('catalog.university.language_requirements') }}</th>
                            <th scope="col" class="hidden px-4 py-3 text-start font-bold md:table-cell">{{ __('catalog.university.accredited_tracks') }}</th>
                            <th scope="col" class="px-4 py-3 text-start font-bold">{{ __('common.actions') }}</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100">
                        @foreach ($universities as $university)
                            <tr class="transition hover:bg-slate-50/70">
                                <td class="numeric px-4 py-3 font-bold text-sand-500">#{{ $university->qs_rank }}</td>
                                <td class="px-4 py-3">
                                    <a href="{{ route('universities.show', $university) }}" class="font-bold text-slate-900 transition hover:text-saudi-700">
                                        {{ $university->name }}
                                    </a>
                                    <span class="block text-[11px] text-slate-500">{{ $university->city }}</span>
                                </td>
                                <td class="px-4 py-3 text-slate-600">{{ $university->country }}</td>
                                <td class="numeric hidden px-4 py-3 text-slate-600 lg:table-cell">
                                    IELTS {{ rtrim(rtrim(number_format($university->min_ielts, 1), '0'), '.') }} · TOEFL {{ $university->min_toefl }}
                                </td>
                                <td class="hidden px-4 py-3 md:table-cell">
                                    <span class="flex flex-wrap gap-1">
                                        @foreach ($university->tracks->take(2) as $track)
                                            <x-badge tone="saudi">{{ $track->name }}</x-badge>
                                        @endforeach
                                        @if ($university->tracks->count() > 2)
                                            <span class="self-center text-[10px] text-slate-400">+{{ $university->tracks->count() - 2 }}</span>
                                        @endif
                                    </span>
                                </td>
                                <td class="px-4 py-3">
                                    <a href="{{ route('universities.show', $university) }}" class="font-bold text-saudi-700 transition hover:underline">
                                        {{ __('common.view') }}
                                    </a>
                                </td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>
        @else
            <div class="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3">
                @foreach ($universities as $university)
                    <x-university-card :university="$university" />
                @endforeach
            </div>
        @endif

        {{ $universities->links() }}
    </div>
@endsection
