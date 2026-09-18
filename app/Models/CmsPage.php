<?php

namespace App\Models;

use App\Models\Concerns\HasLocalizedAttributes;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * A public page assembled from ordered, toggleable content blocks.
 */
class CmsPage extends Model
{
    use HasLocalizedAttributes;

    public $incrementing = false;

    protected $keyType = 'string';

    protected array $localized = ['title', 'description'];

    protected $guarded = [];

    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    public function blocks(): HasMany
    {
        return $this->hasMany(PageBlock::class, 'page_id')->orderBy('sort_order');
    }

    public function versions(): HasMany
    {
        return $this->hasMany(PageVersion::class, 'page_id')->orderByDesc('version_number');
    }

    public function isPublished(): bool
    {
        return $this->status === 'published';
    }

    /** Whether a home-page section block is switched on. */
    public function blockEnabled(string $type): bool
    {
        return $this->blocks->firstWhere('type', $type)?->is_enabled ?? true;
    }
}
