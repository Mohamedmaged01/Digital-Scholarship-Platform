<?php

namespace App\Models;

use App\Models\Concerns\HasLocalizedAttributes;
use Illuminate\Database\Eloquent\Model;

/**
 * Single-row configuration for the AI scholarship advisor.
 */
class AiConfig extends Model
{
    use HasLocalizedAttributes;

    protected array $localized = ['system_prompt', 'suggested_prompts', 'fallback_message'];

    protected $guarded = [];

    protected function casts(): array
    {
        return [
            'temperature' => 'float',
            'is_enabled' => 'boolean',
            'use_faq_knowledge_base' => 'boolean',
            'log_unanswered' => 'boolean',
            'suggested_prompts_ar' => 'array',
            'suggested_prompts_en' => 'array',
        ];
    }

    public static function current(): self
    {
        return static::query()->firstOrCreate([], [
            'model_name' => config('kasp.ai.gemini.model'),
        ]);
    }
}
