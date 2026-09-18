<?php

namespace Tests\Feature;

use App\Models\Country;
use App\Models\CulturalMission;
use App\Models\NewsArticle;
use App\Models\ScholarshipTrack;
use App\Models\SiteSetting;
use App\Models\University;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PublicPortalTest extends TestCase
{
    use RefreshDatabase;

    public function test_every_public_page_renders(): void
    {
        $track = ScholarshipTrack::query()->firstOrFail();
        $university = University::query()->firstOrFail();
        $country = Country::query()->firstOrFail();
        $mission = CulturalMission::query()->firstOrFail();
        $article = NewsArticle::published()->firstOrFail();

        $routes = [
            route('home'),
            route('tracks.index'),
            route('tracks.show', $track),
            route('universities.index'),
            route('universities.show', $university),
            route('countries.index'),
            route('countries.show', $country),
            route('guide.index'),
            route('missions.index'),
            route('missions.show', $mission),
            route('faq.index'),
            route('news.index'),
            route('news.show', $article),
            route('help.index'),
            route('search', ['q' => 'MIT']),
        ];

        foreach ($routes as $url) {
            $this->get($url)->assertOk();
        }
    }

    public function test_the_portal_defaults_to_arabic_and_renders_right_to_left(): void
    {
        $this->get(route('home'))
            ->assertOk()
            ->assertSee('<html lang="ar" dir="rtl"', false);
    }

    public function test_the_language_switch_is_remembered_across_requests(): void
    {
        $this->get(route('language.switch', 'en'))->assertRedirect();

        $this->get(route('home'))
            ->assertOk()
            ->assertSee('<html lang="en" dir="ltr"', false);
    }

    public function test_track_pages_show_the_criteria_the_engine_evaluates(): void
    {
        $track = ScholarshipTrack::query()->where('code', 'PIONEERS')->firstOrFail();

        $this->get(route('tracks.show', $track))
            ->assertOk()
            ->assertSee($track->name_ar)
            ->assertSee((string) $track->top_universities_rank_limit)
            ->assertSee(__('catalog.track.requirements'));
    }

    public function test_the_university_explorer_filters_by_ranking_tier(): void
    {
        $response = $this->get(route('universities.index', ['tier' => 'top30']));

        $response->assertOk();

        $listed = $response->viewData('universities');

        $this->assertGreaterThan(0, $listed->total());
        $this->assertTrue($listed->every(fn (University $item): bool => $item->qs_rank <= 30));
    }

    public function test_the_university_explorer_filters_by_track(): void
    {
        $track = ScholarshipTrack::query()->firstOrFail();

        $listed = $this->get(route('universities.index', ['track' => $track->id]))
            ->assertOk()
            ->viewData('universities');

        $this->assertGreaterThan(0, $listed->total());

        foreach ($listed as $university) {
            $this->assertTrue($university->tracks->contains('id', $track->id));
        }
    }

    public function test_unpublished_tracks_are_not_reachable(): void
    {
        $track = ScholarshipTrack::query()->firstOrFail();
        $track->forceFill(['is_published' => false])->save();

        $this->get(route('tracks.show', $track))->assertNotFound();
    }

    public function test_draft_news_is_not_reachable(): void
    {
        $article = NewsArticle::query()->firstOrFail();
        $article->forceFill(['status' => 'draft'])->save();

        $this->get(route('news.show', $article))->assertNotFound();
    }

    public function test_maintenance_mode_hides_the_public_portal_but_not_the_console(): void
    {
        SiteSetting::put('maintenance_mode', true);

        $this->get(route('home'))->assertStatus(503)->assertSee(__('common.maintenance_title'));
        $this->get(route('admin.login'))->assertOk();
    }

    public function test_legacy_applicant_routes_redirect_home(): void
    {
        foreach (['student/login', 'student/register', 'nafath'] as $legacy) {
            $this->get('/'.$legacy)->assertRedirect(route('home'));
        }
    }

    public function test_search_covers_tracks_universities_and_faqs(): void
    {
        $response = $this->get(route('search', ['q' => 'الرواد']))->assertOk();

        $this->assertGreaterThan(0, $response->viewData('total'));
    }
}
