<?php

namespace Database\Seeders;

use App\Models\AdminUser;
use Illuminate\Database\Seeder;

/**
 * The nine ministry staff accounts that ship with the platform. Every one of them
 * uses the same bootstrap password so the RBAC matrix can be exercised end to end;
 * rotate it before the portal is exposed publicly.
 */
class AdminUserSeeder extends Seeder
{
    public const BOOTSTRAP_PASSWORD = 'Admin@Kasp2026!';

    public function run(): void
    {
        foreach ($this->staff() as $member) {
            AdminUser::updateOrCreate(['id' => $member['id']], [
                ...$member,
                'password' => self::BOOTSTRAP_PASSWORD,
                'is_active' => true,
                'failed_attempts' => 0,
                'locked_until' => null,
            ]);
        }
    }

    protected function staff(): array
    {
        return [
            [
                'id' => 'admin-super-01',
                'username' => 'super.admin',
                'full_name_ar' => 'د. عبدالإله الغامدي',
                'full_name_en' => 'Dr. Abdulelah Al-Ghamdi',
                'email' => 'admin.kasp@moe.gov.sa',
                'role' => 'SUPER_ADMIN',
                'department' => 'وكالة الوزارة للابتعاث',
                'avatar_url' => 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
                'permissions' => [
                    'pages:write', 'tracks:write', 'universities:write', 'faqs:write',
                    'news:write', 'media:write', 'seo:write', 'ai:write',
                    'users:manage', 'settings:write', 'audit:read', 'backup:manage',
                ],
            ],
            [
                'id' => 'admin-content-02',
                'username' => 'content.lead',
                'full_name_ar' => 'أ. فهد الدوسري',
                'full_name_en' => 'Fahad Al-Dossary',
                'email' => 'f.dossary@moe.gov.sa',
                'role' => 'CONTENT_MANAGER',
                'department' => 'الإدارة العامة للاتصال المؤسسي',
                'avatar_url' => 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
                'permissions' => ['pages:write', 'tracks:write', 'faqs:write', 'news:write', 'media:write', 'seo:write', 'audit:read'],
            ],
            [
                'id' => 'admin-tracks-03',
                'username' => 'tracks.manager',
                'full_name_ar' => 'د. سارة بنت عبد الله التميمي',
                'full_name_en' => 'Dr. Sarah Al-Tamimi',
                'email' => 's.tamimi@moe.gov.sa',
                'role' => 'SCHOLARSHIP_MANAGER',
                'department' => 'إدارة المسارات الاستراتيجية',
                'avatar_url' => null,
                'permissions' => ['tracks:write', 'audit:read'],
            ],
            [
                'id' => 'admin-uni-04',
                'username' => 'uni.manager',
                'full_name_ar' => 'م. راشد بن سلطان المري',
                'full_name_en' => 'Eng. Rashid Al-Marri',
                'email' => 'r.marri@moe.gov.sa',
                'role' => 'UNIVERSITY_MANAGER',
                'department' => 'إدارة التصنيف والاعتماد الأكاديمي',
                'avatar_url' => null,
                'permissions' => ['universities:write', 'audit:read'],
            ],
            [
                'id' => 'admin-faq-05',
                'username' => 'faq.officer',
                'full_name_ar' => 'أ. هند بنت خالد السديري',
                'full_name_en' => 'Hind Al-Sudairi',
                'email' => 'h.sudairi@moe.gov.sa',
                'role' => 'FAQ_MANAGER',
                'department' => 'مركز خدمة المستفيدين (تواصل)',
                'avatar_url' => null,
                'permissions' => ['faqs:write'],
            ],
            [
                'id' => 'admin-media-06',
                'username' => 'media.specialist',
                'full_name_ar' => 'أ. تركي بن صالح الحربي',
                'full_name_en' => 'Turki Al-Harbi',
                'email' => 't.harbi@moe.gov.sa',
                'role' => 'MEDIA_MANAGER',
                'department' => 'الإنتاج الرقمي والإعلامي',
                'avatar_url' => null,
                'permissions' => ['media:write'],
            ],
            [
                'id' => 'admin-ai-07',
                'username' => 'ai.director',
                'full_name_ar' => 'م. نوف بنت فايز الشهراني',
                'full_name_en' => 'Nouf Al-Shahrani',
                'email' => 'n.shahrani@moe.gov.sa',
                'role' => 'AI_MANAGER',
                'department' => 'إدارة الذكاء الاصطناعي والتحول الرقمي',
                'avatar_url' => null,
                'permissions' => ['ai:write', 'audit:read'],
            ],
            [
                'id' => 'admin-editor-08',
                'username' => 'editor.staff',
                'full_name_ar' => 'أ. خالد بن ماجد الغامدي',
                'full_name_en' => 'Khaled Al-Ghamdi',
                'email' => 'k.ghamdi@moe.gov.sa',
                'role' => 'EDITOR',
                'department' => 'تحرير ونشر المحتوى الأكاديمي',
                'avatar_url' => null,
                'permissions' => ['pages:write', 'news:write', 'faqs:write', 'media:write'],
            ],
            [
                'id' => 'admin-viewer-09',
                'username' => 'viewer.auditor',
                'full_name_ar' => 'أ. منيرة بنت سعد العجمي',
                'full_name_en' => 'Munira Al-Ajmi',
                'email' => 'm.ajmi@nazaha.gov.sa',
                'role' => 'VIEWER',
                'department' => 'المراجعة والرقابة الداخلية',
                'avatar_url' => null,
                'permissions' => ['audit:read'],
            ],
        ];
    }
}
