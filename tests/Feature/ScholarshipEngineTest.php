<?php

namespace Tests\Feature;

use App\Models\AiConfig;
use App\Models\AiTelemetry;
use App\Models\EligibilityEvaluation;
use App\Models\RequirementRule;
use App\Models\ScholarshipTrack;
use App\Models\SiteSetting;
use App\Models\UnansweredQuestion;
use App\Services\Ai\AiAdvisor;
use App\Services\Ai\ScholarshipKnowledgeEngine;
use App\Services\Ai\TrackRecommender;
use App\Services\EligibilityEngine;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ScholarshipEngineTest extends TestCase
{
    use RefreshDatabase;

    // ------------------------------------------------------------- Eligibility

    public function test_a_strong_candidate_clears_the_pioneers_track(): void
    {
        $report = app(EligibilityEngine::class)->evaluate(
            ScholarshipTrack::query()->where('code', 'PIONEERS')->firstOrFail(),
            [
                'gpa' => 4.85,
                'ielts_score' => 7.5,
                'age' => 26,
                'degree_level' => 'Master',
                'university_rank' => 1,
                'admission_type' => 'unconditional',
            ],
        );

        $this->assertSame('eligible', $report['decision']);
        $this->assertSame(100, $report['score']);
        $this->assertSame([], $report['failed']);
    }

    public function test_a_conditional_offer_fails_the_mandatory_rule(): void
    {
        $report = app(EligibilityEngine::class)->evaluate(
            ScholarshipTrack::query()->where('code', 'PIONEERS')->firstOrFail(),
            [
                'gpa' => 4.85,
                'ielts_score' => 7.5,
                'age' => 26,
                'degree_level' => 'Master',
                'university_rank' => 1,
                'admission_type' => 'conditional_language',
            ],
        );

        $this->assertNotSame('eligible', $report['decision']);
        $this->assertContains('UNCONDITIONAL_OFFER', array_column($report['failed'], 'rule_code'));
    }

    public function test_an_out_of_range_university_fails_the_ranking_rule(): void
    {
        $report = app(EligibilityEngine::class)->evaluate(
            ScholarshipTrack::query()->where('code', 'PIONEERS')->firstOrFail(),
            [
                'gpa' => 4.9,
                'ielts_score' => 8.0,
                'age' => 24,
                'degree_level' => 'Master',
                'university_rank' => 480,
                'admission_type' => 'unconditional',
            ],
        );

        $this->assertContains('MAX_QS_RANK', array_column($report['failed'], 'rule_code'));
    }

    public function test_an_administrator_can_retune_a_threshold_without_a_deploy(): void
    {
        $track = ScholarshipTrack::query()->where('code', 'PIONEERS')->firstOrFail();
        $candidate = [
            'gpa' => 4.0,
            'ielts_score' => 7.5,
            'age' => 26,
            'degree_level' => 'Master',
            'university_rank' => 1,
            'admission_type' => 'unconditional',
        ];

        $engine = app(EligibilityEngine::class);

        // 4.0 is below the seeded 4.5 minimum.
        $this->assertContains('MIN_GPA', array_column($engine->evaluate($track, $candidate)['failed'], 'rule_code'));

        RequirementRule::query()
            ->where('track_id', $track->id)
            ->where('rule_code', 'MIN_GPA')
            ->update(['expected_value' => json_encode(['value' => 3.8])]);

        $this->assertSame('eligible', $engine->evaluate($track->fresh(), $candidate)['decision']);
    }

    public function test_a_missing_value_is_reported_as_a_warning_not_a_pass(): void
    {
        $report = app(EligibilityEngine::class)->evaluate(
            ScholarshipTrack::query()->where('code', 'PIONEERS')->firstOrFail(),
            ['gpa' => 4.9],
        );

        $this->assertNotEmpty($report['warnings']);
        $this->assertLessThan(100, $report['score']);
    }

    public function test_each_evaluation_is_recorded(): void
    {
        $before = EligibilityEvaluation::query()->count();

        app(EligibilityEngine::class)->evaluate(
            ScholarshipTrack::query()->firstOrFail(),
            ['gpa' => 4.5, 'ielts_score' => 7.0, 'age' => 25, 'degree_level' => 'Master', 'university_rank' => 5, 'admission_type' => 'unconditional'],
        );

        $this->assertSame($before + 1, EligibilityEvaluation::query()->count());
    }

    public function test_the_eligibility_endpoint_returns_a_decision(): void
    {
        $this->postJson(route('eligibility.check'), [
            'track_id' => 'track-pioneers',
            'gpa' => 4.8,
            'ielts_score' => 7.5,
            'age' => 26,
            'degree_level' => 'Master',
            'university_rank' => 1,
            'admission_type' => 'unconditional',
        ])
            ->assertOk()
            ->assertJsonPath('decision', 'eligible')
            ->assertJsonPath('score', 100);
    }

    // ------------------------------------------------------------ Recommender

    public function test_a_doctoral_researcher_is_steered_to_the_research_track(): void
    {
        $result = app(TrackRecommender::class)->recommend([
            'degree' => 'PhD',
            'field' => 'space_future',
            'gpa' => 4.7,
            'english' => 7.5,
            'goal' => 'research_phd',
            'destination' => 'us_uk',
        ]);

        $this->assertSame('track-rd', $result['track']->id);
        $this->assertGreaterThan(80, $result['score']);
        $this->assertNotEmpty($result['reasons']);
        $this->assertNotEmpty($result['universities']);
    }

    public function test_a_clinical_candidate_is_steered_to_the_health_track(): void
    {
        $result = app(TrackRecommender::class)->recommend([
            'degree' => 'Fellowship',
            'field' => 'healthcare',
            'gpa' => 4.4,
            'english' => 7.0,
            'goal' => 'industry_leadership',
            'destination' => 'us_uk',
        ]);

        $this->assertSame('track-health', $result['track']->id);
    }

    public function test_the_recommender_endpoint_returns_a_ranked_result(): void
    {
        $this->postJson(route('ai.recommend'), [
            'degree' => 'Master',
            'field' => 'ai_tech',
            'gpa' => 4.8,
            'english' => 7.5,
            'goal' => 'national_megaprojects',
            'destination' => 'us_uk',
        ])
            ->assertOk()
            ->assertJsonStructure([
                'track' => ['id', 'name', 'url', 'apply_url'],
                'score',
                'reasons',
                'criteria',
                'universities',
                'runner_ups',
            ]);
    }

    public function test_the_recommender_rejects_an_unknown_field(): void
    {
        $this->postJson(route('ai.recommend'), [
            'degree' => 'Master',
            'field' => 'underwater-basket-weaving',
            'gpa' => 4.8,
            'english' => 7.5,
            'goal' => 'national_megaprojects',
            'destination' => 'us_uk',
        ])->assertUnprocessable();
    }

    // ---------------------------------------------------------------- Advisor

    public function test_the_advisor_recognises_a_track_question(): void
    {
        $engine = app(ScholarshipKnowledgeEngine::class);

        $this->assertSame('pioneers', $engine->detectIntent('ما شروط مسار الرواد؟'));
        $this->assertSame('documents', $engine->detectIntent('ما المستندات المطلوبة؟'));
        $this->assertSame('apply_steps', $engine->detectIntent('How do I apply for a scholarship?'));
        $this->assertNull($engine->detectIntent('هل يمكنني دراسة الطبخ في باريس؟'));
    }

    public function test_the_advisor_answers_in_the_language_of_the_question(): void
    {
        $advisor = app(AiAdvisor::class);

        $arabic = $advisor->ask('ما خطوات التقديم على الابتعاث؟');
        $english = $advisor->ask('What documents are required to apply?');

        $this->assertMatchesRegularExpression('/\p{Arabic}/u', $arabic['answer']);
        $this->assertDoesNotMatchRegularExpression('/\p{Arabic}/u', $english['answer']);
    }

    public function test_the_advisor_quotes_the_published_thresholds(): void
    {
        $track = ScholarshipTrack::query()->where('code', 'PIONEERS')->firstOrFail();

        $answer = app(AiAdvisor::class)->ask('ما شروط مسار الرواد؟')['answer'];

        $this->assertStringContainsString((string) $track->top_universities_rank_limit, $answer);
    }

    public function test_an_unrecognised_question_is_queued_for_the_ai_manager(): void
    {
        $question = 'هل تغطون رسوم دورة الطهي الفرنسية في ليون؟';
        $before = UnansweredQuestion::query()->count();

        app(AiAdvisor::class)->ask($question);

        $this->assertSame($before + 1, UnansweredQuestion::query()->count());
        $this->assertSame('ar', UnansweredQuestion::query()->where('question', $question)->firstOrFail()->language);
    }

    public function test_repeating_an_unanswered_question_increments_its_counter(): void
    {
        $advisor = app(AiAdvisor::class);
        $question = 'هل تغطون رسوم دورة الطهي الفرنسية في ليون؟';

        $before = UnansweredQuestion::query()->count();

        $advisor->ask($question);
        $advisor->ask($question);

        // The same question is recorded once, with its counter bumped.
        $this->assertSame($before + 1, UnansweredQuestion::query()->count());
        $this->assertSame(2, UnansweredQuestion::query()->where('question', $question)->firstOrFail()->hits);
    }

    public function test_every_advisor_call_is_timed(): void
    {
        app(AiAdvisor::class)->ask('ما الجامعات المعتمدة؟');

        $record = AiTelemetry::query()->firstOrFail();

        $this->assertSame('CHATBOT', $record->operation);
        $this->assertSame('SUCCESS', $record->status);
    }

    public function test_the_advisor_falls_back_to_its_configured_message_when_disabled(): void
    {
        AiConfig::current()->forceFill(['is_enabled' => false])->save();

        $result = app(AiAdvisor::class)->ask('ما شروط مسار الرواد؟');

        $this->assertSame('disabled', $result['source']);
        $this->assertStringContainsString('أهلاً بك', $result['answer']);
    }

    public function test_the_chat_endpoint_returns_rendered_html(): void
    {
        $this->postJson(route('ai.chat'), ['message' => 'ما المستندات المطلوبة؟'])
            ->assertOk()
            ->assertJsonStructure(['answer', 'html', 'source', 'suggestions']);
    }

    public function test_the_chat_endpoint_escapes_markup_in_an_answer(): void
    {
        $html = $this->postJson(route('ai.chat'), ['message' => '<script>alert(1)</script>'])
            ->assertOk()
            ->json('html');

        $this->assertStringNotContainsString('<script>', $html);
    }

    public function test_the_chat_endpoint_honours_the_public_chat_setting(): void
    {
        SiteSetting::put('allow_public_ai_chat', false);

        $this->postJson(route('ai.chat'), ['message' => 'مرحبا'])->assertForbidden();
    }
}
