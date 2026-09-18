<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

/**
 * A scholarship application record. Applications originate on the Ministry's
 * official platform; this table is the reviewing surface inside the admin portal.
 */
class Application extends Model
{
    public $incrementing = false;

    protected $keyType = 'string';

    protected $guarded = [];

    protected function casts(): array
    {
        return [
            'extracted_data' => 'array',
            'documents' => 'array',
            'ai_processing_log' => 'array',
            'financial_guarantee_issued' => 'boolean',
            'gpa' => 'float',
            'ielts_score' => 'float',
            'submitted_at' => 'datetime',
            'reviewed_at' => 'datetime',
        ];
    }

    protected static function booted(): void
    {
        static::creating(function (self $application): void {
            $application->id ??= 'app-'.Str::lower(Str::random(12));
            $application->application_number ??= 'SCH-'.now()->year.'-'.Str::upper(Str::random(8));
        });
    }

    public function track(): BelongsTo
    {
        return $this->belongsTo(ScholarshipTrack::class, 'track_id');
    }

    public function university(): BelongsTo
    {
        return $this->belongsTo(University::class, 'university_id');
    }

    public function applicant(): BelongsTo
    {
        return $this->belongsTo(PlatformUser::class, 'platform_user_id');
    }

    public function statusHistory(): HasMany
    {
        return $this->hasMany(ApplicationStatusHistory::class)->orderByDesc('created_at');
    }

    public function scopeStatus(Builder $query, ?string $status): Builder
    {
        return $status && $status !== 'all' ? $query->where('status', $status) : $query;
    }

    public function statusLabel(): string
    {
        return __('operations.application_status.'.$this->status);
    }

    public function statusTone(): string
    {
        return match ($this->status) {
            'accepted', 'nominated', 'completed' => 'emerald',
            'rejected', 'withdrawn' => 'rose',
            'under_review', 'eligibility_check' => 'amber',
            'needs_information' => 'orange',
            default => 'slate',
        };
    }

    /**
     * Record a status transition alongside its audit trail entry.
     */
    public function transitionTo(string $status, ?AdminUser $actor = null, ?string $reason = null): void
    {
        $from = $this->status;

        $this->forceFill([
            'status' => $status,
            'reviewed_by' => $actor?->id,
            'reviewed_by_name' => $actor?->full_name_ar,
            'reviewed_at' => now(),
        ])->save();

        $this->statusHistory()->create([
            'from_status' => $from,
            'to_status' => $status,
            'changed_by' => $actor?->id,
            'changed_by_name' => $actor?->full_name_ar,
            'change_reason' => $reason,
        ]);
    }
}
