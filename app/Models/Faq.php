<?php

namespace App\Models;

use App\Models\Concerns\HasLocalizedAttributes;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Faq extends Model
{
    use HasLocalizedAttributes;

    public $incrementing = false;

    protected $keyType = 'string';

    protected array $localized = ['question', 'answer'];

    protected $guarded = [];

    protected function casts(): array
    {
        return [
            'tags' => 'array',
            'is_featured' => 'boolean',
            'is_published' => 'boolean',
        ];
    }

    public function track(): BelongsTo
    {
        return $this->belongsTo(ScholarshipTrack::class, 'related_track_id');
    }

    public function scopePublished(Builder $query): Builder
    {
        return $query->where('is_published', true);
    }

    public function scopeOrdered(Builder $query): Builder
    {
        return $query->orderBy('sort_order')->orderBy('id');
    }

    public function scopeSearch(Builder $query, ?string $term): Builder
    {
        if (blank($term)) {
            return $query;
        }

        $like = '%'.trim($term).'%';

        return $query->where(function (Builder $inner) use ($like): void {
            $inner->where('question_ar', 'like', $like)
                ->orWhere('question_en', 'like', $like)
                ->orWhere('answer_ar', 'like', $like)
                ->orWhere('answer_en', 'like', $like)
                ->orWhere('tags', 'like', $like);
        });
    }

    public function scopeCategory(Builder $query, ?string $category): Builder
    {
        return $category && $category !== 'all' ? $query->where('category', $category) : $query;
    }
}
