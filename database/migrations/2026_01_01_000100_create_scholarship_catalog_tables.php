<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Scholarship catalog: the six national tracks, their dynamically configurable
 * requirement rules, host countries, accredited universities and the many-to-many
 * accreditation between a university and the tracks it is approved for.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('scholarship_tracks', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('code')->unique();
            $table->string('slug')->unique();
            $table->string('name_ar');
            $table->string('name_en');
            $table->text('description_ar');
            $table->text('description_en');
            $table->text('objective_ar')->nullable();
            $table->text('objective_en')->nullable();
            $table->string('badge_color')->default('emerald');
            $table->string('icon_name')->default('graduation-cap');
            $table->string('image_url')->nullable();
            $table->decimal('min_gpa', 4, 2)->default(3.00);
            $table->unsignedSmallInteger('max_age')->default(35);
            $table->decimal('required_ielts', 3, 1)->default(6.5);
            $table->unsignedSmallInteger('required_toefl')->default(85);
            $table->unsignedInteger('top_universities_rank_limit')->default(30);
            $table->json('required_degrees');
            $table->json('target_sectors_ar');
            $table->json('target_sectors_en')->nullable();
            $table->json('features_ar');
            $table->json('features_en')->nullable();
            $table->json('details')->nullable();
            $table->unsignedInteger('allocated_seats')->default(0);
            $table->unsignedInteger('filled_seats')->default(0);
            $table->unsignedSmallInteger('sort_order')->default(1);
            $table->boolean('is_active')->default(true);
            $table->boolean('is_published')->default(true);
            $table->timestamps();

            $table->index(['is_active', 'sort_order']);
        });

        // Admins tune eligibility thresholds here instead of in application code.
        Schema::create('requirement_rules', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('track_id');
            $table->string('rule_code');
            $table->string('title_ar');
            $table->string('title_en');
            $table->string('field_name');
            $table->string('operator', 16);
            $table->json('expected_value');
            $table->boolean('is_mandatory')->default(true);
            $table->unsignedSmallInteger('weight')->default(10);
            $table->text('error_message_ar');
            $table->text('error_message_en');
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->foreign('track_id')->references('id')->on('scholarship_tracks')->cascadeOnDelete();
            $table->index(['track_id', 'is_active']);
        });

        Schema::create('countries', function (Blueprint $table) {
            $table->string('code', 2)->primary();
            $table->string('name_ar');
            $table->string('name_en');
            $table->string('flag_emoji', 16)->nullable();
            $table->string('region_ar')->nullable();
            $table->string('region_en')->nullable();
            $table->string('primary_language')->nullable();
            $table->unsignedInteger('approved_universities_count')->default(0);
            $table->unsignedSmallInteger('visa_processing_days')->default(30);
            $table->text('visa_overview_ar')->nullable();
            $table->text('visa_overview_en')->nullable();
            $table->string('cultural_mission_city_ar')->nullable();
            $table->string('cultural_mission_city_en')->nullable();
            $table->string('image_url')->nullable();
            $table->boolean('is_popular')->default(false);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('universities', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('name_ar');
            $table->string('name_en');
            $table->string('country_code', 2);
            $table->string('country_ar');
            $table->string('country_en');
            $table->string('city_ar');
            $table->string('city_en')->nullable();
            $table->unsignedInteger('qs_rank');
            $table->unsignedInteger('the_rank')->nullable();
            $table->unsignedInteger('shanghai_rank')->nullable();
            $table->decimal('min_ielts', 3, 1)->default(6.5);
            $table->unsignedSmallInteger('min_toefl')->default(85);
            $table->string('acceptance_rate', 16)->nullable();
            $table->json('top_majors_ar');
            $table->json('top_majors_en');
            $table->json('degrees_available');
            $table->string('website_url')->nullable();
            $table->string('logo_url')->nullable();
            $table->string('image_url')->nullable();
            $table->string('cultural_mission_id')->nullable();
            $table->boolean('is_top_30')->default(false);
            $table->boolean('is_top_100')->default(false);
            $table->boolean('is_top_200')->default(false);
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index('qs_rank');
            $table->index('country_code');
        });

        Schema::create('university_track', function (Blueprint $table) {
            $table->string('university_id');
            $table->string('track_id');
            $table->date('accredited_since')->nullable();

            $table->primary(['university_id', 'track_id']);
            $table->foreign('university_id')->references('id')->on('universities')->cascadeOnDelete();
            $table->foreign('track_id')->references('id')->on('scholarship_tracks')->cascadeOnDelete();
        });

        Schema::create('cultural_missions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('code')->unique();
            $table->string('country_code', 2)->nullable();
            $table->string('country_ar');
            $table->string('country_en');
            $table->string('city_ar');
            $table->string('city_en')->nullable();
            $table->string('title_ar');
            $table->string('title_en')->nullable();
            $table->string('attache_name_ar')->nullable();
            $table->string('attache_name_en')->nullable();
            $table->string('email')->nullable();
            $table->string('phone', 64)->nullable();
            $table->string('emergency_phone', 64)->nullable();
            $table->string('working_hours_ar')->nullable();
            $table->string('working_hours_en')->nullable();
            $table->text('address_ar')->nullable();
            $table->text('address_en')->nullable();
            $table->string('website_url')->nullable();
            $table->unsignedInteger('active_students_count')->default(0);
            $table->decimal('latitude', 10, 6)->nullable();
            $table->decimal('longitude', 10, 6)->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cultural_missions');
        Schema::dropIfExists('university_track');
        Schema::dropIfExists('universities');
        Schema::dropIfExists('countries');
        Schema::dropIfExists('requirement_rules');
        Schema::dropIfExists('scholarship_tracks');
    }
};
