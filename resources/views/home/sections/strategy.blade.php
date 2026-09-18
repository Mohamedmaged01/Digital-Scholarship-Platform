@php
    $totalSeats = $tracks->sum('allocated_seats');
    $filledSeats = $tracks->sum('filled_seats');

    $tones = [
        'emerald' => ['icon' => 'text-saudi-600', 'chip' => 'bg-saudi-400 text-slate-950'],
        'amber' => ['icon' => 'text-sand-500', 'chip' => 'bg-sand-300 text-slate-950'],
        'purple' => ['icon' => 'text-purple-600', 'chip' => 'bg-purple-300 text-slate-950'],
        'teal' => ['icon' => 'text-teal-600', 'chip' => 'bg-teal-300 text-slate-950'],
    ];
@endphp

<section id="strategy"
         x-data="{ active: 0 }"
         class="relative scroll-mt-24 overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-saudi-900 to-slate-950 p-6 text-white shadow-2xl sm:p-10 lg:p-12">

    <span class="pointer-events-none absolute start-1/4 top-0 size-96 rounded-full bg-saudi-500/10 blur-3xl" aria-hidden="true"></span>
    <span class="pointer-events-none absolute bottom-0 end-1/4 size-96 rounded-full bg-sand-400/10 blur-3xl" aria-hidden="true"></span>

    <div class="relative space-y-8">
        <x-section-heading tone="dark" :eyebrow="__('strategy.eyebrow')" :title="__('strategy.title')" :subtitle="__('strategy.subtitle')">
            <div class="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur-xs">
                <x-brand.human-capability variant="white" />
                <span class="h-8 w-px bg-white/20" aria-hidden="true"></span>
                <x-brand.vision-2030 variant="white" />
            </div>
        </x-section-heading>

        <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            @foreach ($strategyPillars as $index => $pillar)
                @php $tone = $tones[$pillar['tone']] ?? $tones['emerald']; @endphp

                <button type="button" @click="active = {{ $index }}"
                        class="group flex flex-col justify-between gap-4 rounded-2xl border p-5 text-start transition-all duration-300"
                        :class="active === {{ $index }}
                            ? 'border-sand-300/70 bg-white/15 shadow-lg shadow-saudi-950/60 scale-[1.02]'
                            : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'">

                    <div class="flex w-full items-center justify-between">
                        <span class="flex size-12 items-center justify-center rounded-xl transition-transform group-hover:scale-105"
                              :class="active === {{ $index }} ? '{{ $tone['chip'] }} shadow-md' : 'bg-white/10 text-white'">
                            <x-dynamic-component :component="'lucide-'.$pillar['icon']" class="size-6" aria-hidden="true" />
                        </span>
                        <span class="numeric rounded-full border border-white/15 bg-white/10 px-2 py-0.5 text-[10px] font-bold text-saudi-300">
                            0{{ $index + 1 }}
                        </span>
                    </div>

                    <div class="space-y-1.5">
                        <h3 class="text-base font-bold text-white transition-colors group-hover:text-sand-300">{{ $pillar['title'] }}</h3>
                        <p class="text-xs leading-relaxed text-slate-300">{{ $pillar['description'] }}</p>
                    </div>
                </button>
            @endforeach
        </div>

        <dl class="grid grid-cols-2 gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 lg:grid-cols-4">
            <div>
                <dt class="text-[11px] font-semibold text-saudi-300">{{ __('hero.stat_scholars_label') }}</dt>
                <dd class="numeric text-xl font-black text-white">{{ number_format($totalSeats) }}</dd>
            </div>
            <div>
                <dt class="text-[11px] font-semibold text-saudi-300">{{ __('catalog.track.filled_seats') }}</dt>
                <dd class="numeric text-xl font-black text-white">{{ number_format($filledSeats) }}</dd>
            </div>
            <div>
                <dt class="text-[11px] font-semibold text-saudi-300">{{ __('hero.stat_accredited_label') }}</dt>
                <dd class="numeric text-xl font-black text-white">{{ number_format($universitiesTotal) }}</dd>
            </div>
            <div>
                <dt class="text-[11px] font-semibold text-saudi-300">{{ __('hero.stat_tracks_label') }}</dt>
                <dd class="numeric text-xl font-black text-white">{{ $tracks->count() }}</dd>
            </div>
        </dl>

        <div class="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 text-xs sm:p-5">
            <p class="flex items-center gap-2 font-semibold text-slate-200">
                <x-lucide-award class="size-4 shrink-0 text-sand-300" aria-hidden="true" />
                <span>{{ __('strategy.stat_vision_desc') }}</span>
            </p>

            <a href="{{ route('tracks.index') }}"
               class="flex shrink-0 items-center gap-1.5 rounded-xl bg-sand-300 px-4 py-2 text-xs font-bold text-slate-950 shadow-md transition hover:bg-sand-200">
                <span>{{ __('tracks.eyebrow') }}</span>
                <x-lucide-arrow-right class="size-3.5 flip-rtl" aria-hidden="true" />
            </a>
        </div>
    </div>
</section>
