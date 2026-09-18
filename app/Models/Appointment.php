<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

/**
 * An academic advising slot requested from the public help centre.
 */
class Appointment extends Model
{
    public $incrementing = false;

    protected $keyType = 'string';

    protected $guarded = [];

    protected function casts(): array
    {
        return ['preferred_date' => 'date'];
    }

    protected static function booted(): void
    {
        static::creating(function (self $appointment): void {
            $appointment->id ??= 'apt-'.Str::lower(Str::random(12));
        });
    }

    public function culturalMission(): BelongsTo
    {
        return $this->belongsTo(CulturalMission::class, 'cultural_mission_id');
    }

    public function applicant(): BelongsTo
    {
        return $this->belongsTo(PlatformUser::class, 'platform_user_id');
    }

    public function scopeUpcoming(Builder $query): Builder
    {
        return $query->whereIn('status', ['pending', 'confirmed'])->orderBy('preferred_date');
    }

    public function typeLabel(): string
    {
        return __('operations.appointment_types.'.$this->type);
    }

    public function statusLabel(): string
    {
        return __('operations.appointment_status.'.$this->status);
    }
}
