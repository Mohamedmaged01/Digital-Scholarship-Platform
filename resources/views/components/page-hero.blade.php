@props(['eyebrow' => null, 'title', 'subtitle' => null, 'icon' => 'graduation-cap'])

<section class="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-saudi-900 to-slate-950 p-6 text-white shadow-xl sm:p-10">
    <span class="pointer-events-none absolute -top-24 start-1/4 size-96 rounded-full bg-saudi-500/10 blur-3xl" aria-hidden="true"></span>
    <span class="pointer-events-none absolute -bottom-24 end-1/4 size-96 rounded-full bg-sand-400/10 blur-3xl" aria-hidden="true"></span>
    <span class="pointer-events-none absolute inset-0 bg-grid-pattern opacity-10" aria-hidden="true"></span>

    <div class="relative max-w-3xl">
        @if ($eyebrow)
            <p class="mb-4 inline-flex items-center gap-2 rounded-full border border-saudi-500/30 bg-saudi-900/60 px-3 py-1 text-xs font-bold text-saudi-300">
                <x-dynamic-component :component="'lucide-'.$icon" class="size-3.5 text-sand-300" aria-hidden="true" />
                <span>{{ $eyebrow }}</span>
            </p>
        @endif

        <h1 class="heading-hero text-white">{{ $title }}</h1>

        @if ($subtitle)
            <p class="mt-3 text-sm leading-relaxed text-slate-300 sm:text-base">{{ $subtitle }}</p>
        @endif

        @if (! $slot->isEmpty())
            <div class="mt-6">{{ $slot }}</div>
        @endif
    </div>
</section>
