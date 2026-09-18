@props(['type' => 'text'])

<input type="{{ $type }}"
    {{ $attributes->merge([
        'class' => 'w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs text-slate-900 transition focus:border-saudi-600 focus:ring-2 focus:ring-saudi-600/20 disabled:bg-slate-50 disabled:text-slate-500',
    ]) }}>
