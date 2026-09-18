@php
    $locale = app()->getLocale();
    $direction = config("kasp.locales.{$locale}.dir", 'rtl');
@endphp
<!DOCTYPE html>
<html lang="{{ $locale }}" dir="{{ $direction }}" class="h-full">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="robots" content="noindex, nofollow">
    <title>{{ __('admin.login.title') }}</title>

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&family=IBM+Plex+Sans:wght@400;500;600;700&display=swap">

    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body class="min-h-full bg-canvas text-slate-900 antialiased">
<div class="mx-auto flex min-h-screen max-w-5xl flex-col justify-center px-4 py-8 sm:px-6 lg:px-8">

    <div class="mb-6 flex flex-wrap items-center justify-between gap-3">
        <a href="{{ route('home') }}"
           class="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-600 shadow-xs transition hover:border-saudi-700/40 hover:text-saudi-700">
            <x-lucide-arrow-left class="size-4 flip-rtl" aria-hidden="true" />
            <span>{{ __('admin.login.return_public') }}</span>
        </a>

        <p class="inline-flex items-center gap-2 rounded-xl border border-sand-200 bg-sand-100 px-3 py-1.5 text-xs font-semibold text-sand-500">
            <x-lucide-shield-check class="size-4 shrink-0" aria-hidden="true" />
            <span>{{ __('admin.login.staff_only') }}</span>
        </p>
    </div>

    <div class="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">

        {{-- Sign-in card --}}
        <div class="overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-xl lg:col-span-7">
            <header class="relative bg-gradient-to-l from-slate-900 via-slate-800 to-saudi-900 p-6 text-white">
                <div class="flex items-center justify-between">
                    <span class="flex size-12 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-saudi-400">
                        <x-lucide-lock class="size-6" aria-hidden="true" />
                    </span>
                    <span class="rounded-full border border-saudi-500/30 bg-saudi-950/60 px-2.5 py-1 text-[11px] font-bold uppercase tracking-widest text-saudi-300">
                        {{ __('admin.login.security_badge') }}
                    </span>
                </div>

                <h1 class="mt-4 text-xl font-black text-white sm:text-2xl">{{ __('admin.login.title') }}</h1>
                <p class="mt-1 text-xs leading-relaxed text-slate-300">{{ __('admin.login.subtitle') }}</p>
            </header>

            <div class="space-y-6 p-6 sm:p-8">

                <aside class="flex items-start gap-3 rounded-2xl border border-saudi-200 bg-saudi-50/70 p-4">
                    <x-lucide-info class="mt-0.5 size-5 shrink-0 text-saudi-700" aria-hidden="true" />
                    <div class="space-y-1 text-xs">
                        <p class="font-bold text-saudi-950">{{ __('admin.login.applicant_notice_title') }}</p>
                        <p class="text-saudi-800">{{ __('admin.login.applicant_notice_body') }}</p>
                        <a href="{{ config('kasp.apply_url') }}" target="_blank" rel="noopener"
                           class="inline-flex items-center gap-1.5 font-extrabold text-saudi-700 hover:underline">
                            <span>{{ __('admin.login.applicant_notice_link') }}</span>
                            <x-lucide-external-link class="size-3.5" aria-hidden="true" />
                        </a>
                    </div>
                </aside>

                @if ($errors->any())
                    <div class="flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4" role="alert">
                        <x-lucide-circle-alert class="mt-0.5 size-5 shrink-0 text-rose-600" aria-hidden="true" />
                        <div>
                            <h2 class="text-xs font-bold text-rose-900">{{ __('common.error') }}</h2>
                            <ul class="mt-0.5 space-y-0.5 text-xs text-rose-700">
                                @foreach ($errors->all() as $message)
                                    <li>{{ $message }}</li>
                                @endforeach
                            </ul>
                        </div>
                    </div>
                @endif

                <form method="post" action="{{ route('admin.login.attempt') }}" class="space-y-4" x-data="{ reveal: false }">
                    @csrf

                    <x-admin.field :label="__('admin.login.identifier')" name="identifier" required>
                        <span class="relative block">
                            <x-lucide-user class="pointer-events-none absolute inset-y-0 start-3.5 my-auto size-4 text-slate-400" aria-hidden="true" />
                            <x-admin.input name="identifier" value="{{ old('identifier') }}" required autofocus dir="ltr"
                                           autocomplete="username"
                                           placeholder="{{ __('admin.login.identifier_placeholder') }}"
                                           class="ps-10" />
                        </span>
                    </x-admin.field>

                    <x-admin.field :label="__('admin.login.password')" name="password" required>
                        <span class="relative block">
                            <x-lucide-key-round class="pointer-events-none absolute inset-y-0 start-3.5 my-auto size-4 text-slate-400" aria-hidden="true" />
                            <input :type="reveal ? 'text' : 'password'" name="password" required dir="ltr"
                                   autocomplete="current-password" placeholder="••••••••••••"
                                   class="w-full rounded-xl border border-slate-300 py-2.5 pe-11 ps-10 text-xs text-slate-900 transition focus:border-saudi-600 focus:ring-2 focus:ring-saudi-600/20">
                            <button type="button" @click="reveal = !reveal"
                                    class="absolute inset-y-0 end-0 flex items-center pe-3.5 text-slate-400 transition hover:text-slate-600"
                                    :aria-label="reveal ? @js(__('common.close')) : @js(__('common.view'))">
                                <x-lucide-eye class="size-4" x-show="!reveal" aria-hidden="true" />
                                <x-lucide-eye-off class="size-4" x-show="reveal" x-cloak aria-hidden="true" />
                            </button>
                        </span>
                    </x-admin.field>

                    <div class="flex items-center justify-between pt-1 text-xs">
                        <label class="flex cursor-pointer select-none items-center gap-2 text-slate-600">
                            <input type="checkbox" name="remember" value="1" @checked(old('remember'))
                                   class="size-4 rounded border-slate-300 text-saudi-700 focus:ring-saudi-600">
                            <span>{{ __('admin.login.remember') }}</span>
                        </label>

                        <span class="text-[11px] text-slate-400">{{ __('admin.login.security_badge') }}</span>
                    </div>

                    <button type="submit"
                            class="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-saudi-700 px-4 py-3 text-xs font-bold text-white shadow-md transition hover:bg-saudi-800">
                        <x-lucide-shield-check class="size-4" aria-hidden="true" />
                        <span>{{ __('admin.login.submit') }}</span>
                    </button>
                </form>
            </div>
        </div>

        {{-- Roles matrix: what each role can open, for the staff being onboarded --}}
        <aside class="space-y-4 lg:col-span-5">
            <section class="space-y-3 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <header class="space-y-1">
                    <h2 class="flex items-center gap-2 text-xs font-bold text-slate-900">
                        <x-lucide-shield class="size-4 text-saudi-700" aria-hidden="true" />
                        {{ __('admin.login.roles_heading') }}
                    </h2>
                    <p class="text-[11px] leading-relaxed text-slate-500">{{ __('admin.login.roles_intro') }}</p>
                </header>

                <ul class="space-y-2">
                    @foreach ($roles as $role => $meta)
                        <li class="rounded-2xl border border-slate-200 p-3">
                            <div class="flex items-center justify-between gap-2">
                                <span class="text-xs font-bold text-slate-900">{{ app()->getLocale() === 'ar' ? $meta['label_ar'] : $meta['label_en'] }}</span>
                                <code class="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-600">{{ $role }}</code>
                            </div>

                            <div class="mt-1.5 flex flex-wrap gap-1">
                                @foreach ($meta['sections'] as $sectionKey)
                                    <span class="rounded border border-saudi-100 bg-saudi-50 px-1.5 py-0.5 text-[10px] font-medium text-saudi-700">
                                        {{ __('admin.nav.'.$sectionKey) }}
                                    </span>
                                @endforeach
                            </div>
                        </li>
                    @endforeach
                </ul>
            </section>

            <section class="space-y-2 rounded-3xl border border-slate-800 bg-slate-900 p-5 text-white shadow-md">
                <h2 class="flex items-center gap-2 text-xs font-bold">
                    <x-lucide-shield-check class="size-4 text-saudi-400" aria-hidden="true" />
                    {{ __('admin.login.security_badge') }}
                </h2>
                <ul class="space-y-1.5 text-[11px] leading-relaxed text-slate-300">
                    <li class="flex items-start gap-2">
                        <x-lucide-check class="mt-0.5 size-3 shrink-0 text-saudi-400" aria-hidden="true" />
                        <span>{{ app()->getLocale() === 'ar'
                            ? 'كلمات المرور مخزنة بتجزئة bcrypt ولا يمكن استرجاعها.'
                            : 'Passwords are stored as bcrypt hashes and cannot be recovered.' }}</span>
                    </li>
                    <li class="flex items-start gap-2">
                        <x-lucide-check class="mt-0.5 size-3 shrink-0 text-saudi-400" aria-hidden="true" />
                        <span>{{ app()->getLocale() === 'ar'
                            ? 'يُقفل الحساب مؤقتاً بعد '.config('kasp.security.max_failed_logins').' محاولات دخول فاشلة.'
                            : 'Accounts lock temporarily after '.config('kasp.security.max_failed_logins').' failed attempts.' }}</span>
                    </li>
                    <li class="flex items-start gap-2">
                        <x-lucide-check class="mt-0.5 size-3 shrink-0 text-saudi-400" aria-hidden="true" />
                        <span>{{ app()->getLocale() === 'ar'
                            ? 'كل عملية إدارية تُسجَّل في سجل التدقيق غير القابل للتعديل.'
                            : 'Every administrative write lands in the append-only audit log.' }}</span>
                    </li>
                </ul>
            </section>
        </aside>
    </div>
</div>
</body>
</html>
