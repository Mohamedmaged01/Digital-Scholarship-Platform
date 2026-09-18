<?php

namespace App\Models;

use App\Models\Concerns\HasLocalizedAttributes;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * One of the six national scholarship tracks (Pioneers, Imdad, R&D, Excellence,
 * Health, Waed).
 */
class ScholarshipTrack extends Model
{
    use HasLocalizedAttributes;

    public $incrementing = false;

    protected $keyType = 'string';

    protected array $localized = ['name', 'description', 'objective', 'target_sectors', 'features'];

    protected $guarded = [];

    protected function casts(): array
    {
        return [
            'required_degrees' => 'array',
            'target_sectors_ar' => 'array',
            'target_sectors_en' => 'array',
            'features_ar' => 'array',
            'features_en' => 'array',
            'details' => 'array',
            'min_gpa' => 'float',
            'required_ielts' => 'float',
            'is_active' => 'boolean',
            'is_published' => 'boolean',
        ];
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    public function rules(): HasMany
    {
        return $this->hasMany(RequirementRule::class, 'track_id')->orderBy('weight', 'desc');
    }

    public function universities(): BelongsToMany
    {
        return $this->belongsToMany(University::class, 'university_track', 'track_id', 'university_id')
            ->withPivot('accredited_since');
    }

    public function applications(): HasMany
    {
        return $this->hasMany(Application::class, 'track_id');
    }

    public function faqs(): HasMany
    {
        return $this->hasMany(Faq::class, 'related_track_id');
    }

    public function scopePublished(Builder $query): Builder
    {
        return $query->where('is_active', true)->where('is_published', true);
    }

    public function scopeOrdered(Builder $query): Builder
    {
        return $query->orderBy('sort_order');
    }

    // ------------------------------------------------------------ Presentation

    public function seatUtilisation(): float
    {
        if ($this->allocated_seats <= 0) {
            return 0.0;
        }

        return round(($this->filled_seats / $this->allocated_seats) * 100, 1);
    }

    /** Requirement checklist shown on the track detail page. */
    public function requirementItems(): array
    {
        return data_get($this->details, 'requirements', []);
    }

    public function targetMajors(): array
    {
        return data_get($this->details, 'target_majors', []);
    }

    public function benefits(): array
    {
        return data_get($this->details, 'benefits', []);
    }

    public function applyUrl(): string
    {
        return $this->details['official_apply_url'] ?? config('kasp.apply_url');
    }

    /** Sequence number ("01" … "06") used by the track cards. */
    public function displayNumber(): string
    {
        return str_pad((string) $this->sort_order, 2, '0', STR_PAD_LEFT);
    }
}
