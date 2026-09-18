<?php

namespace App\Services\Ai;

use App\Models\Country;
use App\Models\CulturalMission;
use App\Models\ScholarshipTrack;
use App\Models\University;
use Illuminate\Support\Str;

/**
 * The rule-based scholarship advisor.
 *
 * This is the portal's own knowledge, not a language model: it recognises the
 * intent behind a question and answers from the published tracks, criteria and
 * procedures. It is the default advisor and also the fallback whenever a call to
 * Gemini is unavailable or fails, so the assistant never goes silent and never
 * invents criteria.
 */
class ScholarshipKnowledgeEngine
{
    /**
     * Intent keyword map. Order matters: the first intent whose keywords appear
     * in the question wins, so specific topics sit above general ones.
     *
     * @var array<string, list<string>>
     */
    protected const INTENTS = [
        'track_selection' => [
            'مناسب لي', 'اختيار المسار', 'أي مسار', 'ايش المسار', 'وش المسار',
            'right track', 'which track', 'suitable track', 'best track',
        ],
        'pioneers' => ['الرواد', 'pioneer'],
        'supply' => ['إمداد', 'امداد', 'imdad', 'سلاسل', 'supply chain'],
        'research' => ['البحث والتطوير', 'بحث وتطوير', 'r&d', 'research track', 'دكتوراه بحثية'],
        'excellence' => ['التميز', 'excellence track'],
        'health' => ['المسار الصحي', 'الزمالة', 'زمالات', 'health track', 'fellowship'],
        'waed' => ['واعد', 'waed'],
        'apply_steps' => [
            'كيف أقدم', 'كيف اقدم', 'خطوات التقديم', 'طريقة التقديم', 'اريد التقديم',
            'how to apply', 'how do i apply', 'application steps', 'apply for',
        ],
        'universities' => [
            'جامعات', 'الجامعات المتاحة', 'قائمة الجامعات', 'تصنيف الجامعة',
            'universities', 'available universities', 'ranking',
        ],
        'documents' => [
            'مستندات', 'أوراق', 'اوراق', 'الوثائق', 'المستندات المطلوبة',
            'documents', 'required documents', 'paperwork',
        ],
        'language_tests' => ['آيلتس', 'ايلتس', 'توفل', 'ielts', 'toefl', 'duolingo', 'اختبار اللغة'],
        'financial_guarantee' => ['ضمان مالي', 'الضمان المالي', 'financial guarantee'],
        'visa' => ['تأشيرة', 'التأشيرة', 'visa', 'f-1', 'cas'],
        'missions' => ['ملحقية', 'الملحقيات', 'الملحق الثقافي', 'cultural mission', 'attache'],
        'services' => ['خدمة', 'الخدمات', 'سفير', 'قبول', 'services', 'safeer'],
    ];

    /**
     * Answer a free-text question in the requested locale.
     */
    public function answer(string $question, string $locale = 'ar'): string
    {
        $intent = $this->detectIntent($question);

        return match ($intent) {
            'track_selection' => $this->trackSelection($locale),
            'pioneers' => $this->trackBrief('track-pioneers', $locale),
            'supply' => $this->trackBrief('track-supply', $locale),
            'research' => $this->trackBrief('track-rd', $locale),
            'excellence' => $this->trackBrief('track-excellence', $locale),
            'health' => $this->trackBrief('track-health', $locale),
            'waed' => $this->trackBrief('track-waed', $locale),
            'apply_steps' => $this->applySteps($locale),
            'universities' => $this->universities($locale),
            'documents' => $this->documents($locale),
            'language_tests' => $this->languageTests($locale),
            'financial_guarantee' => $this->financialGuarantee($locale),
            'visa' => $this->visa($locale),
            'missions' => $this->missions($locale),
            'services' => $this->services($locale),
            default => $this->greeting($locale),
        };
    }

    public function detectIntent(string $question): ?string
    {
        $clean = Str::lower(trim($question));

        if ($clean === '') {
            return null;
        }

        foreach (self::INTENTS as $intent => $keywords) {
            foreach ($keywords as $keyword) {
                if (Str::contains($clean, Str::lower($keyword))) {
                    return $intent;
                }
            }
        }

        return null;
    }

    /** True when the engine had nothing specific to say. */
    public function isFallback(string $question): bool
    {
        return $this->detectIntent($question) === null;
    }

    // ------------------------------------------------------------------ Answers

    protected function trackSelection(string $locale): string
    {
        $tracks = ScholarshipTrack::published()->ordered()->get();

        if ($locale === 'ar') {
            $lines = ['🎯 **دليل اختيار المسار المناسب لطموحك ومؤهلك**', '', 'يقدم البرنامج ستة مسارات استراتيجية. اختر الأنسب لك بناءً على مؤهلك وتصنيف جامعتك:', ''];
        } else {
            $lines = ['🎯 **Choosing the track that fits you**', '', 'The programme runs six strategic tracks. Pick the one that matches your qualifications and your institution’s ranking:', ''];
        }

        foreach ($tracks as $index => $track) {
            $number = $index + 1;

            $lines[] = $locale === 'ar'
                ? sprintf(
                    '%d. **%s** — أفضل %d جامعة عالمياً، معدل %s من 5.0، آيلتس %s. الدرجات: %s.',
                    $number,
                    $track->name_ar,
                    $track->top_universities_rank_limit,
                    rtrim(rtrim(number_format($track->min_gpa, 2), '0'), '.'),
                    rtrim(rtrim(number_format($track->required_ielts, 1), '0'), '.'),
                    implode('، ', $this->degreeLabels($track->required_degrees, 'ar')),
                )
                : sprintf(
                    '%d. **%s** — top %d worldwide, GPA %s/5.0, IELTS %s. Degrees: %s.',
                    $number,
                    $track->name_en ?: $track->name_ar,
                    $track->top_universities_rank_limit,
                    rtrim(rtrim(number_format($track->min_gpa, 2), '0'), '.'),
                    rtrim(rtrim(number_format($track->required_ielts, 1), '0'), '.'),
                    implode(', ', $this->degreeLabels($track->required_degrees, 'en')),
                );
        }

        $lines[] = '';
        $lines[] = $locale === 'ar'
            ? '💡 استخدم *محرك التوصية الذكي* في الصفحة الرئيسية للحصول على ترشيح مبني على معدلك ودرجة لغتك وهدفك المهني.'
            : '💡 Run the *AI recommender* on the home page for a recommendation based on your GPA, language score and career goal.';

        return implode("\n", $lines);
    }

    protected function trackBrief(string $trackId, string $locale): string
    {
        $track = ScholarshipTrack::with('rules')->find($trackId);

        if (! $track) {
            return $this->greeting($locale);
        }

        $name = $locale === 'ar' ? $track->name_ar : ($track->name_en ?: $track->name_ar);
        $description = $locale === 'ar' ? $track->description_ar : ($track->description_en ?: $track->description_ar);

        $lines = [
            $locale === 'ar' ? "🎓 **{$name}**" : "🎓 **{$name}**",
            '',
            $description,
            '',
            $locale === 'ar' ? '**الشروط المعتمدة:**' : '**Published criteria:**',
        ];

        foreach ($track->rules->where('is_active', true) as $rule) {
            $title = $locale === 'ar' ? $rule->title_ar : ($rule->title_en ?: $rule->title_ar);
            $expected = $rule->expected();
            $value = is_array($expected) ? implode($locale === 'ar' ? '، ' : ', ', $expected) : (string) $expected;

            $lines[] = "- {$title}: `{$rule->operator} {$value}`";
        }

        $features = $locale === 'ar' ? $track->features : ($track->features_en ?: $track->features);

        if (filled($features)) {
            $lines[] = '';
            $lines[] = $locale === 'ar' ? '**أبرز المزايا:**' : '**Key benefits:**';

            foreach ($features as $feature) {
                $lines[] = "- {$feature}";
            }
        }

        $lines[] = '';
        $lines[] = $locale === 'ar'
            ? 'المقاعد المخصصة لهذا المسار: **'.number_format($track->allocated_seats).'** مقعد.'
            : 'Allocated seats for this track: **'.number_format($track->allocated_seats).'**.';

        return implode("\n", $lines);
    }

    protected function applySteps(string $locale): string
    {
        $portal = config('kasp.apply_url');

        if ($locale === 'en') {
            return implode("\n", [
                '📝 **How to apply**',
                '',
                '1. **Secure admission** — obtain a final, unconditional offer from an institution accredited for your chosen track.',
                '2. **Sign in with Nafath** — the official portal uses the national single sign-on; no separate account is needed.',
                '3. **Upload your documents** — the offer letter, transcripts, language certificate and passport are read and validated automatically.',
                '4. **Confirm your track** — verify GPA, language score and age against the published criteria.',
                '5. **Review** — the file is audited by the scholarship committee and the cultural mission in your host country.',
                '6. **Decree & financial guarantee** — once approved, the QR-authenticated digital financial guarantee is issued for your visa and enrolment.',
                '',
                "Applications are submitted only on the official portal: {$portal}",
            ]);
        }

        return implode("\n", [
            '📝 **خطوات التقديم المعتمدة**',
            '',
            '1. **تأمين القبول الجامعي** — الحصول على قبول نهائي غير مشروط من جامعة معتمدة في المسار الذي اخترته.',
            '2. **الدخول عبر النفاذ الوطني** — البوابة الرسمية تستخدم النفاذ الموحد (نفاذ/يقين) دون إنشاء حساب جديد.',
            '3. **رفع المستندات** — خطاب القبول والسجل الأكاديمي وشهادة اللغة وجواز السفر، وتتم قراءتها والتحقق منها آلياً.',
            '4. **تأكيد المسار** — مطابقة المعدل ودرجة اللغة والعمر مع الشروط المنشورة.',
            '5. **التدقيق** — مراجعة الملف من لجنة الابتعاث والملحقية الثقافية في بلد الابتعاث.',
            '6. **القرار والضمان المالي** — بعد الاعتماد يُصدر الضمان المالي الرقمي برمز QR لاستكمال التأشيرة والتسجيل.',
            '',
            "التقديم يتم حصراً عبر البوابة الرسمية: {$portal}",
        ]);
    }

    protected function universities(string $locale): string
    {
        $universities = University::active()->orderBy('qs_rank')->limit(10)->get();

        $lines = $locale === 'ar'
            ? ['🏛️ **الجامعات المعتمدة وتصنيفاتها**', '', 'تعتمد المنصة تصنيفات QS و THE و Shanghai. أعلى الجامعات المعتمدة حالياً:', '']
            : ['🏛️ **Accredited universities and rankings**', '', 'The platform uses the QS, THE and Shanghai rankings. The highest-ranked accredited institutions are:', ''];

        foreach ($universities as $university) {
            $name = $locale === 'ar' ? $university->name_ar : $university->name_en;
            $country = $locale === 'ar' ? $university->country_ar : $university->country_en;

            $lines[] = "- **{$name}** — {$country} · #{$university->qs_rank}";
        }

        $lines[] = '';
        $lines[] = $locale === 'ar'
            ? '💡 استعرض الدليل الكامل من صفحة *الجامعات والتخصصات* وافرز بحسب الدولة والمسار والدرجة العلمية.'
            : '💡 Browse the full directory on the *Universities & majors* page and filter by country, track and degree level.';

        return implode("\n", $lines);
    }

    protected function documents(string $locale): string
    {
        if ($locale === 'en') {
            return implode("\n", [
                '📁 **Required documents**',
                '',
                '1. **Official offer letter** — final and unconditional, stating the major, degree level and start date.',
                '2. **Graduation certificate and transcripts** — attested, plus an equivalency decision if issued outside the Kingdom.',
                '3. **English proficiency certificate** — a valid IELTS Academic or TOEFL iBT report meeting the track threshold.',
                '4. **Passport copy** — valid for at least six months beyond the study start date.',
                '5. **Personal data** — imported automatically and verified through the national single sign-on.',
            ]);
        }

        return implode("\n", [
            '📁 **المستندات المطلوبة**',
            '',
            '1. **خطاب القبول الرسمي** — نهائي وغير مشروط، يوضح التخصص والدرجة العلمية وتاريخ بدء الدراسة.',
            '2. **وثيقة التخرج والسجل الأكاديمي** — مصدقة، مع معادلة الشهادة إن كانت صادرة من خارج المملكة.',
            '3. **شهادة كفاءة اللغة الإنجليزية** — اختبار ساري (IELTS Academic أو TOEFL iBT) يستوفي حد المسار.',
            '4. **صورة جواز السفر** — ساري لمدة لا تقل عن ستة أشهر من تاريخ بدء الدراسة.',
            '5. **البيانات الشخصية** — تُستورد تلقائياً وتُوثَّق عبر النفاذ الوطني ويقين.',
        ]);
    }

    protected function languageTests(string $locale): string
    {
        $tracks = ScholarshipTrack::published()->ordered()->get();

        $lines = $locale === 'ar'
            ? ['🗣️ **متطلبات اختبارات اللغة بحسب المسار**', '']
            : ['🗣️ **Language test thresholds by track**', ''];

        foreach ($tracks as $track) {
            $name = $locale === 'ar' ? $track->name_ar : ($track->name_en ?: $track->name_ar);
            $ielts = rtrim(rtrim(number_format($track->required_ielts, 1), '0'), '.');

            $lines[] = "- **{$name}** — IELTS {$ielts} · TOEFL iBT {$track->required_toefl}";
        }

        $lines[] = '';
        $lines[] = $locale === 'ar'
            ? 'يُشترط أن يكون الاختبار سارياً، وأن تستوفي الدرجة الحد الأعلى بين متطلب المسار ومتطلب الجامعة.'
            : 'The certificate must be valid, and your score must meet the higher of the track threshold and the institution’s own requirement.';

        return implode("\n", $lines);
    }

    protected function financialGuarantee(string $locale): string
    {
        if ($locale === 'en') {
            return implode("\n", [
                '📜 **The digital financial guarantee**',
                '',
                '- It is issued automatically once the nomination is approved and the scholarship decree is signed.',
                '- It carries an encrypted QR code and an authenticated digital seal recognised internationally.',
                '- Present it to the embassy for your student visa and to the university so tuition is billed to the sponsor directly.',
            ]);
        }

        return implode("\n", [
            '📜 **الضمان المالي الرقمي**',
            '',
            '- يُصدر تلقائياً بعد اعتماد الترشيح وصدور قرار الابتعاث.',
            '- يحمل رمز استجابة سريعة (QR) مشفراً وختماً رقمياً موثقاً معترفاً به دولياً.',
            '- يُقدَّم للسفارة لاستخراج التأشيرة الدراسية، وللجامعة لتحويل الرسوم على الجهة الراعية مباشرة.',
        ]);
    }

    protected function visa(string $locale): string
    {
        $countries = Country::query()->where('is_active', true)->limit(6)->get();

        $lines = $locale === 'ar'
            ? ['🛂 **التأشيرة الدراسية بحسب الوجهة**', '']
            : ['🛂 **Student visas by destination**', ''];

        foreach ($countries as $country) {
            $name = $locale === 'ar' ? $country->name_ar : $country->name_en;
            $overview = $locale === 'ar' ? $country->visa_overview_ar : ($country->visa_overview_en ?: $country->visa_overview_ar);

            if (filled($overview)) {
                $lines[] = "- **{$name}**: {$overview}";
            }
        }

        $lines[] = '';
        $lines[] = $locale === 'ar'
            ? 'الضمان المالي الرقمي هو المستند الأساسي المطلوب من السفارات لإصدار التأشيرة الدراسية.'
            : 'The digital financial guarantee is the primary document embassies require to issue a student visa.';

        return implode("\n", $lines);
    }

    protected function missions(string $locale): string
    {
        $missions = CulturalMission::query()->where('is_active', true)->get();

        $lines = $locale === 'ar'
            ? ['🏢 **الملحقيات الثقافية السعودية**', '', 'الملحقية هي جهة الإشراف الأكاديمي والمالي على المبتعث في بلد الدراسة:', '']
            : ['🏢 **Saudi cultural missions**', '', 'The mission is your academic and financial supervisor in the host country:', ''];

        foreach ($missions as $mission) {
            $title = $locale === 'ar' ? $mission->title_ar : ($mission->title_en ?: $mission->title_ar);
            $city = $locale === 'ar' ? $mission->city_ar : ($mission->city_en ?: $mission->city_ar);

            $lines[] = "- **{$title}** — {$city} · {$mission->phone}";
        }

        return implode("\n", $lines);
    }

    protected function services(string $locale): string
    {
        if ($locale === 'en') {
            return implode("\n", [
                '⚡ **Digital services**',
                '',
                '- **Qabool** — apply, have your offer letter verified, and match against tracks.',
                '- **Universities directory** — accredited institutions with criteria and priority majors.',
                '- **Cultural missions** — academic supervision and direct contact with your supervisor abroad.',
                '- **Safeer** — financial guarantees, travel orders, allowances and medical insurance.',
                '- **Help centre** — user guide, advisory appointments, and support on '.config('kasp.support.phone').'.',
            ]);
        }

        return implode("\n", [
            '⚡ **الخدمات الرقمية**',
            '',
            '- **منصة قبول** — التقديم، فحص خطاب القبول، ومطابقة المسارات.',
            '- **دليل الجامعات** — الجامعات المعتمدة وشروطها وتخصصاتها ذات الأولوية.',
            '- **الملحقيات الثقافية** — الإشراف الأكاديمي والتواصل المباشر مع المشرف الدراسي.',
            '- **منصة سفير** — الضمانات المالية، أوامر الإركاب، المخصصات، والتأمين الطبي.',
            '- **مركز المساعدة** — الدليل الإرشادي، حجز الاستشارات، والدعم عبر '.config('kasp.support.phone').'.',
        ]);
    }

    public function greeting(string $locale = 'ar'): string
    {
        if ($locale === 'en') {
            return implode("\n", [
                'Welcome to the **AI scholarship advisor** 🇸🇦',
                '',
                'I can help you with:',
                '- 🎯 Choosing the track that matches your qualifications',
                '- 📜 Eligibility criteria for each of the six tracks',
                '- 🏛️ Accredited universities and their rankings',
                '- 📝 The application steps on the official portal',
                '- 📁 Required documents and language test thresholds',
                '- ⚡ Electronic services and the digital financial guarantee',
                '',
                'Pick a suggested question or type your own.',
            ]);
        }

        return implode("\n", [
            'أهلاً بك في **المستشار الذكي للابتعاث** 🇸🇦',
            '',
            'يمكنني مساعدتك في:',
            '- 🎯 اختيار المسار المناسب لمؤهلك وطموحك',
            '- 📜 شروط ومعايير القبول في المسارات الستة',
            '- 🏛️ الجامعات المعتمدة وتصنيفاتها الأكاديمية',
            '- 📝 خطوات التقديم عبر البوابة الرسمية',
            '- 📁 المستندات المطلوبة ومتطلبات اختبارات اللغة',
            '- ⚡ الخدمات الإلكترونية وإصدار الضمان المالي الرقمي',
            '',
            'اختر أحد الأسئلة المقترحة أو اكتب استفسارك بحرية.',
        ]);
    }

    /** @param list<string> $degrees */
    protected function degreeLabels(array $degrees, string $locale): array
    {
        return array_map(
            fn (string $degree): string => __('catalog.degrees.'.$degree, [], $locale),
            $degrees,
        );
    }
}
