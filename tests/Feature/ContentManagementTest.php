<?php

namespace Tests\Feature;

use App\Models\AdminUser;
use App\Models\Appointment;
use App\Models\CmsPage;
use App\Models\Country;
use App\Models\Faq;
use App\Models\MediaItem;
use App\Models\NewsArticle;
use App\Models\PageVersion;
use App\Models\ScholarshipTrack;
use App\Models\SiteSetting;
use App\Models\UnansweredQuestion;
use App\Models\University;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class ContentManagementTest extends TestCase
{
    use RefreshDatabase;

    protected function superAdmin(): AdminUser
    {
        return AdminUser::findOrFail('admin-super-01');
    }

    // ------------------------------------------------------------------ Tracks

    public function test_a_track_can_be_created_and_gets_its_eligibility_rules(): void
    {
        $this->actingAs($this->superAdmin())
            ->post(route('admin.tracks.store'), $this->trackPayload())
            ->assertRedirect();

        $track = ScholarshipTrack::query()->where('code', 'FUTURE')->firstOrFail();

        $this->assertSame('مسار المستقبل', $track->name_ar);
        $this->assertSame(['Master', 'PhD'], $track->required_degrees);
        $this->assertSame(['الفضاء', 'أشباه الموصلات'], $track->target_sectors);
        $this->assertSame(['تغطية شاملة', 'إشراف بحثي'], $track->features);
    }

    public function test_editing_a_track_threshold_changes_what_the_public_page_states(): void
    {
        $this->actingAs($this->superAdmin());

        $track = ScholarshipTrack::query()->where('code', 'PIONEERS')->firstOrFail();

        $this->put(route('admin.tracks.update', $track), [
            ...$this->trackPayload(),
            'code' => $track->code,
            'slug' => $track->slug,
            'top_universities_rank_limit' => 42,
        ])->assertRedirect();

        $this->get(route('tracks.show', $track->fresh()))->assertOk()->assertSee('42');
    }

    public function test_a_requirement_rule_can_be_retuned_from_the_console(): void
    {
        $track = ScholarshipTrack::query()->where('code', 'PIONEERS')->firstOrFail();
        $rule = $track->rules()->where('rule_code', 'MIN_GPA')->firstOrFail();

        $this->actingAs($this->superAdmin())
            ->put(route('admin.tracks.rules.update', [$track, $rule]), [
                'operator' => '>=',
                'expected_value' => '3.9',
                'weight' => 30,
                'is_mandatory' => '1',
                'is_active' => '1',
            ])->assertRedirect();

        $this->assertSame(3.9, $rule->fresh()->expected());
        $this->assertSame(30, $rule->fresh()->weight);
    }

    // ------------------------------------------------------------ Universities

    public function test_a_university_is_created_with_derived_ranking_flags(): void
    {
        $this->actingAs($this->superAdmin())
            ->post(route('admin.universities.store'), [
                'name_ar' => 'جامعة كيوتو',
                'name_en' => 'Kyoto University',
                'country_code' => 'JP',
                'country_ar' => 'اليابان',
                'country_en' => 'Japan',
                'city_ar' => 'كيوتو',
                'city_en' => 'Kyoto',
                'qs_rank' => 46,
                'min_ielts' => 6.5,
                'min_toefl' => 90,
                'degrees_available' => ['Master', 'PhD'],
                'tracks' => ['track-rd'],
                'is_active' => '1',
            ])->assertRedirect();

        $university = University::query()->where('name_en', 'Kyoto University')->firstOrFail();

        $this->assertFalse($university->is_top_30);
        $this->assertTrue($university->is_top_100);
        $this->assertTrue($university->is_top_200);
        $this->assertTrue($university->tracks->contains('id', 'track-rd'));
    }

    public function test_country_university_counts_are_recalculated_on_save(): void
    {
        $this->actingAs($this->superAdmin())
            ->put(route('admin.countries.update', 'US'), [
                'name_ar' => 'الولايات المتحدة الأمريكية',
                'name_en' => 'United States',
                'visa_processing_days' => 30,
                'is_active' => '1',
            ])->assertRedirect();

        $this->assertSame(
            University::query()->where('country_code', 'US')->count(),
            Country::find('US')->approved_universities_count,
        );
    }

    // -------------------------------------------------------------------- News

    public function test_an_editor_cannot_publish_but_can_draft(): void
    {
        $this->actingAs(AdminUser::findOrFail('admin-editor-08')); // EDITOR — can_publish false

        $this->post(route('admin.news.store'), $this->newsPayload(['status' => 'published']))->assertRedirect();

        $article = NewsArticle::query()->where('title_ar', 'خبر اختبار')->firstOrFail();

        $this->assertSame('draft', $article->status);
    }

    public function test_a_content_manager_can_publish(): void
    {
        $this->actingAs(AdminUser::findOrFail('admin-content-02')); // CONTENT_MANAGER

        $this->post(route('admin.news.store'), $this->newsPayload(['status' => 'published']))->assertRedirect();

        $this->assertSame('published', NewsArticle::query()->where('title_ar', 'خبر اختبار')->firstOrFail()->status);
    }

    public function test_publishing_a_story_makes_it_visible_and_is_audited(): void
    {
        $article = NewsArticle::query()->firstOrFail();
        $article->forceFill(['status' => 'draft'])->save();

        $this->actingAs($this->superAdmin())
            ->patch(route('admin.news.status', $article), ['status' => 'published'])
            ->assertRedirect();

        $this->get(route('news.show', $article->fresh()))->assertOk();
        $this->assertDatabaseHas('audit_logs', ['action' => 'PUBLISH', 'entity_type' => 'NEWS']);
    }

    public function test_a_news_slug_is_generated_and_stays_unique(): void
    {
        $this->actingAs($this->superAdmin());

        $this->post(route('admin.news.store'), $this->newsPayload())->assertRedirect();
        $this->post(route('admin.news.store'), $this->newsPayload())->assertRedirect();

        $slugs = NewsArticle::query()->where('title_ar', 'خبر اختبار')->pluck('slug');

        $this->assertCount(2, $slugs);
        $this->assertCount(2, $slugs->unique());
    }

    // --------------------------------------------------------------------- FAQ

    public function test_a_published_faq_reaches_the_public_page_and_the_advisor(): void
    {
        $this->actingAs($this->superAdmin())
            ->post(route('admin.faqs.store'), [
                'question_ar' => 'هل تغطي المنحة تذاكر السفر السنوية؟',
                'question_en' => 'Does the scholarship cover annual flight tickets?',
                'answer_ar' => 'نعم، تشمل المنحة تذكرتي سفر سنوياً عبر منصة سفير.',
                'answer_en' => 'Yes, two annual tickets are issued through the Safeer platform.',
                'category' => 'services',
                'tags' => 'تذاكر, سفير',
                'sort_order' => 99,
                'is_published' => '1',
            ])->assertRedirect();

        $this->get(route('faq.index', ['q' => 'تذاكر']))->assertOk()->assertSee('تذكرتي سفر سنوياً', false);
    }

    public function test_an_unpublished_faq_stays_off_the_public_page(): void
    {
        $faq = Faq::query()->firstOrFail();
        $faq->forceFill(['is_published' => false])->save();

        $this->get(route('faq.index'))->assertOk()->assertDontSee($faq->answer_ar, false);
    }

    // -------------------------------------------------------------- CMS blocks

    public function test_disabling_a_block_removes_the_section_from_the_home_page(): void
    {
        $this->actingAs($this->superAdmin());

        $page = CmsPage::query()->where('slug', 'home')->firstOrFail();
        $hero = $page->blocks()->where('type', 'hero')->firstOrFail();

        $this->get(route('home'))->assertOk()->assertSee('images/saudi-scholars-hero.jpg', false);

        $this->patch(route('admin.pages.blocks.toggle', [$page, $hero]))->assertRedirect();

        $this->assertFalse($hero->fresh()->is_enabled);
        $this->get(route('home'))->assertOk()->assertDontSee('hero.cta_explore_tracks');
    }

    public function test_blocks_can_be_reordered(): void
    {
        $this->actingAs($this->superAdmin());

        $page = CmsPage::query()->where('slug', 'home')->firstOrFail();
        $blocks = $page->blocks()->orderBy('sort_order')->get();
        [$first, $second] = [$blocks[0], $blocks[1]];
        [$firstOrder, $secondOrder] = [$first->sort_order, $second->sort_order];

        $this->patch(route('admin.pages.blocks.move', [$page, $second]), ['direction' => 'up'])->assertRedirect();

        $this->assertSame($firstOrder, $second->fresh()->sort_order);
        $this->assertSame($secondOrder, $first->fresh()->sort_order);
    }

    public function test_a_page_version_can_be_snapshotted_and_restored(): void
    {
        $this->actingAs($this->superAdmin());

        $page = CmsPage::query()->where('slug', 'home')->firstOrFail();
        $block = $page->blocks()->firstOrFail();
        $original = $block->title_ar;

        $this->post(route('admin.pages.versions.store', $page), ['label' => 'قبل التعديل'])->assertRedirect();

        $this->put(route('admin.pages.blocks.update', [$page, $block]), ['title_ar' => 'عنوان مؤقت'])->assertRedirect();
        $this->assertSame('عنوان مؤقت', $block->fresh()->title_ar);

        $version = PageVersion::query()->where('page_id', $page->id)->where('label', 'قبل التعديل')->firstOrFail();
        $this->post(route('admin.pages.versions.restore', [$page, $version]))->assertRedirect();

        $this->assertSame($original, $block->fresh()->title_ar);
    }

    // ------------------------------------------------------------------- Media

    public function test_an_upload_lands_in_the_library_with_its_alt_text(): void
    {
        Storage::fake('public');

        $this->actingAs($this->superAdmin())
            ->post(route('admin.media.store'), [
                'file' => UploadedFile::fake()->image('campus.jpg', 1200, 800),
                'folder' => 'banners',
                'alt_text_ar' => 'صورة الحرم الجامعي',
                'alt_text_en' => 'Campus photo',
            ])->assertRedirect();

        $item = MediaItem::query()->where('file_name', 'campus.jpg')->firstOrFail();

        $this->assertSame('banners', $item->folder);
        $this->assertSame('صورة الحرم الجامعي', $item->alt_text_ar);
        $this->assertTrue($item->size_bytes > 0);
    }

    public function test_an_upload_without_arabic_alt_text_is_rejected(): void
    {
        Storage::fake('public');

        $this->actingAs($this->superAdmin())
            ->post(route('admin.media.store'), [
                'file' => UploadedFile::fake()->image('campus.jpg'),
                'folder' => 'banners',
            ])->assertSessionHasErrors('alt_text_ar');
    }

    // -------------------------------------------------------------- AI manager

    public function test_answering_a_pending_question_publishes_it_as_an_faq(): void
    {
        $question = UnansweredQuestion::query()->pending()->firstOrFail();

        $this->actingAs($this->superAdmin())
            ->post(route('admin.ai.questions.answer', $question), [
                'answer' => 'نعم، يجوز التحويل بموافقة الملحقية الثقافية المختصة.',
                'category' => 'post_nomination',
            ])->assertRedirect();

        $this->assertNotNull($question->fresh()->answered_at);
        $this->assertTrue(
            Faq::query()->where('answer_ar', 'نعم، يجوز التحويل بموافقة الملحقية الثقافية المختصة.')->exists(),
        );
    }

    // ---------------------------------------------------------------- Settings

    public function test_settings_are_saved_and_reflected_on_the_public_portal(): void
    {
        $this->actingAs($this->superAdmin())
            ->put(route('admin.settings.update'), [
                'site_name_ar' => 'بوابة الابتعاث التجريبية',
                'site_name_en' => 'Test Scholarship Portal',
                'primary_color' => '#005A36',
                'support_email' => 'care@moe.gov.sa',
                'support_phone' => '19996',
                'official_apply_url' => 'https://kasp.moe.gov.sa',
                'moe_portal_url' => 'https://moe.gov.sa',
                'vision_2030_url' => 'https://www.vision2030.gov.sa',
                'cache_ttl_seconds' => 600,
            ])->assertRedirect();

        $this->assertSame('بوابة الابتعاث التجريبية', SiteSetting::get('site_name_ar'));
        $this->get(route('home'))->assertOk()->assertSee('بوابة الابتعاث التجريبية', false);
        $this->assertDatabaseHas('audit_logs', ['action' => 'SETTINGS_CHANGE']);
    }

    // ------------------------------------------------------------------ Backup

    public function test_a_backup_round_trips_the_catalog(): void
    {
        $this->actingAs($this->superAdmin());

        $payload = $this->get(route('admin.backup.export'))->assertOk()->streamedContent();
        $decoded = json_decode($payload, true);

        $this->assertSame(1, $decoded['version']);
        $this->assertCount(ScholarshipTrack::query()->count(), $decoded['data']['tracks']);

        // Break something, then restore it from the export.
        ScholarshipTrack::query()->where('id', 'track-pioneers')->update(['name_ar' => 'اسم تالف']);

        $this->post(route('admin.backup.import'), [
            'backup' => UploadedFile::fake()->createWithContent('backup.json', $payload),
        ])->assertRedirect();

        $this->assertSame('مسار الرواد', ScholarshipTrack::find('track-pioneers')->name_ar);
    }

    public function test_an_invalid_backup_is_refused(): void
    {
        $this->actingAs($this->superAdmin())
            ->post(route('admin.backup.import'), [
                'backup' => UploadedFile::fake()->createWithContent('backup.json', '{"nope":true}'),
            ])->assertSessionHasErrors('backup');
    }

    // ------------------------------------------------------------ Appointments

    public function test_a_visitor_can_request_an_advisory_appointment(): void
    {
        $this->post(route('appointments.store'), [
            'requester_name' => 'سارة القحطاني',
            'requester_email' => 'sarah@example.com',
            'requester_phone' => '+966501234567',
            'type' => 'academic_advising',
            'subject' => 'استفسار عن مسار الرواد',
            'preferred_date' => now()->addDays(3)->toDateString(),
            'preferred_time' => '10:00',
        ])->assertRedirect()->assertSessionHas('appointment_reference');

        $appointment = Appointment::query()->where('requester_email', 'sarah@example.com')->firstOrFail();

        $this->assertSame('pending', $appointment->status);
        $this->assertDatabaseHas('audit_logs', ['action' => 'CREATE', 'entity_type' => 'APPOINTMENT']);
    }

    public function test_an_appointment_in_the_past_is_rejected(): void
    {
        $this->post(route('appointments.store'), [
            'requester_name' => 'سارة القحطاني',
            'requester_email' => 'sarah@example.com',
            'requester_phone' => '+966501234567',
            'type' => 'academic_advising',
            'subject' => 'استفسار',
            'preferred_date' => now()->subWeek()->toDateString(),
            'preferred_time' => '10:00',
        ])->assertSessionHasErrors('preferred_date');
    }

    // ----------------------------------------------------------------- Helpers

    protected function trackPayload(array $overrides = []): array
    {
        return array_merge([
            'code' => 'FUTURE',
            'slug' => 'future',
            'name_ar' => 'مسار المستقبل',
            'name_en' => 'Future Track',
            'description_ar' => 'مسار تجريبي للتقنيات الناشئة.',
            'description_en' => 'A trial track for emerging technologies.',
            'badge_color' => 'teal',
            'icon_name' => 'rocket',
            'min_gpa' => 4.0,
            'max_age' => 32,
            'required_ielts' => 6.5,
            'required_toefl' => 85,
            'top_universities_rank_limit' => 150,
            'required_degrees' => ['Master', 'PhD'],
            'target_sectors_ar' => "الفضاء\nأشباه الموصلات",
            'features_ar' => "تغطية شاملة\nإشراف بحثي",
            'allocated_seats' => 500,
            'filled_seats' => 0,
            'sort_order' => 9,
            'is_active' => '1',
            'is_published' => '1',
        ], $overrides);
    }

    protected function newsPayload(array $overrides = []): array
    {
        return array_merge([
            'title_ar' => 'خبر اختبار',
            'summary_ar' => 'ملخص الخبر التجريبي.',
            'content_ar' => 'نص الخبر التجريبي الكامل.',
            'category' => 'announcement',
            'publish_date' => now()->toDateString(),
            'author_ar' => 'وكالة الوزارة للابتعاث',
            'status' => 'draft',
        ], $overrides);
    }
}
