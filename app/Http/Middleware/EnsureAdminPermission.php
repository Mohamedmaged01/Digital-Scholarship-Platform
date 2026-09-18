<?php

namespace App\Http\Middleware;

use App\Models\AdminUser;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Guards a write action behind one granular permission. Read routes stay open to
 * the section gate; anything that mutates state passes through here.
 */
class EnsureAdminPermission
{
    public function handle(Request $request, Closure $next, string $permission): Response
    {
        /** @var AdminUser $user */
        $user = $request->user();

        if (! $user->hasPermission($permission)) {
            abort(Response::HTTP_FORBIDDEN, __('admin.permission_denied', ['permission' => $permission]));
        }

        return $next($request);
    }
}
