<?php

namespace App\Models;

use App\Models\Concerns\HasLocalizedAttributes;
use Illuminate\Database\Eloquent\Model;

class SeoMetadata extends Model
{
    use HasLocalizedAttributes;

    protected $table = 'seo_metadata';

    protected $primaryKey = 'page_slug';

    public $incrementing = false;

    protected $keyType = 'string';

    protected array $localized = ['meta_title', 'meta_description', 'keywords'];

    protected $guarded = [];

    protected function casts(): array
    {
        return [
            'keywords_ar' => 'array',
            'keywords_en' => 'array',
        ];
    }
}
