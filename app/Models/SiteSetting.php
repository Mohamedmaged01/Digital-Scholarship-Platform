<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

/**
 * Key/value platform configuration editable from the admin portal.
 */
class SiteSetting extends Model
{
    protected $primaryKey = 'key';

    public $incrementing = false;

    protected $keyType = 'string';

    protected $guarded = [];

    protected function casts(): array
    {
        return ['value' => 'array'];
    }

    public const CACHE_KEY = 'kasp.site_settings';

    protected static function booted(): void
    {
        static::saved(fn () => Cache::forget(self::CACHE_KEY));
        static::deleted(fn () => Cache::forget(self::CACHE_KEY));
    }

    /**
     * Every setting as a flat key => value array, cached until a setting changes.
     */
    public static function allValues(): array
    {
        return Cache::rememberForever(self::CACHE_KEY, function (): array {
            return static::query()->pluck('value', 'key')->all();
        });
    }

    public static function get(string $key, mixed $default = null): mixed
    {
        return data_get(static::allValues(), $key, $default);
    }

    public static function put(string $key, mixed $value, ?string $description = null): void
    {
        static::updateOrCreate(
            ['key' => $key],
            array_filter(['value' => $value, 'description' => $description], fn ($v) => $v !== null),
        );
    }
}
