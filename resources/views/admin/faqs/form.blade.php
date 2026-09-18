@extends('layouts.admin')

@section('title', $faq->exists ? __('admin.faqs.edit') : __('admin.faqs.create'))

@php
    $section = 'faqs';
    $canEdit = auth()->user()->hasPermission('faqs:write');
@endphp

@section('content')
    <nav class="flex items-center gap-2 text-xs text-slate-500">
        <a href="{{ route('admin.faqs.index') }}" class="transition hover:text-saudi-700">{{ __('admin.nav.faqs') }}</a>
        <x-lucide-chevron-right class="size-3 flip-rtl" aria-hidden="true" />
        <span class="font-bold text-slate-700">{{ $faq->exists ? Str::limit($faq->question_ar, 50) : __('admin.faqs.create') }}</span>
    </nav>

    <form method="post"
          action="{{ $faq->exists ? route('admin.faqs.update', $faq) : route('admin.faqs.store') }}"
          class="space-y-6">
        @csrf
        @if ($faq->exists)
            @method('PUT')
        @endif

        <x-admin.panel icon="circle-help" :title="__('admin.faqs.title')" :subtitle="__('admin.faqs.subtitle')">
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <x-admin.field :label="__('common.title').' — '.__('common.arabic')" name="question_ar" required>
                    <x-admin.textarea name="question_ar" rows="3" required :disabled="! $canEdit">{{ old('question_ar', $faq->question_ar) }}</x-admin.textarea>
                </x-admin.field>

                <x-admin.field :label="__('common.title').' — '.__('common.english')" name="question_en" required>
                    <x-admin.textarea name="question_en" rows="3" required dir="ltr" :disabled="! $canEdit">{{ old('question_en', $faq->question_en) }}</x-admin.textarea>
                </x-admin.field>

                <x-admin.field :label="__('admin.ai.answer').' — '.__('common.arabic')" name="answer_ar" required>
                    <x-admin.textarea name="answer_ar" rows="8" required :disabled="! $canEdit">{{ old('answer_ar', $faq->answer_ar) }}</x-admin.textarea>
                </x-admin.field>

                <x-admin.field :label="__('admin.ai.answer').' — '.__('common.english')" name="answer_en" required>
                    <x-admin.textarea name="answer_en" rows="8" required dir="ltr" :disabled="! $canEdit">{{ old('answer_en', $faq->answer_en) }}</x-admin.textarea>
                </x-admin.field>
            </div>

            <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <x-admin.field :label="__('common.category')" name="category" required>
                    <x-admin.select name="category" required :disabled="! $canEdit">
                        @foreach ($categories as $value => $label)
                            <option value="{{ $value }}" @selected(old('category', $faq->category) === $value)>{{ $label }}</option>
                        @endforeach
                    </x-admin.select>
                </x-admin.field>

                <x-admin.field :label="__('catalog.filters.track')" name="related_track_id">
                    <x-admin.select name="related_track_id" :disabled="! $canEdit">
                        <option value="">{{ __('common.none') }}</option>
                        @foreach ($tracks as $track)
                            <option value="{{ $track->id }}" @selected(old('related_track_id', $faq->related_track_id) === $track->id)>{{ $track->name }}</option>
                        @endforeach
                    </x-admin.select>
                </x-admin.field>

                <x-admin.field :label="__('common.order')" name="sort_order" required>
                    <x-admin.input type="number" name="sort_order" value="{{ old('sort_order', $faq->sort_order) }}" min="1" max="999" required :disabled="! $canEdit" />
                </x-admin.field>
            </div>

            <x-admin.field :label="app()->getLocale() === 'ar' ? 'الكلمات المفتاحية' : 'Keywords'" name="tags" :hint="__('admin.faqs.tags_hint')">
                <x-admin.input name="tags" value="{{ old('tags', implode(', ', $faq->tags ?? [])) }}" :disabled="! $canEdit" />
            </x-admin.field>

            <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <x-admin.toggle name="is_published" :label="__('common.published')" :checked="(bool) old('is_published', $faq->is_published)" />
                <x-admin.toggle name="is_featured" :label="__('pages.news.featured')" :checked="(bool) old('is_featured', $faq->is_featured)" />
            </div>
        </x-admin.panel>

        @if ($canEdit)
            <div class="flex items-center justify-end gap-3">
                <a href="{{ route('admin.faqs.index') }}"
                   class="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-600 transition hover:bg-slate-50">
                    {{ __('common.cancel') }}
                </a>
                <x-admin.submit>{{ $faq->exists ? __('common.update') : __('common.create') }}</x-admin.submit>
            </div>
        @endif
    </form>
@endsection
