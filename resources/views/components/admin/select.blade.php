<select {{ $attributes->merge([
        'class' => 'w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-900 transition focus:border-saudi-600 focus:ring-2 focus:ring-saudi-600/20 disabled:bg-slate-50',
    ]) }}>{{ $slot }}</select>
