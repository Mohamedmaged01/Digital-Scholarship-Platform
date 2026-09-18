@props(['variant' => 'dark'])

@php
    $onDark = in_array($variant, ['white', 'light'], true);
@endphp

<div {{ $attributes->merge(['class' => 'inline-flex select-none items-center']) }}
     title="{{ app()->getLocale() === 'ar' ? 'رؤية المملكة العربية السعودية 2030' : 'Saudi Vision 2030' }}">
    <span class="flex flex-col items-center text-center">
        <span class="flex items-center gap-1" dir="ltr">
            <span class="{{ $onDark ? 'text-white' : 'text-slate-900' }} text-xl font-black leading-none tracking-tighter sm:text-2xl">20</span>
            <span class="flex size-5 items-center justify-center rounded-full bg-gradient-to-br from-saudi-700 to-saudi-600 text-sand-300 shadow-sm">
                <svg viewBox="0 0 24 24" fill="currentColor" class="size-3" aria-hidden="true">
                    <path d="M12 2C12 2 10.5 5 9.5 7C8.5 9 7.5 10 6 10.5C6 10.5 8.5 10.5 9.5 9C9.5 9 8 12 6.5 13.5C8.5 12.5 10 10.5 10.5 9C10.5 11 9.5 14.5 7.5 16C9.5 15 11 12.5 11.5 10C12 12.5 13.5 15 15.5 16C13.5 14.5 12.5 11 12.5 9C13 10.5 14.5 12.5 16.5 13.5C15 12 13.5 9 13.5 9C14.5 10.5 17 10.5 17 10.5C15.5 10 14.5 9 13.5 7C12.5 5 12 2 12 2Z"/>
                    <path d="M11.5 10H12.5V18H11.5V10Z"/>
                </svg>
            </span>
            <span class="{{ $onDark ? 'text-white' : 'text-slate-900' }} text-xl font-black leading-none tracking-tighter sm:text-2xl">30</span>
        </span>
        <span class="mt-0.5 flex flex-col text-[8.5px] font-bold leading-tight tracking-wide">
            <span class="{{ $onDark ? 'text-saudi-300' : 'text-saudi-700' }}">
                {{ app()->getLocale() === 'ar' ? 'رؤيــــة' : 'VISION' }}
            </span>
            <span class="{{ $onDark ? 'text-slate-400' : 'text-slate-500' }}">
                {{ app()->getLocale() === 'ar' ? 'المملكة العربية السعودية' : 'KINGDOM OF SAUDI ARABIA' }}
            </span>
        </span>
    </span>
</div>
