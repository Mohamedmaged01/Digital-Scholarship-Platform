@extends('layouts.public')

@section('title', __('common.not_found_title'))

@section('content')
    <div class="mx-auto flex max-w-2xl flex-col items-center gap-6 px-4 py-20 text-center sm:px-6">
        <span class="flex size-20 items-center justify-center rounded-3xl border border-slate-200 bg-white text-slate-400 shadow-sm">
            <x-lucide-compass class="size-10" aria-hidden="true" />
        </span>

        <div class="space-y-2">
            <p class="numeric text-sm font-bold text-saudi-700">404</p>
            <h1 class="heading-section text-slate-900">{{ __('common.not_found_title') }}</h1>
            <p class="text-sm leading-relaxed text-slate-600">{{ __('common.not_found_body') }}</p>
        </div>

        <div class="flex flex-wrap items-center justify-center gap-3">
            <a href="{{ route('home') }}"
               class="flex items-center gap-2 rounded-xl bg-saudi-700 px-5 py-2.5 text-xs font-bold text-white transition hover:bg-saudi-800">
                <x-lucide-house class="size-4" aria-hidden="true" />
                <span>{{ __('common.return_to_home') }}</span>
            </a>

            <a href="{{ route('search') }}"
               class="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-bold text-slate-700 transition hover:bg-slate-50">
                <x-lucide-search class="size-4" aria-hidden="true" />
                <span>{{ __('common.search') }}</span>
            </a>
        </div>
    </div>
@endsection
