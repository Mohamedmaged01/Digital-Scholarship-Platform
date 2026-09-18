<?php

namespace App\Services\Ai;

use App\Models\AnalyticsCounter;
use App\Models\ScholarshipTrack;
use App\Models\University;
use Illuminate\Support\Collection;

/**
 * The AI track recommender behind the home-page wizard.
 *
 * It scores every published track against the visitor's answers — degree level,
 * field, GPA, language band, career goal, destination — and returns a ranked
 * recommendation with the reasoning shown to the visitor.
 */
class TrackRecommender
{
    /** Interest fields, mapped onto the track each one leans towards. */
    public const FIELDS = [
        'ai_tech' => 'track-pioneers',
        'healthcare' => 'track-health',
        'engineering_industry' => 'track-supply',
        'creative_megaprojects' => 'track-excellence',
        'space_future' => 'track-rd',
        'business_policy' => 'track-excellence',
    ];

    public const GOALS = [
        'national_megaprojects' => 'track-excellence',
        'research_phd' => 'track-rd',
        'industry_leadership' => 'track-supply',
    ];

    public const DESTINATIONS = [
        'us_uk' => ['US', 'GB'],
        'europe_asia' => ['CH', 'DE', 'FR', 'JP', 'SG'],
        'australia_canada' => ['CA', 'AU'],
    ];

    /**
     * @param  array{degree: string, field: string, gpa: float, english: float, goal: string, destination: string}  $answers
     * @return array{
     *     track: ScholarshipTrack,
     *     score: int,
     *     reasons: list<string>,
     *     criteria: list<array{label: string, expected: string, provided: string, passed: bool}>,
     *     universities: Collection<int, University>,
     *     runner_ups: list<array{track: ScholarshipTrack, score: int}>
     * }
     */
    public function recommend(array $answers): array
    {
        $tracks = ScholarshipTrack::published()->ordered()->get();

        $scored = $tracks
            ->map(fn (ScholarshipTrack $track): array => [
                'track' => $track,
                'score' => $this->score($track, $answers),
            ])
            ->sortByDesc('score')
            ->values();

        /** @var array{track: ScholarshipTrack, score: int} $winner */
        $winner = $scored->first();

        AnalyticsCounter::bump('ai.finder_runs');
        AnalyticsCounter::bump('track_views.'.$winner['track']->id);

        return [
            'track' => $winner['track'],
            'score' => $winner['score'],
            'reasons' => $this->reasons($winner['track'], $answers),
            'criteria' => $this->criteria($winner['track'], $answers),
            'universities' => $this->universities($winner['track'], $answers),
            'runner_ups' => $scored->slice(1, 2)->values()->all(),
        ];
    }

    /**
     * Match score out of 100: half from meeting the published thresholds, half
     * from how well the visitor's interests align with the track's purpose.
     */
    protected function score(ScholarshipTrack $track, array $answers): int
    {
        $score = 40;

        // Thresholds.
        $score += $answers['gpa'] >= $track->min_gpa ? 18 : -14;
        $score += $answers['english'] >= $track->required_ielts ? 14 : -10;
        $score += in_array($answers['degree'], $track->required_degrees, true) ? 14 : -18;

        // Alignment.
        if ((self::FIELDS[$answers['field']] ?? null) === $track->id) {
            $score += 16;
        }

        if ((self::GOALS[$answers['goal']] ?? null) === $track->id) {
            $score += 12;
        }

        // A PhD candidate belongs in the research track unless a field says otherwise.
        if ($answers['degree'] === 'PhD' && $track->id === 'track-rd') {
            $score += 10;
        }

        // Reward tracks whose ranking window the preferred destination can satisfy.
        $codes = self::DESTINATIONS[$answers['destination']] ?? [];

        if ($codes !== [] && $this->hasAccreditedUniversity($track, $codes)) {
            $score += 6;
        }

        return (int) max(35, min(99, $score));
    }

    protected function hasAccreditedUniversity(ScholarshipTrack $track, array $countryCodes): bool
    {
        return $track->universities()
            ->whereIn('country_code', $countryCodes)
            ->where('qs_rank', '<=', $track->top_universities_rank_limit)
            ->exists();
    }

    /** @return list<string> */
    protected function reasons(ScholarshipTrack $track, array $answers): array
    {
        $locale = app()->getLocale();
        $gpa = rtrim(rtrim(number_format($answers['gpa'], 2), '0'), '.');
        $english = rtrim(rtrim(number_format($answers['english'], 1), '0'), '.');
        $degree = __('catalog.degrees.'.$answers['degree']);
        $sectors = collect($track->target_sectors)->take(3)->implode($locale === 'ar' ? '، ' : ', ');

        if ($locale === 'ar') {
            return array_values(array_filter([
                "معدلك ({$gpa} من 5.0) ودرجة اللغة ({$english}) مقارنة بشروط المسار: معدل {$track->min_gpa} وآيلتس {$track->required_ielts}.",
                "المسار يشمل دراسة {$degree} في جامعات ضمن أفضل {$track->top_universities_rank_limit} عالمياً.",
                filled($sectors) ? "القطاعات المستهدفة في هذا المسار تشمل: {$sectors}." : null,
                'المقاعد المخصصة للمسار '.number_format($track->allocated_seats).' مقعد، والمشغول منها '.number_format($track->filled_seats).'.',
            ]));
        }

        return array_values(array_filter([
            "Your GPA ({$gpa}/5.0) and language band ({$english}) against this track’s thresholds: GPA {$track->min_gpa} and IELTS {$track->required_ielts}.",
            "The track covers {$degree} study at institutions ranked within the world’s top {$track->top_universities_rank_limit}.",
            filled($sectors) ? "Priority sectors for this track include: {$sectors}." : null,
            'It allocates '.number_format($track->allocated_seats).' seats, of which '.number_format($track->filled_seats).' are filled.',
        ]));
    }

    /** @return list<array{label: string, expected: string, provided: string, passed: bool}> */
    protected function criteria(ScholarshipTrack $track, array $answers): array
    {
        $locale = app()->getLocale();

        return [
            [
                'label' => __('catalog.track.min_gpa'),
                'expected' => '≥ '.$track->min_gpa.' / 5.0',
                'provided' => number_format($answers['gpa'], 2).' / 5.0',
                'passed' => $answers['gpa'] >= $track->min_gpa,
            ],
            [
                'label' => __('catalog.track.ielts'),
                'expected' => '≥ '.$track->required_ielts,
                'provided' => (string) $answers['english'],
                'passed' => $answers['english'] >= $track->required_ielts,
            ],
            [
                'label' => __('catalog.track.degrees'),
                'expected' => collect($track->required_degrees)
                    ->map(fn (string $degree): string => __('catalog.degrees.'.$degree))
                    ->implode($locale === 'ar' ? '، ' : ', '),
                'provided' => __('catalog.degrees.'.$answers['degree']),
                'passed' => in_array($answers['degree'], $track->required_degrees, true),
            ],
            [
                'label' => __('catalog.track.rank_limit'),
                'expected' => '≤ '.$track->top_universities_rank_limit,
                'provided' => trans_choice(
                    $locale === 'ar'
                        ? '{0}لا توجد جامعة معتمدة في وجهتك المفضلة|[1,*]:count جامعة معتمدة في وجهتك المفضلة'
                        : '{0}No accredited institution in your preferred destination|[1,*]:count accredited institution(s) in your preferred destination',
                    $this->universities($track, $answers)->count(),
                ),
                'passed' => $this->universities($track, $answers)->isNotEmpty(),
            ],
        ];
    }

    /** @return Collection<int, University> */
    protected function universities(ScholarshipTrack $track, array $answers): Collection
    {
        $codes = self::DESTINATIONS[$answers['destination']] ?? [];

        $query = $track->universities()
            ->active()
            ->where('qs_rank', '<=', $track->top_universities_rank_limit)
            ->orderBy('qs_rank');

        if ($codes !== []) {
            $preferred = (clone $query)->whereIn('country_code', $codes)->limit(4)->get();

            if ($preferred->isNotEmpty()) {
                return $preferred;
            }
        }

        return $query->limit(4)->get();
    }
}
