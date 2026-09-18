<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Simple named counters (track views, AI sessions, wizard runs) backing the
 * analytics panel in the admin dashboard.
 */
class AnalyticsCounter extends Model
{
    protected $primaryKey = 'key';

    public $incrementing = false;

    protected $keyType = 'string';

    protected $guarded = [];

    public static function bump(string $key, int $by = 1): void
    {
        $affected = static::query()->where('key', $key)->increment('value', $by, ['updated_at' => now()]);

        if ($affected === 0) {
            static::query()->insertOrIgnore([
                'key' => $key,
                'value' => $by,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }

    public static function value(string $key): int
    {
        return (int) (static::query()->where('key', $key)->value('value') ?? 0);
    }

    /** @return array<string,int> */
    public static function map(string $prefix): array
    {
        return static::query()
            ->where('key', 'like', $prefix.'%')
            ->pluck('value', 'key')
            ->mapWithKeys(fn ($value, $key) => [str_replace($prefix, '', $key) => (int) $value])
            ->all();
    }
}
