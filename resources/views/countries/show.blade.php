@extends('layouts.public')

@section('title', $country->name)
@section('description', $country->visa_overview ?: __('pages.countries.subtitle'))

@section('content')
    <div class="mx-auto max-w-7xl space-y-8 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">

        <nav aria-label="breadcrumb" class="flex items-center gap-2 text-xs text-slate-500">
            <a href="{{ route('home') }}" class="transition hover:text-saudi-700">{{ __('nav.overview') }}</a>
            <x-lucide-chevron-right class="size-3 flip-rtl" aria-hidden="true" />
            <a href="{{ route('countries.index') }}" class="transition hover:text-saudi-700">{{ __('pages.countries.title') }}</a>
            <x-lucide-chevron-right class="size-3 flip-rtl" aria-hidden="true" />
            <span class="font-bold text-slate-700">{{ $country->name }}</span>
        </nav>

        <x-page-hero icon="map-pin" :eyebrow="$country->region" :title="$country->flag_emoji.' '.$country->name" :subtitle="$country->visa_overview">
            <dl class="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div class="rounded-2xl border border-white/10 bg-white/5 p-3">
                    <dt class="text-[11px] font-semibold text-saudi-300">{{ __('catalog.country.universities_count') }}</dt>
                    <dd class="numeric text-xl font-black text-white">{{ $universities->count() }}</dd>
                </div>
                <div class="rounded-2xl border border-white/10 bg-white/5 p-3">
                    <dt class="text-[11px] font-semibold text-saudi-300">{{ app()->getLocale() === 'ar' ? 'مدة التأشيرة' : 'Visa processing' }}</dt>
                    <dd class="numeric text-xl font-black text-white">{{ $country->visa_processing_days }}</dd>
                </div>
                <div class="rounded-2xl border border-white/10 bg-white/5 p-3">
                    <dt class="text-[11px] font-semibold text-saudi-300">{{ __('catalog.country.language') }}</dt>
                    <dd class="text-sm font-bold text-white">{{ $country->primary_language ?: '—' }}</dd>
                </div>
                <div class="rounded-2xl border border-white/10 bg-white/5 p-3">
                    <dt class="text-[11px] font-semibold text-saudi-300">{{ __('catalog.country.mission_city') }}</dt>
                    <dd class="text-sm font-bold text-white">{{ $country->cultural_mission_city ?: '—' }}</dd>
                </div>
            </dl>
        </x-page-hero>

        @if ($missions->isNotEmpty())
            <section class="space-y-4">
                <h2 class="text-lg font-bold text-slate-900">{{ __('admin.countries.missions') }}</h2>
                <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
                    @foreach ($missions as $mission)
                        @include('missions.partials.card', ['mission' => $mission])
                    @endforeach
                </div>
            </section>
        @endif

        <section class="space-y-4">
            <x-section-heading :title="__('catalog.country.universities_count')" :subtitle="__('pages.universities.subtitle')">
                <a href="{{ route('universities.index', ['country' => $country->code]) }}"
                   class="flex items-center gap-2 rounded-xl bg-slate-100 px-4 py-2.5 text-xs font-bold text-slate-800 transition hover:bg-slate-200">
                    <span>{{ __('catalog.filters.apply') }}</span>
                    <x-lucide-arrow-right class="size-3.5 flip-rtl" aria-hidden="true" />
                </a>
            </x-section-heading>

            @if ($universities->isEmpty())
                <x-empty-state icon="building-2" :title="__('common.empty')" />
            @else
                <div class="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3">
                    @foreach ($universities as $university)
                        <x-university-card :university="$university" />
                    @endforeach
                </div>
            @endif
        </section>
    </div>
@endsection
