<section id="universities" class="scroll-mt-24 space-y-6">
    <x-section-heading :eyebrow="__('unis.eyebrow')" :title="__('unis.title')" :subtitle="__('unis.subtitle')">
        <a href="{{ route('universities.index') }}"
           class="flex items-center gap-2 rounded-xl bg-slate-100 px-4 py-2.5 text-xs font-bold text-slate-800 transition hover:bg-slate-200">
            <span>{{ __('unis.open_full_btn') }}</span>
            <x-lucide-arrow-right class="size-3.5 flip-rtl" aria-hidden="true" />
        </a>
    </x-section-heading>

    <form action="{{ route('universities.index') }}" method="get"
          class="flex flex-col items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3.5 shadow-2xs sm:flex-row sm:p-4">
        <label class="relative w-full flex-1">
            <span class="sr-only">{{ __('unis.search_placeholder') }}</span>
            <x-lucide-search class="pointer-events-none absolute inset-y-0 start-3.5 my-auto size-4 text-slate-400" aria-hidden="true" />
            <input type="search" name="q" placeholder="{{ __('unis.search_placeholder') }}"
                   class="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pe-4 ps-10 text-xs text-slate-800 transition focus:border-saudi-600 focus:bg-white focus:outline-none sm:text-sm">
        </label>

        <div class="flex w-full items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none sm:w-auto sm:pb-0">
            <button type="submit" name="tier" value="all"
                    class="whitespace-nowrap rounded-xl bg-saudi-700 px-3 py-2 text-xs font-bold text-white transition hover:bg-saudi-800">
                {{ __('catalog.tiers.all') }}
            </button>
            @foreach (['top30', 'top100', 'top200'] as $tier)
                <button type="submit" name="tier" value="{{ $tier }}"
                        class="whitespace-nowrap rounded-xl bg-slate-100 px-3 py-2 text-xs font-bold text-slate-600 transition hover:bg-slate-200">
                    {{ __('catalog.tiers.'.$tier) }}
                </button>
            @endforeach
        </div>
    </form>

    <div class="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3">
        @foreach ($universities as $university)
            <x-university-card :university="$university" />
        @endforeach
    </div>
</section>
