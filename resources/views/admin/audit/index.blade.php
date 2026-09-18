@extends('layouts.admin')

@section('title', __('admin.audit.title'))

@php $section = 'audit'; @endphp

@section('content')
    <x-admin.panel icon="shield-check" :title="__('admin.audit.title')" :subtitle="__('admin.audit.subtitle')">
        <form method="get" class="grid grid-cols-1 gap-3 rounded-2xl border border-slate-200 bg-slate-50/60 p-4 sm:grid-cols-4">
            <label class="sm:col-span-2">
                <span class="mb-1 block text-[11px] font-bold text-slate-600">{{ __('common.search') }}</span>
                <x-admin.input type="search" name="q" value="{{ $filters['q'] }}" placeholder="{{ __('admin.audit.search_placeholder') }}" />
            </label>

            <label>
                <span class="mb-1 block text-[11px] font-bold text-slate-600">{{ __('admin.audit.action') }}</span>
                <x-admin.select name="action">
                    @foreach ($actionOptions as $value => $label)
                        <option value="{{ $value }}" @selected($filters['action'] === $value)>{{ $label }}</option>
                    @endforeach
                </x-admin.select>
            </label>

            <label>
                <span class="mb-1 block text-[11px] font-bold text-slate-600">{{ __('admin.audit.entity') }}</span>
                <div class="flex items-center gap-2">
                    <x-admin.select name="entity">
                        @foreach ($entityOptions as $value => $label)
                            <option value="{{ $value }}" @selected($filters['entity'] === $value)>{{ $label }}</option>
                        @endforeach
                    </x-admin.select>
                    <button type="submit" class="shrink-0 rounded-xl bg-saudi-700 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-saudi-800">
                        {{ __('common.filter') }}
                    </button>
                </div>
            </label>
        </form>

        @if ($logs->isEmpty())
            <p class="py-10 text-center text-xs text-slate-400">{{ __('admin.audit.empty') }}</p>
        @else
            <ol class="space-y-2">
                @foreach ($logs as $log)
                    <li class="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs">
                        <div class="flex flex-wrap items-start justify-between gap-3">
                            <div class="space-y-1">
                                <div class="flex flex-wrap items-center gap-2">
                                    <x-badge :tone="$log->actionTone()">{{ $log->actionLabel() }}</x-badge>
                                    <x-badge tone="slate">{{ $log->entityTypeLabel() }}</x-badge>
                                    <span class="text-sm font-bold text-slate-900">{{ $log->entity_label ?: $log->entity_id }}</span>
                                </div>

                                <p class="text-xs leading-relaxed text-slate-600">{{ $log->changes_summary }}</p>

                                @if (filled($log->changes_before) || filled($log->changes_after))
                                    <details class="pt-1">
                                        <summary class="cursor-pointer text-[11px] font-bold text-saudi-700">
                                            {{ __('admin.audit.before') }} / {{ __('admin.audit.after') }}
                                        </summary>
                                        <div class="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                                            <div class="rounded-xl border border-rose-200 bg-rose-50 p-3">
                                                <p class="mb-1 text-[10.5px] font-bold text-rose-700">{{ __('admin.audit.before') }}</p>
                                                <pre class="overflow-x-auto whitespace-pre-wrap break-all text-[10.5px] text-rose-900" dir="ltr">{{ json_encode($log->changes_before, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE) }}</pre>
                                            </div>
                                            <div class="rounded-xl border border-saudi-200 bg-saudi-50 p-3">
                                                <p class="mb-1 text-[10.5px] font-bold text-saudi-700">{{ __('admin.audit.after') }}</p>
                                                <pre class="overflow-x-auto whitespace-pre-wrap break-all text-[10.5px] text-saudi-900" dir="ltr">{{ json_encode($log->changes_after, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE) }}</pre>
                                            </div>
                                        </div>
                                    </details>
                                @endif
                            </div>

                            <div class="shrink-0 space-y-0.5 text-end text-[11px]">
                                <p class="font-bold text-slate-700">{{ $log->actor_name ?: '—' }}</p>
                                <p class="text-slate-400">{{ $log->actor_role }}</p>
                                <p class="numeric text-slate-400" dir="ltr">{{ $log->ip_address }}</p>
                                <time class="numeric block text-slate-400" datetime="{{ $log->created_at?->toIso8601String() }}">
                                    {{ $log->created_at?->format('Y-m-d H:i') }}
                                </time>
                            </div>
                        </div>
                    </li>
                @endforeach
            </ol>

            {{ $logs->links() }}
        @endif
    </x-admin.panel>

    @if ($securityEvents->isNotEmpty())
        <x-admin.panel icon="triangle-alert" :title="app()->getLocale() === 'ar' ? 'أحداث أمنية' : 'Security events'">
            <ul class="space-y-2">
                @foreach ($securityEvents as $event)
                    <li class="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 p-4 text-xs">
                        <div class="flex items-center gap-2">
                            <x-badge :tone="$event->severity === 'CRITICAL' ? 'rose' : 'amber'">{{ $event->severity }}</x-badge>
                            <span class="font-bold text-slate-900">{{ $event->event_type }}</span>
                        </div>

                        <div class="flex items-center gap-3 text-[11px] text-slate-400">
                            <span class="numeric" dir="ltr">{{ $event->ip_address }}</span>
                            <time class="numeric" datetime="{{ $event->created_at?->toIso8601String() }}">{{ $event->created_at?->format('Y-m-d H:i') }}</time>
                        </div>
                    </li>
                @endforeach
            </ul>
        </x-admin.panel>
    @endif
@endsection
