<?php

// Application pipeline, appointments and beneficiary roles.

return [
    'application_status' => [
        'draft' => 'مسودة',
        'in_progress' => 'قيد الاستكمال',
        'submitted' => 'تم التقديم',
        'under_review' => 'تحت المراجعة',
        'needs_information' => 'بحاجة لاستكمال بيانات',
        'eligibility_check' => 'فحص الأهلية',
        'nominated' => 'مُرشَّح',
        'accepted' => 'صدر قرار الابتعاث',
        'rejected' => 'مرفوض',
        'withdrawn' => 'منسحب',
        'completed' => 'مكتمل',
    ],

    'eligibility_status' => [
        'eligible' => 'مستوفٍ للشروط',
        'not_eligible' => 'غير مستوفٍ',
        'conditionally_eligible' => 'مستوفٍ بشروط',
        'needs_review' => 'بحاجة لمراجعة',
    ],

    'appointment_types' => [
        'academic_advising' => 'إرشاد أكاديمي',
        'visa_inquiry' => 'استفسار عن التأشيرة',
        'scholarship_contract' => 'عقد الابتعاث والبدء الأكاديمي',
        'financial_guarantee' => 'الضمان المالي',
        'general_support' => 'دعم عام',
    ],

    'appointment_status' => [
        'pending' => 'بانتظار التأكيد',
        'confirmed' => 'مؤكَّد',
        'completed' => 'منتهٍ',
        'cancelled' => 'ملغى',
        'rescheduled' => 'أُعيد تحديده',
    ],

    'platform_roles' => [
        'applicant' => 'متقدم / مبتعث',
        'supervisor' => 'مشرف أكاديمي',
        'admin' => 'مشرف وزاري',
        'donor' => 'جهة راعية',
    ],
];
