@php
    $isArabic = app()->getLocale() === 'ar';

    $items = [
        [
            'icon' => 'layers',
            'tone' => 'text-saudi-700',
            'label' => __('nav.tracks'),
            'value' => $tracks->count().' '.($isArabic ? 'مسارات استراتيجية' : 'strategic tracks'),
            'body' => __('tracks.subtitle'),
            'url' => route('tracks.index'),
        ],
        [
            'icon' => 'globe',
            'tone' => 'text-teal-700',
            'label' => __('nav.universities'),
            'value' => $universitiesTotal.' '.($isArabic ? 'جامعة معتمدة' : 'accredited institutions'),
            'body' => __('unis.subtitle'),
            'url' => route('universities.index'),
        ],
        [
            'icon' => 'book-open',
            'tone' => 'text-sand-500',
            'label' => __('pages.countries.title'),
            'value' => $countries->count().' '.($isArabic ? 'دول مستضيفة' : 'host countries'),
            'body' => __('pages.countries.subtitle'),
            'url' => route('countries.index'),
        ],
        [
            'icon' => 'laptop',
            'tone' => 'text-saudi-600',
            'label' => __('services.eyebrow'),
            'value' => __('info_strip.headline'),
            'body' => __('services.subtitle'),
            'url' => route('help.index'),
        ],
    ];
@endphp

<div class="grid grid-cols-1 gap-3.5 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
    @foreach ($items as $item)
        <a href="{{ $item['url'] }}"
           class="group flex items-start gap-3.5 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs transition-all duration-200 hover:bg-slate-50/90 hover:shadow-md sm:p-5">
            <span class="flex size-11 shrink-0 items-center justify-center rounded-xl border border-slate-200/80 bg-slate-50 transition-colors group-hover:border-saudi-200 group-hover:bg-saudi-50">
                <x-dynamic-component :component="'lucide-'.$item['icon']" class="size-5 {{ $item['tone'] }}" aria-hidden="true" />
            </span>

            <span class="min-w-0 space-y-0.5">
                <span class="block text-[11px] font-bold uppercase tracking-wide text-slate-500">{{ $item['label'] }}</span>
                <span class="block truncate text-sm font-bold text-slate-900 sm:text-base">{{ $item['value'] }}</span>
                <span class="line-clamp-1 block text-[11.5px] leading-snug text-slate-500">{{ $item['body'] }}</span>
            </span>
        </a>
    @endforeach
</div>
