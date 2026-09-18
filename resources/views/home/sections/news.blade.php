<section id="news" class="scroll-mt-24 space-y-6">
    <x-section-heading :eyebrow="__('pages.news.eyebrow')" :title="__('pages.news.title')" :subtitle="__('pages.news.subtitle')">
        <a href="{{ route('news.index') }}"
           class="flex items-center gap-2 rounded-xl bg-slate-100 px-4 py-2.5 text-xs font-bold text-slate-800 transition hover:bg-slate-200">
            <span>{{ __('pages.news.latest') }}</span>
            <x-lucide-arrow-right class="size-3.5 flip-rtl" aria-hidden="true" />
        </a>
    </x-section-heading>

    @if ($news->isEmpty())
        <x-empty-state icon="newspaper" :title="__('pages.news.empty')" />
    @else
        <div class="grid grid-cols-1 gap-5 md:grid-cols-3">
            @foreach ($news as $article)
                <article class="group flex flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-2xs transition-all hover:-translate-y-0.5 hover:border-saudi-300 hover:shadow-md">
                    @if (filled($article->image_url))
                        <div class="aspect-16/9 overflow-hidden bg-slate-100">
                            <img src="{{ $article->image_url }}" alt="{{ $article->title }}"
                                 loading="lazy" decoding="async" referrerpolicy="no-referrer"
                                 class="size-full object-cover transition-transform duration-500 group-hover:scale-105">
                        </div>
                    @endif

                    <div class="flex flex-1 flex-col justify-between gap-3 p-5">
                        <div class="space-y-2">
                            <div class="flex items-center gap-2">
                                <x-badge tone="saudi">{{ $article->categoryLabel() }}</x-badge>
                                @if ($article->is_featured)
                                    <x-badge tone="sand" icon="star">{{ __('pages.news.featured') }}</x-badge>
                                @endif
                            </div>

                            <h3 class="text-base font-bold leading-snug text-slate-900 transition-colors group-hover:text-saudi-700">
                                <a href="{{ route('news.show', $article) }}">{{ $article->title }}</a>
                            </h3>

                            <p class="line-clamp-3 text-xs leading-relaxed text-slate-600">{{ $article->summary }}</p>
                        </div>

                        <div class="flex items-center justify-between border-t border-slate-100 pt-3 text-[11px] text-slate-500">
                            <time datetime="{{ $article->publish_date?->toDateString() }}" class="numeric">
                                {{ $article->publish_date?->translatedFormat('d MMMM y') }}
                            </time>
                            <span class="flex items-center gap-1">
                                <x-lucide-clock class="size-3" aria-hidden="true" />
                                <span class="numeric">{{ $article->read_time_minutes }}</span>
                                <span>{{ app()->getLocale() === 'ar' ? 'دقائق' : 'min' }}</span>
                            </span>
                        </div>
                    </div>
                </article>
            @endforeach
        </div>
    @endif
</section>
