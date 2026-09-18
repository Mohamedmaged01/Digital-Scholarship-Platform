@php
    $degrees = ['Bachelor', 'Master', 'PhD'];

    $fields = [
        'ai_tech' => [__('ai_finder.field_ai'), app()->getLocale() === 'ar' ? 'الحوسبة السحابية، الروبوتات، الأمن السيبراني' : 'Cloud, robotics, cyber security'],
        'healthcare' => [__('ai_finder.field_health'), app()->getLocale() === 'ar' ? 'الطب البشري، الجراحة، الأورام، التمريض' : 'Medicine, surgery, oncology, nursing'],
        'engineering_industry' => [__('ai_finder.field_industry'), app()->getLocale() === 'ar' ? 'الطاقة المتجددة، التعدين، اللوجستيات' : 'Renewables, mining, logistics'],
        'creative_megaprojects' => [__('ai_finder.field_megaprojects'), app()->getLocale() === 'ar' ? 'التصميم الحضري، العمارة، الضيافة' : 'Urban design, architecture, hospitality'],
        'space_future' => [__('ai_finder.field_future'), app()->getLocale() === 'ar' ? 'الأقمار الاصطناعية، الهيدروجين، أشباه الموصلات' : 'Satellites, clean hydrogen, semiconductors'],
        'business_policy' => [__('ai_finder.field_research'), app()->getLocale() === 'ar' ? 'الاقتصاد الرقمي، الحوكمة، السياسات' : 'Digital economy, governance, policy'],
    ];

    $goals = [
        'national_megaprojects' => app()->getLocale() === 'ar' ? 'مشاريع رؤية 2030 الكبرى' : 'Vision 2030 giga projects',
        'research_phd' => app()->getLocale() === 'ar' ? 'الأبحاث العلمية والتدريس الأكاديمي' : 'Academic research & professorship',
        'industry_leadership' => app()->getLocale() === 'ar' ? 'قيادة الشركات الوطنية والخاصة' : 'Corporate leadership & industry',
    ];

    $destinations = [
        'us_uk' => [app()->getLocale() === 'ar' ? 'أمريكا وبريطانيا' : 'United States & UK', 'MIT, Harvard, Oxford, Cambridge'],
        'europe_asia' => [app()->getLocale() === 'ar' ? 'أوروبا وشرق آسيا' : 'Europe & East Asia', 'ETH Zurich, Tokyo, NUS Singapore'],
        'australia_canada' => [app()->getLocale() === 'ar' ? 'كندا وأستراليا' : 'Canada & Australia', 'Toronto, McGill, Melbourne, Sydney'],
    ];

    $finderConfig = [
        'endpoint' => route('ai.recommend'),
        'labels' => ['error' => __('common.error')],
    ];
@endphp

<section id="ai-finder"
         x-data="trackFinder(@js($finderConfig))"
         class="scroll-mt-24 space-y-8 rounded-3xl border border-saudi-200/80 bg-gradient-to-br from-saudi-50 via-white to-sand-100/40 p-6 shadow-2xs sm:p-10 lg:p-12">

    <div class="flex flex-col items-start justify-between gap-6 border-b border-slate-200/80 pb-6 md:flex-row md:items-center">
        <div class="max-w-2xl space-y-1.5">
            <p class="inline-flex items-center gap-2 rounded-full border border-saudi-300 bg-saudi-100 px-3 py-1 text-xs font-bold text-saudi-700">
                <x-lucide-bot class="size-4" aria-hidden="true" />
                <span>{{ __('ai_finder.eyebrow') }}</span>
            </p>
            <h2 class="heading-section text-slate-900">{{ __('ai_finder.title') }}</h2>
            <p class="text-xs text-slate-600 sm:text-sm">{{ __('ai_finder.subtitle') }}</p>
        </div>

        <button type="button" x-show="step === 4" @click="restart()"
                class="flex shrink-0 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50">
            <x-lucide-rotate-ccw class="size-4" aria-hidden="true" />
            <span>{{ __('ai_finder.recalculate') }}</span>
        </button>
    </div>

    <div class="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-md sm:p-8">

        {{-- Progress --}}
        <div x-show="step < 4" class="flex items-center justify-between border-b border-slate-100 pb-4 text-xs font-bold text-slate-500">
            <span class="text-saudi-700">
                {{ app()->getLocale() === 'ar' ? 'الخطوة' : 'Step' }} <span class="numeric" x-text="step"></span> / <span class="numeric">3</span>
            </span>
            <span class="flex items-center gap-1.5" aria-hidden="true">
                <template x-for="n in 3" :key="n">
                    <span class="h-1.5 w-6 rounded-full transition-colors" :class="n <= step ? 'bg-saudi-700' : 'bg-slate-200'"></span>
                </template>
            </span>
        </div>

        {{-- Step 1 — academic background --}}
        <div x-show="step === 1" class="space-y-6">
            <fieldset class="space-y-3">
                <legend class="text-sm font-bold text-slate-900">{{ __('ai_finder.step_degree') }}</legend>
                <div class="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    @foreach ($degrees as $degree)
                        <label class="cursor-pointer rounded-2xl border p-4 transition"
                               :class="answers.degree === '{{ $degree }}' ? 'border-saudi-600 bg-saudi-50 shadow-xs' : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'">
                            <input type="radio" x-model="answers.degree" value="{{ $degree }}" class="sr-only" name="finder-degree">
                            <span class="block text-sm font-bold text-slate-900">{{ __('catalog.degrees.'.$degree) }}</span>
                            <span class="mt-0.5 block text-[11px] text-slate-500">{{ __('catalog.degrees.'.$degree) }}</span>
                        </label>
                    @endforeach
                </div>
            </fieldset>

            <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <label class="space-y-2">
                    <span class="flex items-center justify-between text-sm font-bold text-slate-900">
                        <span>{{ __('ai_finder.step_gpa') }}</span>
                        <span class="numeric rounded-lg bg-saudi-50 px-2 py-0.5 text-saudi-700" x-text="Number(answers.gpa).toFixed(2)"></span>
                    </span>
                    <input type="range" x-model.number="answers.gpa" min="2" max="5" step="0.05"
                           class="w-full accent-saudi-700">
                    <span class="numeric flex justify-between text-[10px] text-slate-400"><span>2.00</span><span>5.00</span></span>
                </label>

                <label class="space-y-2">
                    <span class="flex items-center justify-between text-sm font-bold text-slate-900">
                        <span>{{ __('ai_finder.step_ielts') }}</span>
                        <span class="numeric rounded-lg bg-saudi-50 px-2 py-0.5 text-saudi-700" x-text="Number(answers.english).toFixed(1)"></span>
                    </span>
                    <input type="range" x-model.number="answers.english" min="4" max="9" step="0.5"
                           class="w-full accent-saudi-700">
                    <span class="numeric flex justify-between text-[10px] text-slate-400"><span>4.0</span><span>9.0</span></span>
                </label>
            </div>
        </div>

        {{-- Step 2 — field of interest --}}
        <fieldset x-show="step === 2" class="space-y-3">
            <legend class="text-sm font-bold text-slate-900">{{ __('ai_finder.step_field') }}</legend>
            <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                @foreach ($fields as $value => [$label, $hint])
                    <label class="cursor-pointer rounded-2xl border p-4 transition"
                           :class="answers.field === '{{ $value }}' ? 'border-saudi-600 bg-saudi-50 shadow-xs' : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'">
                        <input type="radio" x-model="answers.field" value="{{ $value }}" class="sr-only" name="finder-field">
                        <span class="block text-sm font-bold text-slate-900">{{ $label }}</span>
                        <span class="mt-0.5 block text-[11px] leading-snug text-slate-500">{{ $hint }}</span>
                    </label>
                @endforeach
            </div>
        </fieldset>

        {{-- Step 3 — goal and destination --}}
        <div x-show="step === 3" class="space-y-6">
            <fieldset class="space-y-3">
                <legend class="text-sm font-bold text-slate-900">{{ app()->getLocale() === 'ar' ? 'طموحك المهني بعد التخرج' : 'Your career goal after graduation' }}</legend>
                <div class="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    @foreach ($goals as $value => $label)
                        <label class="cursor-pointer rounded-2xl border p-4 text-sm font-bold text-slate-900 transition"
                               :class="answers.goal === '{{ $value }}' ? 'border-saudi-600 bg-saudi-50 shadow-xs' : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'">
                            <input type="radio" x-model="answers.goal" value="{{ $value }}" class="sr-only" name="finder-goal">
                            {{ $label }}
                        </label>
                    @endforeach
                </div>
            </fieldset>

            <fieldset class="space-y-3">
                <legend class="text-sm font-bold text-slate-900">{{ app()->getLocale() === 'ar' ? 'الوجهة المفضلة' : 'Preferred destination' }}</legend>
                <div class="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    @foreach ($destinations as $value => [$label, $hint])
                        <label class="cursor-pointer rounded-2xl border p-4 transition"
                               :class="answers.destination === '{{ $value }}' ? 'border-saudi-600 bg-saudi-50 shadow-xs' : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'">
                            <input type="radio" x-model="answers.destination" value="{{ $value }}" class="sr-only" name="finder-destination">
                            <span class="block text-sm font-bold text-slate-900">{{ $label }}</span>
                            <span class="mt-0.5 block text-[11px] text-slate-500" dir="ltr">{{ $hint }}</span>
                        </label>
                    @endforeach
                </div>
            </fieldset>
        </div>

        {{-- Result --}}
        <div x-show="step === 4 && result" x-cloak class="space-y-6">
            <div class="flex flex-col items-start justify-between gap-4 rounded-2xl border border-saudi-300 bg-gradient-to-r from-saudi-50 to-white p-5 sm:flex-row sm:items-center">
                <div class="space-y-1">
                    <p class="text-xs font-bold text-saudi-700">{{ __('ai_finder.result_title') }}</p>
                    <h3 class="text-xl font-black text-slate-900" x-text="result?.track?.name"></h3>
                    <p class="text-xs text-slate-500">
                        {{ __('ai_finder.eligible_status') }}
                    </p>
                </div>

                <div class="flex items-center gap-4">
                    <div class="text-center">
                        <p class="text-[11px] font-bold text-slate-500">{{ __('ai_finder.match_score') }}</p>
                        <p class="numeric text-3xl font-black text-saudi-700"><span x-text="result?.score"></span>%</p>
                    </div>
                    <a :href="result?.track?.url"
                       class="flex items-center gap-1.5 rounded-xl bg-saudi-700 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-saudi-800">
                        <span>{{ __('tracks.details_btn') }}</span>
                        <x-lucide-arrow-right class="size-3.5 flip-rtl" aria-hidden="true" />
                    </a>
                </div>
            </div>

            <div class="grid grid-cols-1 gap-5 lg:grid-cols-2">
                <div class="space-y-3">
                    <h4 class="text-sm font-bold text-slate-900">{{ app()->getLocale() === 'ar' ? 'لماذا هذا المسار؟' : 'Why this track?' }}</h4>
                    <ul class="space-y-2">
                        <template x-for="(reason, index) in result?.reasons ?? []" :key="index">
                            <li class="flex items-start gap-2 rounded-xl bg-slate-50 p-3 text-xs leading-relaxed text-slate-700">
                                <x-lucide-circle-check class="mt-0.5 size-4 shrink-0 text-saudi-600" aria-hidden="true" />
                                <span x-text="reason"></span>
                            </li>
                        </template>
                    </ul>
                </div>

                <div class="space-y-3">
                    <h4 class="text-sm font-bold text-slate-900">{{ __('ai_finder.criteria_passed') }}</h4>
                    <ul class="space-y-2">
                        <template x-for="(item, index) in result?.criteria ?? []" :key="index">
                            <li class="flex items-center justify-between gap-3 rounded-xl border border-slate-200 p-3 text-xs">
                                <span class="font-semibold text-slate-700" x-text="item.label"></span>
                                <span class="flex items-center gap-2">
                                    <span class="numeric text-slate-500" x-text="item.provided"></span>
                                    <x-lucide-circle-check class="size-4 shrink-0 text-saudi-600" x-show="item.passed" aria-hidden="true" />
                                    <x-lucide-circle-alert class="size-4 shrink-0 text-amber-500" x-show="!item.passed" aria-hidden="true" />
                                </span>
                            </li>
                        </template>
                    </ul>
                </div>
            </div>

            <div x-show="(result?.universities ?? []).length > 0" class="space-y-3">
                <h4 class="text-sm font-bold text-slate-900">{{ __('catalog.track.accredited_universities') }}</h4>
                <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    <template x-for="university in result?.universities ?? []" :key="university.url">
                        <a :href="university.url" class="rounded-xl border border-slate-200 bg-white p-3 transition hover:border-saudi-300">
                            <span class="numeric block text-[11px] font-bold text-sand-500">#<span x-text="university.rank"></span></span>
                            <span class="mt-0.5 block text-xs font-bold text-slate-900" x-text="university.name"></span>
                            <span class="block text-[11px] text-slate-500" x-text="university.country"></span>
                        </a>
                    </template>
                </div>
            </div>

            <div x-show="(result?.runner_ups ?? []).length > 0" class="flex flex-wrap items-center gap-2 border-t border-slate-100 pt-4 text-xs">
                <span class="font-bold text-slate-500">{{ app()->getLocale() === 'ar' ? 'مسارات بديلة:' : 'Alternative tracks:' }}</span>
                <template x-for="runnerUp in result?.runner_ups ?? []" :key="runnerUp.url">
                    <a :href="runnerUp.url" class="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 font-semibold text-slate-700 transition hover:border-saudi-300">
                        <span x-text="runnerUp.name"></span>
                        <span class="numeric text-slate-400"><span x-text="runnerUp.score"></span>%</span>
                    </a>
                </template>
            </div>

            <a :href="result?.track?.apply_url" target="_blank" rel="noopener"
               class="flex w-full items-center justify-center gap-2 rounded-2xl bg-sand-300 px-6 py-3.5 text-sm font-extrabold text-slate-950 transition hover:bg-sand-200">
                <span>{{ __('catalog.track.apply_official') }}</span>
                <x-lucide-external-link class="size-4" aria-hidden="true" />
            </a>
        </div>

        <p x-show="error" x-cloak class="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-800">
            <x-lucide-circle-alert class="size-4 shrink-0" aria-hidden="true" />
            <span x-text="error"></span>
        </p>

        {{-- Wizard controls --}}
        <div x-show="step < 4" class="flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
            <button type="button" @click="back()" x-show="step > 1"
                    class="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-700 transition hover:bg-slate-50">
                {{ __('common.back') }}
            </button>
            <span x-show="step === 1" aria-hidden="true"></span>

            <button type="button" @click="step < 3 ? next() : run()" :disabled="running"
                    class="flex items-center gap-2 rounded-xl bg-saudi-700 px-6 py-2.5 text-xs font-bold text-white transition hover:bg-saudi-800 disabled:opacity-50">
                <x-lucide-sparkles class="size-4 text-sand-300" x-show="step === 3" aria-hidden="true" />
                <span x-text="step < 3 ? @js(__('common.next')) : @js(__('ai_finder.calc_btn'))"></span>
                <x-lucide-arrow-right class="size-3.5 flip-rtl" x-show="step < 3" aria-hidden="true" />
            </button>
        </div>
    </div>

    <noscript>
        <p class="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-900">
            {{ app()->getLocale() === 'ar'
                ? 'محرك التوصية يحتاج إلى تشغيل الجافاسكربت. يمكنك بدلاً من ذلك استعراض المسارات وشروطها كاملة من صفحة المسارات.'
                : 'The recommender needs JavaScript. You can review every track and its criteria on the tracks page instead.' }}
        </p>
    </noscript>
</section>
