@props(['track', 'index' => null])

@php
    $number = $index !== null ? str_pad((string) ($index + 1), 2, '0', STR_PAD_LEFT) : $track->displayNumber();
    $sectors = collect($track->target_sectors);
@endphp

<article class="group flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-saudi-400/80 hover:shadow-xl">

    <div class="relative aspect-16/10 overflow-hidden bg-slate-900">
        <img src="{{ $track->image_url }}"
             alt="{{ $track->name }}"
             loading="lazy" decoding="async" referrerpolicy="no-referrer"
             class="size-full object-cover object-center transition-transform duration-500 group-hover:scale-105">

        <div class="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" aria-hidden="true"></div>

        <div class="absolute start-3.5 top-3.5 flex items-center gap-2">
            <span class="numeric rounded-xl border border-white/20 bg-slate-950/80 px-3 py-1 text-xs font-bold text-white shadow-md backdrop-blur-md">
                {{ $number }}
            </span>
            <span class="rounded-xl border border-saudi-400/40 bg-saudi-950/80 px-2.5 py-1 text-[10.5px] font-bold text-saudi-300 backdrop-blur-md">
                {{ __('tracks.top_label') }} {{ $track->top_universities_rank_limit }}
            </span>
        </div>

        <div class="absolute inset-x-3.5 bottom-3">
            <div class="mb-1 flex items-center gap-2">
                <span class="flex size-7 shrink-0 items-center justify-center rounded-lg bg-white/20 text-white backdrop-blur-md">
                    <x-dynamic-component :component="'lucide-'.$track->icon_name" class="size-4" aria-hidden="true" />
                </span>
                <h3 class="truncate text-lg font-bold leading-tight text-white drop-shadow-sm">
                    <a href="{{ route('tracks.show', $track) }}" class="hover:underline">{{ $track->name }}</a>
                </h3>
            </div>
            <p class="truncate text-[10.5px] font-medium tracking-wide text-saudi-200/90">{{ $track->code }}</p>
        </div>
    </div>

    <div class="flex flex-1 flex-col justify-between gap-4 p-5">
        <p class="line-clamp-2 text-xs leading-relaxed text-slate-600 sm:text-sm">{{ $track->description }}</p>

        <dl class="space-y-2 border-t border-slate-100 pt-3 text-xs">
            <div class="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-1.5">
                <dt class="font-medium text-slate-500">{{ __('tracks.min_gpa_label') }}</dt>
                <dd class="numeric font-bold text-slate-900">{{ rtrim(rtrim(number_format($track->min_gpa, 2), '0'), '.') }} {{ __('tracks.out_of_five') }}</dd>
            </div>

            <div class="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-1.5">
                <dt class="font-medium text-slate-500">{{ __('tracks.rank_limit_label') }}</dt>
                <dd class="font-bold text-saudi-700">
                    {{ __('tracks.top_label') }} <span class="numeric">{{ $track->top_universities_rank_limit }}</span>
                </dd>
            </div>

            @if ($sectors->isNotEmpty())
                <div class="flex flex-wrap gap-1 pt-1">
                    @foreach ($sectors->take(3) as $sector)
                        <span class="rounded-md border border-saudi-100 bg-saudi-50 px-2 py-0.5 text-[10.5px] font-medium text-saudi-700">{{ $sector }}</span>
                    @endforeach
                    @if ($sectors->count() > 3)
                        <span class="self-center text-[10px] text-slate-400">+{{ $sectors->count() - 3 }} {{ __('common.more') }}</span>
                    @endif
                </div>
            @endif
        </dl>

        <div class="flex items-center gap-2 border-t border-slate-100 pt-3">
            <a href="{{ route('tracks.show', $track) }}"
               class="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-saudi-700 py-2.5 text-xs font-bold text-white shadow-xs transition hover:bg-saudi-800">
                <span>{{ __('tracks.details_btn') }}</span>
                <x-lucide-arrow-right class="size-3.5 flip-rtl" aria-hidden="true" />
            </a>

            <a href="{{ $track->applyUrl() }}" target="_blank" rel="noopener"
               class="flex items-center justify-center rounded-xl bg-slate-100 p-2.5 text-slate-700 transition hover:bg-slate-200"
               title="{{ __('tracks.apply_btn') }}" aria-label="{{ __('tracks.apply_btn') }}">
                <x-lucide-external-link class="size-4" aria-hidden="true" />
            </a>
        </div>
    </div>
</article>
