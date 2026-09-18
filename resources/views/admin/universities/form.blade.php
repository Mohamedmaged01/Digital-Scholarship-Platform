@extends('layouts.admin')

@section('title', $university->exists ? __('admin.universities.edit') : __('admin.universities.create'))

@php
    $section = 'universities';
    $canEdit = auth()->user()->hasPermission('universities:write');
    $selectedTracks = old('tracks', $university->exists ? $university->tracks->pluck('id')->all() : []);
@endphp

@section('content')
    <nav class="flex items-center gap-2 text-xs text-slate-500">
        <a href="{{ route('admin.universities.index') }}" class="transition hover:text-saudi-700">{{ __('admin.nav.universities') }}</a>
        <x-lucide-chevron-right class="size-3 flip-rtl" aria-hidden="true" />
        <span class="font-bold text-slate-700">{{ $university->exists ? $university->name_ar : __('admin.universities.create') }}</span>
    </nav>

    <form method="post"
          action="{{ $university->exists ? route('admin.universities.update', $university) : route('admin.universities.store') }}"
          class="space-y-6">
        @csrf
        @if ($university->exists)
            @method('PUT')
        @endif

        <x-admin.panel icon="building-2" :title="__('admin.universities.title')">
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <x-admin.field :label="__('common.name').' — '.__('common.arabic')" name="name_ar" required>
                    <x-admin.input name="name_ar" value="{{ old('name_ar', $university->name_ar) }}" required :disabled="! $canEdit" />
                </x-admin.field>

                <x-admin.field :label="__('common.name').' — '.__('common.english')" name="name_en" required>
                    <x-admin.input name="name_en" value="{{ old('name_en', $university->name_en) }}" required dir="ltr" :disabled="! $canEdit" />
                </x-admin.field>

                <x-admin.field :label="__('catalog.university.country')" name="country_code" required>
                    <x-admin.select name="country_code" required :disabled="! $canEdit">
                        @foreach ($countries as $country)
                            <option value="{{ $country->code }}" @selected(old('country_code', $university->country_code) === $country->code)>
                                {{ $country->flag_emoji }} {{ $country->name_ar }} — {{ $country->name_en }}
                            </option>
                        @endforeach
                    </x-admin.select>
                </x-admin.field>

                <x-admin.field :label="__('catalog.university.supervising_mission')" name="cultural_mission_id">
                    <x-admin.select name="cultural_mission_id" :disabled="! $canEdit">
                        <option value="">{{ __('common.none') }}</option>
                        @foreach ($missions as $mission)
                            <option value="{{ $mission->id }}" @selected(old('cultural_mission_id', $university->cultural_mission_id) === $mission->id)>
                                {{ $mission->country_ar }} — {{ $mission->city_ar }}
                            </option>
                        @endforeach
                    </x-admin.select>
                </x-admin.field>

                <x-admin.field :label="__('catalog.university.country').' — '.__('common.arabic')" name="country_ar" required>
                    <x-admin.input name="country_ar" value="{{ old('country_ar', $university->country_ar) }}" required :disabled="! $canEdit" />
                </x-admin.field>

                <x-admin.field :label="__('catalog.university.country').' — '.__('common.english')" name="country_en" required>
                    <x-admin.input name="country_en" value="{{ old('country_en', $university->country_en) }}" required dir="ltr" :disabled="! $canEdit" />
                </x-admin.field>

                <x-admin.field :label="__('catalog.university.city').' — '.__('common.arabic')" name="city_ar" required>
                    <x-admin.input name="city_ar" value="{{ old('city_ar', $university->city_ar) }}" required :disabled="! $canEdit" />
                </x-admin.field>

                <x-admin.field :label="__('catalog.university.city').' — '.__('common.english')" name="city_en">
                    <x-admin.input name="city_en" value="{{ old('city_en', $university->city_en) }}" dir="ltr" :disabled="! $canEdit" />
                </x-admin.field>
            </div>
        </x-admin.panel>

        <x-admin.panel icon="award" :title="__('catalog.university.rank')">
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <x-admin.field :label="__('catalog.university.qs_rank')" name="qs_rank" required>
                    <x-admin.input type="number" name="qs_rank" value="{{ old('qs_rank', $university->qs_rank) }}" min="1" max="2000" required :disabled="! $canEdit" />
                </x-admin.field>

                <x-admin.field :label="__('catalog.university.the_rank')" name="the_rank">
                    <x-admin.input type="number" name="the_rank" value="{{ old('the_rank', $university->the_rank) }}" min="1" max="2000" :disabled="! $canEdit" />
                </x-admin.field>

                <x-admin.field label="IELTS" name="min_ielts" required>
                    <x-admin.input type="number" name="min_ielts" value="{{ old('min_ielts', $university->min_ielts) }}" step="0.5" min="1" max="9" required :disabled="! $canEdit" />
                </x-admin.field>

                <x-admin.field label="TOEFL" name="min_toefl" required>
                    <x-admin.input type="number" name="min_toefl" value="{{ old('min_toefl', $university->min_toefl) }}" min="1" max="120" required :disabled="! $canEdit" />
                </x-admin.field>
            </div>

            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <x-admin.field :label="__('catalog.university.acceptance_rate')" name="acceptance_rate">
                    <x-admin.input name="acceptance_rate" value="{{ old('acceptance_rate', $university->acceptance_rate) }}" dir="ltr" placeholder="7%" :disabled="! $canEdit" />
                </x-admin.field>

                <x-admin.field :label="__('catalog.university.visit_website')" name="website_url">
                    <x-admin.input type="url" name="website_url" value="{{ old('website_url', $university->website_url) }}" dir="ltr" :disabled="! $canEdit" />
                </x-admin.field>
            </div>

            <fieldset class="space-y-2">
                <legend class="text-xs font-bold text-slate-700">{{ __('catalog.university.degrees') }}</legend>
                <div class="flex flex-wrap gap-2">
                    @foreach ($degreeOptions as $value => $label)
                        <label class="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 transition has-checked:border-saudi-600 has-checked:bg-saudi-50 has-checked:text-saudi-800">
                            <input type="checkbox" name="degrees_available[]" value="{{ $value }}"
                                   @checked(in_array($value, old('degrees_available', $university->degrees_available ?? []), true))
                                   @disabled(! $canEdit)
                                   class="size-4 rounded border-slate-300 text-saudi-700 focus:ring-saudi-600">
                            <span>{{ $label }}</span>
                        </label>
                    @endforeach
                </div>
                @error('degrees_available')
                    <p class="text-[11px] font-semibold text-rose-600">{{ $message }}</p>
                @enderror
            </fieldset>

            <fieldset class="space-y-2">
                <legend class="text-xs font-bold text-slate-700">{{ __('catalog.university.accredited_tracks') }}</legend>
                <p class="text-[11px] text-slate-500">{{ __('admin.universities.accredited_tracks_hint') }}</p>

                <div class="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    @foreach ($tracks as $track)
                        <label class="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 transition has-checked:border-saudi-600 has-checked:bg-saudi-50 has-checked:text-saudi-800">
                            <input type="checkbox" name="tracks[]" value="{{ $track->id }}"
                                   @checked(in_array($track->id, $selectedTracks, true))
                                   @disabled(! $canEdit)
                                   class="size-4 rounded border-slate-300 text-saudi-700 focus:ring-saudi-600">
                            <span>{{ $track->name }}</span>
                        </label>
                    @endforeach
                </div>
            </fieldset>
        </x-admin.panel>

        <x-admin.panel icon="book-open" :title="__('catalog.university.majors')">
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <x-admin.field :label="__('catalog.university.majors').' — '.__('common.arabic')" name="top_majors_ar" :hint="__('admin.universities.majors_hint')">
                    <x-admin.textarea name="top_majors_ar" rows="6" :disabled="! $canEdit">{{ old('top_majors_ar', implode("\n", $university->top_majors_ar ?? [])) }}</x-admin.textarea>
                </x-admin.field>

                <x-admin.field :label="__('catalog.university.majors').' — '.__('common.english')" name="top_majors_en" :hint="__('admin.universities.majors_hint')">
                    <x-admin.textarea name="top_majors_en" rows="6" dir="ltr" :disabled="! $canEdit">{{ old('top_majors_en', implode("\n", $university->top_majors_en ?? [])) }}</x-admin.textarea>
                </x-admin.field>
            </div>

            <x-admin.field label="Image URL" name="image_url">
                <x-admin.input name="image_url" value="{{ old('image_url', $university->image_url) }}" dir="ltr" :disabled="! $canEdit" />
            </x-admin.field>

            <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <x-admin.toggle name="is_active" :label="__('common.active')" :checked="(bool) old('is_active', $university->is_active)" />
                <x-admin.toggle name="is_featured" :label="__('pages.news.featured')" :checked="(bool) old('is_featured', $university->is_featured)" />
            </div>
        </x-admin.panel>

        @if ($canEdit)
            <div class="flex items-center justify-end gap-3">
                <a href="{{ route('admin.universities.index') }}"
                   class="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-600 transition hover:bg-slate-50">
                    {{ __('common.cancel') }}
                </a>
                <x-admin.submit>{{ $university->exists ? __('common.update') : __('common.create') }}</x-admin.submit>
            </div>
        @endif
    </form>
@endsection
