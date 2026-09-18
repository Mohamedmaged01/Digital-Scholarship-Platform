@extends('layouts.public')

@section('title', $track->name)
@section('description', $track->description)
@section('og_image', $track->image_url)

@section('content')
    <div class="mx-auto max-w-7xl space-y-8 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">

        <nav aria-label="breadcrumb" class="flex items-center gap-2 text-xs text-slate-500">
            <a href="{{ route('home') }}" class="transition hover:text-saudi-700">{{ __('nav.overview') }}</a>
            <x-lucide-chevron-right class="size-3 flip-rtl" aria-hidden="true" />
            <a href="{{ route('tracks.index') }}" class="transition hover:text-saudi-700">{{ __('nav.tracks') }}</a>
            <x-lucide-chevron-right class="size-3 flip-rtl" aria-hidden="true" />
            <span class="font-bold text-slate-700">{{ $track->name }}</span>
        </nav>

        {{-- Masthead --}}
        <section class="relative overflow-hidden rounded-3xl border border-saudi-900/60 bg-slate-900 text-white shadow-2xl">
            <img src="{{ $track->image_url }}" alt="{{ $track->name }}"
                 class="absolute inset-0 size-full object-cover opacity-35" loading="eager" decoding="async" referrerpolicy="no-referrer">
            <span class="absolute inset-0 bg-gradient-to-t from-saudi-950 via-saudi-950/85 to-saudi-900/60" aria-hidden="true"></span>

            <div class="relative grid grid-cols-1 gap-8 p-6 sm:p-10 lg:grid-cols-3 lg:p-12">
                <div class="space-y-5 lg:col-span-2">
                    <div class="flex flex-wrap items-center gap-2">
                        <span class="numeric rounded-xl border border-white/20 bg-slate-950/70 px-3 py-1 text-xs font-bold text-white">
                            {{ $track->displayNumber() }}
                        </span>
                        <x-badge tone="saudi">{{ $track->code }}</x-badge>
                        <x-badge tone="sand" icon="award">
                            {{ __('tracks.top_label') }} {{ $track->top_universities_rank_limit }}
                        </x-badge>
                    </div>

                    <div class="flex items-start gap-3">
                        <span class="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-white/10">
                            <x-dynamic-component :component="'lucide-'.$track->icon_name" class="size-6 text-sand-300" aria-hidden="true" />
                        </span>
                        <div>
                            <h1 class="heading-hero text-white">{{ $track->name }}</h1>
                            <p class="mt-1 text-sm text-saudi-200" dir="{{ app()->getLocale() === 'ar' ? 'ltr' : 'rtl' }}">{{ $track->alternate('name') }}</p>
                        </div>
                    </div>

                    <p class="max-w-3xl text-sm leading-relaxed text-saudi-100/90 sm:text-base">{{ $track->description }}</p>

                    @if (filled($track->objective))
                        <p class="max-w-3xl rounded-2xl border border-white/10 bg-white/5 p-4 text-xs leading-relaxed text-slate-200 sm:text-sm">
                            {{ $track->objective }}
                        </p>
                    @endif

                    <div class="flex flex-wrap items-center gap-3 pt-1">
                        <a href="{{ $track->applyUrl() }}" target="_blank" rel="noopener"
                           class="flex items-center gap-2 rounded-2xl bg-sand-300 px-6 py-3.5 text-sm font-extrabold text-slate-950 shadow-xl transition hover:-translate-y-0.5 hover:bg-sand-200">
                            <span>{{ __('catalog.track.apply_official') }}</span>
                            <x-lucide-external-link class="size-4" aria-hidden="true" />
                        </a>

                        <a href="{{ route('universities.index', ['track' => $track->id]) }}"
                           class="flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-white/15">
                            <x-lucide-globe class="size-5 text-saudi-300" aria-hidden="true" />
                            <span>{{ __('catalog.track.accredited_universities') }}</span>
                        </a>
                    </div>
                </div>

                {{-- Criteria at a glance --}}
                <dl class="space-y-2.5 self-start rounded-2xl border border-white/10 bg-slate-950/60 p-5 backdrop-blur-sm">
                    @php
                        $facts = [
                            ['label' => __('catalog.track.min_gpa'), 'value' => rtrim(rtrim(number_format($track->min_gpa, 2), '0'), '.').' / 5.0', 'icon' => 'gauge'],
                            ['label' => __('catalog.track.ielts'), 'value' => rtrim(rtrim(number_format($track->required_ielts, 1), '0'), '.'), 'icon' => 'languages'],
                            ['label' => __('catalog.track.toefl'), 'value' => $track->required_toefl, 'icon' => 'languages'],
                            ['label' => __('catalog.track.max_age'), 'value' => $track->max_age.' '.__('catalog.track.years'), 'icon' => 'clock'],
                            ['label' => __('catalog.track.rank_limit'), 'value' => __('tracks.top_label').' '.$track->top_universities_rank_limit, 'icon' => 'award'],
                            ['label' => __('catalog.track.seats'), 'value' => number_format($track->allocated_seats), 'icon' => 'users'],
                        ];
                    @endphp

                    @foreach ($facts as $fact)
                        <div class="flex items-center justify-between gap-3 rounded-xl bg-white/5 px-3 py-2">
                            <dt class="flex items-center gap-2 text-[11.5px] font-semibold text-slate-300">
                                <x-dynamic-component :component="'lucide-'.$fact['icon']" class="size-3.5 text-saudi-400" aria-hidden="true" />
                                {{ $fact['label'] }}
                            </dt>
                            <dd class="numeric text-sm font-bold text-white">{{ $fact['value'] }}</dd>
                        </div>
                    @endforeach

                    <div class="space-y-1.5 border-t border-white/10 pt-3">
                        <div class="flex items-center justify-between text-[11.5px] font-semibold text-slate-300">
                            <span>{{ __('catalog.track.utilisation') }}</span>
                            <span class="numeric text-white">{{ $track->seatUtilisation() }}%</span>
                        </div>
                        <div class="h-2 overflow-hidden rounded-full bg-white/10">
                            <div class="h-full rounded-full bg-gradient-to-r from-saudi-400 to-sand-300"
                                 style="width: {{ min(100, $track->seatUtilisation()) }}%"></div>
                        </div>
                        <p class="numeric text-[10.5px] text-slate-400">
                            {{ number_format($track->filled_seats) }} / {{ number_format($track->allocated_seats) }}
                        </p>
                    </div>
                </dl>
            </div>
        </section>

        <div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div class="space-y-8 lg:col-span-2">

                {{-- Eligibility rules, straight from the engine's own configuration --}}
                <section class="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-2xs sm:p-8">
                    <h2 class="flex items-center gap-2 text-lg font-bold text-slate-900">
                        <x-lucide-list-ordered class="size-5 text-saudi-700" aria-hidden="true" />
                        {{ __('catalog.track.requirements') }}
                    </h2>

                    <ul class="space-y-2.5">
                        @foreach ($track->rules as $rule)
                            @php $expected = $rule->expected(); @endphp
                            <li class="flex items-start justify-between gap-4 rounded-2xl border border-slate-200/80 bg-slate-50/60 p-4">
                                <div class="space-y-0.5">
                                    <p class="text-sm font-bold text-slate-900">{{ $rule->title }}</p>
                                    <p class="text-xs leading-relaxed text-slate-600">{{ $rule->error_message }}</p>
                                </div>

                                <div class="flex shrink-0 flex-col items-end gap-1">
                                    <code class="numeric rounded-lg bg-white px-2 py-1 text-[11px] font-bold text-saudi-700 ring-1 ring-slate-200">
                                        {{ $rule->operator }} {{ is_array($expected) ? implode(' / ', $expected) : $expected }}
                                    </code>
                                    <x-badge :tone="$rule->is_mandatory ? 'rose' : 'slate'">
                                        {{ $rule->is_mandatory ? __('catalog.track.mandatory') : __('catalog.track.preferred') }}
                                    </x-badge>
                                </div>
                            </li>
                        @endforeach
                    </ul>

                    @if (filled($track->requirementItems()))
                        <div class="space-y-2.5 border-t border-slate-100 pt-4">
                            @foreach ($track->requirementItems() as $item)
                                <div class="flex items-start gap-3 rounded-2xl bg-white p-4 ring-1 ring-slate-200">
                                    <x-lucide-circle-check class="mt-0.5 size-4 shrink-0 {{ ($item['is_mandatory'] ?? false) ? 'text-saudi-700' : 'text-slate-400' }}" aria-hidden="true" />
                                    <div>
                                        <p class="text-sm font-bold text-slate-900">{{ $item['label'] }}</p>
                                        <p class="text-xs leading-relaxed text-slate-600">{{ $item['description'] }}</p>
                                    </div>
                                </div>
                            @endforeach
                        </div>
                    @endif
                </section>

                {{-- Accredited universities --}}
                <section class="space-y-4">
                    <x-section-heading :title="__('catalog.track.accredited_universities')"
                                       :subtitle="app()->getLocale() === 'ar' ? 'الجامعات المعتمدة لهذا المسار ضمن نطاق التصنيف المحدد.' : 'Institutions accredited for this track inside its ranking window.'">
                        <a href="{{ route('universities.index', ['track' => $track->id]) }}"
                           class="flex items-center gap-2 rounded-xl bg-slate-100 px-4 py-2.5 text-xs font-bold text-slate-800 transition hover:bg-slate-200">
                            <span class="numeric">{{ $universitiesCount }}</span>
                            <span>{{ __('nav.universities') }}</span>
                            <x-lucide-arrow-right class="size-3.5 flip-rtl" aria-hidden="true" />
                        </a>
                    </x-section-heading>

                    @if ($universities->isEmpty())
                        <x-empty-state icon="building-2" :title="__('common.empty')" />
                    @else
                        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            @foreach ($universities as $university)
                                <a href="{{ route('universities.show', $university) }}"
                                   class="group space-y-1 rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs transition hover:-translate-y-0.5 hover:border-saudi-300 hover:shadow-md">
                                    <span class="numeric block text-[11px] font-bold text-sand-500">#{{ $university->qs_rank }}</span>
                                    <span class="block text-sm font-bold text-slate-900 transition group-hover:text-saudi-700">{{ $university->name }}</span>
                                    <span class="block text-[11px] text-slate-500">{{ $university->country }} · {{ $university->city }}</span>
                                </a>
                            @endforeach
                        </div>
                    @endif
                </section>

                {{-- Related questions --}}
                @if ($faqs->isNotEmpty())
                    <section class="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-2xs sm:p-8">
                        <h2 class="flex items-center gap-2 text-lg font-bold text-slate-900">
                            <x-lucide-circle-help class="size-5 text-saudi-700" aria-hidden="true" />
                            {{ __('catalog.track.related_faq') }}
                        </h2>
                        <x-faq-accordion :faqs="$faqs" :open-id="$faqs->first()->id" />
                    </section>
                @endif
            </div>

            <aside class="space-y-6">
                @if (filled($track->target_sectors))
                    <section class="space-y-3 rounded-3xl border border-slate-200 bg-white p-6 shadow-2xs">
                        <h2 class="text-sm font-bold text-slate-900">{{ __('catalog.track.sectors') }}</h2>
                        <ul class="flex flex-wrap gap-1.5">
                            @foreach ($track->target_sectors as $sector)
                                <li class="rounded-lg border border-saudi-100 bg-saudi-50 px-2.5 py-1 text-[11.5px] font-medium text-saudi-800">{{ $sector }}</li>
                            @endforeach
                        </ul>
                    </section>
                @endif

                @if (filled($track->features))
                    <section class="space-y-3 rounded-3xl border border-slate-200 bg-white p-6 shadow-2xs">
                        <h2 class="text-sm font-bold text-slate-900">{{ __('catalog.track.features') }}</h2>
                        <ul class="space-y-2">
                            @foreach ($track->features as $feature)
                                <li class="flex items-start gap-2 text-xs leading-relaxed text-slate-700">
                                    <x-lucide-check class="mt-0.5 size-3.5 shrink-0 text-saudi-600" aria-hidden="true" />
                                    <span>{{ $feature }}</span>
                                </li>
                            @endforeach
                        </ul>
                    </section>
                @endif

                <section class="space-y-3 rounded-3xl border border-slate-200 bg-white p-6 shadow-2xs">
                    <h2 class="text-sm font-bold text-slate-900">{{ __('catalog.track.degrees') }}</h2>
                    <ul class="flex flex-wrap gap-1.5">
                        @foreach ($track->required_degrees as $degreeLevel)
                            <li class="rounded-lg bg-slate-100 px-2.5 py-1 text-[11.5px] font-bold text-slate-700">
                                {{ __('catalog.degrees.'.$degreeLevel) }}
                            </li>
                        @endforeach
                    </ul>
                </section>

                <section class="space-y-3 rounded-3xl border border-slate-200 bg-white p-6 shadow-2xs">
                    <h2 class="text-sm font-bold text-slate-900">{{ __('tracks.eyebrow') }}</h2>
                    <ul class="space-y-1.5">
                        @foreach ($otherTracks as $other)
                            <li>
                                <a href="{{ route('tracks.show', $other) }}"
                                   class="flex items-center justify-between gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-saudi-700">
                                    <span>{{ $other->name }}</span>
                                    <x-lucide-chevron-right class="size-3.5 flip-rtl text-slate-400" aria-hidden="true" />
                                </a>
                            </li>
                        @endforeach
                    </ul>
                </section>
            </aside>
        </div>
    </div>
@endsection
