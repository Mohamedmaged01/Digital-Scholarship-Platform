@extends('layouts.public')

@section('title', __('common.server_error_title'))

@section('content')
    <div class="mx-auto flex max-w-2xl flex-col items-center gap-6 px-4 py-20 text-center sm:px-6">
        <span class="flex size-20 items-center justify-center rounded-3xl border border-rose-200 bg-rose-50 text-rose-500 shadow-sm">
            <x-lucide-triangle-alert class="size-10" aria-hidden="true" />
        </span>

        <div class="space-y-2">
            <p class="numeric text-sm font-bold text-rose-600">500</p>
            <h1 class="heading-section text-slate-900">{{ __('common.server_error_title') }}</h1>
            <p class="text-sm leading-relaxed text-slate-600">{{ __('common.server_error_body') }}</p>
        </div>

        <div class="flex flex-wrap items-center justify-center gap-3">
            <a href="{{ route('home') }}"
               class="flex items-center gap-2 rounded-xl bg-saudi-700 px-5 py-2.5 text-xs font-bold text-white transition hover:bg-saudi-800">
                <x-lucide-house class="size-4" aria-hidden="true" />
                <span>{{ __('common.return_to_home') }}</span>
            </a>

            <a href="tel:{{ config('kasp.support.phone') }}"
               class="numeric flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-bold text-slate-700 transition hover:bg-slate-50">
                <x-lucide-phone class="size-4" aria-hidden="true" />
                <span>{{ config('kasp.support.phone') }}</span>
            </a>
        </div>
    </div>
@endsection
