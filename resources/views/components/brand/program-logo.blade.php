@props(['variant' => 'dark', 'showSubtitle' => true])

@php
    $onDark = in_array($variant, ['white', 'light'], true);
@endphp

<div {{ $attributes->merge(['class' => 'inline-flex select-none items-center gap-3.5']) }}>
    {{-- Palm and crossed swords: the national emblem, drawn rather than bitmapped so it stays crisp. --}}
    <span class="relative flex shrink-0 items-center justify-center">
        <span class="{{ $onDark ? 'border-saudi-600/40 bg-gradient-to-br from-saudi-800 to-saudi-950 text-sand-300' : 'border-saudi-700/30 bg-gradient-to-br from-saudi-700 to-saudi-800 text-sand-400' }} flex size-11 items-center justify-center rounded-2xl border shadow-sm transition-transform hover:scale-105">
            <svg viewBox="0 0 64 64" fill="none" class="size-7" aria-hidden="true">
                <path d="M32 10C32 10 30 16 28 20C26 24 24 26 21 27C21 27 26 27 28 24C28 24 25 30 22 33C26 31 29 27 30 24C30 28 28 35 24 38C28 36 31 31 32 26C33 31 36 36 40 38C36 35 34 28 34 24C35 27 38 31 42 33C39 30 36 24 36 24C38 27 43 27 43 27C40 26 38 24 36 20C34 16 32 10 32 10Z" fill="currentColor"/>
                <path d="M31 26H33V42H31V26Z" fill="currentColor"/>
                <path d="M19 49C25 46 32 42 45 35L44 33C31 40 24 44 18 47L19 49Z" fill="#E2B755"/>
                <path d="M45 49C39 46 32 42 19 35L20 33C33 40 40 44 46 47L45 49Z" fill="#E2B755"/>
                <path d="M16 48L19 51L17 53L14 50L16 48Z" fill="#E2B755"/>
                <path d="M48 48L45 51L47 53L50 50L48 48Z" fill="#E2B755"/>
            </svg>
        </span>
        <span class="pointer-events-none absolute -inset-0.5 rounded-2xl border border-sand-400/20" aria-hidden="true"></span>
    </span>

    <span class="flex flex-col leading-tight">
        <span class="{{ $onDark ? 'text-saudi-300' : 'text-saudi-700' }} text-[10px] font-semibold uppercase tracking-wider">
            {{ app()->getLocale() === 'ar' ? 'المملكة العربية السعودية • وزارة التعليم' : 'Kingdom of Saudi Arabia • Ministry of Education' }}
        </span>
        <span class="{{ $onDark ? 'text-white' : 'text-slate-900' }} text-base font-black tracking-tight sm:text-lg">
            {{ __('nav.program_title') }}
        </span>
        @if ($showSubtitle)
            <span class="{{ $onDark ? 'text-slate-300' : 'text-slate-500' }} text-[10.5px] font-medium uppercase">
                {{ app()->getLocale() === 'ar' ? 'Scholarship Program' : __('nav.program_title') }}
            </span>
        @endif
    </span>
</div>
