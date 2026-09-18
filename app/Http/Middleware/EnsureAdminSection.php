<?php

namespace App\Http\Middleware;

use App\Models\AdminUser;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Deny-by-default gate on a dashboard section. A role that does not list the
 * section gets the explicit "restricted" screen rather than a bare 403, which is
 * how the original portal behaved.
 */
class EnsureAdminSection
{
    public function handle(Request $request, Closure $next, string $section): Response
    {
        /** @var AdminUser $user */
        $user = $request->user();

        if (! $user->canOpenSection($section)) {
            return response()->view('admin.restricted', [
                'section' => $section,
            ], Response::HTTP_FORBIDDEN);
        }

        return $next($request);
    }
}
