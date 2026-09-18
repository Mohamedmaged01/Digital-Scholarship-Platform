<?php

namespace Tests\Feature;

use App\Models\AdminUser;
use App\Models\AuditLog;
use App\Models\SecurityEvent;
use Database\Seeders\AdminUserSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminAccessTest extends TestCase
{
    use RefreshDatabase;

    public function test_the_console_is_closed_to_guests(): void
    {
        $this->get(route('admin.dashboard'))->assertRedirect(route('admin.login'));
    }

    public function test_staff_can_sign_in_with_a_username_or_a_ministry_email(): void
    {
        foreach (['super.admin', 'admin.kasp@moe.gov.sa'] as $identifier) {
            $this->post(route('admin.login.attempt'), [
                'identifier' => $identifier,
                'password' => AdminUserSeeder::BOOTSTRAP_PASSWORD,
            ])->assertRedirect(route('admin.dashboard'));

            $this->assertAuthenticated();
            $this->post(route('admin.logout'));
        }
    }

    public function test_a_successful_sign_in_is_recorded(): void
    {
        $this->post(route('admin.login.attempt'), [
            'identifier' => 'super.admin',
            'password' => AdminUserSeeder::BOOTSTRAP_PASSWORD,
        ]);

        $this->assertDatabaseHas('audit_logs', [
            'action' => 'LOGIN',
            'actor_id' => 'admin-super-01',
        ]);

        $this->assertNotNull(AdminUser::find('admin-super-01')->last_login_at);
    }

    public function test_a_wrong_password_is_rejected_logged_and_counted(): void
    {
        $this->post(route('admin.login.attempt'), [
            'identifier' => 'super.admin',
            'password' => 'not-the-password',
        ])->assertSessionHasErrors('identifier');

        $this->assertGuest();
        $this->assertSame(1, AdminUser::find('admin-super-01')->failed_attempts);
        $this->assertDatabaseHas('audit_logs', ['action' => 'FAILED_LOGIN']);
        $this->assertTrue(SecurityEvent::query()->where('event_type', 'BRUTE_FORCE')->exists());
    }

    public function test_repeated_failures_lock_the_account(): void
    {
        $max = (int) config('kasp.security.max_failed_logins');

        for ($attempt = 0; $attempt < $max; $attempt++) {
            $this->post(route('admin.login.attempt'), [
                'identifier' => 'super.admin',
                'password' => 'wrong',
            ]);
        }

        $this->assertTrue(AdminUser::find('admin-super-01')->isLocked());

        // Even the correct password is refused while the lockout window is open.
        $this->post(route('admin.login.attempt'), [
            'identifier' => 'super.admin',
            'password' => AdminUserSeeder::BOOTSTRAP_PASSWORD,
        ])->assertSessionHasErrors('identifier');

        $this->assertGuest();
    }

    public function test_a_suspended_account_cannot_sign_in(): void
    {
        AdminUser::find('admin-viewer-09')->forceFill(['is_active' => false])->save();

        $this->post(route('admin.login.attempt'), [
            'identifier' => 'viewer.auditor',
            'password' => AdminUserSeeder::BOOTSTRAP_PASSWORD,
        ])->assertSessionHasErrors('identifier');

        $this->assertGuest();
    }

    public function test_signing_out_is_recorded(): void
    {
        $this->actingAs(AdminUser::find('admin-super-01'))
            ->post(route('admin.logout'))
            ->assertRedirect(route('home'));

        $this->assertGuest();
        $this->assertDatabaseHas('audit_logs', ['action' => 'LOGOUT']);
    }

    public function test_a_super_admin_reaches_every_section(): void
    {
        $this->actingAs(AdminUser::find('admin-super-01'));

        foreach ($this->sectionRoutes() as $url) {
            $this->get($url)->assertOk();
        }
    }

    public function test_a_role_only_reaches_the_sections_it_is_granted(): void
    {
        $this->actingAs(AdminUser::find('admin-faq-05')); // FAQ_MANAGER — faqs only

        $this->get(route('admin.faqs.index'))->assertOk();

        foreach ([
            route('admin.dashboard'),
            route('admin.tracks.index'),
            route('admin.users.index'),
            route('admin.settings.edit'),
            route('admin.audit.index'),
        ] as $url) {
            $this->get($url)->assertForbidden();
        }
    }

    public function test_a_write_outside_a_role_permission_is_refused(): void
    {
        $this->actingAs(AdminUser::find('admin-faq-05'));

        $this->post(route('admin.tracks.store'), ['code' => 'NEW'])->assertForbidden();
    }

    public function test_a_read_only_role_cannot_write(): void
    {
        $this->actingAs(AdminUser::find('admin-viewer-09')); // VIEWER

        $this->get(route('admin.tracks.index'))->assertOk();
        $this->delete(route('admin.tracks.destroy', 'pioneers'))->assertForbidden();
    }

    public function test_the_restricted_screen_names_the_blocking_role(): void
    {
        $this->actingAs(AdminUser::find('admin-faq-05'))
            ->get(route('admin.users.index'))
            ->assertForbidden()
            ->assertSee(__('admin.restricted_title'));
    }

    public function test_an_administrator_cannot_delete_their_own_account(): void
    {
        $actor = AdminUser::find('admin-super-01');

        $this->actingAs($actor)
            ->delete(route('admin.users.destroy', $actor))
            ->assertSessionHasErrors('user');

        $this->assertModelExists($actor);
    }

    public function test_the_last_super_admin_cannot_be_deleted(): void
    {
        $actor = AdminUser::find('admin-super-01');

        // A second super admin who is the only other holder of the role.
        $spare = AdminUser::create([
            'id' => 'admin-spare',
            'username' => 'spare.admin',
            'full_name_ar' => 'مشرف احتياطي',
            'email' => 'spare@moe.gov.sa',
            'password' => 'Spare@Password1!',
            'role' => 'SUPER_ADMIN',
            'permissions' => [],
            'is_active' => true,
        ]);

        // Deleting the spare is fine — the actor still holds the role.
        $this->actingAs($actor)->delete(route('admin.users.destroy', $spare))->assertRedirect();
        $this->assertModelMissing($spare);

        // Now the actor is the last one, and deleting themselves is refused twice over.
        $this->actingAs($actor)
            ->delete(route('admin.users.destroy', $actor))
            ->assertSessionHasErrors('user');
    }

    public function test_every_administrative_write_lands_in_the_audit_log(): void
    {
        AuditLog::query()->delete();

        $this->actingAs(AdminUser::find('admin-super-01'))
            ->put(route('admin.faqs.update', 'faq-adm-1'), [
                'question_ar' => 'سؤال محدث',
                'question_en' => 'Updated question',
                'answer_ar' => 'إجابة محدثة',
                'answer_en' => 'Updated answer',
                'category' => 'admission',
                'sort_order' => 1,
                'is_published' => '1',
            ])->assertRedirect();

        $log = AuditLog::query()->newestFirst()->firstOrFail();

        $this->assertSame('UPDATE', $log->action);
        $this->assertSame('FAQ', $log->entity_type);
        $this->assertSame('admin-super-01', $log->actor_id);
        $this->assertNotNull($log->changes_after);
    }

    /** @return list<string> */
    protected function sectionRoutes(): array
    {
        return [
            route('admin.dashboard'),
            route('admin.tracks.index'),
            route('admin.universities.index'),
            route('admin.countries.index'),
            route('admin.faqs.index'),
            route('admin.news.index'),
            route('admin.pages.index'),
            route('admin.media.index'),
            route('admin.ai.index'),
            route('admin.users.index'),
            route('admin.audit.index'),
            route('admin.settings.edit'),
        ];
    }
}
