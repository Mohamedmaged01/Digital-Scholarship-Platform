<?php

namespace Database\Seeders\Concerns;

use RuntimeException;

/**
 * The seed data is the exported catalog of the original application
 * (database/data/*.json), so the Blade portal launches with the same six tracks,
 * sixteen universities, eight missions, FAQ bank and staff accounts as before.
 */
trait ReadsLegacyData
{
    protected function dataset(string $name): array
    {
        $path = database_path('data/'.$name.'.json');

        if (! is_file($path)) {
            throw new RuntimeException("Seed dataset [{$name}] is missing at {$path}.");
        }

        $decoded = json_decode((string) file_get_contents($path), true, 512, JSON_THROW_ON_ERROR);

        return is_array($decoded) ? $decoded : [];
    }

    /** Normalise an ISO-ish timestamp string into something the DB accepts. */
    protected function asTimestamp(?string $value): ?string
    {
        if (blank($value)) {
            return null;
        }

        try {
            return now()->parse($value)->toDateTimeString();
        } catch (\Throwable) {
            return null;
        }
    }
}
