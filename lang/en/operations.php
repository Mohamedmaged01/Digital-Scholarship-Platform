<?php

// Application pipeline, appointments and beneficiary roles.

return [
    'application_status' => [
        'draft' => 'Draft',
        'in_progress' => 'In progress',
        'submitted' => 'Submitted',
        'under_review' => 'Under review',
        'needs_information' => 'Needs information',
        'eligibility_check' => 'Eligibility check',
        'nominated' => 'Nominated',
        'accepted' => 'Decree issued',
        'rejected' => 'Rejected',
        'withdrawn' => 'Withdrawn',
        'completed' => 'Completed',
    ],

    'eligibility_status' => [
        'eligible' => 'Eligible',
        'not_eligible' => 'Not eligible',
        'conditionally_eligible' => 'Conditionally eligible',
        'needs_review' => 'Needs review',
    ],

    'appointment_types' => [
        'academic_advising' => 'Academic advising',
        'visa_inquiry' => 'Visa inquiry',
        'scholarship_contract' => 'Scholarship contract & academic start',
        'financial_guarantee' => 'Financial guarantee',
        'general_support' => 'General support',
    ],

    'appointment_status' => [
        'pending' => 'Awaiting confirmation',
        'confirmed' => 'Confirmed',
        'completed' => 'Completed',
        'cancelled' => 'Cancelled',
        'rescheduled' => 'Rescheduled',
    ],

    'platform_roles' => [
        'applicant' => 'Applicant / scholar',
        'supervisor' => 'Academic supervisor',
        'admin' => 'Ministry administrator',
        'donor' => 'Sponsoring entity',
    ],
];
