@props([
    'label',
    'value',
    'hint' => null,
    'icon' => null,
    'tone' => 'slate',
])

@php
    $tones = [
        'slate' => 'text-slate-900',
        'saudi' => 'text-saudi-700',
        'sand' => 'text-sand-500',
        'indigo' => 'text-indigo-700',
        'purple' => 'text-purple-700',
        'rose' => 'text-rose-700',
        'amber' => 'text-amber-600',
    ];
@endphp

<div {{ $attributes->merge(['class' => 'space-y-1 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs']) }}>
    <div class="flex items-center justify-between gap-2">
        <p class="text-[11px] font-bold text-slate-500">{{ $label }}</p>
        @if ($icon)
            <x-dynamic-component :component="'lucide-'.$icon" class="size-4 shrink-0 text-slate-400" aria-hidden="true" />
        @endif
    </div>

    <p class="numeric text-2xl font-black {{ $tones[$tone] ?? $tones['slate'] }}">{{ $value }}</p>

    @if ($hint)
        <p class="text-[10.5px] text-slate-400">{{ $hint }}</p>
    @endif
</div>
