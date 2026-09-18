@php
    $locale = app()->getLocale();
    $direction = config("kasp.locales.{$locale}.dir", 'rtl');
    $otherLocale = $locale === 'ar' ? 'en' : 'ar';
    $admin = auth()->user();

    $sections = [
        'statistics' => ['route' => 'admin.dashboard', 'icon' => 'chart-bar'],
        'tracks' => ['route' => 'admin.tracks.index', 'icon' => 'award'],
        'universities' => ['route' => 'admin.universities.index', 'icon' => 'building-2'],
        'countries' => ['route' => 'admin.countries.index', 'icon' => 'globe'],
        'faqs' => ['route' => 'admin.faqs.index', 'icon' => 'circle-help'],
        'news' => ['route' => 'admin.news.index', 'icon' => 'newspaper'],
        'pages' => ['route' => 'admin.pages.index', 'icon' => 'layers'],
        'media' => ['route' => 'admin.media.index', 'icon' => 'image'],
        'ai' => ['route' => 'admin.ai.index', 'icon' => 'bot'],
        'users' => ['route' => 'admin.users.index', 'icon' => 'users'],
        'audit' => ['route' => 'admin.audit.index', 'icon' => 'shield-check'],
        'settings' => ['route' => 'admin.settings.edit', 'icon' => 'settings'],
    ];
@endphp
<!DOCTYPE html>
<html lang="{{ $locale }}" dir="{{ $direction }}" class="h-full">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <meta name="robots" content="noindex, nofollow">

    <title>@yield('title', __('admin.portal_title')) — {{ __('admin.portal_badge') }}</title>

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&family=IBM+Plex+Sans:wght@400;500;600;700&display=swap">

    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body class="min-h-full bg-canvas text-slate-900 antialiased">
<div class="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">

    {{-- Masthead --}}
    <header class="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-slate-700/60 bg-gradient-to-l from-slate-900 via-slate-800 to-slate-900 p-6 text-white shadow-xl">
        <div class="space-y-2">
            <div class="flex flex-wrap items-center gap-3">
                <span class="flex items-center gap-1.5 rounded-full border border-saudi-500/30 bg-saudi-500/20 px-3 py-1 text-xs font-bold text-saudi-400">
                    <span class="size-2 animate-pulse rounded-full bg-saudi-400" aria-hidden="true"></span>
                    {{ __('admin.portal_badge') }}
                </span>
                <span class="text-xs text-slate-400">{{ __('admin.portal_tag') }}</span>
            </div>

            <h1 class="text-2xl font-black text-white">{{ __('admin.portal_title') }}</h1>
            <p class="max-w-2xl text-xs text-slate-300">{{ __('admin.portal_subtitle') }}</p>
        </div>

        <div class="flex items-center gap-3">
            <div class="flex items-center gap-3 rounded-2xl border border-slate-700 bg-slate-800/90 p-3.5">
                @if (filled($admin->avatar_url))
                    <img src="{{ $admin->avatar_url }}" alt="" width="40" height="40"
                         class="size-10 shrink-0 rounded-xl object-cover" referrerpolicy="no-referrer">
                @else
                    <span class="flex size-10 shrink-0 items-center justify-center rounded-xl bg-saudi-500/20 font-bold text-saudi-400">
                        {{ $admin->initials() }}
                    </span>
                @endif

                <span class="flex flex-col">
                    <span class="flex items-center gap-2">
                        <span class="text-xs font-bold text-white">{{ $admin->full_name }}</span>
                        <span class="rounded border border-saudi-700/50 bg-saudi-950 px-1.5 py-0.5 text-[10px] font-bold text-saudi-300">{{ $admin->role }}</span>
                    </span>
                    <span class="mt-0.5 text-[11px] text-slate-400">{{ $admin->department ?: $admin->roleLabel() }}</span>
                </span>
            </div>

            <a href="{{ route('language.switch', $otherLocale) }}"
               class="flex items-center gap-1.5 rounded-2xl border border-slate-700 bg-slate-800/60 px-3 py-3.5 text-xs font-bold text-slate-300 transition hover:bg-slate-700"
               title="{{ __('nav.lang_switch_title') }}">
                <x-lucide-globe class="size-4" aria-hidden="true" />
                <span>{{ config("kasp.locales.{$otherLocale}.switch_label") }}</span>
            </a>

            <a href="{{ route('home') }}"
               class="flex items-center gap-2 rounded-2xl border border-slate-700 bg-slate-800/60 px-3 py-3.5 text-xs font-bold text-slate-300 transition hover:bg-slate-700"
               title="{{ __('admin.view_public_site') }}">
                <x-lucide-external-link class="size-4" aria-hidden="true" />
                <span class="hidden lg:inline">{{ __('admin.view_public_site') }}</span>
            </a>

            <form method="post" action="{{ route('admin.logout') }}">
                @csrf
                <button type="submit"
                        class="flex items-center gap-2 rounded-2xl border border-rose-800/50 bg-rose-950/40 px-3.5 py-3.5 text-xs font-bold text-rose-300 transition hover:bg-rose-900/60">
                    <x-lucide-log-out class="size-4" aria-hidden="true" />
                    <span class="hidden sm:inline">{{ __('admin.logout') }}</span>
                </button>
            </form>
        </div>
    </header>

    <div class="grid grid-cols-1 gap-6 lg:grid-cols-4">

        {{-- Sidebar --}}
        <nav class="h-fit space-y-1 rounded-3xl border border-slate-200 bg-white p-4 shadow-xs lg:col-span-1"
             aria-label="{{ __('admin.sections_heading') }}">
            <p class="mb-2 block px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                {{ __('admin.sections_heading') }}
            </p>

            @foreach ($sections as $key => $meta)
                @php
                    $allowed = $admin->canOpenSection($key);
                    $active = ($section ?? null) === $key;
                @endphp

                <a href="{{ $allowed ? route($meta['route']) : '#' }}"
                   @if (! $allowed) aria-disabled="true" tabindex="-1" @endif
                   @if ($active) aria-current="page" @endif
                   class="{{ $active
                        ? 'bg-saudi-700 text-white shadow-md'
                        : ($allowed ? 'text-slate-700 hover:bg-slate-50 hover:text-slate-900' : 'cursor-not-allowed text-slate-400 opacity-60') }} flex w-full items-center justify-between rounded-2xl p-3 text-xs font-bold transition">
                    <span class="flex items-center gap-2.5">
                        <x-dynamic-component :component="'lucide-'.$meta['icon']" class="size-4 shrink-0" aria-hidden="true" />
                        <span>{{ __('admin.nav.'.$key) }}</span>
                    </span>

                    @unless ($allowed)
                        <x-lucide-lock class="size-3.5 text-slate-400" aria-hidden="true" />
                    @endunless
                </a>
            @endforeach

            @unless ($admin->canEditContent())
                <p class="mt-3 flex items-start gap-2 rounded-2xl border border-amber-200 bg-amber-50 p-3 text-[11px] leading-relaxed text-amber-900">
                    <x-lucide-eye class="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
                    <span>{{ __('admin.read_only_notice') }}</span>
                </p>
            @endunless
        </nav>

        {{-- Content --}}
        <div class="space-y-6 lg:col-span-3">
            @if (session('status'))
                <div class="flex items-start gap-3 rounded-2xl border border-saudi-200 bg-saudi-50 p-4 text-sm text-saudi-900" role="status">
                    <x-lucide-circle-check class="mt-0.5 size-5 shrink-0 text-saudi-600" aria-hidden="true" />
                    <p class="font-semibold">{{ session('status') }}</p>
                </div>
            @endif

            @if ($errors->any())
                <div class="space-y-1 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs text-rose-800" role="alert">
                    <p class="flex items-center gap-2 font-bold">
                        <x-lucide-circle-alert class="size-4 shrink-0" aria-hidden="true" />
                        {{ __('common.error') }}
                    </p>
                    <ul class="list-disc space-y-0.5 ps-5">
                        @foreach ($errors->all() as $message)
                            <li>{{ $message }}</li>
                        @endforeach
                    </ul>
                </div>
            @endif

            @yield('content')
        </div>
    </div>
</div>
</body>
</html>
