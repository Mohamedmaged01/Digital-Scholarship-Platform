<?php

namespace App\Models;

use App\Models\Concerns\HasLocalizedAttributes;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Number;
use Illuminate\Support\Str;

class MediaItem extends Model
{
    use HasLocalizedAttributes;

    public $incrementing = false;

    protected $keyType = 'string';

    protected array $localized = ['alt_text'];

    protected $guarded = [];

    protected function casts(): array
    {
        return ['size_bytes' => 'integer'];
    }

    protected static function booted(): void
    {
        static::creating(function (self $item): void {
            $item->id ??= 'media-'.Str::lower(Str::random(10));
        });
    }

    public function humanSize(): string
    {
        return $this->size_bytes > 0 ? Number::fileSize($this->size_bytes, precision: 1) : '—';
    }

    public function isImage(): bool
    {
        return Str::startsWith((string) $this->mime_type, 'image/')
            || in_array(Str::lower((string) $this->extension), ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg'], true);
    }
}
