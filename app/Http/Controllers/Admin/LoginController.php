<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AdminUser;
use App\Models\SecurityEvent;
use App\Services\AuditLogger;
use Illuminate\Contracts\View\View;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

/**
 * Administrative session authentication.
 *
 * Staff sign in with either their username or their ministry email. Repeated
 * failures lock the account for a cool-off window and raise a security event.
 */
class LoginController extends Controller
{
    public function create(): View
    {
        return view('admin.auth.login', [
            'roles' => config('kasp.roles'),
        ]);
    }

    public function store(Request $request, AuditLogger $audit): RedirectResponse
    {
        $credentials = $request->validate([
            'identifier' => ['required', 'string', 'max:190'],
            'password' => ['required', 'string'],
        ]);

        $identifier = trim($credentials['identifier']);

        $user = AdminUser::query()
            ->where('username', $identifier)
            ->orWhere('email', $identifier)
            ->first();

        if (! $user) {
            $this->raiseSecurityEvent($request, 'UNKNOWN_ADMIN_IDENTIFIER', ['identifier' => $identifier]);

            throw ValidationException::withMessages(['identifier' => __('admin.login.failed')]);
        }

        if ($user->isLocked()) {
            throw ValidationException::withMessages([
                'identifier' => __('admin.login.locked', [
                    'minutes' => max(1, (int) ceil(now()->diffInMinutes($user->locked_until, false))),
                ]),
            ]);
        }

        if (! $user->is_active) {
            throw ValidationException::withMessages(['identifier' => __('admin.login.inactive')]);
        }

        if (! Hash::check($credentials['password'], $user->password)) {
            $user->registerFailedLogin();
            $audit->recordAuthEvent('FAILED_LOGIN', $user, 'محاولة دخول إداري فاشلة للمستخدم '.$user->username);
            $this->raiseSecurityEvent($request, 'BRUTE_FORCE', ['username' => $user->username, 'attempts' => $user->failed_attempts]);

            throw ValidationException::withMessages(['identifier' => __('admin.login.failed')]);
        }

        Auth::login($user, $request->boolean('remember'));
        $request->session()->regenerate();
        $user->registerSuccessfulLogin();

        $audit->recordAuthEvent('LOGIN', $user, 'تسجيل دخول إداري ناجح ('.$user->role.')');

        return redirect()->intended(route('admin.dashboard'));
    }

    public function destroy(Request $request, AuditLogger $audit): RedirectResponse
    {
        $audit->recordAuthEvent('LOGOUT', $request->user(), 'تسجيل خروج إداري');

        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('home');
    }

    protected function raiseSecurityEvent(Request $request, string $type, array $details): void
    {
        SecurityEvent::create([
            'event_type' => $type,
            'severity' => $type === 'BRUTE_FORCE' ? 'CRITICAL' : 'WARNING',
            'ip_address' => $request->ip(),
            'details' => $details + ['user_agent' => $request->userAgent()],
        ]);
    }
}
