<?php

namespace App\Models;

use App\Models\Concerns\HasLocalizedAttributes;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

/**
 * A step in the Qabool (application) or Safeer (post-nomination) walkthrough.
 */
class UserGuideStep extends Model
{
    use HasLocalizedAttributes;

    protected array $localized = ['title', 'description', 'details', 'tips'];

    protected $guarded = [];

    protected function casts(): array
    {
        return [
            'details_ar' => 'array',
            'details_en' => 'array',
            'tips_ar' => 'array',
            'tips_en' => 'array',
        ];
    }

    public function scopeForSystem(Builder $query, string $system): Builder
    {
        return $query->where('system', $system)->orderBy('step_number');
    }
}
