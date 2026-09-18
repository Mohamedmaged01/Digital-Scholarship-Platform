@php
    $locale = app()->getLocale();
    $direction = config("kasp.locales.{$locale}.dir", 'rtl');
    $siteName = $settings['site_name_'.$locale] ?? config('app.name');
    $banner = $settings['announcement_banner'] ?? [];
@endphp
<!DOCTYPE html>
<html lang="{{ $locale }}" dir="{{ $direction }}" class="h-full">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>@hasSection('title')@yield('title') — {{ $siteName }}@else{{ $siteName }}@endif</title>
    <meta name="description" content="@yield('description', $settings['tagline_'.$locale] ?? '')">

    <meta property="og:type" content="website">
    <meta property="og:site_name" content="{{ $siteName }}">
    <meta property="og:title" content="@yield('title', $siteName)">
    <meta property="og:description" content="@yield('description', $settings['tagline_'.$locale] ?? '')">
    <meta property="og:image" content="@yield('og_image', asset('images/saudi-scholars-hero.jpg'))">
    <meta property="og:locale" content="{{ $locale === 'ar' ? 'ar_SA' : 'en_US' }}">
    <meta name="twitter:card" content="summary_large_image">
    <link rel="canonical" href="{{ url()->current() }}">

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700&family=IBM+Plex+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Tajawal:wght@400;500;700&family=Inter:wght@400;500;600;700&display=swap">

    @vite(['resources/css/app.css', 'resources/js/app.js'])
    @stack('head')
</head>
<body class="flex min-h-full flex-col bg-canvas text-slate-900 antialiased">
    <a href="#main"
       class="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:m-3 focus:rounded-xl focus:bg-saudi-700 focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-white">
        {{ __('common.skip_to_content') }}
    </a>

    @if (($banner['is_active'] ?? false) && filled($banner['text_'.$locale] ?? null))
        <div class="bg-saudi-900 text-center text-xs font-semibold text-saudi-100">
            <div class="mx-auto flex max-w-7xl items-center justify-center gap-2 px-4 py-2">
                <x-lucide-megaphone class="size-4 shrink-0 text-sand-300" aria-hidden="true" />
                <span>{{ $banner['text_'.$locale] }}</span>
                @if (filled($banner['action_url'] ?? null))
                    <a href="{{ $banner['action_url'] }}" target="_blank" rel="noopener"
                       class="inline-flex items-center gap-1 font-bold text-sand-300 underline-offset-4 hover:underline">
                        {{ __('cta.start_btn') }}
                        <x-lucide-external-link class="size-3" aria-hidden="true" />
                    </a>
                @endif
            </div>
        </div>
    @endif

    @include('partials.navbar')

    <main id="main" class="flex-1">
        @if (session('status'))
            <div class="mx-auto mt-6 max-w-7xl px-4 sm:px-6 lg:px-8">
                <div class="flex items-start gap-3 rounded-2xl border border-saudi-200 bg-saudi-50 p-4 text-sm text-saudi-900"
                     role="status">
                    <x-lucide-circle-check class="mt-0.5 size-5 shrink-0 text-saudi-600" aria-hidden="true" />
                    <p class="font-semibold">{{ session('status') }}</p>
                </div>
            </div>
        @endif

        @yield('content')
    </main>

    @include('partials.footer')

    <x-ai-advisor />
    <x-scroll-to-top />

    @stack('scripts')
</body>
</html>
