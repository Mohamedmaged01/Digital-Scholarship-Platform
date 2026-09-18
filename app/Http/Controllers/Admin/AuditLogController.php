<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\SecurityEvent;
use Illuminate\Contracts\View\View;
use Illuminate\Http\Request;

class AuditLogController extends Controller
{
    public function __invoke(Request $request): View
    {
        $filters = [
            'action' => $request->string('action')->toString() ?: 'all',
            'entity' => $request->string('entity')->toString() ?: 'all',
            'q' => $request->string('q')->toString(),
        ];

        return view('admin.audit.index', [
            'logs' => AuditLog::query()->filter($filters)->newestFirst()->paginate(25)->withQueryString(),
            'filters' => $filters,
            'actionOptions' => ['all' => __('admin.audit.all_actions')] + __('admin.audit_actions'),
            'entityOptions' => ['all' => __('admin.audit.all_entities')] + __('admin.audit_entities'),
            'securityEvents' => SecurityEvent::query()->newestFirst()->limit(8)->get(),
        ]);
    }
}
