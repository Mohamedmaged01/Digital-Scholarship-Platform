<?php

namespace Database\Seeders;

use App\Models\Country;
use App\Models\CulturalMission;
use App\Models\RequirementRule;
use App\Models\ScholarshipTrack;
use App\Models\University;
use Database\Seeders\Concerns\ReadsLegacyData;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ScholarshipCatalogSeeder extends Seeder
{
    use ReadsLegacyData;

    public function run(): void
    {
        $this->seedCountries();
        $this->seedTracks();
        $this->seedUniversities();
        $this->seedCulturalMissions();
    }

    // ------------------------------------------------------------------ Countries

    /** ISO-3 codes used by the admin country list mapped onto ISO-2. */
    protected const ISO3_TO_ISO2 = [
        'USA' => 'US', 'GBR' => 'GB', 'CAN' => 'CA', 'AUS' => 'AU',
        'JPN' => 'JP', 'CHE' => 'CH', 'DEU' => 'DE', 'FRA' => 'FR', 'SGP' => 'SG',
    ];

    protected function seedCountries(): void
    {
        // The public directory carries the richer copy; the admin list adds status.
        $adminStatus = collect($this->dataset('scholarship_countries'))
            ->keyBy(fn (array $row): string => self::ISO3_TO_ISO2[Str::upper((string) $row['code'])] ?? Str::upper((string) $row['code']));

        foreach ($this->extraCountries($this->dataset('countries_directory')) as $row) {
            $code = Str::upper((string) $row['code']);

            Country::updateOrCreate(['code' => $code], [
                'name_ar' => $row['nameAr'],
                'name_en' => $row['nameEn'],
                'flag_emoji' => $row['flagEmoji'] ?? null,
                'region_ar' => $row['regionAr'] ?? null,
                'region_en' => $row['regionEn'] ?? null,
                'primary_language' => $row['primaryLanguage'] ?? null,
                'approved_universities_count' => (int) ($row['approvedUniversitiesCount'] ?? 0),
                'visa_overview_ar' => $row['visaOverviewAr'] ?? null,
                'visa_overview_en' => $row['visaOverviewEn'] ?? null,
                'cultural_mission_city_ar' => $row['culturalMissionCityAr'] ?? null,
                'cultural_mission_city_en' => $row['culturalMissionCityEn'] ?? null,
                'image_url' => $row['imageUrl'] ?? null,
                'is_popular' => (bool) ($row['isPopular'] ?? false),
                'is_active' => ($adminStatus[$code]['status'] ?? 'active') === 'active',
            ]);
        }
    }

    /**
     * Singapore hosts accredited universities (NUS, NTU) but was missing from the
     * legacy country directory, so the destination filter had no entry for it.
     */
    protected function extraCountries(array $directory): array
    {
        $codes = array_map(fn (array $row): string => Str::upper((string) $row['code']), $directory);

        if (! in_array('SG', $codes, true)) {
            $directory[] = [
                'code' => 'SG',
                'nameAr' => 'سنغافورة',
                'nameEn' => 'Singapore',
                'flagEmoji' => '🇸🇬',
                'regionAr' => 'شرق آسيا',
                'regionEn' => 'East Asia',
                'primaryLanguage' => 'English',
                'approvedUniversitiesCount' => 2,
                'visaOverviewAr' => 'تصريح الطالب (Student Pass) يصدر عبر منصة ICA بعد تأكيد القبول الجامعي، ومدة المعالجة أربعة أسابيع تقريباً.',
                'visaOverviewEn' => 'A Student Pass is issued through Singapore’s ICA portal once admission is confirmed, taking roughly four weeks.',
                'culturalMissionCityAr' => 'بكين (الملحقية المشرفة على آسيا)',
                'culturalMissionCityEn' => 'Beijing (supervising mission for Asia)',
                'imageUrl' => 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=1000&auto=format&fit=crop&q=80',
                'isPopular' => false,
            ];
        }

        return $directory;
    }

    // --------------------------------------------------------------------- Tracks

    protected function seedTracks(): void
    {
        $details = $this->dataset('track_details');
        $order = 1;

        foreach ($this->dataset('tracks') as $row) {
            $detail = $details[$row['id']] ?? [];

            $track = ScholarshipTrack::updateOrCreate(['id' => $row['id']], [
                'code' => $row['code'],
                'slug' => Str::slug(Str::replaceFirst('track-', '', $row['id'])),
                'name_ar' => $row['nameAr'],
                'name_en' => $row['nameEn'],
                'description_ar' => $row['descriptionAr'],
                'description_en' => $row['descriptionEn'],
                'objective_ar' => data_get($detail, 'overview.summary'),
                'objective_en' => $row['objectiveEn'] ?? null,
                'badge_color' => $row['badgeColor'] ?? 'emerald',
                'icon_name' => $this->iconFor($row['id']),
                'image_url' => $this->imageFor($row['id']),
                'min_gpa' => (float) $row['minGpa'],
                'max_age' => (int) $row['maxAge'],
                'required_ielts' => (float) $row['requiredIelts'],
                'required_toefl' => (int) $row['requiredToefl'],
                'top_universities_rank_limit' => (int) $row['topUniversitiesRankLimit'],
                'required_degrees' => $row['requiredDegree'] ?? [],
                'target_sectors_ar' => $row['targetSectors'] ?? [],
                'target_sectors_en' => $row['targetSectorsEn'] ?? null,
                'features_ar' => $row['features'] ?? [],
                'features_en' => $row['featuresEn'] ?? null,
                'details' => $this->buildDetails($detail),
                'allocated_seats' => (int) ($row['allocatedSeats'] ?? 0),
                'filled_seats' => (int) ($row['filledSeats'] ?? 0),
                'sort_order' => $order++,
                'is_active' => (bool) ($row['isActive'] ?? true),
                'is_published' => true,
            ]);

            $this->seedRulesFor($track);
        }
    }

    /**
     * Flatten the legacy rich-content block into the `details` JSON column.
     */
    protected function buildDetails(array $detail): array
    {
        return [
            'hero_title' => data_get($detail, 'overview.heroTitle'),
            'summary' => data_get($detail, 'overview.summary'),
            'target_audience' => data_get($detail, 'overview.targetAudience'),
            'benefits' => data_get($detail, 'overview.keyBenefits', []),
            'quota' => data_get($detail, 'overview.quotaStats', []),
            'rules_title' => data_get($detail, 'rules.title'),
            'requirements' => collect(data_get($detail, 'rules.items', []))
                ->map(fn (array $item): array => [
                    'label' => $item['label'] ?? '',
                    'description' => $item['desc'] ?? '',
                    'is_mandatory' => (bool) ($item['isStrict'] ?? false),
                ])->all(),
            'approved_universities_count' => data_get($detail, 'approvedUniversitiesCount'),
            'target_majors' => data_get($detail, 'topSectors', []),
            'faq' => data_get($detail, 'faq', []),
            'official_apply_url' => config('kasp.apply_url'),
        ];
    }

    /**
     * Turn each track's headline numbers into machine-evaluable rules so the
     * eligibility engine reads its thresholds from the database.
     */
    protected function seedRulesFor(ScholarshipTrack $track): void
    {
        $rules = [
            [
                'code' => 'MAX_QS_RANK',
                'title_ar' => 'تصنيف الجامعة الدولي',
                'title_en' => 'World University Ranking',
                'field' => 'university_rank',
                'operator' => '<=',
                'value' => $track->top_universities_rank_limit,
                'weight' => 30,
                'error_ar' => 'يجب أن تكون الجامعة ضمن أفضل '.$track->top_universities_rank_limit.' جامعة عالمياً.',
                'error_en' => 'The institution must rank within the world’s top '.$track->top_universities_rank_limit.'.',
            ],
            [
                'code' => 'MIN_GPA',
                'title_ar' => 'المعدل التراكمي (من 5.0)',
                'title_en' => 'Cumulative GPA (out of 5.0)',
                'field' => 'gpa',
                'operator' => '>=',
                'value' => $track->min_gpa,
                'weight' => 25,
                'error_ar' => 'الحد الأدنى للمعدل التراكمي هو '.$track->min_gpa.' من 5.0.',
                'error_en' => 'A minimum GPA of '.$track->min_gpa.' out of 5.0 is required.',
            ],
            [
                'code' => 'MIN_IELTS',
                'title_ar' => 'كفاءة اللغة الإنجليزية (IELTS)',
                'title_en' => 'English Proficiency (IELTS)',
                'field' => 'ielts_score',
                'operator' => '>=',
                'value' => $track->required_ielts,
                'weight' => 20,
                'error_ar' => 'الحد الأدنى لدرجة الآيلتس هو '.$track->required_ielts.'.',
                'error_en' => 'A minimum IELTS band of '.$track->required_ielts.' is required.',
            ],
            [
                'code' => 'MAX_AGE',
                'title_ar' => 'السن النظامي للتقديم',
                'title_en' => 'Maximum Applicant Age',
                'field' => 'age',
                'operator' => '<=',
                'value' => $track->max_age,
                'weight' => 15,
                'error_ar' => 'الحد الأعلى للعمر هو '.$track->max_age.' عاماً.',
                'error_en' => 'Applicants must be '.$track->max_age.' years old or younger.',
            ],
            [
                'code' => 'DEGREE_LEVEL',
                'title_ar' => 'الدرجة العلمية المستهدفة',
                'title_en' => 'Target Degree Level',
                'field' => 'degree_level',
                'operator' => 'IN',
                'value' => $track->required_degrees,
                'weight' => 10,
                'error_ar' => 'الدرجة العلمية المطلوبة غير مشمولة في هذا المسار.',
                'error_en' => 'The requested degree level is not covered by this track.',
            ],
            [
                'code' => 'UNCONDITIONAL_OFFER',
                'title_ar' => 'نوع القبول الأكاديمي',
                'title_en' => 'Admission Type',
                'field' => 'admission_type',
                'operator' => '==',
                'value' => 'unconditional',
                'weight' => 20,
                'error_ar' => 'يشترط قبول نهائي غير مشروط من الجامعة.',
                'error_en' => 'A final unconditional offer from the institution is mandatory.',
            ],
        ];

        foreach ($rules as $rule) {
            RequirementRule::updateOrCreate(
                ['id' => $track->id.'-'.Str::lower(Str::replace('_', '-', $rule['code']))],
                [
                    'track_id' => $track->id,
                    'rule_code' => $rule['code'],
                    'title_ar' => $rule['title_ar'],
                    'title_en' => $rule['title_en'],
                    'field_name' => $rule['field'],
                    'operator' => $rule['operator'],
                    'expected_value' => ['value' => $rule['value']],
                    'is_mandatory' => true,
                    'weight' => $rule['weight'],
                    'error_message_ar' => $rule['error_ar'],
                    'error_message_en' => $rule['error_en'],
                    'is_active' => true,
                ],
            );
        }

    }

    // --------------------------------------------------------------- Universities

    protected function seedUniversities(): void
    {
        foreach ($this->dataset('universities') as $row) {
            $university = University::updateOrCreate(['id' => $row['id']], [
                'name_ar' => $row['nameAr'],
                'name_en' => $row['nameEn'],
                'country_code' => Str::upper((string) $row['countryCode']),
                'country_ar' => $row['country'],
                'country_en' => $row['countryEn'],
                'city_ar' => $row['city'],
                'city_en' => $row['cityEn'] ?? $row['city'],
                'qs_rank' => (int) $row['qsRank'],
                'the_rank' => isset($row['theRank']) ? (int) $row['theRank'] : null,
                'min_ielts' => (float) ($row['minIelts'] ?? 6.5),
                'min_toefl' => (int) ($row['minToefl'] ?? 85),
                'acceptance_rate' => $row['acceptanceRate'] ?? null,
                'top_majors_ar' => $row['topMajorsAr'] ?? [],
                'top_majors_en' => $row['topMajorsEn'] ?? [],
                'degrees_available' => $row['degreesAvailable'] ?? [],
                'website_url' => $row['websiteUrl'] ?? null,
                'image_url' => $row['imageUrl'] ?? null,
                'cultural_mission_id' => $row['culturalMissionId'] ?? null,
                'is_top_30' => (bool) ($row['isTop30'] ?? false),
                'is_top_100' => (bool) ($row['isTop100'] ?? false),
                'is_top_200' => (bool) ($row['isTop200'] ?? false),
                'is_featured' => (int) $row['qsRank'] <= 10,
                'is_active' => true,
            ]);

            $accredited = collect($row['accreditedTracks'] ?? [])
                ->filter(fn (string $trackId): bool => ScholarshipTrack::whereKey($trackId)->exists())
                ->mapWithKeys(fn (string $trackId): array => [$trackId => ['accredited_since' => '2024-01-01']])
                ->all();

            $university->tracks()->sync($accredited);
        }
    }

    // ----------------------------------------------------------- Cultural missions

    protected function seedCulturalMissions(): void
    {
        $knownCodes = Country::query()->pluck('code')->all();

        foreach ($this->dataset('cultural_missions') as $row) {
            // Mission ids carry their primary country ("sacm-us"); several missions
            // supervise a region, so the label keeps the full wording.
            $code = Str::upper(Str::afterLast($row['id'], '-'));
            $code = ['UK' => 'GB'][$code] ?? $code;

            CulturalMission::updateOrCreate(['id' => $row['id']], [
                'code' => $row['code'],
                'country_code' => in_array($code, $knownCodes, true) ? $code : null,
                'country_ar' => $row['countryAr'],
                'country_en' => $row['countryEn'],
                'city_ar' => $row['cityAr'],
                'city_en' => $row['cityEn'] ?? null,
                'title_ar' => $row['titleAr'],
                'title_en' => $row['titleEn'] ?? null,
                // The legacy export spells this key with an accented "é".
                'attache_name_ar' => $row['attachéNameAr'] ?? $row['attacheNameAr'] ?? null,
                'attache_name_en' => $row['attachéNameEn'] ?? $row['attacheNameEn'] ?? null,
                'email' => $row['email'] ?? null,
                'phone' => $row['phone'] ?? null,
                'emergency_phone' => $row['emergencyPhone'] ?? null,
                'working_hours_ar' => $row['workingHoursAr'] ?? null,
                'working_hours_en' => $row['workingHoursEn'] ?? null,
                'address_ar' => $row['addressAr'] ?? null,
                'address_en' => $row['addressEn'] ?? null,
                'active_students_count' => (int) ($row['activeStudentsCount'] ?? 0),
                'latitude' => $row['lat'] ?? null,
                'longitude' => $row['lng'] ?? null,
                'is_active' => true,
            ]);
        }
    }

    // ------------------------------------------------------------------- Visuals

    protected function iconFor(string $trackId): string
    {
        return match ($trackId) {
            'track-pioneers' => 'crown',
            'track-supply' => 'layers',
            'track-rd' => 'microscope',
            'track-excellence' => 'award',
            'track-health' => 'stethoscope',
            'track-waed' => 'rocket',
            default => 'graduation-cap',
        };
    }

    protected function imageFor(string $trackId): string
    {
        return match ($trackId) {
            'track-pioneers' => 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1000&auto=format&fit=crop&q=80',
            'track-supply' => '/images/saudi-youth-imdad.jpg',
            'track-rd' => '/images/saudi-scholar-researcher.jpg',
            'track-excellence' => '/images/saudi-youth-excellence.jpg',
            'track-health' => 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=1000&auto=format&fit=crop&q=80',
            'track-waed' => 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?w=1000&auto=format&fit=crop&q=80',
            default => 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1000&auto=format&fit=crop&q=80',
        };
    }
}
