@php
    $locale = app()->getLocale();
    $otherLocale = $locale === 'ar' ? 'en' : 'ar';
    $links = [
        ['route' => 'home', 'label' => __('nav.overview')],
        ['route' => 'tracks.index', 'label' => __('nav.tracks')],
        ['route' => 'universities.index', 'label' => __('nav.universities')],
        ['route' => 'guide.index', 'label' => __('nav.guide')],
        ['route' => 'missions.index', 'label' => __('nav.missions')],
        ['route' => 'faq.index', 'label' => __('nav.faq')],
        ['route' => 'news.index', 'label' => __('pages.news.title')],
    ];
@endphp

<header x-data="stickyHeader"
        :class="scrolled ? 'border-slate-200/80 bg-white/95 py-2 shadow-sm backdrop-blur-md' : 'border-slate-100 bg-white py-3.5'"
        class="sticky top-0 z-50 border-b transition-all duration-300">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between gap-3">

            <a href="{{ route('home') }}" class="shrink-0" aria-label="{{ __('nav.program_title') }}">
                <x-brand.program-logo />
            </a>

            <nav class="hidden items-center gap-0.5 lg:flex" aria-label="{{ __('common.menu') }}">
                @foreach ($links as $link)
                    @php $active = request()->routeIs($link['route']) || request()->routeIs(str_replace('.index', '.*', $link['route'])); @endphp
                    <a href="{{ route($link['route']) }}"
                       @if ($active) aria-current="page" @endif
                       class="{{ $active ? 'bg-saudi-700/10 font-extrabold text-saudi-700' : 'text-slate-700 hover:bg-slate-50 hover:text-saudi-700' }} shrink-0 whitespace-nowrap rounded-xl px-2.5 py-2 text-xs font-bold transition-colors xl:px-3 xl:text-sm">
                        {{ $link['label'] }}
                    </a>
                @endforeach
            </nav>

            <div class="flex shrink-0 items-center gap-1.5 sm:gap-2">
                <form action="{{ route('search') }}" method="get" class="hidden xl:block">
                    <label class="relative block">
                        <span class="sr-only">{{ __('nav.search_placeholder') }}</span>
                        <x-lucide-search class="pointer-events-none absolute inset-y-0 start-3 my-auto size-4 text-slate-400" aria-hidden="true" />
                        <input type="search" name="q" value="{{ request('q') }}"
                               placeholder="{{ __('common.search') }}"
                               class="w-44 rounded-xl border border-slate-200 bg-slate-50 py-2 pe-3 ps-9 text-xs text-slate-800 transition focus:w-56 focus:border-saudi-600 focus:bg-white focus:outline-none">
                    </label>
                </form>

                <a href="{{ route('search') }}"
                   class="rounded-xl border border-slate-200/80 p-2.5 text-slate-600 transition hover:bg-slate-100 hover:text-saudi-700 xl:hidden"
                   aria-label="{{ __('common.search') }}">
                    <x-lucide-search class="size-4" aria-hidden="true" />
                </a>

                <button type="button"
                        @click="$dispatch('open-advisor')"
                        class="flex items-center justify-center rounded-xl border border-purple-200 bg-purple-50 p-2.5 text-purple-700 transition hover:bg-purple-100"
                        aria-label="{{ __('ai_chat.title') }}"
                        title="{{ __('ai_chat.title') }}">
                    <x-lucide-bot class="size-4" aria-hidden="true" />
                </button>

                <a href="{{ route('language.switch', $otherLocale) }}"
                   class="flex items-center gap-1.5 rounded-xl border border-slate-200/80 px-2.5 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-100 hover:text-saudi-700"
                   title="{{ __('nav.lang_switch_title') }}">
                    <x-lucide-globe class="size-4 text-saudi-700" aria-hidden="true" />
                    <span>{{ config("kasp.locales.{$otherLocale}.switch_label") }}</span>
                </a>

                <a href="{{ route('admin.dashboard') }}"
                   class="flex items-center justify-center rounded-xl border border-slate-200/90 bg-slate-50 p-2.5 text-slate-700 transition hover:bg-saudi-50 hover:text-saudi-700"
                   aria-label="{{ __('nav.admin_portal') }}"
                   title="{{ __('nav.admin_portal') }}">
                    <x-lucide-lock class="size-4 text-saudi-700" aria-hidden="true" />
                </a>

                <a href="{{ $settings['official_apply_url'] ?? config('kasp.apply_url') }}"
                   target="_blank" rel="noopener"
                   class="hidden items-center gap-1.5 rounded-xl bg-saudi-700 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-saudi-800 sm:flex">
                    <span>{{ __('nav.apply_now') }}</span>
                    <x-lucide-external-link class="size-3.5" aria-hidden="true" />
                </a>

                <button type="button"
                        @click="toggleMobileMenu"
                        class="rounded-xl border border-slate-200 p-2 text-slate-700 transition hover:bg-slate-100 lg:hidden"
                        :aria-expanded="mobileMenuOpen"
                        aria-controls="mobile-nav"
                        aria-label="{{ __('common.open_menu') }}">
                    <x-lucide-menu class="size-5" x-show="!mobileMenuOpen" aria-hidden="true" />
                    <x-lucide-x class="size-5" x-show="mobileMenuOpen" x-cloak aria-hidden="true" />
                </button>
            </div>
        </div>

        <div id="mobile-nav" x-show="mobileMenuOpen" x-cloak x-collapse
             class="mt-3 space-y-1 border-t border-slate-100 pb-3 pt-3 lg:hidden">
            @foreach ($links as $link)
                <a href="{{ route($link['route']) }}"
                   class="block rounded-xl px-4 py-2.5 text-sm font-bold text-slate-800 transition hover:bg-slate-50">
                    {{ $link['label'] }}
                </a>
            @endforeach

            <a href="{{ route('help.index') }}" class="block rounded-xl px-4 py-2.5 text-sm font-bold text-slate-800 transition hover:bg-slate-50">
                {{ __('nav.help_center') }}
            </a>

            <a href="{{ $settings['official_apply_url'] ?? config('kasp.apply_url') }}" target="_blank" rel="noopener"
               class="mt-2 flex items-center justify-center gap-2 rounded-xl bg-saudi-700 px-4 py-3 text-xs font-bold text-white">
                <span>{{ __('nav.apply_now') }}</span>
                <x-lucide-external-link class="size-3.5" aria-hidden="true" />
            </a>
        </div>
    </div>
</header>
