@extends('layouts.admin')

@section('title', __('admin.tracks.title'))

@php $section = 'tracks'; @endphp

@section('content')
    <x-admin.panel icon="award" :title="__('admin.tracks.title')" :subtitle="__('admin.tracks.subtitle')">
        @permission('tracks:write')
            <x-slot:actions>
                <a href="{{ route('admin.tracks.create') }}"
                   class="flex items-center gap-1.5 rounded-xl bg-saudi-700 px-4 py-2 text-xs font-bold text-white transition hover:bg-saudi-800">
                    <x-lucide-plus class="size-3.5" aria-hidden="true" />
                    <span>{{ __('admin.tracks.create') }}</span>
                </a>
            </x-slot:actions>
        @endpermission

        <div class="overflow-x-auto">
            <table class="w-full text-start text-xs">
                <caption class="sr-only">{{ __('admin.tracks.title') }}</caption>
                <thead class="bg-slate-50 text-[11px] uppercase tracking-wide text-slate-500">
                    <tr>
                        <th scope="col" class="rounded-s-xl px-4 py-3 text-start font-bold">{{ __('common.order') }}</th>
                        <th scope="col" class="px-4 py-3 text-start font-bold">{{ __('common.name') }}</th>
                        <th scope="col" class="hidden px-4 py-3 text-start font-bold sm:table-cell">{{ __('catalog.track.min_gpa') }}</th>
                        <th scope="col" class="hidden px-4 py-3 text-start font-bold md:table-cell">{{ __('catalog.track.rank_limit') }}</th>
                        <th scope="col" class="hidden px-4 py-3 text-start font-bold lg:table-cell">{{ __('catalog.track.utilisation') }}</th>
                        <th scope="col" class="px-4 py-3 text-start font-bold">{{ __('common.status') }}</th>
                        <th scope="col" class="rounded-e-xl px-4 py-3 text-start font-bold">{{ __('common.actions') }}</th>
                    </tr>
                </thead>

                <tbody class="divide-y divide-slate-100">
                    @foreach ($tracks as $track)
                        <tr class="transition hover:bg-slate-50/70">
                            <td class="numeric px-4 py-3 font-bold text-slate-400">{{ $track->displayNumber() }}</td>

                            <td class="px-4 py-3">
                                <div class="flex items-center gap-2.5">
                                    <span class="flex size-8 shrink-0 items-center justify-center rounded-lg bg-saudi-50 text-saudi-700">
                                        <x-dynamic-component :component="'lucide-'.$track->icon_name" class="size-4" aria-hidden="true" />
                                    </span>
                                    <span>
                                        <a href="{{ route('admin.tracks.edit', $track) }}" class="block font-bold text-slate-900 transition hover:text-saudi-700">
                                            {{ $track->name_ar }}
                                        </a>
                                        <span class="block text-[11px] text-slate-500" dir="ltr">{{ $track->name_en }} · {{ $track->code }}</span>
                                    </span>
                                </div>
                            </td>

                            <td class="numeric hidden px-4 py-3 text-slate-700 sm:table-cell">
                                {{ rtrim(rtrim(number_format($track->min_gpa, 2), '0'), '.') }} / 5.0
                            </td>

                            <td class="numeric hidden px-4 py-3 text-slate-700 md:table-cell">
                                {{ __('tracks.top_label') }} {{ $track->top_universities_rank_limit }}
                            </td>

                            <td class="hidden px-4 py-3 lg:table-cell">
                                <div class="flex items-center gap-2">
                                    <div class="h-1.5 w-20 overflow-hidden rounded-full bg-slate-100">
                                        <div class="h-full rounded-full bg-saudi-600" style="width: {{ min(100, $track->seatUtilisation()) }}%"></div>
                                    </div>
                                    <span class="numeric text-[11px] font-bold text-slate-600">{{ $track->seatUtilisation() }}%</span>
                                </div>
                            </td>

                            <td class="px-4 py-3">
                                <x-badge :tone="$track->is_active && $track->is_published ? 'saudi' : 'slate'">
                                    {{ $track->is_active && $track->is_published ? __('common.published') : __('common.draft') }}
                                </x-badge>
                            </td>

                            <td class="px-4 py-3">
                                <div class="flex items-center gap-2">
                                    <a href="{{ route('admin.tracks.edit', $track) }}"
                                       class="flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-50">
                                        <x-lucide-pencil class="size-3.5" aria-hidden="true" />
                                        <span>{{ auth()->user()->hasPermission('tracks:write') ? __('common.edit') : __('common.view') }}</span>
                                    </a>

                                    <a href="{{ route('tracks.show', $track) }}" target="_blank" rel="noopener"
                                       class="rounded-xl border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-50 hover:text-saudi-700"
                                       title="{{ __('admin.tracks.preview') }}" aria-label="{{ __('admin.tracks.preview') }}">
                                        <x-lucide-external-link class="size-3.5" aria-hidden="true" />
                                    </a>

                                    @permission('tracks:write')
                                        <x-admin.delete-button :action="route('admin.tracks.destroy', $track)" label="" />
                                    @endpermission
                                </div>
                            </td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
    </x-admin.panel>
@endsection
