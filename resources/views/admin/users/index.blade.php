@extends('layouts.admin')

@section('title', __('admin.users.title'))

@php $section = 'users'; @endphp

@section('content')
    <x-admin.panel icon="users" :title="__('admin.users.title')" :subtitle="__('admin.users.subtitle')">
        <x-slot:actions>
            <a href="{{ route('admin.users.create') }}"
               class="flex items-center gap-1.5 rounded-xl bg-saudi-700 px-4 py-2 text-xs font-bold text-white transition hover:bg-saudi-800">
                <x-lucide-plus class="size-3.5" aria-hidden="true" />
                <span>{{ __('admin.users.create') }}</span>
            </a>
        </x-slot:actions>

        <div class="overflow-x-auto">
            <table class="w-full text-start text-xs">
                <caption class="sr-only">{{ __('admin.users.title') }}</caption>
                <thead class="bg-slate-50 text-[11px] uppercase tracking-wide text-slate-500">
                    <tr>
                        <th scope="col" class="px-4 py-3 text-start font-bold">{{ __('common.name') }}</th>
                        <th scope="col" class="px-4 py-3 text-start font-bold">{{ __('admin.users.role') }}</th>
                        <th scope="col" class="hidden px-4 py-3 text-start font-bold lg:table-cell">{{ __('admin.users.permissions') }}</th>
                        <th scope="col" class="hidden px-4 py-3 text-start font-bold sm:table-cell">{{ __('admin.users.last_login') }}</th>
                        <th scope="col" class="px-4 py-3 text-start font-bold">{{ __('common.status') }}</th>
                        <th scope="col" class="px-4 py-3 text-start font-bold">{{ __('common.actions') }}</th>
                    </tr>
                </thead>

                <tbody class="divide-y divide-slate-100">
                    @foreach ($users as $user)
                        <tr class="transition hover:bg-slate-50/70">
                            <td class="px-4 py-3">
                                <div class="flex items-center gap-2.5">
                                    @if (filled($user->avatar_url))
                                        <img src="{{ $user->avatar_url }}" alt="" width="32" height="32"
                                             class="size-8 shrink-0 rounded-lg object-cover" referrerpolicy="no-referrer" loading="lazy">
                                    @else
                                        <span class="flex size-8 shrink-0 items-center justify-center rounded-lg bg-saudi-50 text-[11px] font-bold text-saudi-700">
                                            {{ $user->initials() }}
                                        </span>
                                    @endif

                                    <span>
                                        <span class="block font-bold text-slate-900">{{ $user->full_name_ar }}</span>
                                        <code class="block text-[11px] text-slate-500">{{ $user->username }}</code>
                                    </span>
                                </div>
                            </td>

                            <td class="px-4 py-3">
                                <x-badge :tone="$user->isSuperAdmin() ? 'saudi' : 'slate'">{{ $user->role }}</x-badge>
                                <span class="mt-1 block text-[11px] text-slate-500">{{ $user->department }}</span>
                            </td>

                            <td class="hidden px-4 py-3 lg:table-cell">
                                @if ($user->isSuperAdmin())
                                    <span class="text-[11px] font-bold text-saudi-700">{{ __('admin.users.permissions_hint') }}</span>
                                @else
                                    <span class="flex flex-wrap gap-1">
                                        @foreach (array_slice($user->permissions ?? [], 0, 3) as $permission)
                                            <code class="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-600">{{ $permission }}</code>
                                        @endforeach
                                        @if (count($user->permissions ?? []) > 3)
                                            <span class="self-center text-[10px] text-slate-400">+{{ count($user->permissions) - 3 }}</span>
                                        @endif
                                    </span>
                                @endif
                            </td>

                            <td class="numeric hidden px-4 py-3 text-slate-500 sm:table-cell">
                                {{ $user->last_login_at?->diffForHumans() ?? __('admin.users.never') }}
                            </td>

                            <td class="px-4 py-3">
                                <x-badge :tone="$user->is_active ? 'emerald' : 'rose'">
                                    {{ $user->is_active ? __('common.active') : __('common.inactive') }}
                                </x-badge>
                                @if ($user->isLocked())
                                    <x-badge tone="amber" icon="lock">{{ __('common.pending') }}</x-badge>
                                @endif
                            </td>

                            <td class="px-4 py-3">
                                <div class="flex items-center gap-2">
                                    <a href="{{ route('admin.users.edit', $user) }}"
                                       class="flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-50">
                                        <x-lucide-pencil class="size-3.5" aria-hidden="true" />
                                        <span>{{ __('common.edit') }}</span>
                                    </a>

                                    @unless ($user->is(auth()->user()))
                                        <x-admin.delete-button :action="route('admin.users.destroy', $user)" label="" />
                                    @endunless
                                </div>
                            </td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
    </x-admin.panel>

    <x-admin.panel icon="shield-check" :title="__('admin.users.matrix')" :subtitle="__('admin.login.roles_intro')">
        <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
            @foreach ($roles as $role => $meta)
                <div class="space-y-2 rounded-2xl border border-slate-200 p-4">
                    <div class="flex items-center justify-between gap-2">
                        <h3 class="text-xs font-bold text-slate-900">{{ app()->getLocale() === 'ar' ? $meta['label_ar'] : $meta['label_en'] }}</h3>
                        <code class="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-600">{{ $role }}</code>
                    </div>

                    <div class="flex flex-wrap gap-1">
                        @foreach ($meta['sections'] as $sectionKey)
                            <span class="rounded border border-saudi-100 bg-saudi-50 px-1.5 py-0.5 text-[10px] font-medium text-saudi-700">
                                {{ __('admin.nav.'.$sectionKey) }}
                            </span>
                        @endforeach
                    </div>

                    <ul class="flex flex-wrap gap-2 border-t border-slate-100 pt-2 text-[10.5px] text-slate-500">
                        <li>{{ __('common.edit') }}: <span class="font-bold {{ $meta['can_edit'] ? 'text-saudi-700' : 'text-rose-600' }}">{{ $meta['can_edit'] ? __('common.yes') : __('common.no') }}</span></li>
                        <li>{{ __('admin.news.publish') }}: <span class="font-bold {{ $meta['can_publish'] ? 'text-saudi-700' : 'text-rose-600' }}">{{ $meta['can_publish'] ? __('common.yes') : __('common.no') }}</span></li>
                        <li>{{ __('admin.nav.users') }}: <span class="font-bold {{ $meta['can_manage_users'] ? 'text-saudi-700' : 'text-rose-600' }}">{{ $meta['can_manage_users'] ? __('common.yes') : __('common.no') }}</span></li>
                    </ul>
                </div>
            @endforeach
        </div>
    </x-admin.panel>
@endsection
