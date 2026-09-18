<?php

namespace App\Models;

use App\Models\Concerns\HasLocalizedAttributes;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * A Saudi cultural attaché office supervising scholars in a host country.
 */
class CulturalMission extends Model
{
    use HasLocalizedAttributes;

    public $incrementing = false;

    protected $keyType = 'string';

    protected array $localized = ['country', 'city', 'title', 'attache_name', 'working_hours', 'address'];

    protected $guarded = [];

    protected function casts(): array
    {
        return [
            'latitude' => 'float',
            'longitude' => 'float',
            'is_active' => 'boolean',
        ];
    }

    /** See University::hostCountry() — `country` is a localized attribute here too. */
    public function hostCountry(): BelongsTo
    {
        return $this->belongsTo(Country::class, 'country_code', 'code');
    }
}
