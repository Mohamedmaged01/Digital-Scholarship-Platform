@extends('layouts.admin')

@section('title', __('admin.countries.title'))

@php $section = 'countries'; @endphp

@section('content')
    <x-admin.panel icon="globe" :title="__('admin.countries.title')" :subtitle="__('admin.countries.subtitle')">
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            @foreach ($countries as $country)
                <div class="space-y-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs">
                    <div class="flex items-start justify-between gap-3">
                        <div class="flex items-center gap-3">
                            <span class="text-2xl" aria-hidden="true">{{ $country->flag_emoji }}</span>
                            <div>
                                <h3 class="text-xs font-bold text-slate-900">{{ $country->name_ar }}</h3>
                                <span class="text-[10px] text-slate-400" dir="ltr">{{ $country->name_en }} · {{ $country->code }}</span>
                            </div>
                        </div>

                        <x-badge :tone="$country->is_active ? 'saudi' : 'slate'">
                            {{ $country->is_active ? __('common.active') : __('common.inactive') }}
                        </x-badge>
                    </div>

                    <dl class="grid grid-cols-2 gap-2 border-t border-slate-100 pt-2 text-[11px]">
                        <div>
                            <dt class="font-semibold text-slate-400">{{ __('catalog.country.region') }}</dt>
                            <dd class="font-bold text-slate-700">{{ $country->region_ar ?: '—' }}</dd>
                        </div>
                        <div>
                            <dt class="font-semibold text-slate-400">{{ __('catalog.country.universities_count') }}</dt>
                            <dd class="numeric font-bold text-saudi-700">{{ $country->universities_count }}</dd>
                        </div>
                        <div class="col-span-2">
                            <dt class="font-semibold text-slate-400">{{ __('catalog.country.mission_city') }}</dt>
                            <dd class="font-bold text-slate-700">{{ $country->cultural_mission_city_ar ?: '—' }}</dd>
                        </div>
                    </dl>

                    <a href="{{ route('admin.countries.edit', $country) }}"
                       class="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-50">
                        <x-lucide-pencil class="size-3.5" aria-hidden="true" />
                        <span>{{ auth()->user()->hasPermission('universities:write') ? __('admin.countries.edit') : __('common.view') }}</span>
                    </a>
                </div>
            @endforeach
        </div>
    </x-admin.panel>

    <x-admin.panel icon="building-2" :title="__('admin.countries.missions')">
        <div class="overflow-x-auto">
            <table class="w-full text-start text-xs">
                <caption class="sr-only">{{ __('admin.countries.missions') }}</caption>
                <thead class="bg-slate-50 text-[11px] uppercase tracking-wide text-slate-500">
                    <tr>
                        <th scope="col" class="px-4 py-3 text-start font-bold">{{ __('common.name') }}</th>
                        <th scope="col" class="hidden px-4 py-3 text-start font-bold sm:table-cell">{{ __('pages.missions.attache') }}</th>
                        <th scope="col" class="hidden px-4 py-3 text-start font-bold lg:table-cell">{{ __('pages.missions.contact') }}</th>
                        <th scope="col" class="px-4 py-3 text-start font-bold">{{ __('pages.missions.active_scholars') }}</th>
                    </tr>
                </thead>

                <tbody class="divide-y divide-slate-100">
                    @foreach ($missions as $mission)
                        <tr class="transition hover:bg-slate-50/70">
                            <td class="px-4 py-3">
                                <span class="block font-bold text-slate-900">{{ $mission->title_ar }}</span>
                                <span class="block text-[11px] text-slate-500">{{ $mission->city_ar }} · {{ $mission->code }}</span>
                            </td>
                            <td class="hidden px-4 py-3 text-slate-600 sm:table-cell">{{ $mission->attache_name_ar ?: '—' }}</td>
                            <td class="numeric hidden px-4 py-3 text-slate-600 lg:table-cell">{{ $mission->phone }}</td>
                            <td class="numeric px-4 py-3 font-bold text-saudi-700">{{ number_format($mission->active_students_count) }}</td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
    </x-admin.panel>
@endsection
