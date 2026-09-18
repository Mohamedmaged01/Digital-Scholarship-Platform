<?php

namespace App\Models;

use App\Models\Concerns\HasLocalizedAttributes;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Country extends Model
{
    use HasLocalizedAttributes;

    protected $primaryKey = 'code';

    public $incrementing = false;

    protected $keyType = 'string';

    protected array $localized = ['name', 'region', 'visa_overview', 'cultural_mission_city'];

    protected $guarded = [];

    protected function casts(): array
    {
        return [
            'is_popular' => 'boolean',
            'is_active' => 'boolean',
        ];
    }

    public function universities(): HasMany
    {
        return $this->hasMany(University::class, 'country_code', 'code')->orderBy('qs_rank');
    }

    public function culturalMissions(): HasMany
    {
        return $this->hasMany(CulturalMission::class, 'country_code', 'code');
    }
}
