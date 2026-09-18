@extends('layouts.admin')

@section('title', $article->exists ? __('admin.news.edit') : __('admin.news.create'))

@php
    $section = 'news';
    $canEdit = auth()->user()->hasPermission('news:write');
    $canPublish = auth()->user()->canPublishContent();
@endphp

@section('content')
    <nav class="flex items-center gap-2 text-xs text-slate-500">
        <a href="{{ route('admin.news.index') }}" class="transition hover:text-saudi-700">{{ __('admin.nav.news') }}</a>
        <x-lucide-chevron-right class="size-3 flip-rtl" aria-hidden="true" />
        <span class="font-bold text-slate-700">{{ $article->exists ? Str::limit($article->title_ar, 50) : __('admin.news.create') }}</span>
    </nav>

    <form method="post"
          action="{{ $article->exists ? route('admin.news.update', $article) : route('admin.news.store') }}"
          class="space-y-6">
        @csrf
        @if ($article->exists)
            @method('PUT')
        @endif

        <x-admin.panel icon="newspaper" :title="__('admin.news.title')">
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <x-admin.field :label="__('common.title').' — '.__('common.arabic')" name="title_ar" required>
                    <x-admin.input name="title_ar" value="{{ old('title_ar', $article->title_ar) }}" required :disabled="! $canEdit" />
                </x-admin.field>

                <x-admin.field :label="__('common.title').' — '.__('common.english')" name="title_en">
                    <x-admin.input name="title_en" value="{{ old('title_en', $article->title_en) }}" dir="ltr" :disabled="! $canEdit" />
                </x-admin.field>

                <x-admin.field :label="__('common.description').' — '.__('common.arabic')" name="summary_ar" required>
                    <x-admin.textarea name="summary_ar" rows="3" maxlength="600" required :disabled="! $canEdit">{{ old('summary_ar', $article->summary_ar) }}</x-admin.textarea>
                </x-admin.field>

                <x-admin.field :label="__('common.description').' — '.__('common.english')" name="summary_en">
                    <x-admin.textarea name="summary_en" rows="3" maxlength="600" dir="ltr" :disabled="! $canEdit">{{ old('summary_en', $article->summary_en) }}</x-admin.textarea>
                </x-admin.field>
            </div>

            <x-admin.field :label="app()->getLocale() === 'ar' ? 'نص الخبر — العربية' : 'Body — Arabic'" name="content_ar" required>
                <x-admin.textarea name="content_ar" rows="10" required :disabled="! $canEdit">{{ old('content_ar', $article->content_ar) }}</x-admin.textarea>
            </x-admin.field>

            <x-admin.field :label="app()->getLocale() === 'ar' ? 'نص الخبر — الإنجليزية' : 'Body — English'" name="content_en">
                <x-admin.textarea name="content_en" rows="10" dir="ltr" :disabled="! $canEdit">{{ old('content_en', $article->content_en) }}</x-admin.textarea>
            </x-admin.field>
        </x-admin.panel>

        <x-admin.panel icon="settings" :title="__('common.status')">
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <x-admin.field :label="__('common.category')" name="category" required>
                    <x-admin.select name="category" required :disabled="! $canEdit">
                        @foreach ($categories as $value => $label)
                            <option value="{{ $value }}" @selected(old('category', $article->category) === $value)>{{ $label }}</option>
                        @endforeach
                    </x-admin.select>
                </x-admin.field>

                <x-admin.field :label="__('common.status')" name="status" required
                               :hint="$canPublish ? null : __('admin.news.cannot_publish')">
                    <x-admin.select name="status" required :disabled="! $canEdit">
                        @foreach ($statuses as $value => $label)
                            <option value="{{ $value }}"
                                    @selected(old('status', $article->status) === $value)
                                    @disabled($value === 'published' && ! $canPublish)>{{ $label }}</option>
                        @endforeach
                    </x-admin.select>
                </x-admin.field>

                <x-admin.field :label="__('pages.news.published_on')" name="publish_date" required>
                    <x-admin.input type="date" name="publish_date"
                                   value="{{ old('publish_date', $article->publish_date?->toDateString() ?? now()->toDateString()) }}"
                                   required :disabled="! $canEdit" />
                </x-admin.field>

                <x-admin.field :label="app()->getLocale() === 'ar' ? 'الجهة — العربية' : 'Author — Arabic'" name="author_ar" required>
                    <x-admin.input name="author_ar" value="{{ old('author_ar', $article->author_ar) }}" required :disabled="! $canEdit" />
                </x-admin.field>
            </div>

            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <x-admin.field :label="app()->getLocale() === 'ar' ? 'الجهة — الإنجليزية' : 'Author — English'" name="author_en">
                    <x-admin.input name="author_en" value="{{ old('author_en', $article->author_en) }}" dir="ltr" :disabled="! $canEdit" />
                </x-admin.field>

                <x-admin.field label="Image URL" name="image_url">
                    <x-admin.input name="image_url" value="{{ old('image_url', $article->image_url) }}" dir="ltr" :disabled="! $canEdit" />
                </x-admin.field>
            </div>

            <x-admin.toggle name="is_featured" :label="__('pages.news.featured')" :checked="(bool) old('is_featured', $article->is_featured)" />
        </x-admin.panel>

        @if ($canEdit)
            <div class="flex items-center justify-end gap-3">
                <a href="{{ route('admin.news.index') }}"
                   class="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-600 transition hover:bg-slate-50">
                    {{ __('common.cancel') }}
                </a>
                <x-admin.submit>{{ $article->exists ? __('common.update') : __('common.create') }}</x-admin.submit>
            </div>
        @endif
    </form>
@endsection
