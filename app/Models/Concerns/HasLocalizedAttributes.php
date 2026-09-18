<?php

namespace App\Models\Concerns;

/**
 * Resolves bilingual `*_ar` / `*_en` columns against the active locale.
 *
 * The React app repeated `isRtl ? track.nameAr : track.nameEn` at every call site.
 * Here a model declares which attributes are bilingual and Blade just reads
 * `$track->name`, falling back to Arabic whenever an English value is missing —
 * Arabic is the authoritative language of the portal.
 */
trait HasLocalizedAttributes
{
    /**
     * Base attribute names that exist as `<name>_ar` and `<name>_en` columns.
     * Override with `protected array $localized = [...]` on the model.
     */
    public function localizedAttributes(): array
    {
        return property_exists($this, 'localized') ? $this->localized : [];
    }

    public function getAttribute($key)
    {
        if (is_string($key) && in_array($key, $this->localizedAttributes(), true)) {
            return $this->localized($key);
        }

        return parent::getAttribute($key);
    }

    /**
     * Read one bilingual attribute, optionally forcing a locale.
     */
    public function localized(string $base, ?string $locale = null): mixed
    {
        $locale = $locale ?: app()->getLocale();

        $preferred = parent::getAttribute($base.'_'.$locale);

        if (is_array($preferred)) {
            return $preferred === [] ? (parent::getAttribute($base.'_ar') ?? []) : $preferred;
        }

        if (filled($preferred)) {
            return $preferred;
        }

        return parent::getAttribute($base.'_ar') ?? parent::getAttribute($base.'_en');
    }

    /**
     * The other language's value — used for the secondary line on cards.
     */
    public function alternate(string $base): mixed
    {
        return $this->localized($base, app()->getLocale() === 'ar' ? 'en' : 'ar');
    }

    public function isLocalizedAttribute(string $key): bool
    {
        return in_array($key, $this->localizedAttributes(), true);
    }
}
