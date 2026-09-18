@props(['tone' => 'slate', 'icon' => null])

@php
    $tones = [
        'slate' => 'border-slate-200 bg-slate-100 text-slate-700',
        'saudi' => 'border-saudi-200 bg-saudi-50 text-saudi-800',
        'emerald' => 'border-emerald-200 bg-emerald-50 text-emerald-800',
        'sand' => 'border-sand-200 bg-sand-100 text-sand-500',
        'amber' => 'border-amber-200 bg-amber-50 text-amber-800',
        'rose' => 'border-rose-200 bg-rose-50 text-rose-800',
        'blue' => 'border-blue-200 bg-blue-50 text-blue-800',
        'indigo' => 'border-indigo-200 bg-indigo-50 text-indigo-800',
        'purple' => 'border-purple-200 bg-purple-50 text-purple-800',
        'teal' => 'border-teal-200 bg-teal-50 text-teal-800',
        'orange' => 'border-orange-200 bg-orange-50 text-orange-800',
    ];
@endphp

<span {{ $attributes->merge(['class' => 'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10.5px] font-bold '.($tones[$tone] ?? $tones['slate'])]) }}>
    @if ($icon)
        <x-dynamic-component :component="'lucide-'.$icon" class="size-3" aria-hidden="true" />
    @endif
    {{ $slot }}
</span>
