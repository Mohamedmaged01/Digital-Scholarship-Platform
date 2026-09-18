<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Resolves the active language for the request.
 *
 * Arabic is the portal's primary language and the default. A visitor's choice is
 * remembered in the session, which is what the header's language toggle writes to.
 * API requests carry no session, so they pass ?lang= or fall back to the default.
 */
class SetLocale
{
    public function handle(Request $request, Closure $next): Response
    {
        $supported = array_keys(config('kasp.locales'));

        $locale = $request->query('lang');

        if (! in_array($locale, $supported, true)) {
            $locale = $request->hasSession() ? $request->session()->get('locale') : null;
        }

        if (! in_array($locale, $supported, true)) {
            $locale = config('app.locale');
        }

        app()->setLocale($locale);

        return $next($request);
    }
}
