@props(['variant' => 'dark'])

@php
    $onDark = in_array($variant, ['white', 'light'], true);
@endphp

<div {{ $attributes->merge(['class' => 'inline-flex select-none items-center gap-3']) }}>
    <span class="{{ $onDark ? 'border-slate-700 bg-slate-800/80 text-teal-300' : 'border-saudi-200/80 bg-saudi-50 text-saudi-700' }} flex size-9 shrink-0 items-center justify-center rounded-xl border">
        <svg viewBox="0 0 32 32" fill="none" class="size-5" aria-hidden="true">
            <circle cx="16" cy="9" r="3.5" fill="currentColor" />
            <path d="M8 24C8 19.5817 11.5817 16 16 16C20.4183 16 24 19.5817 24 24" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" />
            <path d="M22 8L27 5M27 5V10M27 5H22" stroke="#E2B755" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
    </span>

    <span class="flex flex-col leading-tight">
        <span class="{{ $onDark ? 'text-white' : 'text-slate-900' }} text-[12px] font-extrabold">
            برنامج تنمية القدرات البشرية
        </span>
        <span class="{{ $onDark ? 'text-slate-400' : 'text-slate-500' }} text-[9.5px] font-medium" dir="ltr">
            Human Capability Development Program
        </span>
    </span>
</div>
