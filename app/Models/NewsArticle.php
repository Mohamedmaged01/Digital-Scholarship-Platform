<?php

namespace App\Models;

use App\Models\Concerns\HasLocalizedAttributes;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class NewsArticle extends Model
{
    use HasLocalizedAttributes;

    public $incrementing = false;

    protected $keyType = 'string';

    protected array $localized = ['title', 'summary', 'content', 'author'];

    protected $guarded = [];

    protected function casts(): array
    {
        return [
            'publish_date' => 'date',
            'is_featured' => 'boolean',
        ];
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    protected static function booted(): void
    {
        static::saving(function (self $article): void {
            $article->id ??= 'news-'.Str::lower(Str::random(10));

            if (blank($article->slug)) {
                $base = Str::slug($article->title_en ?: $article->title_ar) ?: 'news';
                $article->slug = $base.'-'.Str::lower(Str::random(5));
            }

            $body = strip_tags((string) ($article->content_ar ?: $article->summary_ar));
            $article->read_time_minutes = max(1, (int) ceil(Str::length($body) / 900));
        });
    }

    public function scopePublished(Builder $query): Builder
    {
        return $query->where('status', 'published');
    }

    public function scopeLatestFirst(Builder $query): Builder
    {
        return $query->orderByDesc('publish_date')->orderByDesc('created_at');
    }

    public function categoryLabel(): string
    {
        return __('news.categories.'.$this->category);
    }
}
