@extends('layouts.public')

@section('title', __('pages.tracks.title'))
@section('description', __('pages.tracks.subtitle'))

@section('content')
    <div class="mx-auto max-w-7xl space-y-8 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">

        <x-page-hero icon="compass"
                     :eyebrow="__('pages.tracks.eyebrow')"
                     :title="__('pages.tracks.title')"
                     :subtitle="__('pages.tracks.subtitle')" />

        <form method="get" class="flex flex-wrap items-center gap-2 rounded-2xl border border-slate-200 bg-white p-3.5 shadow-2xs">
            <span class="px-1 text-xs font-bold text-slate-500">{{ __('catalog.filters.degree') }}:</span>

            @foreach ($degreeOptions as $value => $label)
                <button type="submit" name="degree" value="{{ $value }}"
                        class="{{ $degree === $value ? 'bg-saudi-700 text-white shadow-2xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200' }} rounded-xl px-3.5 py-2 text-xs font-bold transition">
                    {{ $label }}
                </button>
            @endforeach
        </form>

        @if ($tracks->isEmpty())
            <x-empty-state icon="search-x" :title="__('catalog.filters.empty')" :body="__('catalog.filters.empty_hint')">
                <a href="{{ route('tracks.index') }}" class="inline-flex items-center gap-2 rounded-xl bg-saudi-700 px-4 py-2 text-xs font-bold text-white transition hover:bg-saudi-800">
                    {{ __('catalog.filters.reset') }}
                </a>
            </x-empty-state>
        @else
            <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                @foreach ($tracks as $track)
                    <x-track-card :track="$track" />
                @endforeach
            </div>
        @endif
    </div>
@endsection
