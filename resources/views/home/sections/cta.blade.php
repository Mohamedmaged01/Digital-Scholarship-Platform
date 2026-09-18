<section class="relative overflow-hidden rounded-3xl border border-saudi-600/30 bg-gradient-to-br from-saudi-800 via-saudi-700 to-slate-950 p-8 text-center text-white shadow-2xl sm:p-12 lg:p-16">
    <span class="pointer-events-none absolute -top-24 -start-24 size-96 rounded-full bg-saudi-400/15 blur-3xl" aria-hidden="true"></span>
    <span class="pointer-events-none absolute -bottom-24 -end-24 size-96 rounded-full bg-sand-300/15 blur-3xl" aria-hidden="true"></span>

    <div class="relative mx-auto max-w-3xl space-y-6">
        <p class="inline-flex items-center gap-2 rounded-full border border-saudi-400/40 bg-saudi-950/80 px-4 py-1.5 text-xs font-bold text-saudi-300 shadow-sm">
            <x-lucide-sparkles class="size-4 text-sand-300" aria-hidden="true" />
            <span>{{ __('cta.eyebrow') }}</span>
        </p>

        <div class="space-y-3">
            <h2 class="heading-hero text-white">{{ __('cta.title') }}</h2>
            <p class="text-sm font-medium leading-relaxed text-saudi-100/90 sm:text-base lg:text-lg">{{ __('cta.subtitle') }}</p>
        </div>

        <div class="flex flex-wrap items-center justify-center gap-4 pt-4">
            <a href="{{ $settings['official_apply_url'] ?? config('kasp.apply_url') }}" target="_blank" rel="noopener"
               class="flex items-center gap-2.5 whitespace-nowrap rounded-2xl bg-sand-300 px-8 py-4 text-sm font-black text-slate-950 shadow-xl shadow-saudi-950/30 transition-all hover:-translate-y-0.5 hover:bg-sand-200 sm:text-base">
                <span>{{ __('cta.start_btn') }}</span>
                <x-lucide-external-link class="size-4 shrink-0" aria-hidden="true" />
            </a>

            <a href="{{ route('tracks.index') }}"
               class="flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-7 py-4 text-sm font-bold text-white backdrop-blur-xs transition hover:bg-white/15 sm:text-base">
                <x-lucide-compass class="size-5 text-saudi-300" aria-hidden="true" />
                <span>{{ __('cta.explore_btn') }}</span>
            </a>
        </div>

        <ul class="flex flex-wrap items-center justify-center gap-6 border-t border-saudi-800/60 pt-6 text-xs text-saudi-200/80">
            <li class="flex items-center gap-1.5">
                <x-lucide-shield-check class="size-4 text-saudi-400" aria-hidden="true" />
                <span>{{ __('footer.gov_platform_note') }}</span>
            </li>
            <li class="flex items-center gap-1.5">
                <x-lucide-award class="size-4 text-sand-300" aria-hidden="true" />
                <span>{{ __('cta.support_note') }}</span>
            </li>
        </ul>
    </div>
</section>
