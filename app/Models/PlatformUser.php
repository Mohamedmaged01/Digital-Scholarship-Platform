<?php

namespace App\Models;

use App\Models\Concerns\HasLocalizedAttributes;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * A beneficiary or supervisor reference record. These people have no login on
 * this portal — the rows exist so reviewers can see who a file belongs to.
 */
class PlatformUser extends Model
{
    use HasLocalizedAttributes;

    public $incrementing = false;

    protected $keyType = 'string';

    protected array $localized = ['full_name'];

    protected $guarded = [];

    protected function casts(): array
    {
        return [
            'date_of_birth' => 'date',
            'gpa' => 'float',
            'ielts_score' => 'float',
            'yakeen_verified' => 'boolean',
            'is_active' => 'boolean',
            'last_login_at' => 'datetime',
        ];
    }

    public function applications(): HasMany
    {
        return $this->hasMany(Application::class, 'platform_user_id');
    }

    public function appointments(): HasMany
    {
        return $this->hasMany(Appointment::class, 'platform_user_id');
    }

    public function culturalMission(): BelongsTo
    {
        return $this->belongsTo(CulturalMission::class, 'cultural_mission_id');
    }

    public function roleLabel(): string
    {
        return __('operations.platform_roles.'.$this->role);
    }
}
