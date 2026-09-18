@extends('layouts.admin')

@section('title', $user->exists ? __('admin.users.edit') : __('admin.users.create'))

@php
    $section = 'users';
    $selectedPermissions = old('permissions', $user->permissions ?? []);
@endphp

@section('content')
    <nav class="flex items-center gap-2 text-xs text-slate-500">
        <a href="{{ route('admin.users.index') }}" class="transition hover:text-saudi-700">{{ __('admin.nav.users') }}</a>
        <x-lucide-chevron-right class="size-3 flip-rtl" aria-hidden="true" />
        <span class="font-bold text-slate-700">{{ $user->exists ? $user->full_name_ar : __('admin.users.create') }}</span>
    </nav>

    <form method="post"
          action="{{ $user->exists ? route('admin.users.update', $user) : route('admin.users.store') }}"
          class="space-y-6">
        @csrf
        @if ($user->exists)
            @method('PUT')
        @endif

        <x-admin.panel icon="user" :title="__('admin.users.title')">
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <x-admin.field :label="__('common.name').' — '.__('common.arabic')" name="full_name_ar" required>
                    <x-admin.input name="full_name_ar" value="{{ old('full_name_ar', $user->full_name_ar) }}" required />
                </x-admin.field>

                <x-admin.field :label="__('common.name').' — '.__('common.english')" name="full_name_en">
                    <x-admin.input name="full_name_en" value="{{ old('full_name_en', $user->full_name_en) }}" dir="ltr" />
                </x-admin.field>

                <x-admin.field label="Username" name="username" required hint="a-z, 0-9, . _ -">
                    <x-admin.input name="username" value="{{ old('username', $user->username) }}" required dir="ltr" autocomplete="off" />
                </x-admin.field>

                <x-admin.field :label="__('pages.help.appointment_form.email')" name="email" required>
                    <x-admin.input type="email" name="email" value="{{ old('email', $user->email) }}" required dir="ltr" autocomplete="off" />
                </x-admin.field>

                <x-admin.field :label="app()->getLocale() === 'ar' ? 'الإدارة / القطاع' : 'Department'" name="department">
                    <x-admin.input name="department" value="{{ old('department', $user->department) }}" />
                </x-admin.field>

                <x-admin.field label="Avatar URL" name="avatar_url">
                    <x-admin.input name="avatar_url" value="{{ old('avatar_url', $user->avatar_url) }}" dir="ltr" />
                </x-admin.field>
            </div>
        </x-admin.panel>

        <x-admin.panel icon="shield-check" :title="__('admin.users.role')" :subtitle="__('admin.users.permissions_hint')">
            <x-admin.field :label="__('admin.users.role')" name="role" required>
                <x-admin.select name="role" required>
                    @foreach ($roles as $role => $meta)
                        <option value="{{ $role }}" @selected(old('role', $user->role) === $role)>
                            {{ app()->getLocale() === 'ar' ? $meta['label_ar'] : $meta['label_en'] }} — {{ $role }}
                        </option>
                    @endforeach
                </x-admin.select>
            </x-admin.field>

            <fieldset class="space-y-2">
                <legend class="text-xs font-bold text-slate-700">{{ __('admin.users.permissions') }}</legend>

                <div class="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    @foreach ($permissions as $permission => $description)
                        <label class="flex cursor-pointer items-start gap-2.5 rounded-xl border border-slate-200 bg-slate-50/60 p-3 transition has-checked:border-saudi-600 has-checked:bg-saudi-50">
                            <input type="checkbox" name="permissions[]" value="{{ $permission }}"
                                   @checked(in_array($permission, $selectedPermissions, true))
                                   class="mt-0.5 size-4 rounded border-slate-300 text-saudi-700 focus:ring-saudi-600">
                            <span class="space-y-0.5">
                                <code class="block text-[11px] font-bold text-slate-800">{{ $permission }}</code>
                                <span class="block text-[11px] leading-snug text-slate-500">{{ $description }}</span>
                            </span>
                        </label>
                    @endforeach
                </div>
            </fieldset>

            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <x-admin.field :label="__('admin.users.password')" name="password"
                               :required="! $user->exists"
                               :hint="$user->exists ? __('admin.users.password_hint') : null">
                    <x-admin.input type="password" name="password" dir="ltr" autocomplete="new-password" :required="! $user->exists" />
                </x-admin.field>

                <x-admin.field :label="__('admin.users.password').' — '.__('common.confirm')" name="password_confirmation" :required="! $user->exists">
                    <x-admin.input type="password" name="password_confirmation" dir="ltr" autocomplete="new-password" :required="! $user->exists" />
                </x-admin.field>
            </div>

            <x-admin.toggle name="is_active" :label="__('admin.users.status')" :checked="(bool) old('is_active', $user->is_active ?? true)" />
        </x-admin.panel>

        <div class="flex items-center justify-end gap-3">
            <a href="{{ route('admin.users.index') }}"
               class="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-600 transition hover:bg-slate-50">
                {{ __('common.cancel') }}
            </a>
            <x-admin.submit>{{ $user->exists ? __('common.update') : __('common.create') }}</x-admin.submit>
        </div>
    </form>
@endsection
