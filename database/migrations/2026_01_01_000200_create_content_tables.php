<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Editorial content managed from the admin portal: FAQs, news, the media library,
 * the CMS page builder with its version history, guide steps and SEO metadata.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('faqs', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->text('question_ar');
            $table->text('question_en');
            $table->text('answer_ar');
            $table->text('answer_en');
            $table->string('category')->index();
            $table->json('tags');
            $table->string('related_track_id')->nullable();
            $table->string('related_country_code', 2)->nullable();
            $table->unsignedSmallInteger('sort_order')->default(1);
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_published')->default(true);
            $table->timestamps();
        });

        Schema::create('news_articles', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('slug')->unique();
            $table->string('title_ar');
            $table->string('title_en')->nullable();
            $table->text('summary_ar')->nullable();
            $table->text('summary_en')->nullable();
            $table->longText('content_ar')->nullable();
            $table->longText('content_en')->nullable();
            $table->string('category')->default('announcement')->index();
            $table->date('publish_date')->nullable();
            $table->string('author_ar')->nullable();
            $table->string('author_en')->nullable();
            $table->string('image_url')->nullable();
            $table->boolean('is_featured')->default(false);
            $table->string('status')->default('published')->index();
            $table->unsignedSmallInteger('read_time_minutes')->default(3);
            $table->timestamps();
        });

        Schema::create('media_items', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('file_name');
            $table->string('url');
            $table->string('folder')->default('banners')->index();
            $table->string('mime_type')->nullable();
            $table->string('extension', 16)->nullable();
            $table->unsignedBigInteger('size_bytes')->default(0);
            $table->string('dimensions', 32)->nullable();
            $table->string('alt_text_ar')->nullable();
            $table->string('alt_text_en')->nullable();
            $table->string('uploaded_by')->nullable();
            $table->timestamps();
        });

        Schema::create('cms_pages', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('slug')->unique();
            $table->string('title_ar');
            $table->string('title_en')->nullable();
            $table->text('description_ar')->nullable();
            $table->text('description_en')->nullable();
            $table->string('status')->default('draft')->index();
            $table->string('seo_title')->nullable();
            $table->text('seo_description')->nullable();
            $table->string('last_updated_by')->nullable();
            $table->timestamps();
        });

        Schema::create('page_blocks', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('page_id');
            $table->string('type');
            $table->string('title_ar')->nullable();
            $table->string('title_en')->nullable();
            $table->string('subtitle_ar')->nullable();
            $table->string('subtitle_en')->nullable();
            $table->longText('content_ar')->nullable();
            $table->longText('content_en')->nullable();
            $table->json('config')->nullable();
            $table->unsignedSmallInteger('sort_order')->default(1);
            $table->boolean('is_enabled')->default(true);
            $table->timestamps();

            $table->foreign('page_id')->references('id')->on('cms_pages')->cascadeOnDelete();
            $table->index(['page_id', 'sort_order']);
        });

        Schema::create('page_versions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('page_id');
            $table->unsignedInteger('version_number');
            $table->string('label')->nullable();
            $table->json('snapshot');
            $table->string('status')->default('draft');
            $table->text('changelog_notes')->nullable();
            $table->string('created_by')->nullable();
            $table->timestamps();

            $table->foreign('page_id')->references('id')->on('cms_pages')->cascadeOnDelete();
            $table->index(['page_id', 'version_number']);
        });

        Schema::create('user_guide_steps', function (Blueprint $table) {
            $table->id();
            $table->string('system', 32)->index(); // qabool | safeer
            $table->unsignedSmallInteger('step_number');
            $table->string('title_ar');
            $table->string('title_en')->nullable();
            $table->text('description_ar')->nullable();
            $table->text('description_en')->nullable();
            $table->json('details_ar')->nullable();
            $table->json('details_en')->nullable();
            $table->json('tips_ar')->nullable();
            $table->json('tips_en')->nullable();
            $table->string('icon_name')->default('info');
            $table->timestamps();
        });

        Schema::create('seo_metadata', function (Blueprint $table) {
            $table->string('page_slug')->primary();
            $table->string('meta_title_ar')->nullable();
            $table->string('meta_title_en')->nullable();
            $table->text('meta_description_ar')->nullable();
            $table->text('meta_description_en')->nullable();
            $table->json('keywords_ar')->nullable();
            $table->json('keywords_en')->nullable();
            $table->string('canonical_url')->nullable();
            $table->string('og_image')->nullable();
            $table->longText('structured_data_json')->nullable();
            $table->timestamps();
        });

        Schema::create('site_settings', function (Blueprint $table) {
            $table->string('key')->primary();
            $table->json('value');
            $table->string('description')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('site_settings');
        Schema::dropIfExists('seo_metadata');
        Schema::dropIfExists('user_guide_steps');
        Schema::dropIfExists('page_versions');
        Schema::dropIfExists('page_blocks');
        Schema::dropIfExists('cms_pages');
        Schema::dropIfExists('media_items');
        Schema::dropIfExists('news_articles');
        Schema::dropIfExists('faqs');
    }
};
