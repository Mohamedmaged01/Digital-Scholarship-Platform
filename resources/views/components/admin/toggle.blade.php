@props(['label', 'name', 'checked' => false, 'hint' => null])

<label class="flex cursor-pointer items-start justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50/60 p-4 transition hover:border-slate-300">
    <span class="space-y-0.5">
        <span class="block text-xs font-bold text-slate-800">{{ $label }}</span>
        @if ($hint)
            <span class="block text-[11px] leading-relaxed text-slate-500">{{ $hint }}</span>
        @endif
    </span>

    <span class="flex shrink-0 items-center">
        <input type="hidden" name="{{ $name }}" value="0">
        <input type="checkbox" name="{{ $name }}" value="1" @checked($checked)
               class="size-5 rounded border-slate-300 text-saudi-700 focus:ring-saudi-600">
    </span>
</label>
