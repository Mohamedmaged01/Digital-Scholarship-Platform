<button type="button"
        x-data="{ visible: false }"
        x-init="window.addEventListener('scroll', () => visible = window.scrollY > 600, { passive: true })"
        x-show="visible"
        x-cloak
        x-transition.opacity
        @click="window.scrollTo({ top: 0, behavior: 'smooth' })"
        class="no-print fixed bottom-6 start-6 z-30 flex size-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 shadow-lg transition hover:-translate-y-0.5 hover:border-saudi-300 hover:text-saudi-700"
        aria-label="{{ __('common.scroll_top') }}"
        title="{{ __('common.scroll_top') }}">
    <x-lucide-arrow-up class="size-5" aria-hidden="true" />
</button>
