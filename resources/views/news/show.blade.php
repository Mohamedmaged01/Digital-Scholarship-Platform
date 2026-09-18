@extends('layouts.public')

@section('title', $article->title)
@section('description', $article->summary)
@section('og_image', $article->image_url ?: asset('images/saudi-scholars-hero.jpg'))

@section('content')
    <div class="mx-auto max-w-4xl space-y-8 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">

        <nav aria-label="breadcrumb" class="flex items-center gap-2 text-xs text-slate-500">
            <a href="{{ route('home') }}" class="transition hover:text-saudi-700">{{ __('nav.overview') }}</a>
            <x-lucide-chevron-right class="size-3 flip-rtl" aria-hidden="true" />
            <a href="{{ route('news.index') }}" class="transition hover:text-saudi-700">{{ __('pages.news.title') }}</a>
        </nav>

        <article class="space-y-6">
            <header class="space-y-4">
                <div class="flex flex-wrap items-center gap-2">
                    <x-badge tone="saudi">{{ $article->categoryLabel() }}</x-badge>
                    @if ($article->is_featured)
                        <x-badge tone="sand" icon="star">{{ __('pages.news.featured') }}</x-badge>
                    @endif
                </div>

                <h1 class="heading-section text-slate-900">{{ $article->title }}</h1>

                <p class="text-base leading-relaxed text-slate-600">{{ $article->summary }}</p>

                <dl class="flex flex-wrap items-center gap-x-6 gap-y-2 border-y border-slate-200 py-3 text-xs text-slate-500">
                    <div class="flex items-center gap-1.5">
                        <dt class="sr-only">{{ __('pages.news.published_on') }}</dt>
                        <x-lucide-calendar class="size-3.5 text-slate-400" aria-hidden="true" />
                        <dd><time datetime="{{ $article->publish_date?->toDateString() }}" class="numeric">{{ $article->publish_date?->translatedFormat('d MMMM y') }}</time></dd>
                    </div>

                    <div class="flex items-center gap-1.5">
                        <dt class="sr-only">{{ app()->getLocale() === 'ar' ? 'الجهة' : 'Author' }}</dt>
                        <x-lucide-user class="size-3.5 text-slate-400" aria-hidden="true" />
                        <dd>{{ $article->author }}</dd>
                    </div>

                    <div class="flex items-center gap-1.5">
                        <dt class="sr-only">{{ app()->getLocale() === 'ar' ? 'مدة القراءة' : 'Reading time' }}</dt>
                        <x-lucide-clock class="size-3.5 text-slate-400" aria-hidden="true" />
                        <dd>{{ __('pages.news.read_time', ['minutes' => $article->read_time_minutes]) }}</dd>
                    </div>
                </dl>
            </header>

            @if (filled($article->image_url))
                <figure class="overflow-hidden rounded-3xl border border-slate-200 bg-slate-100">
                    <img src="{{ $article->image_url }}" alt="{{ $article->title }}"
                         class="aspect-16/9 w-full object-cover" loading="eager" decoding="async" referrerpolicy="no-referrer">
                </figure>
            @endif

            <div class="prose-portal space-y-4 text-sm leading-relaxed text-slate-700 sm:text-base">
                @foreach (preg_split('/\r?\n\r?\n/', (string) $article->content) as $paragraph)
                    @if (filled(trim($paragraph)))
                        <p class="whitespace-pre-line">{{ trim($paragraph) }}</p>
                    @endif
                @endforeach
            </div>

            <footer class="flex flex-col items-center justify-between gap-4 rounded-2xl border border-saudi-200 bg-saudi-50 p-5 sm:flex-row">
                <p class="text-xs leading-relaxed text-saudi-900">{{ __('cta.support_note') }}</p>
                <a href="{{ $settings['official_apply_url'] ?? config('kasp.apply_url') }}" target="_blank" rel="noopener"
                   class="flex shrink-0 items-center gap-2 rounded-xl bg-saudi-700 px-5 py-2.5 text-xs font-bold text-white transition hover:bg-saudi-800">
                    <span>{{ __('catalog.track.apply_official') }}</span>
                    <x-lucide-external-link class="size-3.5" aria-hidden="true" />
                </a>
            </footer>
        </article>

        @if ($related->isNotEmpty())
            <section class="space-y-4">
                <h2 class="text-lg font-bold text-slate-900">{{ __('pages.news.related') }}</h2>
                <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    @foreach ($related as $other)
                        <a href="{{ route('news.show', $other) }}"
                           class="group space-y-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs transition hover:border-saudi-300">
                            <span class="numeric block text-[11px] text-slate-500">{{ $other->publish_date?->translatedFormat('d MMMM y') }}</span>
                            <span class="block text-sm font-bold leading-snug text-slate-900 transition group-hover:text-saudi-700">{{ $other->title }}</span>
                        </a>
                    @endforeach
                </div>
            </section>
        @endif

        <a href="{{ route('news.index') }}"
           class="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 transition hover:bg-slate-50">
            <x-lucide-arrow-left class="size-3.5 flip-rtl" aria-hidden="true" />
            <span>{{ __('pages.news.back_to_news') }}</span>
        </a>
    </div>
@endsection
