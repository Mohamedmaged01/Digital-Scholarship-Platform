@extends('layouts.public')

@section('title', __('pages.countries.title'))
@section('description', __('pages.countries.subtitle'))

@section('content')
    <div class="mx-auto max-w-7xl space-y-8 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">

        <x-page-hero icon="globe"
                     :eyebrow="__('pages.countries.eyebrow')"
                     :title="__('pages.countries.title')"
                     :subtitle="__('pages.countries.subtitle')" />

        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            @foreach ($countries as $country)
                <a href="{{ route('countries.show', $country) }}"
                   class="group flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs transition-all hover:-translate-y-0.5 hover:border-saudi-300 hover:shadow-md">
                    <div class="space-y-3">
                        <div class="flex items-start justify-between gap-3">
                            <div class="flex items-center gap-3">
                                <span class="text-3xl" aria-hidden="true">{{ $country->flag_emoji }}</span>
                                <div>
                                    <h2 class="text-base font-bold text-slate-900 transition group-hover:text-saudi-700">{{ $country->name }}</h2>
                                    <p class="text-[11px] text-slate-500">{{ $country->region }}</p>
                                </div>
                            </div>

                            @if ($country->is_popular)
                                <x-badge tone="sand" icon="star">{{ app()->getLocale() === 'ar' ? 'وجهة رائجة' : 'Popular' }}</x-badge>
                            @endif
                        </div>

                        @if (filled($country->visa_overview))
                            <p class="line-clamp-3 text-xs leading-relaxed text-slate-600">{{ $country->visa_overview }}</p>
                        @endif
                    </div>

                    <dl class="grid grid-cols-2 gap-3 border-t border-slate-100 pt-3 text-[11px]">
                        <div>
                            <dt class="font-semibold text-slate-400">{{ __('catalog.country.universities_count') }}</dt>
                            <dd class="numeric font-bold text-saudi-700">{{ $country->universities_count }}</dd>
                        </div>
                        <div>
                            <dt class="font-semibold text-slate-400">{{ __('catalog.country.mission_city') }}</dt>
                            <dd class="font-bold text-slate-700">{{ $country->cultural_mission_city ?: '—' }}</dd>
                        </div>
                    </dl>
                </a>
            @endforeach
        </div>
    </div>
@endsection
