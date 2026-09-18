@extends('layouts.admin')

@section('title', __('admin.universities.title'))

@php $section = 'universities'; @endphp

@section('content')
    <x-admin.panel icon="building-2" :title="__('admin.universities.title')" :subtitle="__('admin.universities.subtitle')">
        @permission('universities:write')
            <x-slot:actions>
                <a href="{{ route('admin.universities.create') }}"
                   class="flex items-center gap-1.5 rounded-xl bg-saudi-700 px-4 py-2 text-xs font-bold text-white transition hover:bg-saudi-800">
                    <x-lucide-plus class="size-3.5" aria-hidden="true" />
                    <span>{{ __('admin.universities.create') }}</span>
                </a>
            </x-slot:actions>
        @endpermission

        <form method="get" class="grid grid-cols-1 gap-3 rounded-2xl border border-slate-200 bg-slate-50/60 p-4 sm:grid-cols-2 lg:grid-cols-5">
            <label class="lg:col-span-2">
                <span class="mb-1 block text-[11px] font-bold text-slate-600">{{ __('common.search') }}</span>
                <x-admin.input type="search" name="q" value="{{ $filters['q'] }}" placeholder="{{ __('universities.search_placeholder') }}" />
            </label>

            <label>
                <span class="mb-1 block text-[11px] font-bold text-slate-600">{{ __('catalog.filters.country') }}</span>
                <x-admin.select name="country">
                    <option value="all">{{ __('catalog.filters.all_countries') }}</option>
                    @foreach ($countries as $country)
                        <option value="{{ $country->code }}" @selected($filters['country'] === $country->code)>{{ $country->name }}</option>
                    @endforeach
                </x-admin.select>
            </label>

            <label>
                <span class="mb-1 block text-[11px] font-bold text-slate-600">{{ __('catalog.filters.track') }}</span>
                <x-admin.select name="track">
                    <option value="all">{{ __('catalog.filters.all_tracks') }}</option>
                    @foreach ($tracks as $track)
                        <option value="{{ $track->id }}" @selected($filters['track'] === $track->id)>{{ $track->name }}</option>
                    @endforeach
                </x-admin.select>
            </label>

            <div class="flex items-end gap-2">
                <button type="submit" class="flex-1 rounded-xl bg-saudi-700 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-saudi-800">
                    {{ __('catalog.filters.apply') }}
                </button>
                <a href="{{ route('admin.universities.index') }}"
                   class="rounded-xl border border-slate-300 px-3 py-2.5 text-xs font-bold text-slate-600 transition hover:bg-white">
                    {{ __('catalog.filters.reset') }}
                </a>
            </div>
        </form>

        <div class="overflow-x-auto">
            <table class="w-full text-start text-xs">
                <caption class="sr-only">{{ __('admin.universities.title') }}</caption>
                <thead class="bg-slate-50 text-[11px] uppercase tracking-wide text-slate-500">
                    <tr>
                        <th scope="col" class="px-4 py-3 text-start font-bold">{{ __('catalog.university.rank') }}</th>
                        <th scope="col" class="px-4 py-3 text-start font-bold">{{ __('common.name') }}</th>
                        <th scope="col" class="hidden px-4 py-3 text-start font-bold sm:table-cell">{{ __('catalog.university.country') }}</th>
                        <th scope="col" class="hidden px-4 py-3 text-start font-bold lg:table-cell">{{ __('catalog.university.accredited_tracks') }}</th>
                        <th scope="col" class="px-4 py-3 text-start font-bold">{{ __('common.status') }}</th>
                        <th scope="col" class="px-4 py-3 text-start font-bold">{{ __('common.actions') }}</th>
                    </tr>
                </thead>

                <tbody class="divide-y divide-slate-100">
                    @forelse ($universities as $university)
                        <tr class="transition hover:bg-slate-50/70">
                            <td class="numeric px-4 py-3 font-bold text-sand-500">#{{ $university->qs_rank }}</td>

                            <td class="px-4 py-3">
                                <a href="{{ route('admin.universities.edit', $university) }}" class="block font-bold text-slate-900 transition hover:text-saudi-700">
                                    {{ $university->name_ar }}
                                </a>
                                <span class="block text-[11px] text-slate-500" dir="ltr">{{ $university->name_en }}</span>
                            </td>

                            <td class="hidden px-4 py-3 text-slate-600 sm:table-cell">{{ $university->country }}</td>

                            <td class="hidden px-4 py-3 lg:table-cell">
                                <span class="flex flex-wrap gap-1">
                                    @foreach ($university->tracks->take(2) as $track)
                                        <x-badge tone="saudi">{{ $track->name }}</x-badge>
                                    @endforeach
                                    @if ($university->tracks->count() > 2)
                                        <span class="self-center text-[10px] text-slate-400">+{{ $university->tracks->count() - 2 }}</span>
                                    @endif
                                </span>
                            </td>

                            <td class="px-4 py-3">
                                <x-badge :tone="$university->is_active ? 'saudi' : 'slate'">
                                    {{ $university->is_active ? __('common.active') : __('common.inactive') }}
                                </x-badge>
                            </td>

                            <td class="px-4 py-3">
                                <div class="flex items-center gap-2">
                                    <a href="{{ route('admin.universities.edit', $university) }}"
                                       class="flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-50">
                                        <x-lucide-pencil class="size-3.5" aria-hidden="true" />
                                        <span>{{ auth()->user()->hasPermission('universities:write') ? __('common.edit') : __('common.view') }}</span>
                                    </a>

                                    @permission('universities:write')
                                        <x-admin.delete-button :action="route('admin.universities.destroy', $university)" label="" />
                                    @endpermission
                                </div>
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="6" class="px-4 py-10 text-center text-xs text-slate-400">{{ __('catalog.filters.empty') }}</td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>

        {{ $universities->links() }}
    </x-admin.panel>
@endsection
