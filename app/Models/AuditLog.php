<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

/**
 * Append-only record of every administrative write.
 */
class AuditLog extends Model
{
    protected $guarded = [];

    protected function casts(): array
    {
        return [
            'changes_before' => 'array',
            'changes_after' => 'array',
        ];
    }

    public function scopeNewestFirst(Builder $query): Builder
    {
        return $query->orderByDesc('created_at')->orderByDesc('id');
    }

    public function scopeFilter(Builder $query, array $filters): Builder
    {
        if (filled($action = $filters['action'] ?? null) && $action !== 'all') {
            $query->where('action', $action);
        }

        if (filled($entity = $filters['entity'] ?? null) && $entity !== 'all') {
            $query->where('entity_type', $entity);
        }

        if (filled($term = $filters['q'] ?? null)) {
            $like = '%'.trim($term).'%';
            $query->where(function (Builder $inner) use ($like): void {
                $inner->where('actor_name', 'like', $like)
                    ->orWhere('entity_label', 'like', $like)
                    ->orWhere('changes_summary', 'like', $like)
                    ->orWhere('entity_id', 'like', $like);
            });
        }

        return $query;
    }

    public function actionLabel(): string
    {
        return __('admin.audit_actions.'.$this->action);
    }

    public function actionTone(): string
    {
        return match ($this->action) {
            'CREATE' => 'emerald',
            'UPDATE' => 'blue',
            'DELETE' => 'rose',
            'PUBLISH' => 'teal',
            'UNPUBLISH' => 'amber',
            'RESTORE' => 'purple',
            'LOGIN', 'LOGOUT' => 'slate',
            'EXPORT', 'IMPORT' => 'indigo',
            default => 'slate',
        };
    }

    public function entityTypeLabel(): string
    {
        return __('admin.audit_entities.'.$this->entity_type);
    }
}
