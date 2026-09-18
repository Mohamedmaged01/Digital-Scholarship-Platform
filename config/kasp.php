<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Official external destinations
    |--------------------------------------------------------------------------
    |
    | This portal is informational. Scholarship applications are submitted
    | exclusively on the Ministry of Education's official platform, so every
    | "Apply" call to action points outward at the URL configured here.
    |
    */

    'apply_url' => env('KASP_APPLY_URL', 'https://kasp.moe.gov.sa'),
    'moe_url' => env('KASP_MOE_URL', 'https://moe.gov.sa'),
    'vision_url' => env('KASP_VISION_URL', 'https://www.vision2030.gov.sa'),

    'support' => [
        'phone' => env('KASP_SUPPORT_PHONE', '19996'),
        'email' => env('KASP_SUPPORT_EMAIL', 'scholarship@moe.gov.sa'),
    ],

    /*
    |--------------------------------------------------------------------------
    | Supported locales
    |--------------------------------------------------------------------------
    */

    'locales' => [
        'ar' => ['name' => 'العربية', 'dir' => 'rtl', 'switch_label' => 'EN'],
        'en' => ['name' => 'English', 'dir' => 'ltr', 'switch_label' => 'عربي'],
    ],

    /*
    |--------------------------------------------------------------------------
    | AI advisor
    |--------------------------------------------------------------------------
    |
    | driver "engine" answers from the FAQ knowledge base and the built-in
    | rule-based scholarship engine. driver "gemini" tries Gemini first and
    | falls back to the engine whenever the key is missing or the call fails.
    |
    */

    'ai' => [
        'driver' => env('AI_ASSISTANT_DRIVER', 'engine'),
        'gemini' => [
            'key' => env('GEMINI_API_KEY'),
            'model' => env('GEMINI_MODEL', 'gemini-2.5-flash'),
            'endpoint' => 'https://generativelanguage.googleapis.com/v1beta/models',
            'timeout' => 20,
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Administrative RBAC matrix
    |--------------------------------------------------------------------------
    |
    | Each administrative role maps to the dashboard sections it may open and
    | the coarse capabilities it holds. Fine-grained permissions live on the
    | admin_users.permissions column; SUPER_ADMIN bypasses every check.
    |
    */

    'roles' => [
        'SUPER_ADMIN' => [
            'label_ar' => 'المشرف العام (Super Admin)',
            'label_en' => 'Super Administrator',
            'sections' => ['statistics', 'tracks', 'universities', 'countries', 'faqs', 'news', 'pages', 'media', 'ai', 'users', 'audit', 'settings'],
            'can_edit' => true,
            'can_publish' => true,
            'can_manage_users' => true,
            'can_manage_settings' => true,
        ],
        'CONTENT_MANAGER' => [
            'label_ar' => 'مدير المحتوى (Content Manager)',
            'label_en' => 'Content Manager',
            'sections' => ['statistics', 'pages', 'news', 'faqs', 'media'],
            'can_edit' => true,
            'can_publish' => true,
            'can_manage_users' => false,
            'can_manage_settings' => false,
        ],
        'SCHOLARSHIP_MANAGER' => [
            'label_ar' => 'مدير مسارات الابتعاث (Scholarship Manager)',
            'label_en' => 'Scholarship Tracks Manager',
            'sections' => ['statistics', 'tracks', 'countries'],
            'can_edit' => true,
            'can_publish' => true,
            'can_manage_users' => false,
            'can_manage_settings' => false,
        ],
        'UNIVERSITY_MANAGER' => [
            'label_ar' => 'مدير الجامعات والتخصصات (University Manager)',
            'label_en' => 'University & Majors Manager',
            'sections' => ['statistics', 'universities', 'countries'],
            'can_edit' => true,
            'can_publish' => true,
            'can_manage_users' => false,
            'can_manage_settings' => false,
        ],
        'FAQ_MANAGER' => [
            'label_ar' => 'مدير الأسئلة الشائعة (FAQ Manager)',
            'label_en' => 'FAQ & Inquiries Manager',
            'sections' => ['faqs'],
            'can_edit' => true,
            'can_publish' => true,
            'can_manage_users' => false,
            'can_manage_settings' => false,
        ],
        'MEDIA_MANAGER' => [
            'label_ar' => 'مدير الوسائط الرقمية (Media Manager)',
            'label_en' => 'Digital Media Manager',
            'sections' => ['media'],
            'can_edit' => true,
            'can_publish' => true,
            'can_manage_users' => false,
            'can_manage_settings' => false,
        ],
        'SEO_MANAGER' => [
            'label_ar' => 'مدير محركات البحث (SEO Manager)',
            'label_en' => 'SEO & Metadata Manager',
            'sections' => ['pages', 'settings'],
            'can_edit' => true,
            'can_publish' => true,
            'can_manage_users' => false,
            'can_manage_settings' => false,
        ],
        'AI_MANAGER' => [
            'label_ar' => 'مدير محركات الذكاء الاصطناعي (AI Manager)',
            'label_en' => 'AI & Chatbot Knowledge Manager',
            'sections' => ['statistics', 'ai'],
            'can_edit' => true,
            'can_publish' => true,
            'can_manage_users' => false,
            'can_manage_settings' => false,
        ],
        'EDITOR' => [
            'label_ar' => 'محرر محتوى (Editor)',
            'label_en' => 'Content Editor',
            'sections' => ['pages', 'news', 'faqs', 'media'],
            'can_edit' => true,
            'can_publish' => false,
            'can_manage_users' => false,
            'can_manage_settings' => false,
        ],
        'VIEWER' => [
            'label_ar' => 'مستعرض / مراقب (Viewer)',
            'label_en' => 'Read-only Auditor / Viewer',
            'sections' => ['statistics', 'tracks', 'universities', 'countries', 'faqs', 'news', 'pages', 'media', 'audit'],
            'can_edit' => false,
            'can_publish' => false,
            'can_manage_users' => false,
            'can_manage_settings' => false,
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Granular permissions reference
    |--------------------------------------------------------------------------
    */

    'permissions' => [
        'pages:write' => 'إدارة وتعديل صفحات الموقع ونشرها',
        'tracks:write' => 'إدارة وتعديل مسارات الابتعاث وشروطها',
        'universities:write' => 'إدارة الجامعات المصنفة والتخصصات',
        'faqs:write' => 'إدارة الأسئلة الشائعة وتصنيفاتها',
        'news:write' => 'تحرير ونشر الأخبار والإعلانات الصحفية',
        'media:write' => 'رفع وإدارة مكتبة الوسائط والمستندات',
        'seo:write' => 'ضبط إعدادات محركات البحث والكلمات المفتاحية',
        'ai:write' => 'تدريب وضبط محرك المستشار الذكي وقواعد البيانات',
        'users:manage' => 'إدارة المستخدمين الإداريين ومصفوفة الصلاحيات',
        'settings:write' => 'تعديل الإعدادات العامة للمنصة ووضع الصيانة',
        'audit:read' => 'استعراض سجل التدقيق الأمني والأحداث',
        'backup:manage' => 'تصدير واستعادة النسخ الاحتياطية',
    ],

    /*
    |--------------------------------------------------------------------------
    | Security
    |--------------------------------------------------------------------------
    */

    'security' => [
        'max_failed_logins' => 5,
        'lockout_minutes' => 15,
    ],
];
