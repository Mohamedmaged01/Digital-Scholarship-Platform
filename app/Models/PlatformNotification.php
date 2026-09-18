<?php

namespace App\Models;

use App\Models\Concerns\HasLocalizedAttributes;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class PlatformNotification extends Model
{
    use HasLocalizedAttributes;

    public $incrementing = false;

    protected $keyType = 'string';

    protected array $localized = ['title', 'content'];

    protected $guarded = [];

    protected function casts(): array
    {
        return ['is_read' => 'boolean'];
    }

    protected static function booted(): void
    {
        static::creating(function (self $notification): void {
            $notification->id ??= 'notif-'.Str::lower(Str::random(10));
        });
    }

    public function recipient(): BelongsTo
    {
        return $this->belongsTo(PlatformUser::class, 'platform_user_id');
    }
}
