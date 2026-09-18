<section class="relative overflow-hidden rounded-3xl border border-saudi-900/60 bg-gradient-to-b from-saudi-950 via-saudi-800 to-saudi-900 p-6 text-white shadow-2xl sm:p-10 lg:p-14">
    <span class="pointer-events-none absolute start-0 top-0 size-96 rounded-full bg-saudi-500/15 blur-3xl" aria-hidden="true"></span>
    <span class="pointer-events-none absolute bottom-0 end-0 size-80 rounded-full bg-sand-400/10 blur-3xl" aria-hidden="true"></span>
    <span class="pointer-events-none absolute inset-0 bg-grid-pattern opacity-10" aria-hidden="true"></span>

    <div class="relative grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-12">

        <div class="space-y-6 lg:col-span-7">
            <p class="inline-flex items-center gap-2.5 rounded-full border border-saudi-500/30 bg-saudi-900/80 px-3.5 py-1.5 text-xs font-bold text-saudi-300 shadow-sm">
                <span class="size-2 animate-ping rounded-full bg-saudi-400" aria-hidden="true"></span>
                <x-lucide-sparkles class="size-3.5 text-sand-300" aria-hidden="true" />
                <span>{{ __('hero.eyebrow') }}</span>
            </p>

            <div class="space-y-2">
                <h1 class="heading-hero text-white">{{ __('hero.title_part1') }}</h1>
                <p class="bg-gradient-to-r from-saudi-200 via-teal-100 to-sand-200 bg-clip-text text-xl font-bold text-transparent sm:text-2xl">
                    {{ __('hero.title_highlight') }}
                </p>
            </div>

            <p class="max-w-2xl text-sm leading-relaxed text-saudi-100/90 sm:text-base lg:text-lg">
                {{ __('hero.subtitle') }}
            </p>

            <div class="flex flex-wrap items-center gap-3.5 pt-2">
                <a href="{{ route('tracks.index') }}"
                   class="flex items-center gap-2.5 whitespace-nowrap rounded-2xl bg-sand-300 px-6 py-3.5 text-sm font-extrabold text-slate-950 shadow-xl shadow-saudi-950/40 transition-all hover:-translate-y-0.5 hover:bg-sand-200 sm:px-8 sm:py-4 sm:text-base">
                    <x-lucide-compass class="size-5" aria-hidden="true" />
                    <span>{{ __('hero.cta_explore_tracks') }}</span>
                    <x-lucide-arrow-right class="size-4 shrink-0 flip-rtl" aria-hidden="true" />
                </a>

                <a href="#ai-finder"
                   class="flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-5 py-3.5 text-sm font-bold text-white backdrop-blur-xs transition hover:bg-white/15 sm:py-4 sm:text-base">
                    <x-lucide-bot class="size-5 text-sand-300" aria-hidden="true" />
                    <span>{{ __('hero.cta_ai_finder') }}</span>
                </a>
            </div>

            <ul class="flex flex-wrap items-center gap-6 border-t border-saudi-800/60 pt-6 text-xs text-saudi-200/80">
                <li class="flex items-center gap-2">
                    <x-lucide-shield-check class="size-4 shrink-0 text-saudi-400" aria-hidden="true" />
                    <span>{{ __('footer.gov_platform_note') }}</span>
                </li>
                <li class="flex items-center gap-2">
                    <x-lucide-globe class="size-4 shrink-0 text-saudi-400" aria-hidden="true" />
                    <span>{{ __('unis.subtitle') }}</span>
                </li>
                <li class="flex items-center gap-2">
                    <x-lucide-circle-check class="size-4 shrink-0 text-sand-300" aria-hidden="true" />
                    <span>{{ __('pages.missions.title') }}</span>
                </li>
            </ul>
        </div>

        <div class="relative lg:col-span-5">
            <figure class="group relative overflow-hidden rounded-3xl border-2 border-saudi-500/30 bg-slate-900 shadow-2xl">
                <div class="relative aspect-4/3 overflow-hidden sm:aspect-16/11">
                    <img src="{{ asset('images/saudi-scholars-hero.jpg') }}"
                         alt="{{ app()->getLocale() === 'ar' ? 'طلاب وطالبات سعوديون في بيئة جامعية عالمية حديثة' : 'Saudi scholarship students on a world-class university campus' }}"
                         width="1200" height="825" fetchpriority="high" decoding="async"
                         class="size-full object-cover object-center transition-transform duration-700 group-hover:scale-105">
                    <span class="absolute inset-0 bg-gradient-to-t from-saudi-950/90 via-saudi-950/30 to-transparent" aria-hidden="true"></span>
                </div>

                <div class="absolute start-3 top-3 rounded-2xl border border-saudi-500/40 bg-saudi-950/90 px-3 py-2 shadow-lg backdrop-blur-md">
                    <span class="block text-[10px] font-semibold text-saudi-300">{{ __('hero.stat_tracks_label') }}</span>
                    <span class="flex items-center gap-1.5 text-sm font-bold text-white">
                        <x-lucide-graduation-cap class="size-4 text-sand-300" aria-hidden="true" />
                        <span class="numeric">{{ $tracks->count() }}</span>
                        <span>{{ __('nav.tracks') }}</span>
                    </span>
                </div>

                <div class="absolute end-3 top-3 rounded-2xl border border-sand-400/30 bg-slate-900/90 px-3 py-2 text-center shadow-lg backdrop-blur-md">
                    <span class="block text-[10px] font-semibold text-sand-300">{{ __('strategy.vision_badge') }}</span>
                    <span class="numeric text-xs font-bold text-white">Vision 2030</span>
                </div>

                <figcaption class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-saudi-950 via-saudi-950/90 to-transparent p-4">
                    <div class="flex items-center justify-between gap-3 text-xs">
                        <div>
                            <span class="block text-[11px] font-semibold text-saudi-300">{{ __('nav.program_sub') }}</span>
                            <p class="text-sm font-bold text-white">{{ __('hero.title_highlight') }}</p>
                        </div>
                        <span class="flex size-9 shrink-0 items-center justify-center rounded-xl border border-sand-400/40 bg-sand-400/20 text-sand-300">
                            <x-lucide-award class="size-5" aria-hidden="true" />
                        </span>
                    </div>
                </figcaption>
            </figure>

            <div class="absolute -bottom-5 -start-5 hidden items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3.5 text-slate-900 shadow-2xl sm:flex">
                <span class="flex size-10 shrink-0 items-center justify-center rounded-xl bg-saudi-700 text-lg font-bold text-white" aria-hidden="true">🇸🇦</span>
                <span class="flex flex-col">
                    <span class="text-[10.5px] font-bold text-slate-500">{{ __('strategy.human_capability_badge') }}</span>
                    <span class="text-xs font-bold text-saudi-700">{{ __('strategy.pillar1_title') }}</span>
                </span>
            </div>
        </div>
    </div>
</section>
