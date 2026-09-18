@props(['university'])

@php
    $majors = collect($university->top_majors);
@endphp

<article class="group flex flex-col justify-between gap-4 rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs transition-all duration-200 hover:border-saudi-300 hover:shadow-md">
    <div class="space-y-3">
        <div class="flex items-start justify-between gap-2">
            <span class="flex items-center gap-1 rounded-lg border border-sand-200 bg-sand-100 px-2.5 py-1 text-xs font-bold text-sand-500">
                <x-lucide-award class="size-3.5" aria-hidden="true" />
                <span class="numeric">#{{ $university->qs_rank }}</span>
                <span>{{ __('unis.rank_prefix') }}</span>
            </span>

            <span class="flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-bold text-slate-500">
                <x-lucide-map-pin class="size-3 text-slate-400" aria-hidden="true" />
                {{ $university->country }}
            </span>
        </div>

        <div>
            <h3 class="text-base font-bold leading-snug text-slate-900 transition-colors group-hover:text-saudi-700">
                <a href="{{ route('universities.show', $university) }}">{{ $university->name }}</a>
            </h3>
            <p class="text-xs font-medium text-slate-500" dir="{{ app()->getLocale() === 'ar' ? 'ltr' : 'rtl' }}">
                {{ $university->alternate('name') }}
            </p>
        </div>

        @if ($majors->isNotEmpty())
            <div class="space-y-1.5 border-t border-slate-100 pt-2">
                <p class="block text-[10.5px] font-semibold text-slate-400">{{ __('unis.featured_majors') }}:</p>
                <div class="flex flex-wrap gap-1">
                    @foreach ($majors->take(3) as $major)
                        <span class="rounded-md border border-slate-200/60 bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-700">{{ $major }}</span>
                    @endforeach
                    @if ($majors->count() > 3)
                        <span class="self-center text-[10px] text-slate-400">+{{ $majors->count() - 3 }} {{ __('common.more') }}</span>
                    @endif
                </div>
            </div>
        @endif
    </div>

    <div class="flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
        <span class="rounded-md bg-saudi-50 px-2 py-1 text-[11px] font-bold text-saudi-700">{{ __('unis.accredited_badge') }}</span>

        <div class="flex items-center gap-3">
            <a href="{{ route('universities.show', $university) }}" class="font-bold text-slate-600 transition hover:text-saudi-700">
                {{ __('common.view') }}
            </a>
            @if (filled($university->website_url))
                <a href="{{ $university->website_url }}" target="_blank" rel="noopener"
                   class="flex items-center gap-1 font-bold text-slate-500 transition hover:text-saudi-700">
                    <span>{{ __('unis.website_link') }}</span>
                    <x-lucide-external-link class="size-3" aria-hidden="true" />
                </a>
            @endif
        </div>
    </div>
</article>
