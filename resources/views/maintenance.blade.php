@php
    $locale = app()->getLocale();
    $direction = config("kasp.locales.{$locale}.dir", 'rtl');
@endphp
<!DOCTYPE html>
<html lang="{{ $locale }}" dir="{{ $direction }}" class="h-full">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{{ __('common.maintenance_title') }}</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;600;700&family=IBM+Plex+Sans:wght@400;600;700&display=swap">
    @vite('resources/css/app.css')
</head>
<body class="flex min-h-full items-center justify-center bg-saudi-950 p-6 text-white">
    <main class="w-full max-w-lg space-y-6 rounded-3xl border border-saudi-800 bg-saudi-900/60 p-8 text-center shadow-2xl">
        <span class="mx-auto flex size-16 items-center justify-center rounded-2xl border border-sand-400/30 bg-sand-400/15 text-sand-300">
            <x-lucide-wrench class="size-8" aria-hidden="true" />
        </span>

        <div class="space-y-2">
            <h1 class="text-2xl font-black">{{ __('common.maintenance_title') }}</h1>
            <p class="text-sm leading-relaxed text-saudi-100/80">{{ __('common.maintenance_body') }}</p>
        </div>

        <a href="{{ config('kasp.apply_url') }}" target="_blank" rel="noopener"
           class="inline-flex items-center gap-2 rounded-2xl bg-sand-300 px-6 py-3 text-sm font-bold text-slate-950 transition hover:bg-sand-200">
            <span>{{ __('catalog.track.apply_official') }}</span>
            <x-lucide-external-link class="size-4" aria-hidden="true" />
        </a>

        <p class="numeric border-t border-saudi-800 pt-4 text-xs text-saudi-200/70">
            {{ __('pages.help.hotline') }}: {{ config('kasp.support.phone') }}
        </p>
    </main>
</body>
</html>
