<?php

namespace App\Http\Middleware;

use App\Models\SiteSetting;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Honours the maintenance toggle in the settings panel.
 *
 * Public pages show a maintenance notice; the admin console stays reachable so
 * staff can switch the portal back on.
 */
class MaintenanceGate
{
    public function handle(Request $request, Closure $next): Response
    {
        if (! SiteSetting::get('maintenance_mode', false) || $request->user()) {
            return $next($request);
        }

        return response()->view('maintenance', [], Response::HTTP_SERVICE_UNAVAILABLE);
    }
}
