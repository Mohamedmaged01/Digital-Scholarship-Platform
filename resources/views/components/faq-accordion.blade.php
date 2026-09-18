@props(['faqs', 'openId' => null])

{{--
    Native <details> elements: the accordion works before JavaScript loads, is
    keyboard operable for free, and stays open on a full page reload.
--}}
<div class="space-y-3">
    @forelse ($faqs as $faq)
        <details @if ($openId === $faq->id) open @endif
                 class="group overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-50/60 transition-all duration-200 open:border-saudi-300 open:bg-saudi-50/40 hover:border-slate-300">
            <summary class="flex cursor-pointer list-none items-center justify-between gap-4 p-4 sm:p-5">
                <h3 class="text-sm font-bold leading-snug text-slate-900 group-open:text-saudi-700">{{ $faq->question }}</h3>

                <span class="flex size-8 shrink-0 items-center justify-center rounded-xl bg-slate-200/80 text-slate-600 transition-transform group-open:rotate-180 group-open:bg-saudi-700 group-open:text-white">
                    <x-lucide-chevron-down class="size-4" aria-hidden="true" />
                </span>
            </summary>

            <div class="prose-portal border-t border-saudi-200/50 px-5 pb-5 pt-3 text-xs leading-relaxed text-slate-700 sm:text-sm">
                <p class="whitespace-pre-line">{{ $faq->answer }}</p>

                @if (filled($faq->tags))
                    <ul class="mt-3 flex flex-wrap gap-1">
                        @foreach ($faq->tags as $tag)
                            <li class="rounded-md border border-slate-200 bg-white px-2 py-0.5 text-[10.5px] font-medium text-slate-500">{{ $tag }}</li>
                        @endforeach
                    </ul>
                @endif
            </div>
        </details>
    @empty
        <p class="py-10 text-center text-xs text-slate-400">{{ __('common.no_results') }}</p>
    @endforelse
</div>
