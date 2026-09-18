@props(['icon' => 'save'])

<button type="submit"
        {{ $attributes->merge(['class' => 'flex items-center justify-center gap-2 rounded-xl bg-saudi-700 px-5 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-saudi-800 disabled:opacity-50']) }}>
    <x-dynamic-component :component="'lucide-'.$icon" class="size-4" aria-hidden="true" />
    <span>{{ $slot }}</span>
</button>
