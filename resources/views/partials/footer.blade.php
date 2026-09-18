@php
    $locale = app()->getLocale();
    $social = $settings['social_links'] ?? [];
@endphp

<footer class="border-t border-slate-800 bg-slate-950 text-slate-300">

    <div class="border-b border-slate-800/80 bg-slate-900/60 py-6">
        <div class="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 sm:px-6 lg:flex-row lg:px-8">
            <x-brand.program-logo variant="white" />

            <div class="flex items-center gap-6 rounded-2xl border border-slate-800 bg-slate-950/80 px-5 py-3">
                <x-brand.human-capability variant="white" />
                <span class="h-8 w-px bg-slate-800" aria-hidden="true"></span>
                <x-brand.vision-2030 variant="white" />
            </div>
        </div>
    </div>

    <div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5">

            <div class="space-y-4 lg:col-span-2">
                <h2 class="text-sm font-bold uppercase tracking-wider text-white">{{ __('footer.about_title') }}</h2>
                <p class="text-xs leading-relaxed text-slate-400">{{ __('footer.about_text') }}</p>
                <p class="flex items-center gap-2 pt-2 text-xs text-saudi-400">
                    <x-lucide-shield-check class="size-4 shrink-0" aria-hidden="true" />
                    <span>{{ __('footer.gov_platform_note') }}</span>
                </p>

                @if (collect($social)->filter()->isNotEmpty())
                    <ul class="flex items-center gap-2 pt-2">
                        @foreach (['x_twitter' => 'twitter', 'youtube' => 'youtube', 'linkedin' => 'linkedin', 'instagram' => 'instagram'] as $key => $icon)
                            @if (filled($social[$key] ?? null))
                                <li>
                                    <a href="{{ $social[$key] }}" target="_blank" rel="noopener"
                                       class="flex size-9 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-slate-400 transition hover:border-saudi-600 hover:text-saudi-400"
                                       aria-label="{{ ucfirst($icon) }}">
                                        <x-dynamic-component :component="'lucide-'.$icon" class="size-4" aria-hidden="true" />
                                    </a>
                                </li>
                            @endif
                        @endforeach
                    </ul>
                @endif
            </div>

            <div class="space-y-3">
                <h2 class="text-sm font-bold uppercase tracking-wider text-white">{{ __('footer.tracks_title') }}</h2>
                <ul class="space-y-2 text-xs text-slate-400">
                    @foreach ($navTracks as $track)
                        <li>
                            <a href="{{ route('tracks.show', $track) }}" class="transition hover:text-saudi-400">
                                {{ $track->name }}
                            </a>
                        </li>
                    @endforeach
                </ul>
            </div>

            <div class="space-y-3">
                <h2 class="text-sm font-bold uppercase tracking-wider text-white">{{ __('footer.portals_title') }}</h2>
                <ul class="space-y-2 text-xs text-slate-400">
                    <li><a href="{{ route('guide.index') }}" class="transition hover:text-saudi-400">{{ __('footer.portal_safeer') }}</a></li>
                    <li><a href="{{ route('universities.index') }}" class="transition hover:text-saudi-400">{{ __('footer.portal_unis') }}</a></li>
                    <li><a href="{{ route('home') }}#ai-finder" class="transition hover:text-saudi-400">{{ __('footer.portal_ai') }}</a></li>
                    <li><a href="{{ route('missions.index') }}" class="transition hover:text-saudi-400">{{ __('footer.portal_missions') }}</a></li>
                    <li><a href="{{ route('help.index') }}" class="transition hover:text-saudi-400">{{ __('nav.help_center') }}</a></li>
                </ul>
            </div>

            <div class="space-y-3">
                <h2 class="text-sm font-bold uppercase tracking-wider text-white">{{ __('footer.support_title') }}</h2>
                <ul class="space-y-2.5 text-xs text-slate-400">
                    <li class="flex items-center gap-2">
                        <x-lucide-phone class="size-3.5 shrink-0 text-saudi-400" aria-hidden="true" />
                        <span>{{ __('footer.beneficiary_care') }}:
                            <a href="tel:{{ $settings['support_phone'] ?? config('kasp.support.phone') }}"
                               class="numeric font-bold transition hover:text-saudi-400">{{ $settings['support_phone'] ?? config('kasp.support.phone') }}</a>
                        </span>
                    </li>
                    <li class="flex items-center gap-2">
                        <x-lucide-mail class="size-3.5 shrink-0 text-saudi-400" aria-hidden="true" />
                        <a href="mailto:{{ $settings['support_email'] ?? config('kasp.support.email') }}"
                           class="transition hover:text-saudi-400">{{ $settings['support_email'] ?? config('kasp.support.email') }}</a>
                    </li>
                    <li class="flex items-center gap-2">
                        <x-lucide-globe class="size-3.5 shrink-0 text-saudi-400" aria-hidden="true" />
                        <span>{{ __('footer.address_ksa') }}</span>
                    </li>
                    <li class="flex items-center gap-2">
                        <x-lucide-external-link class="size-3.5 shrink-0 text-saudi-400" aria-hidden="true" />
                        <a href="{{ $settings['official_apply_url'] ?? config('kasp.apply_url') }}" target="_blank" rel="noopener"
                           class="font-bold transition hover:text-saudi-400">{{ __('pages.help.official_portal') }}</a>
                    </li>
                </ul>
            </div>
        </div>
    </div>

    <div class="border-t border-slate-900 bg-black/40 py-4">
        <div class="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 text-[11px] text-slate-400 sm:flex-row sm:px-6 lg:px-8">
            <p>{{ __('footer.copyright') }}</p>
            <ul class="flex items-center gap-4">
                <li><a href="{{ route('faq.index') }}" class="transition hover:text-saudi-400">{{ __('footer.privacy') }}</a></li>
                <li aria-hidden="true">•</li>
                <li><a href="{{ route('faq.index') }}" class="transition hover:text-saudi-400">{{ __('footer.terms') }}</a></li>
                <li aria-hidden="true">•</li>
                <li><a href="{{ route('help.index') }}" class="transition hover:text-saudi-400">{{ __('footer.accessibility') }}</a></li>
            </ul>
        </div>
    </div>
</footer>
