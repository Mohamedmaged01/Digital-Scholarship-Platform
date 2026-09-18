<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Administrative staff identity domain.
 *
 * The public portal has no applicant accounts at all — scholarship applications
 * are submitted on the Ministry's official platform. The only people who sign in
 * here are ministry staff, so they are the authenticatable users of this app.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('admin_users', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('username')->unique();
            $table->string('full_name_ar');
            $table->string('full_name_en')->nullable();
            $table->string('email')->unique();
            $table->string('password');
            $table->string('role')->index();
            $table->string('department')->nullable();
            $table->string('avatar_url')->nullable();
            $table->json('permissions');
            $table->boolean('is_active')->default(true);
            $table->timestamp('last_login_at')->nullable();
            $table->unsignedSmallInteger('failed_attempts')->default(0);
            $table->timestamp('locked_until')->nullable();
            $table->rememberToken();
            $table->timestamps();
        });

        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('email')->primary();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });

        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('user_id')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sessions');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('admin_users');
    }
};
