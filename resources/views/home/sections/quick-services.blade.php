@php
    $isArabic = app()->getLocale() === 'ar';

    $services = [
        [
            'title' => __('services.service_tracks_title'),
            'body' => __('services.service_tracks_desc'),
            'icon' => 'compass',
            'tone' => 'text-saudi-700',
            'badge' => $tracks->count().' '.($isArabic ? 'مسارات' : 'tracks'),
            'url' => route('tracks.index'),
        ],
        [
            'title' => __('services.service_check_title'),
            'body' => __('services.service_check_desc'),
            'icon' => 'circle-check',
            'tone' => 'text-saudi-600',
            'badge' => count($journeySteps).' '.($isArabic ? 'محطات' : 'steps'),
            'url' => '#journey',
        ],
        [
            'title' => __('services.service_unis_title'),
            'body' => __('services.service_unis_desc'),
            'icon' => 'globe',
            'tone' => 'text-teal-600',
            'badge' => __('unis.eyebrow'),
            'url' => route('universities.index'),
        ],
        [
            'title' => __('pages.news.title'),
            'body' => __('pages.news.subtitle'),
            'icon' => 'newspaper',
            'tone' => 'text-sand-500',
            'badge' => __('pages.news.latest'),
            'url' => route('news.index'),
            'highlight' => true,
        ],
        [
            'title' => __('services.service_faq_title'),
            'body' => __('services.service_faq_desc'),
            'icon' => 'circle-help',
            'tone' => 'text-blue-600',
            'badge' => __('faq.eyebrow'),
            'url' => route('faq.index'),
        ],
        [
            'title' => __('services.service_ai_title'),
            'body' => __('services.service_ai_desc'),
            'icon' => 'bot',
            'tone' => 'text-purple-600',
            'badge' => 'AI 24/7',
            'url' => route('help.index'),
            'advisor' => true,
        ],
    ];
@endphp

<section class="space-y-4">
    <x-section-heading :eyebrow="__('services.eyebrow')" :title="__('services.title')" :divider="false">
        <p class="hidden text-xs font-medium text-slate-500 sm:block">{{ __('services.subtitle') }}</p>
    </x-section-heading>

    <div class="grid grid-cols-1 gap-3.5 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
        @foreach ($services as $service)
            @php $highlight = $service['highlight'] ?? false; @endphp

            <a href="{{ $service['url'] }}"
               @if ($service['advisor'] ?? false) @click.prevent="$dispatch('open-advisor')" @endif
               class="{{ $highlight
                    ? 'border-saudi-300 bg-gradient-to-br from-saudi-50 via-white to-saudi-50/40 hover:border-saudi-500'
                    : 'border-slate-200/80 bg-white hover:border-slate-300 hover:bg-slate-50/80' }} group flex flex-col justify-between gap-3 overflow-hidden rounded-2xl border p-4 shadow-2xs transition-all duration-200 hover:shadow-md sm:p-5">

                <div class="flex w-full items-start justify-between gap-3">
                    <span class="{{ $highlight ? 'bg-saudi-700 shadow-2xs' : 'bg-slate-100 group-hover:bg-saudi-50' }} flex size-11 items-center justify-center rounded-xl transition-transform group-hover:scale-105">
                        <x-dynamic-component :component="'lucide-'.$service['icon']"
                                             class="size-5 {{ $highlight ? 'text-white' : $service['tone'] }}"
                                             aria-hidden="true" />
                    </span>

                    <x-badge :tone="($service['advisor'] ?? false) ? 'purple' : ($highlight ? 'saudi' : 'slate')">
                        {{ $service['badge'] }}
                    </x-badge>
                </div>

                <div class="space-y-1">
                    <h3 class="text-base font-bold text-slate-900 transition-colors group-hover:text-saudi-700">{{ $service['title'] }}</h3>
                    <p class="text-xs leading-relaxed text-slate-500">{{ $service['body'] }}</p>
                </div>
            </a>
        @endforeach
    </div>
</section>
