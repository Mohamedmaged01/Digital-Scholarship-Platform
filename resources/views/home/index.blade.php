@extends('layouts.public')

@section('title', __('hero.title_part1'))
@section('description', __('hero.subtitle'))

@php
    // A page block that an editor switched off in the builder is skipped here.
    $shows = fn (string $type): bool => $page?->blockEnabled($type) ?? true;
@endphp

@section('content')
    <div class="mx-auto max-w-7xl space-y-12 px-4 py-6 sm:space-y-16 sm:px-6 sm:py-8 lg:space-y-20 lg:px-8">

        @if ($shows('hero'))
            @include('home.sections.hero')
        @endif

        @include('home.sections.info-strip')

        @if ($shows('quick_services'))
            @include('home.sections.quick-services')
        @endif

        @if ($shows('tracks') || $shows('tracks_grid'))
            @include('home.sections.tracks')
        @endif

        @if ($shows('journey'))
            @include('home.sections.journey')
        @endif

        @if ($shows('strategy') || $shows('statistics'))
            @include('home.sections.strategy')
        @endif

        @if ($shows('ai_finder'))
            @include('home.sections.ai-finder')
        @endif

        @if ($shows('universities') || $shows('universities_table'))
            @include('home.sections.universities')
        @endif

        @if ($shows('news'))
            @include('home.sections.news')
        @endif

        @if ($shows('faq') || $shows('faq_accordion'))
            @include('home.sections.faq')
        @endif

        @if ($shows('cta'))
            @include('home.sections.cta')
        @endif
    </div>
@endsection
