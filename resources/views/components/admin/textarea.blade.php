@props(['rows' => 4])

<textarea rows="{{ $rows }}"
    {{ $attributes->merge([
        'class' => 'w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs leading-relaxed text-slate-900 transition focus:border-saudi-600 focus:ring-2 focus:ring-saudi-600/20 disabled:bg-slate-50',
    ]) }}>{{ $slot }}</textarea>
