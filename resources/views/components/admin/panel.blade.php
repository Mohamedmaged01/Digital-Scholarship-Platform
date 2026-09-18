@props(['title' => null, 'subtitle' => null, 'icon' => null])

<section {{ $attributes->merge(['class' => 'space-y-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-xs']) }}>
    @if ($title)
        <header class="flex flex-wrap items-start justify-between gap-3">
            <div class="space-y-0.5">
                <h2 class="flex items-center gap-2 text-lg font-bold text-slate-900">
                    @if ($icon)
                        <x-dynamic-component :component="'lucide-'.$icon" class="size-5 text-saudi-700" aria-hidden="true" />
                    @endif
                    {{ $title }}
                </h2>
                @if ($subtitle)
                    <p class="text-xs text-slate-500">{{ $subtitle }}</p>
                @endif
            </div>

            @isset($actions)
                <div class="flex shrink-0 flex-wrap items-center gap-2">{{ $actions }}</div>
            @endisset
        </header>
    @endif

    {{ $slot }}
</section>
