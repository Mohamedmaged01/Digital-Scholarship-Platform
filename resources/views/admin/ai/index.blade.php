@extends('layouts.admin')

@section('title', __('admin.ai.title'))

@php
    $section = 'ai';
    $canEdit = auth()->user()->hasPermission('ai:write');
    $faqCategories = ['general', 'admission', 'tracks', 'requirements', 'universities', 'documents', 'nomination', 'post_nomination', 'travel_prep', 'services'];
@endphp

@section('content')
    {{-- Which engine is actually answering right now --}}
    <div class="flex items-start gap-3 rounded-2xl border p-4 text-xs {{ $driver === 'gemini' ? 'border-purple-200 bg-purple-50 text-purple-900' : 'border-slate-200 bg-slate-50 text-slate-700' }}">
        <x-lucide-bot class="mt-0.5 size-5 shrink-0" aria-hidden="true" />
        <p class="leading-relaxed">{{ $driver === 'gemini' ? __('admin.ai.driver_live') : __('admin.ai.driver_notice') }}</p>
    </div>

    <div class="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <x-stat-tile icon="activity" :label="__('admin.ai.latency')" :value="$averageLatency.' ms'" />
        <x-stat-tile icon="circle-check" tone="saudi" :label="__('common.status')" :value="$successRate.'%'" />
        <x-stat-tile icon="message-circle-question-mark" tone="amber" :label="__('admin.stats.unanswered')" :value="$pending->count()" />
        <x-stat-tile icon="check" tone="indigo" :label="__('admin.ai.answered')" :value="$answered->count()" />
    </div>

    {{-- Engine configuration --}}
    <form method="post" action="{{ route('admin.ai.config.update') }}">
        @csrf
        @method('PUT')

        <x-admin.panel icon="settings" :title="__('admin.ai.config')" :subtitle="__('admin.ai.subtitle')">
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <x-admin.field :label="__('admin.ai.model')" name="model_name" required>
                    <x-admin.input name="model_name" value="{{ old('model_name', $config->model_name) }}" required dir="ltr" :disabled="! $canEdit" />
                </x-admin.field>

                <x-admin.field :label="__('admin.ai.temperature')" name="temperature" required>
                    <x-admin.input type="number" name="temperature" value="{{ old('temperature', $config->temperature) }}"
                                   step="0.05" min="0" max="2" required :disabled="! $canEdit" />
                </x-admin.field>

                <x-admin.field :label="__('admin.ai.max_tokens')" name="max_output_tokens" required>
                    <x-admin.input type="number" name="max_output_tokens" value="{{ old('max_output_tokens', $config->max_output_tokens) }}"
                                   min="128" max="8192" required :disabled="! $canEdit" />
                </x-admin.field>
            </div>

            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <x-admin.field :label="__('admin.ai.system_prompt').' — '.__('common.arabic')" name="system_prompt_ar" required>
                    <x-admin.textarea name="system_prompt_ar" rows="6" required :disabled="! $canEdit">{{ old('system_prompt_ar', $config->system_prompt_ar) }}</x-admin.textarea>
                </x-admin.field>

                <x-admin.field :label="__('admin.ai.system_prompt').' — '.__('common.english')" name="system_prompt_en">
                    <x-admin.textarea name="system_prompt_en" rows="6" dir="ltr" :disabled="! $canEdit">{{ old('system_prompt_en', $config->system_prompt_en) }}</x-admin.textarea>
                </x-admin.field>

                <x-admin.field :label="__('admin.ai.suggested_prompts').' — '.__('common.arabic')" name="suggested_prompts_ar">
                    <x-admin.textarea name="suggested_prompts_ar" rows="5" :disabled="! $canEdit">{{ old('suggested_prompts_ar', implode("\n", $config->suggested_prompts_ar ?? [])) }}</x-admin.textarea>
                </x-admin.field>

                <x-admin.field :label="__('admin.ai.suggested_prompts').' — '.__('common.english')" name="suggested_prompts_en">
                    <x-admin.textarea name="suggested_prompts_en" rows="5" dir="ltr" :disabled="! $canEdit">{{ old('suggested_prompts_en', implode("\n", $config->suggested_prompts_en ?? [])) }}</x-admin.textarea>
                </x-admin.field>

                <x-admin.field :label="__('admin.ai.fallback').' — '.__('common.arabic')" name="fallback_message_ar" required>
                    <x-admin.textarea name="fallback_message_ar" rows="3" required :disabled="! $canEdit">{{ old('fallback_message_ar', $config->fallback_message_ar) }}</x-admin.textarea>
                </x-admin.field>

                <x-admin.field :label="__('admin.ai.fallback').' — '.__('common.english')" name="fallback_message_en">
                    <x-admin.textarea name="fallback_message_en" rows="3" dir="ltr" :disabled="! $canEdit">{{ old('fallback_message_en', $config->fallback_message_en) }}</x-admin.textarea>
                </x-admin.field>
            </div>

            <div class="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <x-admin.toggle name="is_enabled" :label="__('admin.ai.enabled')" :checked="(bool) old('is_enabled', $config->is_enabled)" />
                <x-admin.toggle name="use_faq_knowledge_base" :label="__('admin.ai.use_kb')" :checked="(bool) old('use_faq_knowledge_base', $config->use_faq_knowledge_base)" />
                <x-admin.toggle name="log_unanswered" :label="__('admin.ai.log_unanswered')" :checked="(bool) old('log_unanswered', $config->log_unanswered)" />
            </div>

            @if ($canEdit)
                <div class="flex justify-end">
                    <x-admin.submit>{{ __('common.update') }}</x-admin.submit>
                </div>
            @endif
        </x-admin.panel>
    </form>

    {{-- Test console --}}
    <x-admin.panel icon="message-circle-question-mark" :title="__('admin.ai.test_console')" :subtitle="__('admin.ai.test_hint')">
        <div x-data="{ question: '', answer: '', source: '', busy: false }" class="space-y-3">
            <form @submit.prevent="
                    busy = true;
                    fetch(@js(route('admin.ai.test')), {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            Accept: 'application/json',
                            'X-CSRF-TOKEN': document.querySelector('meta[name=&quot;csrf-token&quot;]').content,
                        },
                        body: JSON.stringify({ message: question }),
                    })
                    .then((response) => response.json())
                    .then((payload) => { answer = payload.answer; source = payload.source; })
                    .catch(() => { answer = @js(__('common.error')); source = ''; })
                    .finally(() => { busy = false; });
                  "
                  class="flex items-center gap-2">
                <label class="flex-1">
                    <span class="sr-only">{{ __('ai_chat.placeholder') }}</span>
                    <x-admin.input x-model="question" placeholder="{{ __('ai_chat.placeholder') }}" />
                </label>
                <button type="submit" :disabled="busy || question.trim() === ''"
                        class="flex shrink-0 items-center gap-2 rounded-xl bg-saudi-700 px-5 py-2.5 text-xs font-bold text-white transition hover:bg-saudi-800 disabled:opacity-50">
                    <x-lucide-send class="size-4 flip-rtl" aria-hidden="true" />
                    <span>{{ __('ai_chat.send') }}</span>
                </button>
            </form>

            <div x-show="answer" x-cloak class="space-y-2 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p class="flex items-center gap-2 text-[11px] font-bold text-slate-500">
                    <span>{{ __('admin.ai.operation') }}:</span>
                    <code class="rounded bg-white px-1.5 py-0.5 text-[10px] font-bold text-saudi-700" x-text="source"></code>
                </p>
                <p class="whitespace-pre-line text-xs leading-relaxed text-slate-700" x-text="answer"></p>
            </div>
        </div>
    </x-admin.panel>

    {{-- Unanswered questions --}}
    <x-admin.panel icon="circle-help" :title="__('admin.ai.unanswered')">
        @if ($pending->isEmpty())
            <p class="py-6 text-center text-xs text-slate-400">{{ __('admin.ai.unanswered_empty') }}</p>
        @else
            <ul class="space-y-3">
                @foreach ($pending as $question)
                    <li class="space-y-3 rounded-2xl border border-amber-200 bg-amber-50/60 p-4">
                        <div class="flex flex-wrap items-start justify-between gap-3">
                            <div class="space-y-1">
                                <p class="text-sm font-bold text-slate-900">{{ $question->question }}</p>
                                <p class="flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                                    <x-badge tone="slate">{{ __('faq_categories.'.$question->category) }}</x-badge>
                                    <span class="numeric">{{ __('admin.ai.hits') }}: {{ $question->hits }}</span>
                                    <span aria-hidden="true">·</span>
                                    <span class="numeric">{{ $question->created_at?->diffForHumans() }}</span>
                                    <code class="rounded bg-white px-1.5 py-0.5 text-[10px] font-bold text-slate-600">{{ $question->language }}</code>
                                </p>
                            </div>

                            @if ($canEdit)
                                <x-admin.delete-button :action="route('admin.ai.questions.destroy', $question)" label="" />
                            @endif
                        </div>

                        @if ($canEdit)
                            <form method="post" action="{{ route('admin.ai.questions.answer', $question) }}" class="space-y-3 border-t border-amber-200/70 pt-3">
                                @csrf

                                <x-admin.field :label="__('admin.ai.answer').' — '.__('common.arabic')" name="answer" required>
                                    <x-admin.textarea name="answer" rows="4" required></x-admin.textarea>
                                </x-admin.field>

                                <div class="grid grid-cols-1 gap-3 sm:grid-cols-3">
                                    <x-admin.field :label="__('common.title').' — '.__('common.english')" name="question_en">
                                        <x-admin.input name="question_en" dir="ltr" />
                                    </x-admin.field>

                                    <x-admin.field :label="__('admin.ai.answer').' — '.__('common.english')" name="answer_en">
                                        <x-admin.input name="answer_en" dir="ltr" />
                                    </x-admin.field>

                                    <x-admin.field :label="__('common.category')" name="category" required>
                                        <x-admin.select name="category" required>
                                            @foreach ($faqCategories as $value)
                                                <option value="{{ $value }}" @selected($question->category === $value)>{{ __('faq_categories.'.$value) }}</option>
                                            @endforeach
                                        </x-admin.select>
                                    </x-admin.field>
                                </div>

                                <x-admin.submit icon="check">{{ __('admin.ai.publish_answer') }}</x-admin.submit>
                            </form>
                        @endif
                    </li>
                @endforeach
            </ul>
        @endif
    </x-admin.panel>

    {{-- Telemetry --}}
    <x-admin.panel icon="activity" :title="__('admin.ai.telemetry')">
        @if ($telemetry->isEmpty())
            <p class="text-xs text-slate-500">{{ __('common.empty') }}</p>
        @else
            <div class="overflow-x-auto">
                <table class="w-full text-start text-xs">
                    <caption class="sr-only">{{ __('admin.ai.telemetry') }}</caption>
                    <thead class="bg-slate-50 text-[11px] uppercase tracking-wide text-slate-500">
                        <tr>
                            <th scope="col" class="px-4 py-3 text-start font-bold">{{ __('admin.ai.operation') }}</th>
                            <th scope="col" class="px-4 py-3 text-start font-bold">{{ __('admin.ai.model') }}</th>
                            <th scope="col" class="px-4 py-3 text-start font-bold">{{ __('admin.ai.latency') }}</th>
                            <th scope="col" class="px-4 py-3 text-start font-bold">{{ __('common.status') }}</th>
                            <th scope="col" class="px-4 py-3 text-start font-bold">{{ __('admin.audit.when') }}</th>
                        </tr>
                    </thead>

                    <tbody class="divide-y divide-slate-100">
                        @foreach ($telemetry as $record)
                            <tr>
                                <td class="px-4 py-2.5 font-bold text-slate-700">{{ $record->operation }}</td>
                                <td class="px-4 py-2.5 text-slate-600" dir="ltr">{{ $record->model }}</td>
                                <td class="numeric px-4 py-2.5 text-slate-600">{{ $record->latency_ms }} ms</td>
                                <td class="px-4 py-2.5">
                                    <x-badge :tone="$record->succeeded() ? 'emerald' : 'rose'">{{ $record->status }}</x-badge>
                                </td>
                                <td class="numeric px-4 py-2.5 text-slate-400">{{ $record->created_at?->diffForHumans() }}</td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>
        @endif
    </x-admin.panel>
@endsection
