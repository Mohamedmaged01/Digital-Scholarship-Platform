<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\AuditLogger;
use App\Services\BackupService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\StreamedResponse;

class BackupController extends Controller
{
    public function __construct(
        protected AuditLogger $audit,
        protected BackupService $backups,
    ) {}

    public function export(): StreamedResponse
    {
        $payload = $this->backups->export();
        $filename = $this->backups->filename();

        $this->audit->record('EXPORT', 'BACKUP', $filename, $filename, 'تصدير نسخة احتياطية من محتوى المنصة');

        return response()->streamDownload(
            function () use ($payload): void {
                echo json_encode($payload, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
            },
            $filename,
            ['Content-Type' => 'application/json; charset=UTF-8'],
        );
    }

    public function import(Request $request): RedirectResponse
    {
        $request->validate([
            'backup' => ['required', 'file', 'max:20480', 'mimetypes:application/json,text/plain'],
        ]);

        $decoded = json_decode((string) $request->file('backup')->get(), true);

        if (! is_array($decoded) || ! $this->backups->import($decoded)) {
            return back()->withErrors(['backup' => __('admin.settings.import_failed')]);
        }

        $this->audit->record(
            action: 'IMPORT',
            entityType: 'BACKUP',
            entityId: $request->file('backup')->getClientOriginalName(),
            entityLabel: $request->file('backup')->getClientOriginalName(),
            summary: 'استيراد واستعادة نسخة احتياطية لمحتوى المنصة',
        );

        return back()->with('status', __('admin.settings.imported'));
    }
}
