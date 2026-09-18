<?php

namespace App\Models;

use App\Models\Concerns\HasLocalizedAttributes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;

/**
 * A ministry staff account. These are the only accounts that can sign in.
 */
class AdminUser extends Authenticatable
{
    use HasLocalizedAttributes, Notifiable;

    protected $table = 'admin_users';

    public $incrementing = false;

    protected $keyType = 'string';

    protected array $localized = ['full_name'];

    protected $fillable = [
        'id',
        'username',
        'full_name_ar',
        'full_name_en',
        'email',
        'password',
        'role',
        'department',
        'avatar_url',
        'permissions',
        'is_active',
        'last_login_at',
        'failed_attempts',
        'locked_until',
    ];

    protected $hidden = ['password', 'remember_token'];

    protected function casts(): array
    {
        return [
            'permissions' => 'array',
            'is_active' => 'boolean',
            'last_login_at' => 'datetime',
            'locked_until' => 'datetime',
            'password' => 'hashed',
        ];
    }

    protected static function booted(): void
    {
        static::creating(function (self $user): void {
            $user->id ??= 'admin-'.Str::lower(Str::random(10));
        });
    }

    // ---------------------------------------------------------------- RBAC

    public function roleMeta(): array
    {
        return config('kasp.roles.'.$this->role, [
            'label_ar' => $this->role,
            'label_en' => $this->role,
            'sections' => ['statistics'],
            'can_edit' => false,
            'can_publish' => false,
            'can_manage_users' => false,
            'can_manage_settings' => false,
        ]);
    }

    public function roleLabel(): string
    {
        $meta = $this->roleMeta();

        return app()->getLocale() === 'ar' ? $meta['label_ar'] : $meta['label_en'];
    }

    public function isSuperAdmin(): bool
    {
        return $this->role === 'SUPER_ADMIN';
    }

    /** Super admins bypass every permission check; everyone else is deny-by-default. */
    public function hasPermission(string $permission): bool
    {
        return $this->isSuperAdmin() || in_array($permission, $this->permissions ?? [], true);
    }

    public function allowedSections(): array
    {
        return $this->roleMeta()['sections'];
    }

    public function canOpenSection(string $section): bool
    {
        return $this->isSuperAdmin() || in_array($section, $this->allowedSections(), true);
    }

    public function canEditContent(): bool
    {
        return (bool) $this->roleMeta()['can_edit'];
    }

    public function canPublishContent(): bool
    {
        return (bool) $this->roleMeta()['can_publish'];
    }

    // ------------------------------------------------------------- Lockout

    public function isLocked(): bool
    {
        return $this->locked_until !== null && $this->locked_until->isFuture();
    }

    public function registerFailedLogin(): void
    {
        $attempts = $this->failed_attempts + 1;
        $max = (int) config('kasp.security.max_failed_logins', 5);

        $this->forceFill([
            'failed_attempts' => $attempts,
            'locked_until' => $attempts >= $max
                ? Carbon::now()->addMinutes((int) config('kasp.security.lockout_minutes', 15))
                : null,
        ])->save();
    }

    public function registerSuccessfulLogin(): void
    {
        $this->forceFill([
            'failed_attempts' => 0,
            'locked_until' => null,
            'last_login_at' => Carbon::now(),
        ])->save();
    }

    public function initials(): string
    {
        return Str::of($this->full_name_ar)->explode(' ')->take(2)
            ->map(fn (string $part): string => Str::substr($part, 0, 1))->implode('');
    }
}
