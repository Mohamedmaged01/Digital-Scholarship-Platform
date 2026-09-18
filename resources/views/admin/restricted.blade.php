@extends('layouts.admin')

@section('title', __('admin.restricted_title'))

@section('content')
    <div class="space-y-4 rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-xs">
        <span class="mx-auto flex size-16 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
            <x-lucide-lock class="size-8" aria-hidden="true" />
        </span>

        <h1 class="text-lg font-bold text-slate-900">{{ __('admin.restricted_title') }}</h1>

        <p class="mx-auto max-w-md text-xs leading-relaxed text-slate-500">
            {{ __('admin.restricted_body', ['role' => auth()->user()->role.' — '.auth()->user()->roleLabel()]) }}
        </p>

        <p class="text-[11px] text-slate-400">
            {{ __('admin.sections_heading') }}:
            <span class="font-bold text-slate-600">{{ __('admin.nav.'.$section) }}</span>
        </p>

        <a href="{{ route('admin.dashboard') }}"
           class="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white transition hover:bg-slate-800">
            <x-lucide-chart-bar class="size-4" aria-hidden="true" />
            <span>{{ __('admin.nav.statistics') }}</span>
        </a>
    </div>
@endsection
