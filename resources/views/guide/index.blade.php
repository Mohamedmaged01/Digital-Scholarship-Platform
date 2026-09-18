@extends('layouts.public')

@section('title', __('pages.guide.title'))
@section('description', __('pages.guide.subtitle'))

@section('content')
    <div class="mx-auto max-w-5xl space-y-8 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">

        <x-page-hero icon="book-open"
                     :eyebrow="__('pages.guide.eyebrow')"
                     :title="__('pages.guide.title')"
                     :subtitle="__('pages.guide.subtitle')" />

        {{-- System switch: plain links, so each walkthrough has its own URL. --}}
        <nav class="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-2xs" aria-label="{{ __('pages.guide.eyebrow') }}">
            @foreach (['qabool' => 'file-text', 'safeer' => 'plane-takeoff'] as $key => $icon)
                <a href="{{ route('guide.index', ['system' => $key]) }}"
                   @if ($system === $key) aria-current="page" @endif
                   class="{{ $system === $key ? 'bg-saudi-700 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900' }} flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-xs font-bold transition sm:text-sm">
                    <x-dynamic-component :component="'lucide-'.$icon" class="size-4" aria-hidden="true" />
                    <span>{{ __('pages.guide.system_'.$key) }}</span>
                </a>
            @endforeach
        </nav>

        @if ($steps->isEmpty())
            <x-empty-state icon="book-open" :title="__('common.empty')" />
        @else
            <ol class="space-y-4">
                @foreach ($steps as $step)
                    <li>
                        <details @if ($loop->first) open @endif
                                 class="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xs transition open:border-saudi-300">
                            <summary class="flex cursor-pointer list-none items-center gap-4 p-5 sm:p-6">
                                <span class="flex size-12 shrink-0 items-center justify-center rounded-2xl border-2 border-slate-200 bg-slate-50 text-slate-500 transition group-open:border-sand-300 group-open:bg-saudi-700 group-open:text-white">
                                    <x-dynamic-component :component="'lucide-'.$step->icon_name" class="size-5" aria-hidden="true" />
                                </span>

                                <span class="flex-1">
                                    <span class="numeric block text-[11px] font-bold text-saudi-700">
                                        {{ __('pages.guide.step') }} {{ str_pad((string) $step->step_number, 2, '0', STR_PAD_LEFT) }}
                                    </span>
                                    <span class="block text-base font-bold text-slate-900 sm:text-lg">{{ $step->title }}</span>
                                </span>

                                <span class="flex size-8 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600 transition-transform group-open:rotate-180 group-open:bg-saudi-100 group-open:text-saudi-700">
                                    <x-lucide-chevron-down class="size-4" aria-hidden="true" />
                                </span>
                            </summary>

                            <div class="space-y-4 border-t border-slate-100 px-5 pb-6 pt-4 sm:px-6">
                                @if (filled($step->description))
                                    <p class="text-sm leading-relaxed text-slate-700">{{ $step->description }}</p>
                                @endif

                                @if (filled($step->details))
                                    <div class="space-y-2">
                                        <h3 class="text-xs font-bold text-slate-700">{{ __('pages.guide.key_points') }}</h3>
                                        <ul class="space-y-2">
                                            @foreach ($step->details as $detail)
                                                <li class="flex items-start gap-2 rounded-xl bg-slate-50 p-3 text-xs leading-relaxed text-slate-700">
                                                    <x-lucide-circle-check class="mt-0.5 size-4 shrink-0 text-saudi-600" aria-hidden="true" />
                                                    <span>{{ $detail }}</span>
                                                </li>
                                            @endforeach
                                        </ul>
                                    </div>
                                @endif

                                @if (filled($step->tips))
                                    <div class="space-y-2 rounded-2xl border border-sand-200 bg-sand-100/60 p-4">
                                        <h3 class="flex items-center gap-1.5 text-xs font-bold text-sand-500">
                                            <x-lucide-lightbulb class="size-3.5" aria-hidden="true" />
                                            {{ __('pages.guide.tips') }}
                                        </h3>
                                        <ul class="space-y-1 text-xs leading-relaxed text-slate-700">
                                            @foreach ((array) $step->tips as $tip)
                                                <li>{{ $tip }}</li>
                                            @endforeach
                                        </ul>
                                    </div>
                                @endif
                            </div>
                        </details>
                    </li>
                @endforeach
            </ol>
        @endif

        <section class="flex flex-col items-center justify-between gap-4 rounded-3xl border border-saudi-800/40 bg-gradient-to-r from-saudi-950 via-saudi-700 to-slate-900 p-6 text-white shadow-md sm:flex-row">
            <div>
                <h2 class="text-base font-bold">{{ __('cta.title') }}</h2>
                <p class="mt-1 text-xs text-saudi-100/80">{{ __('cta.subtitle') }}</p>
            </div>

            <a href="{{ $settings['official_apply_url'] ?? config('kasp.apply_url') }}" target="_blank" rel="noopener"
               class="flex shrink-0 items-center gap-2 rounded-2xl bg-sand-300 px-6 py-3.5 text-sm font-extrabold text-slate-950 transition hover:bg-sand-200">
                <span>{{ __('catalog.track.apply_official') }}</span>
                <x-lucide-external-link class="size-4" aria-hidden="true" />
            </a>
        </section>
    </div>
@endsection
