<?php

namespace App\Services;

use App\Models\AdminUser;
use App\Models\AuditLog;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Request;

/**
 * Writes the append-only administrative audit trail.
 *
 * Every controller that changes state calls this, so the audit section is a
 * complete record rather than a best-effort one.
 */
class AuditLogger
{
    public function record(
        string $action,
        string $entityType,
        ?string $entityId = null,
        ?string $entityLabel = null,
        ?string $summary = null,
        ?array $before = null,
        ?array $after = null,
    ): AuditLog {
        /** @var AdminUser|null $actor */
        $actor = Auth::user();

        return AuditLog::create([
            'actor_id' => $actor?->id,
            'actor_name' => $actor?->full_name_ar,
            'actor_role' => $actor?->role,
            'action' => $action,
            'entity_type' => $entityType,
            'entity_id' => $entityId,
            'entity_label' => $entityLabel,
            'ip_address' => Request::ip(),
            'user_agent' => Request::userAgent(),
            'changes_summary' => $summary,
            'changes_before' => $before,
            'changes_after' => $after,
        ]);
    }

    /**
     * Log a model write, capturing only the attributes that actually changed.
     */
    public function recordModel(string $action, string $entityType, Model $model, string $label, ?string $summary = null): AuditLog
    {
        $changed = $model->getChanges();
        unset($changed['updated_at']);

        $before = collect($changed)
            ->keys()
            ->mapWithKeys(fn (string $key): array => [$key => $model->getOriginal($key)])
            ->all();

        return $this->record(
            action: $action,
            entityType: $entityType,
            entityId: (string) $model->getKey(),
            entityLabel: $label,
            summary: $summary,
            before: $action === 'CREATE' ? null : ($before ?: null),
            after: $changed ?: null,
        );
    }

    public function recordAuthEvent(string $action, ?AdminUser $user, string $summary): AuditLog
    {
        return AuditLog::create([
            'actor_id' => $user?->id,
            'actor_name' => $user?->full_name_ar ?? '—',
            'actor_role' => $user?->role,
            'action' => $action,
            'entity_type' => 'USER',
            'entity_id' => $user?->id,
            'entity_label' => $user?->username,
            'ip_address' => Request::ip(),
            'user_agent' => Request::userAgent(),
            'changes_summary' => $summary,
        ]);
    }
}
