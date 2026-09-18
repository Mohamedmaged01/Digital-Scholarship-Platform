<?php

namespace Database\Seeders;

use App\Models\AiConfig;
use App\Models\AnalyticsCounter;
use App\Models\Application;
use App\Models\Appointment;
use App\Models\AuditLog;
use App\Models\PlatformNotification;
use App\Models\PlatformUser;
use App\Models\ScholarshipTrack;
use App\Models\UnansweredQuestion;
use App\Models\University;
use Database\Seeders\Concerns\ReadsLegacyData;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class OperationsSeeder extends Seeder
{
    use ReadsLegacyData;

    public function run(): void
    {
        $this->seedPlatformUsers();
        $this->seedApplications();
        $this->seedAppointments();
        $this->seedNotifications();
        $this->seedAuditLogs();
        $this->seedAiConfig();
        $this->seedAnalytics();
    }

    protected function seedPlatformUsers(): void
    {
        foreach ($this->dataset('platform_users') as $row) {
            PlatformUser::updateOrCreate(['id' => $row['id']], [
                'national_id' => $row['nationalId'] ?? null,
                'full_name_ar' => $row['fullName'],
                'full_name_en' => $row['fullNameEn'] ?? null,
                'email' => $row['email'] ?? null,
                'phone' => $row['phone'] ?? null,
                'date_of_birth' => $row['dateOfBirth'] ?? null,
                'nationality' => $row['nationality'] ?? 'سعودي',
                'gender' => $row['gender'] ?? null,
                'role' => $row['role'] ?? 'applicant',
                'avatar_url' => $row['avatarUrl'] ?? null,
                'organization' => $row['organization'] ?? null,
                'cultural_mission_id' => $row['culturalMission'] ?? $row['assignedMission'] ?? null,
                'yakeen_verified' => (bool) ($row['yakeenVerified'] ?? true),
                'is_active' => (bool) ($row['isActive'] ?? true),
                'last_login_at' => $this->asTimestamp($row['lastLogin'] ?? null),
            ]);
        }
    }

    protected function seedApplications(): void
    {
        $universitiesByName = University::query()->get()->keyBy('name_en');

        foreach ($this->dataset('applications') as $row) {
            $university = $universitiesByName->first(
                fn (University $candidate): bool => Str::contains($row['universityName'], $candidate->name_en)
                    || Str::contains($candidate->name_en, $row['universityName']),
            );

            $application = Application::updateOrCreate(['id' => $row['id']], [
                'application_number' => $row['applicationNumber'],
                'platform_user_id' => PlatformUser::whereKey($row['userId'] ?? null)->exists() ? $row['userId'] : null,
                'applicant_name' => $row['userName'],
                'applicant_national_id' => $row['userNationalId'] ?? null,
                'applicant_email' => $row['userEmail'] ?? null,
                'applicant_phone' => $row['userPhone'] ?? null,
                'track_id' => ScholarshipTrack::whereKey($row['trackId'] ?? null)->exists() ? $row['trackId'] : null,
                'university_id' => $university?->id,
                'university_name' => $row['universityName'],
                'university_country' => $row['universityCountry'] ?? null,
                'university_rank' => $row['universityRank'] ?? null,
                'major' => $row['major'] ?? null,
                'degree_level' => $row['degreeLevel'] ?? null,
                'intake_term' => $row['intakeTerm'] ?? 'Fall 2026',
                'gpa' => $row['userGpa'] ?? null,
                'ielts_score' => $row['userIelts'] ?? null,
                'status' => $this->applicationStatus($row['applicationStatus'] ?? 'submitted'),
                'eligibility_status' => $row['eligibilityStatus'] ?? 'needs_review',
                'eligibility_score' => (int) round(($row['progressPercentage'] ?? 0)),
                'progress_percentage' => (int) ($row['progressPercentage'] ?? 0),
                'financial_guarantee_issued' => (bool) ($row['financialGuaranteeIssued'] ?? false),
                'admission_letter_path' => $row['admissionLetterPath'] ?? null,
                'extracted_data' => $row['extractedData'] ?? null,
                'documents' => $row['documents'] ?? null,
                'ai_processing_log' => $row['aiProcessingLog'] ?? null,
                'supervisor_notes' => $row['supervisorNotes'] ?? null,
                'reviewed_by' => $row['reviewedBy'] ?? null,
                'reviewed_by_name' => $row['reviewedByName'] ?? null,
                'reviewed_at' => $this->asTimestamp($row['reviewedAt'] ?? null),
                'submitted_at' => $this->asTimestamp($row['submittedAt'] ?? null),
                'created_at' => $this->asTimestamp($row['createdAt'] ?? null) ?? now(),
                'updated_at' => $this->asTimestamp($row['updatedAt'] ?? null) ?? now(),
            ]);

            if ($application->statusHistory()->doesntExist()) {
                $application->statusHistory()->create([
                    'from_status' => null,
                    'to_status' => $application->status,
                    'changed_by' => $row['reviewedBy'] ?? null,
                    'changed_by_name' => $row['reviewedByName'] ?? 'النظام',
                    'change_reason' => 'ترحيل السجل من المنظومة السابقة',
                    'created_at' => $application->updated_at,
                    'updated_at' => $application->updated_at,
                ]);
            }
        }
    }

    /** The legacy UI used "decision_issued" / "approved" for the same terminal state. */
    protected function applicationStatus(string $status): string
    {
        return match ($status) {
            'decision_issued', 'approved' => 'accepted',
            'nominated' => 'nominated',
            'under_review' => 'under_review',
            'rejected' => 'rejected',
            default => 'submitted',
        };
    }

    protected function seedAppointments(): void
    {
        foreach ($this->dataset('appointments') as $row) {
            Appointment::updateOrCreate(['id' => $row['id']], [
                'platform_user_id' => PlatformUser::whereKey($row['userId'] ?? null)->exists() ? $row['userId'] : null,
                'requester_name' => $row['userName'],
                'requester_national_id' => $row['userNationalId'] ?? null,
                'type' => $row['type'] ?? 'academic_advising',
                'subject' => $row['subject'],
                'description' => $row['description'] ?? null,
                'preferred_date' => $row['preferredDate'] ?? null,
                'preferred_time' => $row['preferredTime'] ?? null,
                'status' => $row['status'] ?? 'pending',
                'assigned_supervisor_id' => $row['assignedSupervisorId'] ?? null,
                'assigned_supervisor_name' => $row['assignedSupervisorName'] ?? null,
                'meeting_link' => $row['meetingLink'] ?? null,
                'location' => $row['location'] ?? null,
                'created_at' => $this->asTimestamp($row['createdAt'] ?? null) ?? now(),
            ]);
        }
    }

    protected function seedNotifications(): void
    {
        foreach ($this->dataset('notifications') as $row) {
            PlatformNotification::updateOrCreate(['id' => $row['id']], [
                'platform_user_id' => PlatformUser::whereKey($row['userId'] ?? null)->exists() ? $row['userId'] : null,
                'title_ar' => $row['title'],
                'content_ar' => $row['content'],
                'type' => $row['type'] ?? 'info',
                'is_read' => (bool) ($row['isRead'] ?? false),
                'created_at' => $this->asTimestamp($row['createdAt'] ?? null) ?? now(),
            ]);
        }
    }

    protected function seedAuditLogs(): void
    {
        foreach ($this->dataset('audit_logs') as $row) {
            // "الصفحة الرئيسية (page-home)" -> label + id
            preg_match('/^(.*?)\s*\((.+)\)$/u', (string) $row['targetEntity'], $matches);

            AuditLog::updateOrCreate(
                ['id' => (int) Str::afterLast($row['id'], '-')],
                [
                    'actor_name' => $row['actorName'],
                    'actor_role' => $row['actorRole'],
                    'action' => $row['action'],
                    'entity_type' => $this->auditEntityType($row['targetEntity']),
                    'entity_id' => $matches[2] ?? null,
                    'entity_label' => trim($matches[1] ?? $row['targetEntity']),
                    'ip_address' => $row['ipAddress'] ?? null,
                    'changes_summary' => $row['details'] ?? null,
                    'changes_before' => filled($row['previousValue'] ?? null) ? ['value' => $row['previousValue']] : null,
                    'changes_after' => filled($row['newValue'] ?? null) ? ['value' => $row['newValue']] : null,
                    'created_at' => $this->asTimestamp($row['timestamp'] ?? null) ?? now(),
                ],
            );
        }
    }

    protected function auditEntityType(string $label): string
    {
        return match (true) {
            Str::contains($label, ['صفحة', 'page']) => 'PAGE',
            Str::contains($label, ['مسار', 'track']) => 'TRACK',
            Str::contains($label, ['جامع', 'uni']) => 'UNIVERSITY',
            Str::contains($label, ['سؤال', 'faq']) => 'FAQ',
            Str::contains($label, ['خبر', 'news']) => 'NEWS',
            Str::contains($label, ['وسائط', 'media']) => 'MEDIA',
            Str::contains($label, ['مستخدم', 'user']) => 'USER',
            default => 'SETTINGS',
        };
    }

    protected function seedAiConfig(): void
    {
        $config = AiConfig::query()->first() ?? new AiConfig;

        $config->forceFill([
            'model_name' => config('kasp.ai.gemini.model'),
            'system_prompt_ar' => 'أنت المستشار الذكي الرسمي لبرنامج خادم الحرمين الشريفين للابتعاث. أجب بدقة واختصار من الأنظمة والشروط المعتمدة فقط، '.
                'ووجّه المستفيد دائماً إلى بوابة الابتعاث الموحدة لإتمام التقديم. لا تقدّم وعوداً بالقبول ولا تخترع شروطاً غير منشورة.',
            'system_prompt_en' => 'You are the official AI advisor of the Custodian of the Two Holy Mosques Scholarship Program. '.
                'Answer only from published tracks, criteria and accredited institutions, and always direct applicants to the official '.
                'unified portal to apply. Never promise admission or invent criteria.',
            'temperature' => 0.4,
            'max_output_tokens' => 1024,
            'is_enabled' => true,
            'use_faq_knowledge_base' => true,
            'log_unanswered' => true,
            'suggested_prompts_ar' => [
                'ما المسار المناسب لي؟',
                'ما شروط مسار الرواد؟',
                'كيف أقدم على الابتعاث؟',
                'ما الجامعات المتاحة؟',
                'ما المستندات المطلوبة؟',
            ],
            'suggested_prompts_en' => [
                'Which track is right for me?',
                'What are the requirements for the Pioneers track?',
                'How do I apply for a scholarship?',
                'What universities are available?',
                'What documents are required?',
            ],
            'fallback_message_ar' => 'أهلاً بك! يمكنك الاستفسار عن مسارات الابتعاث، شروط القبول، أو الجامعات المعتمدة وسأكون سعيداً بمساعدتك.',
            'fallback_message_en' => 'Welcome! Ask me about scholarship tracks, eligibility criteria, or accredited universities.',
        ])->save();

        $pending = [
            ['question' => 'هل يمكن تحويل الابتعاث من جامعة إلى أخرى بعد صدور القرار؟', 'category' => 'post_nomination', 'hits' => 14],
            ['question' => 'هل يشترط اختبار GRE في مسار البحث والتطوير؟', 'category' => 'requirements', 'hits' => 9],
            ['question' => 'Does the Health track cover clinical fellowship exam fees?', 'category' => 'tracks', 'language' => 'en', 'hits' => 6],
        ];

        foreach ($pending as $row) {
            UnansweredQuestion::firstOrCreate(
                ['question' => $row['question']],
                [
                    'language' => $row['language'] ?? 'ar',
                    'category' => $row['category'],
                    'hits' => $row['hits'],
                    'session_id' => 'seed-'.Str::lower(Str::random(6)),
                ],
            );
        }
    }

    protected function seedAnalytics(): void
    {
        $counters = [
            'visitors.total' => 342850,
            'visitors.today' => 4821,
            'ai.chat_sessions' => 18432,
            'ai.finder_runs' => 6210,
        ];

        foreach (ScholarshipTrack::query()->pluck('id') as $trackId) {
            $counters['track_views.'.$trackId] = random_int(4200, 38000);
        }

        foreach ($counters as $key => $value) {
            AnalyticsCounter::updateOrCreate(['key' => $key], ['value' => $value]);
        }
    }
}
