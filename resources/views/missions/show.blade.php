@extends('layouts.public')

@section('title', $mission->title)
@section('description', $mission->title.' — '.$mission->city.', '.$mission->country)

@section('content')
    <div class="mx-auto max-w-7xl space-y-8 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">

        <nav aria-label="breadcrumb" class="flex items-center gap-2 text-xs text-slate-500">
            <a href="{{ route('home') }}" class="transition hover:text-saudi-700">{{ __('nav.overview') }}</a>
            <x-lucide-chevron-right class="size-3 flip-rtl" aria-hidden="true" />
            <a href="{{ route('missions.index') }}" class="transition hover:text-saudi-700">{{ __('nav.missions') }}</a>
            <x-lucide-chevron-right class="size-3 flip-rtl" aria-hidden="true" />
            <span class="font-bold text-slate-700">{{ $mission->city }}</span>
        </nav>

        <x-page-hero icon="building-2" :eyebrow="$mission->country" :title="$mission->title" :subtitle="$mission->address">
            <div class="flex flex-wrap items-center gap-3">
                @if (filled($mission->phone))
                    <a href="tel:{{ $mission->phone }}"
                       class="numeric flex items-center gap-2 rounded-2xl bg-white/10 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/15">
                        <x-lucide-phone class="size-4 text-saudi-300" aria-hidden="true" />
                        {{ $mission->phone }}
                    </a>
                @endif

                @if (filled($mission->emergency_phone))
                    <a href="tel:{{ $mission->emergency_phone }}"
                       class="numeric flex items-center gap-2 rounded-2xl bg-rose-500/20 px-5 py-3 text-sm font-bold text-rose-100 ring-1 ring-rose-400/40 transition hover:bg-rose-500/30">
                        <x-lucide-phone-call class="size-4" aria-hidden="true" />
                        {{ __('pages.missions.emergency') }}: {{ $mission->emergency_phone }}
                    </a>
                @endif

                @if (filled($mission->email))
                    <a href="mailto:{{ $mission->email }}"
                       class="flex items-center gap-2 rounded-2xl bg-sand-300 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-sand-200">
                        <x-lucide-mail class="size-4" aria-hidden="true" />
                        {{ $mission->email }}
                    </a>
                @endif
            </div>
        </x-page-hero>

        <div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div class="space-y-6 lg:col-span-2">
                @if ($universities->isNotEmpty())
                    <section class="space-y-4">
                        <h2 class="text-lg font-bold text-slate-900">{{ __('pages.missions.supervised_universities') }}</h2>
                        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            @foreach ($universities as $university)
                                <x-university-card :university="$university" />
                            @endforeach
                        </div>
                    </section>
                @else
                    <x-empty-state icon="building-2" :title="__('common.empty')" />
                @endif
            </div>

            <aside class="space-y-6">
                <section class="space-y-3 rounded-3xl border border-slate-200 bg-white p-6 shadow-2xs">
                    <h2 class="text-sm font-bold text-slate-900">{{ __('pages.missions.contact') }}</h2>

                    <dl class="space-y-3 text-xs">
                        @if (filled($mission->attache_name))
                            <div>
                                <dt class="font-semibold text-slate-400">{{ __('pages.missions.attache') }}</dt>
                                <dd class="font-bold text-slate-800">{{ $mission->attache_name }}</dd>
                            </div>
                        @endif

                        @if (filled($mission->working_hours))
                            <div>
                                <dt class="font-semibold text-slate-400">{{ __('pages.missions.working_hours') }}</dt>
                                <dd class="text-slate-700">{{ $mission->working_hours }}</dd>
                            </div>
                        @endif

                        @if (filled($mission->address))
                            <div>
                                <dt class="font-semibold text-slate-400">{{ __('pages.missions.address') }}</dt>
                                <dd class="leading-relaxed text-slate-700">{{ $mission->address }}</dd>
                            </div>
                        @endif

                        <div>
                            <dt class="font-semibold text-slate-400">{{ __('pages.missions.active_scholars') }}</dt>
                            <dd class="numeric text-lg font-black text-saudi-700">{{ number_format($mission->active_students_count) }}</dd>
                        </div>
                    </dl>
                </section>

                <section class="space-y-3 rounded-3xl border border-saudi-200 bg-saudi-50 p-6">
                    <h2 class="text-sm font-bold text-saudi-900">{{ __('pages.help.appointment_form.title') }}</h2>
                    <p class="text-xs leading-relaxed text-saudi-800">{{ __('pages.help.appointment_form.intro') }}</p>
                    <a href="{{ route('help.index', ['tab' => 'appointment']) }}"
                       class="flex items-center justify-center gap-2 rounded-xl bg-saudi-700 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-saudi-800">
                        <x-lucide-calendar class="size-3.5" aria-hidden="true" />
                        <span>{{ __('pages.help.tabs.appointment') }}</span>
                    </a>
                </section>
            </aside>
        </div>
    </div>
@endsection
