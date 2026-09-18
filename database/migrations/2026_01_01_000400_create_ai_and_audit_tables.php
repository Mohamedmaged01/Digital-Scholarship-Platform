<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * AI advisor configuration and telemetry, plus the security audit trail that every
 * administrative write goes through.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ai_configs', function (Blueprint $table) {
            $table->id();
            $table->string('model_name')->default('gemini-2.5-flash');
            $table->longText('system_prompt_ar')->nullable();
            $table->longText('system_prompt_en')->nullable();
            $table->decimal('temperature', 3, 2)->default(0.40);
            $table->unsignedInteger('max_output_tokens')->default(1024);
            $table->boolean('is_enabled')->default(true);
            $table->boolean('use_faq_knowledge_base')->default(true);
            $table->boolean('log_unanswered')->default(true);
            $table->json('suggested_prompts_ar')->nullable();
            $table->json('suggested_prompts_en')->nullable();
            $table->text('fallback_message_ar')->nullable();
            $table->text('fallback_message_en')->nullable();
            $table->timestamps();
        });

        Schema::create('unanswered_questions', function (Blueprint $table) {
            $table->id();
            $table->text('question');
            $table->string('language', 8)->default('ar');
            $table->string('category', 64)->default('general');
            $table->string('session_id')->nullable();
            $table->unsignedInteger('hits')->default(1);
            $table->text('official_answer')->nullable();
            $table->string('answered_by')->nullable();
            $table->timestamp('answered_at')->nullable();
            $table->timestamps();

            $table->index(['answered_at', 'created_at']);
        });

        Schema::create('ai_telemetry', function (Blueprint $table) {
            $table->id();
            $table->string('request_id')->index();
            $table->string('operation', 32);
            $table->string('model')->nullable();
            $table->string('driver', 32)->default('engine');
            $table->unsignedInteger('latency_ms')->default(0);
            $table->unsignedInteger('tokens_used')->nullable();
            $table->string('status', 16)->default('SUCCESS');
            $table->text('error_message')->nullable();
            $table->timestamps();
        });

        Schema::create('audit_logs', function (Blueprint $table) {
            $table->id();
            $table->string('actor_id')->nullable()->index();
            $table->string('actor_name')->nullable();
            $table->string('actor_role', 48)->nullable();
            $table->string('action', 32)->index();
            $table->string('entity_type', 48)->index();
            $table->string('entity_id')->nullable();
            $table->string('entity_label')->nullable();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->text('changes_summary')->nullable();
            $table->json('changes_before')->nullable();
            $table->json('changes_after')->nullable();
            $table->timestamps();

            $table->index(['entity_type', 'entity_id']);
        });

        Schema::create('security_events', function (Blueprint $table) {
            $table->id();
            $table->string('event_type', 64)->index();
            $table->string('severity', 16)->default('WARNING');
            $table->string('ip_address', 45)->nullable();
            $table->string('actor_id')->nullable();
            $table->json('details')->nullable();
            $table->boolean('is_resolved')->default(false);
            $table->timestamps();
        });

        Schema::create('analytics_counters', function (Blueprint $table) {
            $table->string('key')->primary();
            $table->unsignedBigInteger('value')->default(0);
            $table->timestamps();
        });

        Schema::create('page_views', function (Blueprint $table) {
            $table->id();
            $table->string('path');
            $table->string('entity_type', 48)->nullable();
            $table->string('entity_id')->nullable();
            $table->string('locale', 8)->default('ar');
            $table->string('device', 16)->default('desktop');
            $table->string('session_id')->nullable();
            $table->timestamp('created_at')->nullable();

            $table->index(['entity_type', 'entity_id']);
            $table->index('created_at');
        });

        Schema::create('search_queries', function (Blueprint $table) {
            $table->id();
            $table->string('query');
            $table->unsignedInteger('results_count')->default(0);
            $table->string('locale', 8)->default('ar');
            $table->timestamps();

            $table->index('query');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('search_queries');
        Schema::dropIfExists('page_views');
        Schema::dropIfExists('analytics_counters');
        Schema::dropIfExists('security_events');
        Schema::dropIfExists('audit_logs');
        Schema::dropIfExists('ai_telemetry');
        Schema::dropIfExists('unanswered_questions');
        Schema::dropIfExists('ai_configs');
    }
};
