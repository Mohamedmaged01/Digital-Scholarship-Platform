<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

/**
 * Latency and outcome of each AI advisor call, surfaced in the AI manager.
 */
class AiTelemetry extends Model
{
    protected $table = 'ai_telemetry';

    protected $guarded = [];

    public function scopeNewestFirst(Builder $query): Builder
    {
        return $query->orderByDesc('created_at')->orderByDesc('id');
    }

    public function succeeded(): bool
    {
        return $this->status === 'SUCCESS';
    }
}
