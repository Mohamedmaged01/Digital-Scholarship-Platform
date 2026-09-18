@props(['label', 'name', 'hint' => null, 'required' => false])

<label class="block space-y-1.5">
    <span class="block text-xs font-bold text-slate-700">
        {{ $label }}
        @if ($required)
            <span class="text-rose-600" aria-hidden="true">*</span>
        @endif
    </span>

    {{ $slot }}

    @if ($hint)
        <span class="block text-[11px] leading-relaxed text-slate-500">{{ $hint }}</span>
    @endif

    @error($name)
        <span class="block text-[11px] font-semibold text-rose-600">{{ $message }}</span>
    @enderror
</label>
