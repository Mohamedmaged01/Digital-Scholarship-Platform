<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

/**
 * A visitor question the advisor could not answer from the knowledge base.
 * The AI manager turns these into official FAQ entries.
 */
class UnansweredQuestion extends Model
{
    protected $guarded = [];

    protected function casts(): array
    {
        return ['answered_at' => 'datetime'];
    }

    public function scopePending(Builder $query): Builder
    {
        return $query->whereNull('answered_at')->orderByDesc('hits')->orderByDesc('created_at');
    }

    public function scopeAnswered(Builder $query): Builder
    {
        return $query->whereNotNull('answered_at')->orderByDesc('answered_at');
    }

    public function isAnswered(): bool
    {
        return $this->answered_at !== null;
    }
}
