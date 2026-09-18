<section id="journey"
         x-data="{ active: 0, total: {{ count($journeySteps) }} }"
         class="scroll-mt-24 space-y-8 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-2xs sm:p-10">

    <x-section-heading :eyebrow="__('journey.eyebrow')" :title="__('journey.title')" :subtitle="__('journey.subtitle')" :divider="false" />

    {{-- Desktop: an interactive stepper with a detail panel. --}}
    <div class="hidden space-y-6 lg:block">
        <div class="relative">
            <div class="absolute inset-x-8 top-7 -z-0 h-1 bg-slate-100" aria-hidden="true">
                <div class="h-full bg-gradient-to-r from-saudi-700 to-saudi-400 transition-all duration-500"
                     :style="`width: ${(active / (total - 1)) * 100}%`"></div>
            </div>

            <ol class="relative z-10 grid grid-cols-8 gap-2">
                @foreach ($journeySteps as $index => $step)
                    <li>
                        <button type="button" @click="active = {{ $index }}"
                                class="group flex w-full flex-col items-center text-center"
                                :aria-current="active === {{ $index }} ? 'step' : false">
                            <span class="flex size-14 items-center justify-center rounded-2xl border-2 text-sm font-bold transition-all duration-300"
                                  :class="active === {{ $index }}
                                        ? 'border-sand-300 bg-saudi-700 text-white shadow-lg scale-110'
                                        : ({{ $index }} < active ? 'border-saudi-300 bg-saudi-50 text-saudi-700' : 'border-slate-200 bg-white text-slate-400 group-hover:border-slate-300')">
                                <x-dynamic-component :component="'lucide-'.$step['icon']" class="size-5" aria-hidden="true" />
                            </span>

                            <span class="numeric mt-2 text-[11px] font-bold"
                                  :class="active === {{ $index }} ? 'text-saudi-700' : 'text-slate-400'">{{ $step['number'] }}</span>

                            <span class="mt-0.5 text-xs font-bold leading-tight"
                                  :class="active === {{ $index }} ? 'text-slate-900 font-extrabold' : 'text-slate-600'">{{ $step['title'] }}</span>
                        </button>
                    </li>
                @endforeach
            </ol>
        </div>

        <div class="flex items-center justify-between gap-6 rounded-2xl border border-saudi-200/70 bg-gradient-to-r from-saudi-50/60 via-slate-50 to-sand-100/40 p-6">
            <div class="max-w-2xl space-y-1.5">
                @foreach ($journeySteps as $index => $step)
                    <div x-show="active === {{ $index }}" x-cloak class="space-y-1.5">
                        <div class="flex items-center gap-2">
                            <span class="numeric rounded-md bg-saudi-700 px-2.5 py-0.5 text-xs font-bold text-white">
                                {{ __('journey.step_prefix') }} {{ $step['number'] }}
                            </span>
                            <h3 class="text-lg font-bold text-slate-900">{{ $step['title'] }}</h3>
                        </div>
                        <p class="text-sm font-medium text-slate-700">{{ $step['description'] }}</p>
                    </div>
                @endforeach
            </div>

            <div class="flex shrink-0 items-center gap-2">
                <button type="button" @click="active = Math.max(0, active - 1)" :disabled="active === 0"
                        class="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-50 disabled:opacity-40">
                    {{ __('journey.prev_step') }}
                </button>
                <button type="button" @click="active = Math.min(total - 1, active + 1)" :disabled="active === total - 1"
                        class="flex items-center gap-1.5 rounded-xl bg-saudi-700 px-4 py-2 text-xs font-bold text-white transition hover:bg-saudi-800 disabled:opacity-40">
                    <span>{{ __('journey.next_step') }}</span>
                    <x-lucide-arrow-right class="size-3.5 flip-rtl" aria-hidden="true" />
                </button>
            </div>
        </div>
    </div>

    {{-- Mobile: the whole timeline, unfolded. --}}
    <ol class="space-y-4 lg:hidden">
        @foreach ($journeySteps as $step)
            <li class="flex items-start gap-3.5 rounded-2xl border border-slate-200/80 bg-slate-50 p-4">
                <span class="flex size-10 shrink-0 items-center justify-center rounded-xl bg-saudi-700 text-white">
                    <x-dynamic-component :component="'lucide-'.$step['icon']" class="size-5" aria-hidden="true" />
                </span>
                <div class="space-y-1">
                    <div class="flex items-center gap-2">
                        <span class="numeric rounded bg-saudi-100 px-1.5 py-0.5 text-[11px] font-bold text-saudi-700">{{ $step['number'] }}</span>
                        <h3 class="text-sm font-bold text-slate-900">{{ $step['title'] }}</h3>
                    </div>
                    <p class="text-xs leading-relaxed text-slate-600">{{ $step['description'] }}</p>
                </div>
            </li>
        @endforeach
    </ol>
</section>
