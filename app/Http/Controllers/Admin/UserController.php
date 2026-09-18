<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AdminUser;
use App\Services\AuditLogger;
use Illuminate\Contracts\View\View;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class UserController extends Controller
{
    public function __construct(protected AuditLogger $audit) {}

    public function index(): View
    {
        return view('admin.users.index', [
            'users' => AdminUser::query()->orderBy('role')->orderBy('full_name_ar')->get(),
            'roles' => config('kasp.roles'),
            'permissions' => config('kasp.permissions'),
        ]);
    }

    public function create(): View
    {
        return view('admin.users.form', [
            'user' => new AdminUser([
                'role' => 'VIEWER',
                'permissions' => ['audit:read'],
                'is_active' => true,
            ]),
            ...$this->formOptions(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validated($request);

        $user = AdminUser::create([
            ...$data,
            'id' => 'admin-'.Str::slug(Str::limit($data['username'], 20, '')).'-'.Str::lower(Str::random(4)),
        ]);

        $this->audit->recordModel('CREATE', 'USER', $user, $user->username, 'إنشاء حساب إداري بدور '.$user->role);

        return redirect()->route('admin.users.index')->with('status', __('common.created'));
    }

    public function edit(AdminUser $user): View
    {
        return view('admin.users.form', [
            'user' => $user,
            ...$this->formOptions(),
        ]);
    }

    public function update(Request $request, AdminUser $user): RedirectResponse
    {
        $data = $this->validated($request, $user);
        $previousRole = $user->role;

        $user->fill($data)->save();

        $this->audit->recordModel(
            'UPDATE',
            'USER',
            $user,
            $user->username,
            $previousRole === $user->role
                ? 'تعديل بيانات حساب إداري'
                : 'تعديل الدور الوظيفي من '.$previousRole.' إلى '.$user->role,
        );

        return back()->with('status', __('common.updated'));
    }

    public function destroy(Request $request, AdminUser $user): RedirectResponse
    {
        if ($user->is($request->user())) {
            return back()->withErrors(['user' => __('admin.users.cannot_delete_self')]);
        }

        // Never leave the platform without a way back in.
        $remainingSuperAdmins = AdminUser::query()
            ->where('role', 'SUPER_ADMIN')
            ->where('is_active', true)
            ->whereKeyNot($user->id)
            ->count();

        if ($user->isSuperAdmin() && $remainingSuperAdmins === 0) {
            return back()->withErrors(['user' => __('admin.users.cannot_delete_last_super')]);
        }

        $label = $user->username;
        $user->delete();

        $this->audit->record('DELETE', 'USER', $user->id, $label, 'حذف حساب إداري');

        return redirect()->route('admin.users.index')->with('status', __('common.deleted'));
    }

    protected function validated(Request $request, ?AdminUser $user = null): array
    {
        $data = $request->validate([
            'username' => ['required', 'string', 'max:64', 'regex:/^[a-zA-Z0-9._-]+$/', Rule::unique('admin_users', 'username')->ignore($user?->id, 'id')],
            'full_name_ar' => ['required', 'string', 'max:190'],
            'full_name_en' => ['nullable', 'string', 'max:190'],
            'email' => ['required', 'email', 'max:190', Rule::unique('admin_users', 'email')->ignore($user?->id, 'id')],
            'role' => ['required', Rule::in(array_keys(config('kasp.roles')))],
            'department' => ['nullable', 'string', 'max:190'],
            'avatar_url' => ['nullable', 'string', 'max:2048'],
            'permissions' => ['nullable', 'array'],
            'permissions.*' => [Rule::in(array_keys(config('kasp.permissions')))],
            'password' => [$user ? 'nullable' : 'required', 'confirmed', Password::min(10)->letters()->numbers()->symbols()],
            'is_active' => ['nullable', 'boolean'],
        ]);

        $data['permissions'] = $data['permissions'] ?? [];
        $data['is_active'] = $request->boolean('is_active');

        if (blank($data['password'] ?? null)) {
            unset($data['password']);
        }

        return $data;
    }

    protected function formOptions(): array
    {
        return [
            'roles' => config('kasp.roles'),
            'permissions' => config('kasp.permissions'),
        ];
    }
}
