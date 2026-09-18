<?php

namespace App\Models;

use App\Models\Concerns\HasLocalizedAttributes;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class PageBlock extends Model
{
    use HasLocalizedAttributes;

    public $incrementing = false;

    protected $keyType = 'string';

    protected array $localized = ['title', 'subtitle', 'content'];

    protected $guarded = [];

    protected function casts(): array
    {
        return [
            'config' => 'array',
            'is_enabled' => 'boolean',
        ];
    }

    protected static function booted(): void
    {
        static::creating(function (self $block): void {
            $block->id ??= 'block-'.Str::lower(Str::random(10));
        });
    }

    public function page(): BelongsTo
    {
        return $this->belongsTo(CmsPage::class, 'page_id');
    }

    public function typeLabel(): string
    {
        return __('admin.block_types.'.$this->type);
    }
}
