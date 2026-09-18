@extends('layouts.public')

@section('title', $university->name)
@section('description', $university->name.' — '.$university->country.' · '.__('catalog.university.rank').' #'.$university->qs_rank)

@section('content')
    <div class="mx-auto max-w-7xl space-y-8 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">

        <nav aria-label="breadcrumb" class="flex items-center gap-2 text-xs text-slate-500">
            <a href="{{ route('home') }}" class="transition hover:text-saudi-700">{{ __('nav.overview') }}</a>
            <x-lucide-chevron-right class="size-3 flip-rtl" aria-hidden="true" />
            <a href="{{ route('universities.index') }}" class="transition hover:text-saudi-700">{{ __('nav.universities') }}</a>
            <x-lucide-chevron-right class="size-3 flip-rtl" aria-hidden="true" />
            <span class="font-bold text-slate-700">{{ $university->name }}</span>
        </nav>

        <section class="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 text-white shadow-2xl">
            @if (filled($university->image_url))
                <img src="{{ $university->image_url }}" alt="{{ $university->name }}"
                     class="absolute inset-0 size-full object-cover opacity-30" loading="eager" decoding="async" referrerpolicy="no-referrer">
            @endif
            <span class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/85 to-saudi-900/60" aria-hidden="true"></span>

            <div class="relative space-y-5 p-6 sm:p-10">
                <div class="flex flex-wrap items-center gap-2">
                    <x-badge tone="sand" icon="award">
                        {{ __('catalog.university.qs_rank') }} #{{ $university->qs_rank }}
                    </x-badge>
                    @if ($university->the_rank)
                        <x-badge tone="slate">{{ __('catalog.university.the_rank') }} #{{ $university->the_rank }}</x-badge>
                    @endif
                    <x-badge tone="saudi">{{ $university->rankTierLabel() }}</x-badge>
                </div>

                <div>
                    <h1 class="heading-hero text-white">{{ $university->name }}</h1>
                    <p class="mt-1 text-sm text-slate-300" dir="{{ app()->getLocale() === 'ar' ? 'ltr' : 'rtl' }}">{{ $university->alternate('name') }}</p>
                </div>

                <p class="flex flex-wrap items-center gap-4 text-xs text-slate-300">
                    <span class="flex items-center gap-1.5">
                        <x-lucide-map-pin class="size-4 text-saudi-400" aria-hidden="true" />
                        {{ $university->city }}, {{ $university->country }}
                    </span>
                    @if (filled($university->acceptance_rate))
                        <span class="flex items-center gap-1.5">
                            <x-lucide-gauge class="size-4 text-saudi-400" aria-hidden="true" />
                            {{ __('catalog.university.acceptance_rate') }}: <span class="numeric">{{ $university->acceptance_rate }}</span>
                        </span>
                    @endif
                    <span class="numeric flex items-center gap-1.5">
                        <x-lucide-languages class="size-4 text-saudi-400" aria-hidden="true" />
                        IELTS {{ rtrim(rtrim(number_format($university->min_ielts, 1), '0'), '.') }} · TOEFL {{ $university->min_toefl }}
                    </span>
                </p>

                @if (filled($university->website_url))
                    <a href="{{ $university->website_url }}" target="_blank" rel="noopener"
                       class="inline-flex items-center gap-2 rounded-2xl bg-sand-300 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-sand-200">
                        <span>{{ __('catalog.university.visit_website') }}</span>
                        <x-lucide-external-link class="size-4" aria-hidden="true" />
                    </a>
                @endif
            </div>
        </section>

        <div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div class="space-y-6 lg:col-span-2">

                <section class="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-2xs sm:p-8">
                    <h2 class="flex items-center gap-2 text-lg font-bold text-slate-900">
                        <x-lucide-book-open class="size-5 text-saudi-700" aria-hidden="true" />
                        {{ __('catalog.university.majors') }}
                    </h2>

                    @if (filled($university->top_majors))
                        <ul class="grid grid-cols-1 gap-2 sm:grid-cols-2">
                            @foreach ($university->top_majors as $major)
                                <li class="flex items-start gap-2 rounded-xl bg-slate-50 p-3 text-xs text-slate-700">
                                    <x-lucide-check class="mt-0.5 size-3.5 shrink-0 text-saudi-600" aria-hidden="true" />
                                    <span>{{ $major }}</span>
                                </li>
                            @endforeach
                        </ul>
                    @else
                        <p class="text-xs text-slate-500">{{ __('common.empty') }}</p>
                    @endif
                </section>

                <section class="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-2xs sm:p-8">
                    <h2 class="flex items-center gap-2 text-lg font-bold text-slate-900">
                        <x-lucide-award class="size-5 text-saudi-700" aria-hidden="true" />
                        {{ __('catalog.university.accredited_tracks') }}
                    </h2>

                    @if ($university->tracks->isEmpty())
                        <p class="text-xs text-slate-500">{{ __('common.empty') }}</p>
                    @else
                        <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            @foreach ($university->tracks as $track)
                                <a href="{{ route('tracks.show', $track) }}"
                                   class="group flex items-center justify-between gap-3 rounded-2xl border border-slate-200 p-4 transition hover:border-saudi-300 hover:bg-saudi-50/40">
                                    <span>
                                        <span class="block text-sm font-bold text-slate-900 transition group-hover:text-saudi-700">{{ $track->name }}</span>
                                        <span class="numeric block text-[11px] text-slate-500">
                                            {{ __('tracks.min_gpa_label') }} {{ rtrim(rtrim(number_format($track->min_gpa, 2), '0'), '.') }} · IELTS {{ rtrim(rtrim(number_format($track->required_ielts, 1), '0'), '.') }}
                                        </span>
                                    </span>
                                    <x-lucide-chevron-right class="size-4 shrink-0 flip-rtl text-slate-400" aria-hidden="true" />
                                </a>
                            @endforeach
                        </div>
                    @endif
                </section>

                @if ($similar->isNotEmpty())
                    <section class="space-y-4">
                        <h2 class="text-lg font-bold text-slate-900">{{ __('catalog.university.similar') }}</h2>
                        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            @foreach ($similar as $other)
                                <a href="{{ route('universities.show', $other) }}"
                                   class="group flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs transition hover:border-saudi-300">
                                    <span>
                                        <span class="numeric block text-[11px] font-bold text-sand-500">#{{ $other->qs_rank }}</span>
                                        <span class="block text-sm font-bold text-slate-900 transition group-hover:text-saudi-700">{{ $other->name }}</span>
                                    </span>
                                    <x-lucide-chevron-right class="size-4 shrink-0 flip-rtl text-slate-400" aria-hidden="true" />
                                </a>
                            @endforeach
                        </div>
                    </section>
                @endif
            </div>

            <aside class="space-y-6">
                <section class="space-y-3 rounded-3xl border border-slate-200 bg-white p-6 shadow-2xs">
                    <h2 class="text-sm font-bold text-slate-900">{{ __('catalog.university.degrees') }}</h2>
                    <ul class="flex flex-wrap gap-1.5">
                        @foreach ($university->degrees_available as $degree)
                            <li class="rounded-lg bg-slate-100 px-2.5 py-1 text-[11.5px] font-bold text-slate-700">{{ __('catalog.degrees.'.$degree) }}</li>
                        @endforeach
                    </ul>
                </section>

                @if ($university->hostCountry)
                    <section class="space-y-3 rounded-3xl border border-slate-200 bg-white p-6 shadow-2xs">
                        <h2 class="text-sm font-bold text-slate-900">{{ __('catalog.university.country') }}</h2>
                        <p class="flex items-center gap-2 text-sm font-bold text-slate-800">
                            <span class="text-xl" aria-hidden="true">{{ $university->hostCountry->flag_emoji }}</span>
                            {{ $university->country }}
                        </p>
                        @if (filled($university->hostCountry->visa_overview))
                            <p class="text-xs leading-relaxed text-slate-600">{{ $university->hostCountry->visa_overview }}</p>
                        @endif
                        <a href="{{ route('countries.show', $university->country_code) }}"
                           class="inline-flex items-center gap-1.5 text-xs font-bold text-saudi-700 transition hover:underline">
                            <span>{{ __('common.view') }}</span>
                            <x-lucide-arrow-right class="size-3.5 flip-rtl" aria-hidden="true" />
                        </a>
                    </section>
                @endif

                @if ($university->culturalMission)
                    <section class="space-y-3 rounded-3xl border border-slate-200 bg-white p-6 shadow-2xs">
                        <h2 class="text-sm font-bold text-slate-900">{{ __('catalog.university.supervising_mission') }}</h2>
                        <p class="text-sm font-bold text-slate-800">{{ $university->culturalMission->title }}</p>
                        <p class="text-xs text-slate-600">{{ $university->culturalMission->city }}</p>
                        <a href="{{ route('missions.show', $university->culturalMission) }}"
                           class="inline-flex items-center gap-1.5 text-xs font-bold text-saudi-700 transition hover:underline">
                            <span>{{ __('pages.missions.contact') }}</span>
                            <x-lucide-arrow-right class="size-3.5 flip-rtl" aria-hidden="true" />
                        </a>
                    </section>
                @endif

                <section class="space-y-3 rounded-3xl border border-saudi-200 bg-saudi-50 p-6">
                    <h2 class="text-sm font-bold text-saudi-900">{{ __('cta.eyebrow') }}</h2>
                    <p class="text-xs leading-relaxed text-saudi-800">{{ __('cta.support_note') }}</p>
                    <a href="{{ $settings['official_apply_url'] ?? config('kasp.apply_url') }}" target="_blank" rel="noopener"
                       class="flex items-center justify-center gap-2 rounded-xl bg-saudi-700 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-saudi-800">
                        <span>{{ __('catalog.track.apply_official') }}</span>
                        <x-lucide-external-link class="size-3.5" aria-hidden="true" />
                    </a>
                </section>
            </aside>
        </div>
    </div>
@endsection
