<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Services\Ai\AiAdvisor;
use App\Services\PlatformAnalytics;
use Illuminate\Contracts\View\View;

class DashboardController extends Controller
{
    public function index(PlatformAnalytics $analytics, AiAdvisor $advisor): View
    {
        return view('admin.dashboard', [
            'metrics' => $analytics->dashboard(),
            'recentActivity' => AuditLog::query()->newestFirst()->limit(8)->get(),
            'aiDriver' => $advisor->activeDriver(),
        ]);
    }
}
