<?php

namespace App\Models;

use App\Models\Concerns\HasLocalizedAttributes;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * One configurable eligibility criterion belonging to a track. Admins edit the
 * operator and threshold so the eligibility engine changes without a deploy.
 */
class RequirementRule extends Model
{
    use HasLocalizedAttributes;

    public $incrementing = false;

    protected $keyType = 'string';

    protected array $localized = ['title', 'error_message'];

    protected $guarded = [];

    protected function casts(): array
    {
        return [
            'expected_value' => 'array',
            'is_mandatory' => 'boolean',
            'is_active' => 'boolean',
        ];
    }

    public function track(): BelongsTo
    {
        return $this->belongsTo(ScholarshipTrack::class, 'track_id');
    }

    /** The raw comparison target (rules store scalars wrapped in an array). */
    public function expected(): mixed
    {
        $value = $this->expected_value;

        return is_array($value) && array_key_exists('value', $value) ? $value['value'] : $value;
    }
}
