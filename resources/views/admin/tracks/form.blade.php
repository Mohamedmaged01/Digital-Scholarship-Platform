@extends('layouts.admin')

@section('title', $track->exists ? __('admin.tracks.edit') : __('admin.tracks.create'))

@php
    $section = 'tracks';
    $canEdit = auth()->user()->hasPermission('tracks:write');
@endphp

@section('content')
    <nav class="flex items-center gap-2 text-xs text-slate-500">
        <a href="{{ route('admin.tracks.index') }}" class="transition hover:text-saudi-700">{{ __('admin.nav.tracks') }}</a>
        <x-lucide-chevron-right class="size-3 flip-rtl" aria-hidden="true" />
        <span class="font-bold text-slate-700">{{ $track->exists ? $track->name_ar : __('admin.tracks.create') }}</span>
    </nav>

    <form method="post"
          action="{{ $track->exists ? route('admin.tracks.update', $track) : route('admin.tracks.store') }}"
          class="space-y-6">
        @csrf
        @if ($track->exists)
            @method('PUT')
        @endif

        <x-admin.panel icon="award" :title="__('admin.tracks.title')">
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <x-admin.field :label="__('common.name').' — '.__('common.arabic')" name="name_ar" required>
                    <x-admin.input name="name_ar" value="{{ old('name_ar', $track->name_ar) }}" required :disabled="! $canEdit" />
                </x-admin.field>

                <x-admin.field :label="__('common.name').' — '.__('common.english')" name="name_en" required>
                    <x-admin.input name="name_en" value="{{ old('name_en', $track->name_en) }}" required dir="ltr" :disabled="! $canEdit" />
                </x-admin.field>

                <x-admin.field label="Code" name="code" required>
                    <x-admin.input name="code" value="{{ old('code', $track->code) }}" required dir="ltr" :disabled="! $canEdit" />
                </x-admin.field>

                <x-admin.field label="Slug" name="slug" required hint="{{ url('/tracks') }}/…">
                    <x-admin.input name="slug" value="{{ old('slug', $track->slug) }}" required dir="ltr" :disabled="! $canEdit" />
                </x-admin.field>
            </div>

            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <x-admin.field :label="__('common.description').' — '.__('common.arabic')" name="description_ar" required>
                    <x-admin.textarea name="description_ar" rows="4" required :disabled="! $canEdit">{{ old('description_ar', $track->description_ar) }}</x-admin.textarea>
                </x-admin.field>

                <x-admin.field :label="__('common.description').' — '.__('common.english')" name="description_en" required>
                    <x-admin.textarea name="description_en" rows="4" required dir="ltr" :disabled="! $canEdit">{{ old('description_en', $track->description_en) }}</x-admin.textarea>
                </x-admin.field>

                <x-admin.field :label="__('catalog.track.target_audience').' — '.__('common.arabic')" name="objective_ar">
                    <x-admin.textarea name="objective_ar" rows="3" :disabled="! $canEdit">{{ old('objective_ar', $track->objective_ar) }}</x-admin.textarea>
                </x-admin.field>

                <x-admin.field :label="__('catalog.track.target_audience').' — '.__('common.english')" name="objective_en">
                    <x-admin.textarea name="objective_en" rows="3" dir="ltr" :disabled="! $canEdit">{{ old('objective_en', $track->objective_en) }}</x-admin.textarea>
                </x-admin.field>
            </div>
        </x-admin.panel>

        <x-admin.panel icon="gauge" :title="__('catalog.track.requirements')" :subtitle="__('admin.tracks.rules_hint')">
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <x-admin.field :label="__('catalog.track.min_gpa')" name="min_gpa" required>
                    <x-admin.input type="number" name="min_gpa" value="{{ old('min_gpa', $track->min_gpa) }}"
                                   step="0.05" min="1" max="5" required :disabled="! $canEdit" />
                </x-admin.field>

                <x-admin.field :label="__('catalog.track.ielts')" name="required_ielts" required>
                    <x-admin.input type="number" name="required_ielts" value="{{ old('required_ielts', $track->required_ielts) }}"
                                   step="0.5" min="1" max="9" required :disabled="! $canEdit" />
                </x-admin.field>

                <x-admin.field :label="__('catalog.track.toefl')" name="required_toefl" required>
                    <x-admin.input type="number" name="required_toefl" value="{{ old('required_toefl', $track->required_toefl) }}"
                                   min="1" max="120" required :disabled="! $canEdit" />
                </x-admin.field>

                <x-admin.field :label="__('catalog.track.max_age')" name="max_age" required>
                    <x-admin.input type="number" name="max_age" value="{{ old('max_age', $track->max_age) }}"
                                   min="18" max="70" required :disabled="! $canEdit" />
                </x-admin.field>

                <x-admin.field :label="__('catalog.track.rank_limit')" name="top_universities_rank_limit" required>
                    <x-admin.input type="number" name="top_universities_rank_limit"
                                   value="{{ old('top_universities_rank_limit', $track->top_universities_rank_limit) }}"
                                   min="1" max="2000" required :disabled="! $canEdit" />
                </x-admin.field>

                <x-admin.field :label="__('common.order')" name="sort_order" required>
                    <x-admin.input type="number" name="sort_order" value="{{ old('sort_order', $track->sort_order) }}"
                                   min="1" max="99" required :disabled="! $canEdit" />
                </x-admin.field>
            </div>

            <fieldset class="space-y-2">
                <legend class="text-xs font-bold text-slate-700">{{ __('catalog.track.degrees') }}</legend>
                <p class="text-[11px] text-slate-500">{{ __('admin.tracks.degrees_hint') }}</p>

                <div class="flex flex-wrap gap-2">
                    @foreach ($degreeOptions as $value => $label)
                        <label class="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 transition has-checked:border-saudi-600 has-checked:bg-saudi-50 has-checked:text-saudi-800">
                            <input type="checkbox" name="required_degrees[]" value="{{ $value }}"
                                   @checked(in_array($value, old('required_degrees', $track->required_degrees ?? []), true))
                                   @disabled(! $canEdit)
                                   class="size-4 rounded border-slate-300 text-saudi-700 focus:ring-saudi-600">
                            <span>{{ $label }}</span>
                        </label>
                    @endforeach
                </div>

                @error('required_degrees')
                    <p class="text-[11px] font-semibold text-rose-600">{{ $message }}</p>
                @enderror
            </fieldset>

            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <x-admin.field :label="__('catalog.track.seats')" name="allocated_seats" required>
                    <x-admin.input type="number" name="allocated_seats" value="{{ old('allocated_seats', $track->allocated_seats) }}"
                                   min="0" required :disabled="! $canEdit" />
                </x-admin.field>

                <x-admin.field :label="__('catalog.track.filled_seats')" name="filled_seats" required>
                    <x-admin.input type="number" name="filled_seats" value="{{ old('filled_seats', $track->filled_seats) }}"
                                   min="0" required :disabled="! $canEdit" />
                </x-admin.field>
            </div>
        </x-admin.panel>

        <x-admin.panel icon="layers" :title="__('catalog.track.sectors')">
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <x-admin.field :label="__('catalog.track.sectors').' — '.__('common.arabic')" name="target_sectors_ar" :hint="__('admin.tracks.sectors_hint')">
                    <x-admin.textarea name="target_sectors_ar" rows="6" :disabled="! $canEdit">{{ old('target_sectors_ar', implode("\n", $track->target_sectors_ar ?? [])) }}</x-admin.textarea>
                </x-admin.field>

                <x-admin.field :label="__('catalog.track.sectors').' — '.__('common.english')" name="target_sectors_en" :hint="__('admin.tracks.sectors_hint')">
                    <x-admin.textarea name="target_sectors_en" rows="6" dir="ltr" :disabled="! $canEdit">{{ old('target_sectors_en', implode("\n", $track->target_sectors_en ?? [])) }}</x-admin.textarea>
                </x-admin.field>

                <x-admin.field :label="__('catalog.track.features').' — '.__('common.arabic')" name="features_ar" :hint="__('admin.tracks.features_hint')">
                    <x-admin.textarea name="features_ar" rows="6" :disabled="! $canEdit">{{ old('features_ar', implode("\n", $track->features_ar ?? [])) }}</x-admin.textarea>
                </x-admin.field>

                <x-admin.field :label="__('catalog.track.features').' — '.__('common.english')" name="features_en" :hint="__('admin.tracks.features_hint')">
                    <x-admin.textarea name="features_en" rows="6" dir="ltr" :disabled="! $canEdit">{{ old('features_en', implode("\n", $track->features_en ?? [])) }}</x-admin.textarea>
                </x-admin.field>
            </div>

            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <x-admin.field label="{{ __('common.name') }} — icon" name="icon_name" required hint="lucide: crown, layers, microscope, award, stethoscope, rocket…">
                    <x-admin.input name="icon_name" value="{{ old('icon_name', $track->icon_name) }}" required dir="ltr" :disabled="! $canEdit" />
                </x-admin.field>

                <x-admin.field label="{{ __('common.name') }} — badge colour" name="badge_color" required>
                    <x-admin.input name="badge_color" value="{{ old('badge_color', $track->badge_color) }}" required dir="ltr" :disabled="! $canEdit" />
                </x-admin.field>
            </div>

            <x-admin.field label="Image URL" name="image_url">
                <x-admin.input name="image_url" value="{{ old('image_url', $track->image_url) }}" dir="ltr" :disabled="! $canEdit" />
            </x-admin.field>

            <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <x-admin.toggle name="is_active" :label="__('common.active')" :checked="(bool) old('is_active', $track->is_active)" />
                <x-admin.toggle name="is_published" :label="__('common.published')" :checked="(bool) old('is_published', $track->is_published)" />
            </div>
        </x-admin.panel>

        @if ($canEdit)
            <div class="flex items-center justify-end gap-3">
                <a href="{{ route('admin.tracks.index') }}"
                   class="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-600 transition hover:bg-slate-50">
                    {{ __('common.cancel') }}
                </a>
                <x-admin.submit>{{ $track->exists ? __('common.update') : __('common.create') }}</x-admin.submit>
            </div>
        @endif
    </form>

    {{-- Eligibility rules: each row is its own small form so the engine's thresholds
         can be retuned one at a time without resubmitting the whole track. --}}
    @if ($track->exists && $track->rules->isNotEmpty())
        <x-admin.panel icon="list-ordered" :title="__('admin.tracks.rules')" :subtitle="__('admin.tracks.rules_hint')">
            <ul class="space-y-3">
                @foreach ($track->rules as $rule)
                    @php $expected = $rule->expected(); @endphp

                    <li class="rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
                        <form method="post" action="{{ route('admin.tracks.rules.update', [$track, $rule]) }}"
                              class="grid grid-cols-1 items-end gap-3 sm:grid-cols-12">
                            @csrf
                            @method('PUT')

                            <div class="space-y-0.5 sm:col-span-4">
                                <p class="text-xs font-bold text-slate-900">{{ $rule->title }}</p>
                                <code class="text-[10.5px] text-slate-500">{{ $rule->rule_code }} · {{ $rule->field_name }}</code>
                            </div>

                            <label class="sm:col-span-2">
                                <span class="mb-1 block text-[11px] font-bold text-slate-600">{{ __('admin.audit.action') }}</span>
                                <x-admin.select name="operator" :disabled="! $canEdit">
                                    @foreach (['>=', '<=', '>', '<', '==', '!=', 'IN', 'NOT_IN', 'CONTAINS'] as $operator)
                                        <option value="{{ $operator }}" @selected($rule->operator === $operator)>{{ $operator }}</option>
                                    @endforeach
                                </x-admin.select>
                            </label>

                            <label class="sm:col-span-3">
                                <span class="mb-1 block text-[11px] font-bold text-slate-600">{{ __('common.status') }}</span>
                                <x-admin.input name="expected_value" dir="ltr" :disabled="! $canEdit"
                                               value="{{ is_array($expected) ? implode(', ', $expected) : $expected }}" />
                            </label>

                            <label class="sm:col-span-1">
                                <span class="mb-1 block text-[11px] font-bold text-slate-600">{{ __('common.order') }}</span>
                                <x-admin.input type="number" name="weight" value="{{ $rule->weight }}" min="1" max="100" :disabled="! $canEdit" />
                            </label>

                            <div class="flex items-center gap-3 sm:col-span-2">
                                <label class="flex items-center gap-1.5 text-[11px] font-semibold text-slate-600">
                                    <input type="hidden" name="is_mandatory" value="0">
                                    <input type="checkbox" name="is_mandatory" value="1" @checked($rule->is_mandatory) @disabled(! $canEdit)
                                           class="size-4 rounded border-slate-300 text-saudi-700 focus:ring-saudi-600">
                                    <span>{{ __('common.required') }}</span>
                                </label>

                                <label class="flex items-center gap-1.5 text-[11px] font-semibold text-slate-600">
                                    <input type="hidden" name="is_active" value="0">
                                    <input type="checkbox" name="is_active" value="1" @checked($rule->is_active) @disabled(! $canEdit)
                                           class="size-4 rounded border-slate-300 text-saudi-700 focus:ring-saudi-600">
                                    <span>{{ __('common.enabled') }}</span>
                                </label>
                            </div>

                            @if ($canEdit)
                                <div class="sm:col-span-12">
                                    <x-admin.submit class="w-full sm:w-auto">{{ __('common.save') }}</x-admin.submit>
                                </div>
                            @endif
                        </form>
                    </li>
                @endforeach
            </ul>
        </x-admin.panel>
    @endif
@endsection
