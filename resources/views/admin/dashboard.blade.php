@extends('layouts.admin')

@section('title', __('admin.nav.statistics'))

@php $section = 'statistics'; @endphp

@section('content')
    {{-- Headline KPIs --}}
    <div class="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <x-stat-tile icon="users"
                     :label="__('admin.stats.total_quota')"
                     :value="number_format($metrics['total_quota'])"
                     :hint="__('admin.stats.quota_hint')" />

        <x-stat-tile icon="award" tone="saudi"
                     :label="__('admin.stats.active_tracks')"
                     :value="$metrics['active_tracks'].' / '.$metrics['tracks_total']"
                     :hint="__('admin.stats.tracks_hint')" />

        <x-stat-tile icon="building-2" tone="indigo"
                     :label="__('admin.stats.universities')"
                     :value="number_format($metrics['universities'])"
                     :hint="__('admin.stats.universities_hint', ['count' => $metrics['countries']])" />

        <x-stat-tile icon="chart-bar" tone="purple"
                     :label="__('admin.stats.visitors')"
                     :value="number_format($metrics['visitors_total'])"
                     :hint="__('admin.stats.visitors_hint')" />
    </div>

    {{-- Content readiness --}}
    <x-admin.panel icon="layers" :title="__('admin.stats.content_health')">
        <div class="grid grid-cols-1 gap-4 text-xs sm:grid-cols-3">
            <div class="space-y-2 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <span class="block font-bold text-slate-800">{{ __('admin.stats.published_pages') }}</span>
                <span class="numeric block text-xl font-bold text-slate-900">{{ $metrics['published_pages'] }} / {{ $metrics['pages_total'] }}</span>
                <p class="text-[11px] text-slate-500">{{ __('admin.stats.published_pages_hint') }}</p>
            </div>

            <div class="space-y-2 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <span class="block font-bold text-slate-800">{{ __('admin.stats.active_faqs') }}</span>
                <span class="numeric block text-xl font-bold text-slate-900">{{ $metrics['active_faqs'] }}</span>
                <p class="text-[11px] text-slate-500">{{ __('admin.stats.active_faqs_hint') }}</p>
            </div>

            <div class="space-y-2 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <span class="block font-bold text-slate-800">{{ __('admin.stats.media_items') }}</span>
                <span class="numeric block text-xl font-bold text-slate-900">{{ $metrics['media_items'] }}</span>
                <p class="text-[11px] text-slate-500">{{ __('admin.stats.media_items_hint') }}</p>
            </div>
        </div>
    </x-admin.panel>

    <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">

        {{-- Quota utilisation per track --}}
        <x-admin.panel icon="award" :title="__('admin.stats.quota_by_track')">
            <ul class="space-y-3">
                @foreach ($metrics['quota_by_track'] as $row)
                    <li class="space-y-1.5">
                        <div class="flex items-center justify-between text-xs">
                            <span class="font-bold text-slate-800">{{ $row['track']->name }}</span>
                            <span class="numeric font-bold text-saudi-700">{{ $row['utilisation'] }}%</span>
                        </div>
                        <div class="h-2 overflow-hidden rounded-full bg-slate-100">
                            <div class="h-full rounded-full bg-gradient-to-r from-saudi-600 to-saudi-400"
                                 style="width: {{ min(100, $row['utilisation']) }}%"></div>
                        </div>
                        <p class="numeric text-[10.5px] text-slate-400">
                            {{ number_format($row['track']->filled_seats) }} / {{ number_format($row['track']->allocated_seats) }}
                        </p>
                    </li>
                @endforeach
            </ul>
        </x-admin.panel>

        {{-- AI advisor --}}
        <x-admin.panel icon="bot" :title="__('admin.stats.ai_usage')">
            <x-slot:actions>
                @php
                    $driverLabel = $aiDriver === 'gemini'
                        ? 'Gemini'
                        : (app()->getLocale() === 'ar' ? 'محرك المعرفة الداخلي' : 'Built-in knowledge engine');
                @endphp
                <x-badge :tone="$aiDriver === 'gemini' ? 'purple' : 'slate'">{{ $driverLabel }}</x-badge>
            </x-slot:actions>

            <dl class="grid grid-cols-2 gap-4 text-xs">
                <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <dt class="font-bold text-slate-500">{{ __('admin.stats.ai_sessions') }}</dt>
                    <dd class="numeric text-xl font-black text-slate-900">{{ number_format($metrics['ai_sessions']) }}</dd>
                </div>
                <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <dt class="font-bold text-slate-500">{{ __('admin.stats.ai_finder_runs') }}</dt>
                    <dd class="numeric text-xl font-black text-slate-900">{{ number_format($metrics['ai_finder_runs']) }}</dd>
                </div>
                <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <dt class="font-bold text-slate-500">{{ __('admin.ai.latency') }}</dt>
                    <dd class="numeric text-xl font-black text-slate-900">{{ $metrics['ai_avg_latency'] }}<span class="text-xs font-bold text-slate-400"> ms</span></dd>
                </div>
                <div class="rounded-2xl border border-amber-200 bg-amber-50 p-4">
                    <dt class="font-bold text-amber-700">{{ __('admin.stats.unanswered') }}</dt>
                    <dd class="numeric text-xl font-black text-amber-900">{{ $metrics['unanswered'] }}</dd>
                </div>
            </dl>

            @if ($metrics['unanswered'] > 0 && auth()->user()->canOpenSection('ai'))
                <a href="{{ route('admin.ai.index') }}"
                   class="flex items-center justify-center gap-2 rounded-xl bg-saudi-700 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-saudi-800">
                    <span>{{ __('admin.ai.unanswered') }}</span>
                    <x-lucide-arrow-right class="size-3.5 flip-rtl" aria-hidden="true" />
                </a>
            @endif
        </x-admin.panel>

        {{-- Application pipeline --}}
        <x-admin.panel icon="file-text" :title="__('admin.stats.pipeline')">
            @if (empty($metrics['pipeline']))
                <p class="text-xs text-slate-500">{{ __('common.empty') }}</p>
            @else
                <ul class="space-y-2">
                    @foreach ($metrics['pipeline'] as $status => $total)
                        <li class="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 px-4 py-2.5 text-xs">
                            <span class="font-bold text-slate-800">{{ __('operations.application_status.'.$status) }}</span>
                            <span class="numeric rounded-lg bg-slate-100 px-2 py-0.5 font-bold text-slate-700">{{ $total }}</span>
                        </li>
                    @endforeach
                </ul>
            @endif
        </x-admin.panel>

        {{-- Most viewed tracks --}}
        <x-admin.panel icon="trending-up" :title="__('admin.stats.top_tracks')">
            <ul class="space-y-2">
                @foreach ($metrics['top_tracks'] as $row)
                    <li class="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 px-4 py-2.5 text-xs">
                        <span class="font-bold text-slate-800">{{ $row['track']->name }}</span>
                        <span class="numeric flex items-center gap-1.5 text-slate-500">
                            <x-lucide-eye class="size-3.5 text-slate-400" aria-hidden="true" />
                            {{ number_format($row['views']) }}
                        </span>
                    </li>
                @endforeach
            </ul>
        </x-admin.panel>
    </div>

    {{-- Upcoming appointments --}}
    @if ($metrics['upcoming_appointments']->isNotEmpty())
        <x-admin.panel icon="calendar" :title="__('admin.stats.appointments')">
            <ul class="space-y-2">
                @foreach ($metrics['upcoming_appointments'] as $appointment)
                    <li class="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 p-4 text-xs">
                        <div class="space-y-0.5">
                            <p class="font-bold text-slate-900">{{ $appointment->subject }}</p>
                            <p class="text-[11px] text-slate-500">
                                {{ $appointment->requester_name }} · {{ $appointment->typeLabel() }}
                            </p>
                        </div>

                        <div class="flex items-center gap-2">
                            <span class="numeric text-[11px] font-bold text-slate-600">
                                {{ $appointment->preferred_date?->toDateString() }} {{ $appointment->preferred_time }}
                            </span>
                            <x-badge :tone="$appointment->status === 'confirmed' ? 'saudi' : 'amber'">
                                {{ $appointment->statusLabel() }}
                            </x-badge>
                        </div>
                    </li>
                @endforeach
            </ul>
        </x-admin.panel>
    @endif

    {{-- Recent activity --}}
    <x-admin.panel icon="shield-check" :title="__('admin.stats.recent_activity')">
        @if (auth()->user()->canOpenSection('audit'))
            <x-slot:actions>
                <a href="{{ route('admin.audit.index') }}"
                   class="flex items-center gap-1.5 rounded-xl bg-slate-100 px-3.5 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-200">
                    <span>{{ __('admin.nav.audit') }}</span>
                    <x-lucide-arrow-right class="size-3.5 flip-rtl" aria-hidden="true" />
                </a>
            </x-slot:actions>
        @endif

        @if ($recentActivity->isEmpty())
            <p class="text-xs text-slate-500">{{ __('admin.stats.no_activity') }}</p>
        @else
            <ol class="space-y-2">
                @foreach ($recentActivity as $log)
                    <li class="flex flex-wrap items-start justify-between gap-3 rounded-2xl border border-slate-200 p-4 text-xs">
                        <div class="space-y-1">
                            <div class="flex flex-wrap items-center gap-2">
                                <x-badge :tone="$log->actionTone()">{{ $log->actionLabel() }}</x-badge>
                                <span class="font-bold text-slate-900">{{ $log->entity_label ?: $log->entityTypeLabel() }}</span>
                            </div>
                            <p class="text-[11px] leading-relaxed text-slate-600">{{ $log->changes_summary }}</p>
                        </div>

                        <div class="text-end text-[11px] text-slate-400">
                            <p class="font-semibold text-slate-600">{{ $log->actor_name }}</p>
                            <time class="numeric" datetime="{{ $log->created_at?->toIso8601String() }}">
                                {{ $log->created_at?->diffForHumans() }}
                            </time>
                        </div>
                    </li>
                @endforeach
            </ol>
        @endif
    </x-admin.panel>
@endsection
