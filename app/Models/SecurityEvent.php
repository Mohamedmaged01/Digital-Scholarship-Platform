<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class SecurityEvent extends Model
{
    protected $guarded = [];

    protected function casts(): array
    {
        return [
            'details' => 'array',
            'is_resolved' => 'boolean',
        ];
    }

    public function scopeNewestFirst(Builder $query): Builder
    {
        return $query->orderByDesc('created_at');
    }
}
