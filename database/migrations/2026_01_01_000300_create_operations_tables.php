<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Operational domain: the scholarship pipeline (applications and their immutable
 * status history), advisory appointments, notifications, the eligibility engine's
 * evaluation log, and the beneficiary reference records shown to reviewers.
 */
return new class extends Migration
{
    public function up(): void
    {
        // Beneficiary / supervisor reference records. These people never sign in here;
        // the rows exist so reviewers can see who an application belongs to.
        Schema::create('platform_users', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('national_id', 10)->nullable()->index();
            $table->string('full_name_ar');
            $table->string('full_name_en')->nullable();
            $table->string('email')->nullable();
            $table->string('phone', 32)->nullable();
            $table->date('date_of_birth')->nullable();
            $table->string('nationality')->default('سعودي');
            $table->string('gender', 16)->nullable();
            $table->string('role', 32)->default('applicant')->index();
            $table->string('avatar_url')->nullable();
            $table->string('cultural_mission_id')->nullable();
            $table->string('organization')->nullable();
            $table->decimal('gpa', 4, 2)->nullable();
            $table->decimal('gpa_scale', 3, 1)->default(5.0);
            $table->decimal('ielts_score', 3, 1)->nullable();
            $table->unsignedSmallInteger('toefl_score')->nullable();
            $table->boolean('yakeen_verified')->default(true);
            $table->boolean('is_active')->default(true);
            $table->timestamp('last_login_at')->nullable();
            $table->timestamps();
        });

        Schema::create('applications', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('application_number')->unique();
            $table->string('platform_user_id')->nullable();
            $table->string('applicant_name');
            $table->string('applicant_national_id', 10)->nullable();
            $table->string('applicant_email')->nullable();
            $table->string('applicant_phone', 32)->nullable();
            $table->string('track_id')->nullable();
            $table->string('university_id')->nullable();
            $table->string('university_name');
            $table->string('university_country')->nullable();
            $table->unsignedInteger('university_rank')->nullable();
            $table->string('major')->nullable();
            $table->string('degree_level', 32)->nullable();
            $table->string('intake_term')->nullable();
            $table->decimal('gpa', 4, 2)->nullable();
            $table->decimal('gpa_scale', 3, 1)->default(5.0);
            $table->decimal('ielts_score', 3, 1)->nullable();
            $table->unsignedSmallInteger('toefl_score')->nullable();
            $table->string('status', 32)->default('draft')->index();
            $table->string('eligibility_status', 32)->default('needs_review');
            $table->unsignedSmallInteger('eligibility_score')->default(0);
            $table->unsignedSmallInteger('progress_percentage')->default(0);
            $table->boolean('financial_guarantee_issued')->default(false);
            $table->string('financial_guarantee_code')->nullable();
            $table->string('admission_letter_path')->nullable();
            $table->json('extracted_data')->nullable();
            $table->json('documents')->nullable();
            $table->json('ai_processing_log')->nullable();
            $table->text('supervisor_notes')->nullable();
            $table->string('reviewed_by')->nullable();
            $table->string('reviewed_by_name')->nullable();
            $table->timestamp('reviewed_at')->nullable();
            $table->timestamp('submitted_at')->nullable();
            $table->timestamps();

            $table->index(['track_id', 'status']);
        });

        Schema::create('application_status_history', function (Blueprint $table) {
            $table->id();
            $table->string('application_id');
            $table->string('from_status', 32)->nullable();
            $table->string('to_status', 32);
            $table->string('changed_by')->nullable();
            $table->string('changed_by_name')->nullable();
            $table->text('change_reason')->nullable();
            $table->timestamps();

            $table->foreign('application_id')->references('id')->on('applications')->cascadeOnDelete();
            $table->index(['application_id', 'created_at']);
        });

        Schema::create('appointments', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('platform_user_id')->nullable();
            $table->string('requester_name');
            $table->string('requester_national_id', 10)->nullable();
            $table->string('requester_email')->nullable();
            $table->string('requester_phone', 32)->nullable();
            $table->string('cultural_mission_id')->nullable();
            $table->string('type', 48)->default('academic_advising');
            $table->string('subject');
            $table->text('description')->nullable();
            $table->date('preferred_date')->nullable();
            $table->string('preferred_time', 32)->nullable();
            $table->unsignedSmallInteger('duration_minutes')->default(30);
            $table->string('status', 32)->default('pending')->index();
            $table->string('assigned_supervisor_id')->nullable();
            $table->string('assigned_supervisor_name')->nullable();
            $table->string('meeting_link')->nullable();
            $table->string('location')->nullable();
            $table->timestamps();

            $table->index(['status', 'preferred_date']);
        });

        Schema::create('platform_notifications', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('platform_user_id')->nullable()->index();
            $table->string('title_ar');
            $table->string('title_en')->nullable();
            $table->text('content_ar');
            $table->text('content_en')->nullable();
            $table->string('type', 32)->default('info');
            $table->boolean('is_read')->default(false);
            $table->string('action_url')->nullable();
            $table->timestamps();
        });

        Schema::create('eligibility_evaluations', function (Blueprint $table) {
            $table->id();
            $table->string('track_id')->nullable();
            $table->string('university_id')->nullable();
            $table->string('session_id')->nullable()->index();
            $table->string('decision', 32);
            $table->unsignedSmallInteger('calculated_score')->default(0);
            $table->json('candidate_data')->nullable();
            $table->json('matched_rules')->nullable();
            $table->json('failed_rules')->nullable();
            $table->json('warnings')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('eligibility_evaluations');
        Schema::dropIfExists('platform_notifications');
        Schema::dropIfExists('appointments');
        Schema::dropIfExists('application_status_history');
        Schema::dropIfExists('applications');
        Schema::dropIfExists('platform_users');
    }
};
