<section id="faq" class="scroll-mt-24 space-y-6 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-2xs sm:p-10">
    <x-section-heading :eyebrow="__('faq.eyebrow')" :title="__('faq.title')" :subtitle="__('faq.subtitle')">
        <form action="{{ route('faq.index') }}" method="get" class="relative w-full md:w-80">
            <label>
                <span class="sr-only">{{ __('faq.search_placeholder') }}</span>
                <x-lucide-search class="pointer-events-none absolute inset-y-0 start-3.5 my-auto size-4 text-slate-400" aria-hidden="true" />
                <input type="search" name="q" placeholder="{{ __('faq.search_placeholder') }}"
                       class="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pe-3 ps-10 text-xs text-slate-800 transition focus:border-saudi-600 focus:bg-white focus:outline-none">
            </label>
        </form>
    </x-section-heading>

    <nav class="flex items-center gap-1.5 overflow-x-auto border-b border-slate-100 pb-2 scrollbar-none" aria-label="{{ __('common.filter') }}">
        @foreach ($faqCategories as $slug => $label)
            <a href="{{ route('faq.index', $slug === 'all' ? [] : ['category' => $slug]) }}"
               class="{{ $slug === 'all' ? 'bg-saudi-700 text-white shadow-2xs' : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900' }} shrink-0 rounded-xl px-3.5 py-2 text-xs font-bold transition">
                {{ $label }}
            </a>
        @endforeach
    </nav>

    <x-faq-accordion :faqs="$faqs" :open-id="$faqs->first()?->id" />

    <div class="flex flex-col items-center justify-between gap-4 rounded-2xl border border-saudi-800/40 bg-gradient-to-r from-saudi-950 via-saudi-700 to-slate-900 p-5 text-white shadow-md sm:flex-row sm:p-6">
        <div class="flex items-center gap-3.5">
            <span class="flex size-12 shrink-0 items-center justify-center rounded-xl border border-saudi-400/30 bg-saudi-500/20">
                <x-lucide-bot class="size-6 text-saudi-300" aria-hidden="true" />
            </span>
            <div>
                <h3 class="text-sm font-bold text-white sm:text-base">{{ __('faq.ask_ai_advisor') }}</h3>
                <p class="mt-0.5 text-xs text-saudi-100/80">{{ __('ai_chat.subtitle') }}</p>
            </div>
        </div>

        <div class="flex shrink-0 items-center gap-2">
            <a href="{{ route('faq.index') }}"
               class="rounded-xl bg-white/10 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-white/20">
                {{ __('faq.view_all_faq') }}
            </a>

            <button type="button" @click="$dispatch('open-advisor')"
                    class="flex items-center gap-1.5 rounded-xl bg-sand-300 px-4 py-2.5 text-xs font-bold text-slate-950 shadow-md transition hover:bg-sand-200 sm:px-5">
                <x-lucide-sparkles class="size-3.5" aria-hidden="true" />
                <span>{{ __('ai_chat.title') }}</span>
                <x-lucide-arrow-right class="size-3.5 flip-rtl" aria-hidden="true" />
            </button>
        </div>
    </div>
</section>
