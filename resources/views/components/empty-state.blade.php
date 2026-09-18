@props(['icon' => 'search-x', 'title', 'body' => null])

<div {{ $attributes->merge(['class' => 'rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center']) }}>
    <span class="mx-auto flex size-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
        <x-dynamic-component :component="'lucide-'.$icon" class="size-7" aria-hidden="true" />
    </span>
    <h3 class="mt-4 text-base font-bold text-slate-900">{{ $title }}</h3>
    @if ($body)
        <p class="mx-auto mt-1 max-w-md text-xs text-slate-500">{{ $body }}</p>
    @endif
    @if (! $slot->isEmpty())
        <div class="mt-5">{{ $slot }}</div>
    @endif
</div>
