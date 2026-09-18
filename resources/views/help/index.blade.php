@extends('layouts.public')

@section('title', __('pages.help.title'))
@section('description', __('pages.help.subtitle'))

@php
    $tabIcons = [
        'overview' => 'life-buoy',
        'guide' => 'book-open',
        'faq' => 'circle-help',
        'steps' => 'list-ordered',
        'support' => 'headphones',
        'appointment' => 'calendar',
    ];
@endphp

@section('content')
    <div class="mx-auto max-w-6xl space-y-8 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">

        <x-page-hero icon="life-buoy"
                     :eyebrow="__('pages.help.eyebrow')"
                     :title="__('pages.help.title')"
                     :subtitle="__('pages.help.subtitle')" />

        {{-- Tabs are links, so each panel is bookmarkable and works without JS. --}}
        <nav class="flex items-center gap-1.5 overflow-x-auto rounded-2xl border border-slate-200 bg-white p-2 shadow-2xs scrollbar-none"
             aria-label="{{ __('pages.help.title') }}">
            @foreach ($tabs as $item)
                <a href="{{ route('help.index', ['tab' => $item]) }}"
                   @if ($tab === $item) aria-current="page" @endif
                   class="{{ $tab === $item ? 'bg-saudi-700 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900' }} flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition">
                    <x-dynamic-component :component="'lucide-'.$tabIcons[$item]" class="size-4" aria-hidden="true" />
                    <span>{{ __('pages.help.tabs.'.$item) }}</span>
                </a>
            @endforeach
        </nav>

        @if ($tab === 'overview')
            <div class="grid grid-cols-1 gap-5 md:grid-cols-3">
                @foreach ([
                    ['icon' => 'phone', 'title' => __('pages.help.hotline'), 'value' => $settings['support_phone'] ?? config('kasp.support.phone'), 'href' => 'tel:'.($settings['support_phone'] ?? config('kasp.support.phone'))],
                    ['icon' => 'mail', 'title' => __('pages.help.email'), 'value' => $settings['support_email'] ?? config('kasp.support.email'), 'href' => 'mailto:'.($settings['support_email'] ?? config('kasp.support.email'))],
                    ['icon' => 'external-link', 'title' => __('pages.help.official_portal'), 'value' => parse_url($settings['official_apply_url'] ?? config('kasp.apply_url'), PHP_URL_HOST), 'href' => $settings['official_apply_url'] ?? config('kasp.apply_url')],
                ] as $channel)
                    <a href="{{ $channel['href'] }}" @if (str_starts_with($channel['href'], 'http')) target="_blank" rel="noopener" @endif
                       class="group space-y-2 rounded-3xl border border-slate-200 bg-white p-6 shadow-2xs transition hover:-translate-y-0.5 hover:border-saudi-300 hover:shadow-md">
                        <span class="flex size-11 items-center justify-center rounded-xl bg-saudi-50 text-saudi-700">
                            <x-dynamic-component :component="'lucide-'.$channel['icon']" class="size-5" aria-hidden="true" />
                        </span>
                        <span class="block text-xs font-bold text-slate-500">{{ $channel['title'] }}</span>
                        <span class="numeric block text-base font-black text-slate-900 transition group-hover:text-saudi-700">{{ $channel['value'] }}</span>
                    </a>
                @endforeach
            </div>

            <div class="grid grid-cols-1 gap-5 lg:grid-cols-3">
                <div class="space-y-3 rounded-3xl border border-slate-200 bg-white p-6 shadow-2xs lg:col-span-2">
                    <h2 class="text-lg font-bold text-slate-900">{{ __('pages.help.channels') }}</h2>
                    <p class="text-sm leading-relaxed text-slate-600">{{ __('footer.about_text') }}</p>
                    <dl class="grid grid-cols-1 gap-3 pt-2 sm:grid-cols-2">
                        <div class="rounded-2xl bg-slate-50 p-4">
                            <dt class="text-[11px] font-bold text-slate-500">{{ __('pages.help.response_time') }}</dt>
                            <dd class="text-sm font-bold text-slate-900">{{ __('pages.help.response_time_value') }}</dd>
                        </div>
                        <div class="rounded-2xl bg-slate-50 p-4">
                            <dt class="text-[11px] font-bold text-slate-500">{{ __('pages.missions.title') }}</dt>
                            <dd class="numeric text-sm font-bold text-slate-900">{{ $missions->count() }}</dd>
                        </div>
                    </dl>
                </div>

                <button type="button" @click="$dispatch('open-advisor')"
                        class="flex flex-col items-start gap-3 rounded-3xl border border-saudi-800/40 bg-gradient-to-br from-saudi-950 via-saudi-700 to-slate-900 p-6 text-start text-white shadow-md transition hover:-translate-y-0.5">
                    <span class="flex size-12 items-center justify-center rounded-xl border border-saudi-400/30 bg-saudi-500/20">
                        <x-lucide-bot class="size-6 text-saudi-300" aria-hidden="true" />
                    </span>
                    <span class="text-base font-bold">{{ __('ai_chat.title') }}</span>
                    <span class="text-xs leading-relaxed text-saudi-100/80">{{ __('ai_chat.subtitle') }}</span>
                    <span class="mt-auto flex items-center gap-1.5 text-xs font-bold text-sand-300">
                        <span>{{ __('faq.ask_ai_advisor') }}</span>
                        <x-lucide-arrow-right class="size-3.5 flip-rtl" aria-hidden="true" />
                    </span>
                </button>
            </div>
        @endif

        @if ($tab === 'guide' || $tab === 'steps')
            @php $steps = $tab === 'steps' ? $qaboolSteps : $safeerSteps; @endphp

            <section class="space-y-4">
                <x-section-heading :title="$tab === 'steps' ? __('pages.guide.system_qabool') : __('pages.guide.system_safeer')"
                                   :subtitle="__('pages.guide.subtitle')">
                    <a href="{{ route('guide.index', ['system' => $tab === 'steps' ? 'qabool' : 'safeer']) }}"
                       class="flex items-center gap-2 rounded-xl bg-slate-100 px-4 py-2.5 text-xs font-bold text-slate-800 transition hover:bg-slate-200">
                        <span>{{ __('pages.guide.title') }}</span>
                        <x-lucide-arrow-right class="size-3.5 flip-rtl" aria-hidden="true" />
                    </a>
                </x-section-heading>

                <ol class="space-y-3">
                    @foreach ($steps as $step)
                        <li class="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
                            <span class="numeric flex size-10 shrink-0 items-center justify-center rounded-xl bg-saudi-700 text-sm font-bold text-white">
                                {{ $step->step_number }}
                            </span>
                            <div class="space-y-1.5">
                                <h3 class="text-sm font-bold text-slate-900">{{ $step->title }}</h3>
                                <p class="text-xs leading-relaxed text-slate-600">{{ $step->description }}</p>
                                @if (filled($step->details))
                                    <ul class="space-y-1 pt-1">
                                        @foreach ($step->details as $detail)
                                            <li class="flex items-start gap-1.5 text-[11.5px] text-slate-600">
                                                <x-lucide-check class="mt-0.5 size-3 shrink-0 text-saudi-600" aria-hidden="true" />
                                                <span>{{ $detail }}</span>
                                            </li>
                                        @endforeach
                                    </ul>
                                @endif
                            </div>
                        </li>
                    @endforeach
                </ol>
            </section>
        @endif

        @if ($tab === 'faq')
            <section class="space-y-4">
                <x-section-heading :title="__('pages.faq.title')" :subtitle="__('pages.faq.subtitle')">
                    <a href="{{ route('faq.index') }}"
                       class="flex items-center gap-2 rounded-xl bg-slate-100 px-4 py-2.5 text-xs font-bold text-slate-800 transition hover:bg-slate-200">
                        <span>{{ __('faq.view_all_faq') }}</span>
                        <x-lucide-arrow-right class="size-3.5 flip-rtl" aria-hidden="true" />
                    </a>
                </x-section-heading>

                <x-faq-accordion :faqs="$faqs" :open-id="$faqs->first()?->id" />
            </section>
        @endif

        @if ($tab === 'support')
            <section class="space-y-4">
                <x-section-heading :title="__('pages.missions.title')" :subtitle="__('pages.missions.subtitle')" />
                <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
                    @foreach ($missions as $mission)
                        @include('missions.partials.card', ['mission' => $mission])
                    @endforeach
                </div>
            </section>
        @endif

        @if ($tab === 'appointment')
            @include('help.partials.appointment-form')
        @endif
    </div>
@endsection
