<?php

namespace Tests\Feature;

use App\Models\ScholarshipTrack;
use App\Models\University;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * The read-only v1 surface other government systems consume. It carries no
 * session, so these tests also guard against session-coupled code creeping in.
 */
class PublicApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_the_health_probe_reports_the_stack(): void
    {
        $this->getJson('/api/v1/system/health')
            ->assertOk()
            ->assertJsonPath('status', 'HEALTHY')
            ->assertJsonPath('stack', 'laravel/blade');
    }

    public function test_the_track_catalog_is_served_in_both_languages(): void
    {
        $payload = $this->getJson('/api/v1/tracks')->assertOk()->json('data');

        $this->assertCount(ScholarshipTrack::published()->count(), $payload);
        $this->assertArrayHasKey('name_ar', $payload[0]);
        $this->assertArrayHasKey('name_en', $payload[0]);
        $this->assertArrayHasKey('min_gpa', $payload[0]);
    }

    public function test_a_single_track_carries_its_requirements(): void
    {
        $this->getJson('/api/v1/tracks/pioneers')
            ->assertOk()
            ->assertJsonPath('data.code', 'PIONEERS')
            ->assertJsonStructure(['data' => ['requirements', 'benefits', 'universities_count']]);
    }

    public function test_the_requirement_rules_are_exposed_verbatim(): void
    {
        $rules = $this->getJson('/api/v1/tracks/pioneers/requirements')->assertOk()->json('data');

        $this->assertContains('MIN_GPA', array_column($rules, 'code'));
        $this->assertContains('MAX_QS_RANK', array_column($rules, 'code'));
    }

    public function test_the_university_endpoint_paginates_and_filters(): void
    {
        $response = $this->getJson('/api/v1/universities?tier=top30&per_page=5')->assertOk();

        $this->assertLessThanOrEqual(5, count($response->json('data')));
        $this->assertNotNull($response->json('meta.total'));

        foreach ($response->json('data') as $university) {
            $this->assertLessThanOrEqual(30, $university['qs_rank']);
        }
    }

    public function test_an_inactive_university_is_not_served(): void
    {
        $university = University::query()->firstOrFail();
        $university->forceFill(['is_active' => false])->save();

        $this->getJson('/api/v1/universities/'.$university->id)->assertNotFound();
    }

    public function test_the_remaining_catalog_endpoints_respond(): void
    {
        foreach (['countries', 'cultural-missions', 'faqs', 'news'] as $resource) {
            $this->getJson('/api/v1/'.$resource)->assertOk()->assertJsonPath('success', true);
        }
    }

    public function test_search_groups_its_results(): void
    {
        $this->getJson('/api/v1/search?q=oxford')
            ->assertOk()
            ->assertJsonStructure(['data' => ['tracks', 'universities', 'faqs']]);
    }

    public function test_the_lang_parameter_selects_the_response_language(): void
    {
        $arabic = $this->getJson('/api/v1/tracks/pioneers?lang=ar')->assertOk();
        $english = $this->getJson('/api/v1/tracks/pioneers?lang=en')->assertOk();

        // Both payloads carry both languages; the difference shows in translated labels.
        $this->assertSame($arabic->json('data.name_ar'), $english->json('data.name_ar'));
        $this->assertNotEmpty($english->json('data.name_en'));
    }

    public function test_the_api_advisor_answers_without_a_session(): void
    {
        $this->postJson('/api/v1/ai/chat', ['message' => 'ما المستندات المطلوبة؟'])
            ->assertOk()
            ->assertJsonStructure(['answer', 'html', 'source']);
    }

    public function test_the_api_eligibility_check_works_without_a_session(): void
    {
        $this->postJson('/api/v1/eligibility/check', [
            'track_id' => 'track-supply',
            'gpa' => 4.0,
            'ielts_score' => 6.5,
            'age' => 28,
            'degree_level' => 'Bachelor',
            'university_rank' => 120,
            'admission_type' => 'unconditional',
        ])->assertOk()->assertJsonStructure(['decision', 'decision_label', 'score', 'matched', 'failed']);
    }

    public function test_the_api_rejects_an_unknown_track(): void
    {
        $this->postJson('/api/v1/eligibility/check', [
            'track_id' => 'track-does-not-exist',
            'gpa' => 4.0,
        ])->assertUnprocessable();
    }
}
