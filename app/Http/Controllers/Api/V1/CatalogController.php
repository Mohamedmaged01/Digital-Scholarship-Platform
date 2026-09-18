<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Country;
use App\Models\CulturalMission;
use App\Models\Faq;
use App\Models\NewsArticle;
use App\Models\ScholarshipTrack;
use App\Models\SiteSetting;
use App\Models\University;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

/**
 * Read-only JSON view of the published catalog, for other government systems.
 */
class CatalogController extends Controller
{
    public function tracks(): JsonResponse
    {
        $tracks = $this->cached('api.tracks', fn () => ScholarshipTrack::published()->ordered()->get()
            ->map(fn (ScholarshipTrack $track): array => $this->trackPayload($track))
            ->all());

        return $this->ok($tracks);
    }

    public function track(ScholarshipTrack $track): JsonResponse
    {
        abort_unless($track->is_active && $track->is_published, 404);

        $track->load(['rules' => fn ($query) => $query->where('is_active', true)]);

        return $this->ok($this->trackPayload($track) + [
            'requirements' => $track->requirementItems(),
            'benefits' => $track->benefits(),
            'universities_count' => $track->universities()->count(),
        ]);
    }

    public function requirements(ScholarshipTrack $track): JsonResponse
    {
        return $this->ok(
            $track->rules()->where('is_active', true)->get()->map(fn ($rule): array => [
                'code' => $rule->rule_code,
                'title_ar' => $rule->title_ar,
                'title_en' => $rule->title_en,
                'field' => $rule->field_name,
                'operator' => $rule->operator,
                'expected' => $rule->expected(),
                'weight' => $rule->weight,
                'mandatory' => $rule->is_mandatory,
            ])->all(),
        );
    }

    public function universities(Request $request): JsonResponse
    {
        $paginator = University::active()
            ->filter([
                'q' => $request->string('q')->toString(),
                'country' => $request->string('country')->toString() ?: 'all',
                'track' => $request->string('track')->toString() ?: 'all',
                'degree' => $request->string('degree')->toString() ?: 'all',
                'tier' => $request->string('tier')->toString() ?: 'all',
            ])
            ->with('tracks:id')
            ->orderBy('qs_rank')
            ->paginate(min(50, max(5, $request->integer('per_page', 20))));

        return $this->ok(
            collect($paginator->items())->map(fn (University $u): array => $this->universityPayload($u))->all(),
            [
                'total' => $paginator->total(),
                'page' => $paginator->currentPage(),
                'total_pages' => $paginator->lastPage(),
            ],
        );
    }

    public function university(University $university): JsonResponse
    {
        abort_unless($university->is_active, 404);

        $university->load('tracks:id,name_ar,name_en');

        return $this->ok($this->universityPayload($university));
    }

    public function countries(): JsonResponse
    {
        return $this->ok(
            Country::query()->where('is_active', true)->withCount('universities')->orderBy('name_ar')->get()
                ->map(fn (Country $country): array => [
                    'code' => $country->code,
                    'name_ar' => $country->name_ar,
                    'name_en' => $country->name_en,
                    'flag' => $country->flag_emoji,
                    'region_ar' => $country->region_ar,
                    'region_en' => $country->region_en,
                    'universities_count' => $country->universities_count,
                    'visa_processing_days' => $country->visa_processing_days,
                ])->all(),
        );
    }

    public function culturalMissions(): JsonResponse
    {
        return $this->ok(
            CulturalMission::query()->where('is_active', true)->orderBy('country_ar')->get()
                ->map(fn (CulturalMission $mission): array => [
                    'id' => $mission->id,
                    'code' => $mission->code,
                    'country_ar' => $mission->country_ar,
                    'country_en' => $mission->country_en,
                    'city_ar' => $mission->city_ar,
                    'email' => $mission->email,
                    'phone' => $mission->phone,
                    'emergency_phone' => $mission->emergency_phone,
                    'working_hours_ar' => $mission->working_hours_ar,
                    'active_students_count' => $mission->active_students_count,
                ])->all(),
        );
    }

    public function faqs(Request $request): JsonResponse
    {
        return $this->ok(
            Faq::published()
                ->category($request->string('category')->toString() ?: 'all')
                ->search($request->string('q')->toString())
                ->ordered()
                ->get()
                ->map(fn (Faq $faq): array => [
                    'id' => $faq->id,
                    'category' => $faq->category,
                    'question_ar' => $faq->question_ar,
                    'question_en' => $faq->question_en,
                    'answer_ar' => $faq->answer_ar,
                    'answer_en' => $faq->answer_en,
                    'tags' => $faq->tags,
                ])->all(),
        );
    }

    public function news(): JsonResponse
    {
        return $this->ok(
            NewsArticle::published()->latestFirst()->limit(20)->get()
                ->map(fn (NewsArticle $article): array => [
                    'id' => $article->id,
                    'slug' => $article->slug,
                    'title_ar' => $article->title_ar,
                    'title_en' => $article->title_en,
                    'summary_ar' => $article->summary_ar,
                    'category' => $article->category,
                    'publish_date' => $article->publish_date?->toDateString(),
                    'image_url' => $article->image_url,
                    'url' => route('news.show', $article),
                ])->all(),
        );
    }

    public function search(Request $request): JsonResponse
    {
        $term = trim($request->string('q')->toString());

        if ($term === '') {
            return $this->ok(['tracks' => [], 'universities' => [], 'faqs' => []]);
        }

        $like = '%'.$term.'%';

        return $this->ok([
            'tracks' => ScholarshipTrack::published()
                ->where(fn ($query) => $query->where('name_ar', 'like', $like)->orWhere('name_en', 'like', $like))
                ->get(['id', 'slug', 'name_ar', 'name_en']),
            'universities' => University::active()->filter(['q' => $term])->limit(10)->get(['id', 'name_ar', 'name_en', 'qs_rank']),
            'faqs' => Faq::published()->search($term)->limit(10)->get(['id', 'question_ar', 'question_en', 'category']),
        ]);
    }

    // ------------------------------------------------------------------ Helpers

    protected function trackPayload(ScholarshipTrack $track): array
    {
        return [
            'id' => $track->id,
            'slug' => $track->slug,
            'code' => $track->code,
            'name_ar' => $track->name_ar,
            'name_en' => $track->name_en,
            'description_ar' => $track->description_ar,
            'description_en' => $track->description_en,
            'min_gpa' => (float) $track->min_gpa,
            'max_age' => $track->max_age,
            'required_ielts' => (float) $track->required_ielts,
            'required_toefl' => $track->required_toefl,
            'top_universities_rank_limit' => $track->top_universities_rank_limit,
            'required_degrees' => $track->required_degrees,
            'target_sectors_ar' => $track->target_sectors_ar,
            'target_sectors_en' => $track->target_sectors_en,
            'allocated_seats' => $track->allocated_seats,
            'filled_seats' => $track->filled_seats,
            'url' => route('tracks.show', $track),
        ];
    }

    protected function universityPayload(University $university): array
    {
        return [
            'id' => $university->id,
            'name_ar' => $university->name_ar,
            'name_en' => $university->name_en,
            'country_code' => $university->country_code,
            'country_ar' => $university->country_ar,
            'country_en' => $university->country_en,
            'city_ar' => $university->city_ar,
            'qs_rank' => $university->qs_rank,
            'the_rank' => $university->the_rank,
            'min_ielts' => (float) $university->min_ielts,
            'min_toefl' => $university->min_toefl,
            'degrees_available' => $university->degrees_available,
            'top_majors_ar' => $university->top_majors_ar,
            'top_majors_en' => $university->top_majors_en,
            'accredited_tracks' => $university->tracks->pluck('id')->all(),
            'website_url' => $university->website_url,
            'url' => route('universities.show', $university),
        ];
    }

    protected function cached(string $key, callable $callback): mixed
    {
        $ttl = (int) SiteSetting::get('cache_ttl_seconds', 3600);

        return $ttl > 0 ? Cache::remember($key, $ttl, $callback) : $callback();
    }

    protected function ok(mixed $data, array $meta = []): JsonResponse
    {
        return response()->json(array_filter([
            'success' => true,
            'data' => $data,
            'meta' => $meta ?: null,
        ], fn ($value): bool => $value !== null));
    }
}
