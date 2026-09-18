<?php

namespace App\Models;

use App\Models\Concerns\HasLocalizedAttributes;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

/**
 * A globally ranked institution accredited for one or more scholarship tracks.
 */
class University extends Model
{
    use HasLocalizedAttributes;

    public $incrementing = false;

    protected $keyType = 'string';

    protected array $localized = ['name', 'country', 'city', 'top_majors'];

    protected $guarded = [];

    protected function casts(): array
    {
        return [
            'top_majors_ar' => 'array',
            'top_majors_en' => 'array',
            'degrees_available' => 'array',
            'min_ielts' => 'float',
            'is_top_30' => 'boolean',
            'is_top_100' => 'boolean',
            'is_top_200' => 'boolean',
            'is_featured' => 'boolean',
            'is_active' => 'boolean',
        ];
    }

    public function tracks(): BelongsToMany
    {
        return $this->belongsToMany(ScholarshipTrack::class, 'university_track', 'university_id', 'track_id')
            ->withPivot('accredited_since');
    }

    /**
     * Named hostCountry, not country: `$university->country` is the localized
     * country name coming from country_ar / country_en.
     */
    public function hostCountry(): BelongsTo
    {
        return $this->belongsTo(Country::class, 'country_code', 'code');
    }

    public function culturalMission(): BelongsTo
    {
        return $this->belongsTo(CulturalMission::class, 'cultural_mission_id');
    }

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }

    /**
     * Mirrors the explorer's filter bar: free-text search plus country, track,
     * degree level and ranking tier.
     */
    public function scopeFilter(Builder $query, array $filters): Builder
    {
        $term = trim((string) ($filters['q'] ?? ''));

        if ($term !== '') {
            $like = '%'.$term.'%';
            $query->where(function (Builder $inner) use ($like): void {
                $inner->where('name_ar', 'like', $like)
                    ->orWhere('name_en', 'like', $like)
                    ->orWhere('city_ar', 'like', $like)
                    ->orWhere('city_en', 'like', $like)
                    ->orWhere('country_ar', 'like', $like)
                    ->orWhere('country_en', 'like', $like)
                    ->orWhere('top_majors_ar', 'like', $like)
                    ->orWhere('top_majors_en', 'like', $like);
            });
        }

        if (($country = $filters['country'] ?? 'all') !== 'all' && filled($country)) {
            $query->where('country_code', $country);
        }

        if (($track = $filters['track'] ?? 'all') !== 'all' && filled($track)) {
            $query->whereHas('tracks', fn (Builder $inner) => $inner->where('scholarship_tracks.id', $track));
        }

        if (($degree = $filters['degree'] ?? 'all') !== 'all' && filled($degree)) {
            $query->where('degrees_available', 'like', '%"'.$degree.'"%');
        }

        return match ($filters['tier'] ?? 'all') {
            'top30' => $query->where('qs_rank', '<=', 30),
            'top100' => $query->where('qs_rank', '<=', 100),
            'top200' => $query->where('qs_rank', '<=', 200),
            default => $query,
        };
    }

    public function rankTierLabel(): string
    {
        return match (true) {
            $this->qs_rank <= 30 => __('catalog.tier_top_30'),
            $this->qs_rank <= 100 => __('catalog.tier_top_100'),
            default => __('catalog.tier_top_200'),
        };
    }
}
