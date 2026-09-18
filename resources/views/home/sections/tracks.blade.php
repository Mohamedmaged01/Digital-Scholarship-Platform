<section id="tracks" class="scroll-mt-24 space-y-6">
    <x-section-heading :eyebrow="__('tracks.eyebrow')" :title="__('tracks.title')" :subtitle="__('tracks.subtitle')">
        <a href="{{ route('tracks.index') }}"
           class="flex items-center gap-2 rounded-xl bg-slate-100 px-4 py-2.5 text-xs font-bold text-slate-800 transition hover:bg-slate-200">
            <span>{{ __('tracks.filter_all') }}</span>
            <x-lucide-arrow-right class="size-3.5 flip-rtl" aria-hidden="true" />
        </a>
    </x-section-heading>

    <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        @foreach ($tracks as $index => $track)
            <x-track-card :track="$track" :index="$index" />
        @endforeach
    </div>
</section>
