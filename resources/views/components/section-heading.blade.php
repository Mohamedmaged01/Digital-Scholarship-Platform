@props([
    'eyebrow' => null,
    'title',
    'subtitle' => null,
    'tone' => 'light',
    'divider' => true,
])

@php
    $onDark = $tone === 'dark';
@endphp

<div {{ $attributes->merge(['class' => 'flex flex-col justify-between gap-4 md:flex-row md:items-end '.($divider ? ($onDark ? 'border-b border-white/10 pb-6' : 'border-b border-slate-200/80 pb-5') : '')]) }}>
    <div class="space-y-1.5">
        @if ($eyebrow)
            <p class="{{ $onDark ? 'text-saudi-300' : 'text-saudi-700' }} inline-flex items-center gap-1.5 text-xs font-bold">
                <x-lucide-sparkles class="size-3.5 text-sand-400" aria-hidden="true" />
                <span>{{ $eyebrow }}</span>
            </p>
        @endif

        <h2 class="{{ $onDark ? 'text-white' : 'text-slate-900' }} heading-section">{{ $title }}</h2>

        @if ($subtitle)
            <p class="{{ $onDark ? 'text-slate-300' : 'text-slate-600' }} max-w-2xl text-xs leading-relaxed sm:text-sm">{{ $subtitle }}</p>
        @endif
    </div>

    @if (! $slot->isEmpty())
        <div class="shrink-0 self-start md:self-auto">{{ $slot }}</div>
    @endif
</div>
