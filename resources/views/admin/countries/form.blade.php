@extends('layouts.admin')

@section('title', __('admin.countries.edit'))

@php
    $section = 'countries';
    $canEdit = auth()->user()->hasPermission('universities:write');
@endphp

@section('content')
    <nav class="flex items-center gap-2 text-xs text-slate-500">
        <a href="{{ route('admin.countries.index') }}" class="transition hover:text-saudi-700">{{ __('admin.nav.countries') }}</a>
        <x-lucide-chevron-right class="size-3 flip-rtl" aria-hidden="true" />
        <span class="font-bold text-slate-700">{{ $country->name_ar }}</span>
    </nav>

    <form method="post" action="{{ route('admin.countries.update', $country) }}" class="space-y-6">
        @csrf
        @method('PUT')

        <x-admin.panel icon="globe" :title="$country->flag_emoji.' '.$country->name_ar">
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <x-admin.field :label="__('common.name').' — '.__('common.arabic')" name="name_ar" required>
                    <x-admin.input name="name_ar" value="{{ old('name_ar', $country->name_ar) }}" required :disabled="! $canEdit" />
                </x-admin.field>

                <x-admin.field :label="__('common.name').' — '.__('common.english')" name="name_en" required>
                    <x-admin.input name="name_en" value="{{ old('name_en', $country->name_en) }}" required dir="ltr" :disabled="! $canEdit" />
                </x-admin.field>

                <x-admin.field label="Flag emoji" name="flag_emoji">
                    <x-admin.input name="flag_emoji" value="{{ old('flag_emoji', $country->flag_emoji) }}" :disabled="! $canEdit" />
                </x-admin.field>

                <x-admin.field :label="__('catalog.country.language')" name="primary_language">
                    <x-admin.input name="primary_language" value="{{ old('primary_language', $country->primary_language) }}" dir="ltr" :disabled="! $canEdit" />
                </x-admin.field>

                <x-admin.field :label="__('catalog.country.region').' — '.__('common.arabic')" name="region_ar">
                    <x-admin.input name="region_ar" value="{{ old('region_ar', $country->region_ar) }}" :disabled="! $canEdit" />
                </x-admin.field>

                <x-admin.field :label="__('catalog.country.region').' — '.__('common.english')" name="region_en">
                    <x-admin.input name="region_en" value="{{ old('region_en', $country->region_en) }}" dir="ltr" :disabled="! $canEdit" />
                </x-admin.field>

                <x-admin.field :label="__('catalog.country.mission_city').' — '.__('common.arabic')" name="cultural_mission_city_ar">
                    <x-admin.input name="cultural_mission_city_ar" value="{{ old('cultural_mission_city_ar', $country->cultural_mission_city_ar) }}" :disabled="! $canEdit" />
                </x-admin.field>

                <x-admin.field :label="__('catalog.country.mission_city').' — '.__('common.english')" name="cultural_mission_city_en">
                    <x-admin.input name="cultural_mission_city_en" value="{{ old('cultural_mission_city_en', $country->cultural_mission_city_en) }}" dir="ltr" :disabled="! $canEdit" />
                </x-admin.field>

                <x-admin.field :label="app()->getLocale() === 'ar' ? 'مدة معالجة التأشيرة (أيام)' : 'Visa processing days'" name="visa_processing_days" required>
                    <x-admin.input type="number" name="visa_processing_days" value="{{ old('visa_processing_days', $country->visa_processing_days) }}"
                                   min="1" max="365" required :disabled="! $canEdit" />
                </x-admin.field>

                <x-admin.field label="Image URL" name="image_url">
                    <x-admin.input name="image_url" value="{{ old('image_url', $country->image_url) }}" dir="ltr" :disabled="! $canEdit" />
                </x-admin.field>
            </div>

            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <x-admin.field :label="__('catalog.country.visa').' — '.__('common.arabic')" name="visa_overview_ar">
                    <x-admin.textarea name="visa_overview_ar" rows="5" :disabled="! $canEdit">{{ old('visa_overview_ar', $country->visa_overview_ar) }}</x-admin.textarea>
                </x-admin.field>

                <x-admin.field :label="__('catalog.country.visa').' — '.__('common.english')" name="visa_overview_en">
                    <x-admin.textarea name="visa_overview_en" rows="5" dir="ltr" :disabled="! $canEdit">{{ old('visa_overview_en', $country->visa_overview_en) }}</x-admin.textarea>
                </x-admin.field>
            </div>

            <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <x-admin.toggle name="is_active" :label="__('common.active')" :checked="(bool) old('is_active', $country->is_active)" />
                <x-admin.toggle name="is_popular" :label="app()->getLocale() === 'ar' ? 'وجهة رائجة' : 'Popular destination'"
                                :checked="(bool) old('is_popular', $country->is_popular)" />
            </div>

            <p class="flex items-start gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-3 text-[11px] text-slate-600">
                <x-lucide-info class="mt-0.5 size-3.5 shrink-0 text-slate-400" aria-hidden="true" />
                <span>
                    {{ __('catalog.country.universities_count') }}:
                    <span class="numeric font-bold text-slate-800">{{ $country->universities()->count() }}</span> —
                    {{ app()->getLocale() === 'ar'
                        ? 'يُحدَّث هذا الرقم تلقائياً من دليل الجامعات عند الحفظ.'
                        : 'This figure is recalculated from the universities directory on save.' }}
                </span>
            </p>
        </x-admin.panel>

        @if ($missions->isNotEmpty())
            <x-admin.panel icon="building-2" :title="__('admin.countries.missions')">
                <ul class="space-y-2">
                    @foreach ($missions as $mission)
                        <li class="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 p-4 text-xs">
                            <div>
                                <p class="font-bold text-slate-900">{{ $mission->title_ar }}</p>
                                <p class="text-[11px] text-slate-500">{{ $mission->city_ar }} · {{ $mission->attache_name_ar }}</p>
                            </div>
                            <span class="numeric text-[11px] font-bold text-slate-600">{{ $mission->phone }}</span>
                        </li>
                    @endforeach
                </ul>
            </x-admin.panel>
        @endif

        @if ($canEdit)
            <div class="flex items-center justify-end gap-3">
                <a href="{{ route('admin.countries.index') }}"
                   class="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-600 transition hover:bg-slate-50">
                    {{ __('common.cancel') }}
                </a>
                <x-admin.submit>{{ __('common.update') }}</x-admin.submit>
            </div>
        @endif
    </form>
@endsection
