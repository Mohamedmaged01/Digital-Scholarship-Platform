<?php

namespace Database\Seeders;

use App\Models\CmsPage;
use App\Models\Faq;
use App\Models\MediaItem;
use App\Models\NewsArticle;
use App\Models\PageBlock;
use App\Models\PageVersion;
use App\Models\SeoMetadata;
use App\Models\SiteSetting;
use App\Models\UserGuideStep;
use Database\Seeders\Concerns\ReadsLegacyData;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ContentSeeder extends Seeder
{
    use ReadsLegacyData;

    public function run(): void
    {
        $this->seedFaqs();
        $this->seedNews();
        $this->seedMedia();
        $this->seedPages();
        $this->seedGuideSteps();
        $this->seedSettings();
        $this->seedSeo();
    }

    // ----------------------------------------------------------------------- FAQ

    protected function seedFaqs(): void
    {
        $order = 1;

        foreach ($this->dataset('faqs') as $row) {
            Faq::updateOrCreate(['id' => $row['id']], [
                'question_ar' => $row['questionAr'],
                'question_en' => $row['questionEn'],
                'answer_ar' => $row['answerAr'],
                'answer_en' => $row['answerEn'],
                'category' => $row['category'],
                'tags' => $row['tags'] ?? [],
                'related_track_id' => $row['relatedTrackId'] ?? null,
                'sort_order' => $order,
                'is_featured' => $order <= 4,
                'is_published' => true,
            ]);

            $order++;
        }
    }

    // ---------------------------------------------------------------------- News

    protected function seedNews(): void
    {
        foreach ($this->dataset('news') as $row) {
            $summaryAr = $row['excerptAr'] ?? $row['summaryAr'] ?? $row['titleAr'];

            NewsArticle::updateOrCreate(['id' => $row['id']], [
                'slug' => Str::slug($row['titleEn'] ?? $row['titleAr']) ?: $row['id'],
                'title_ar' => $row['titleAr'],
                'title_en' => $row['titleEn'] ?? null,
                'summary_ar' => $summaryAr,
                'summary_en' => $row['excerptEn'] ?? $row['summaryEn'] ?? null,
                'content_ar' => $row['contentAr'] ?? $this->expandBody($summaryAr),
                'content_en' => $row['contentEn'] ?? null,
                'category' => $this->newsCategory($row['category'] ?? 'announcement'),
                'publish_date' => $row['publishedAt'] ?? $row['publishDate'] ?? now()->toDateString(),
                'author_ar' => $row['author'] ?? 'وكالة الوزارة للابتعاث',
                'author_en' => $row['authorEn'] ?? 'Scholarship Agency',
                'image_url' => $row['imageUrl'] ?? null,
                'is_featured' => $row['isFeatured'] ?? false,
                'status' => $row['status'] ?? 'published',
            ]);
        }
    }

    /** The legacy admin list used its own category slugs; fold them onto ours. */
    protected function newsCategory(string $category): string
    {
        return match ($category) {
            'admission_cycle', 'admission' => 'admission',
            'event', 'events' => 'event',
            'strategy', 'partnership' => 'strategy',
            default => 'announcement',
        };
    }

    protected function expandBody(string $summary): string
    {
        return $summary."\n\n".
            'تؤكد وكالة الوزارة للابتعاث أن جميع الإجراءات الرسمية للتقديم والترشيح تتم حصراً عبر بوابة الابتعاث الموحدة، '.
            'وأن هذه البوابة التعريفية تهدف إلى إتاحة المعلومة الرسمية عن المسارات والجامعات والشروط المعتمدة.';
    }

    // --------------------------------------------------------------------- Media

    protected function seedMedia(): void
    {
        foreach ($this->dataset('media') as $row) {
            MediaItem::updateOrCreate(['id' => $row['id']], [
                'file_name' => $row['name'],
                'url' => $row['url'],
                'folder' => $this->mediaFolder($row['name']),
                'mime_type' => $row['fileType'] ?? null,
                'extension' => $row['extension'] ?? null,
                'size_bytes' => $this->parseSize($row['fileSize'] ?? null),
                'dimensions' => $row['dimensions'] ?? null,
                'alt_text_ar' => $row['altTextAr'] ?? null,
                'alt_text_en' => $row['altTextEn'] ?? null,
                'uploaded_by' => $row['uploadedBy'] ?? null,
                'created_at' => $this->asTimestamp($row['uploadedAt'] ?? null) ?? now(),
            ]);
        }
    }

    protected function mediaFolder(string $name): string
    {
        return match (true) {
            Str::contains($name, ['emblem', 'logo']) => 'logos',
            Str::contains($name, ['track', 'pioneers', 'imdad']) => 'tracks',
            Str::contains($name, ['uni', 'campus']) => 'universities',
            Str::contains($name, ['guide', 'doc', 'pdf']) => 'documents',
            default => 'banners',
        };
    }

    /** "420 KB" / "2.1 MB" -> bytes. */
    protected function parseSize(?string $label): int
    {
        if (blank($label)) {
            return 0;
        }

        preg_match('/([\d.]+)\s*(KB|MB|GB|B)?/i', $label, $matches);

        $value = (float) ($matches[1] ?? 0);

        return (int) round($value * match (Str::upper($matches[2] ?? 'KB')) {
            'GB' => 1024 ** 3,
            'MB' => 1024 ** 2,
            'B' => 1,
            default => 1024,
        });
    }

    // ------------------------------------------------------------ CMS page builder

    protected function seedPages(): void
    {
        foreach ($this->dataset('cms_pages') as $row) {
            $page = CmsPage::updateOrCreate(['id' => $row['id']], [
                'slug' => $row['slug'],
                'title_ar' => $row['titleAr'],
                'title_en' => $row['titleEn'] ?? null,
                'description_ar' => $row['descriptionAr'] ?? null,
                'description_en' => $row['descriptionEn'] ?? null,
                'status' => $row['status'] ?? 'draft',
                'seo_title' => $row['seoTitle'] ?? null,
                'seo_description' => $row['seoDescription'] ?? null,
                'last_updated_by' => $row['author'] ?? null,
                'updated_at' => $this->asTimestamp($row['lastUpdated'] ?? null) ?? now(),
            ]);

            foreach ($row['blocks'] ?? [] as $block) {
                PageBlock::updateOrCreate(['id' => $page->id.'-'.$block['id']], [
                    'page_id' => $page->id,
                    'type' => Str::snake($block['type']),
                    'title_ar' => $block['title'] ?? null,
                    'title_en' => $block['titleEn'] ?? null,
                    'content_ar' => $block['content'] ?? null,
                    'content_en' => $block['contentEn'] ?? null,
                    'config' => $block['config'] ?? [],
                    'sort_order' => (int) ($block['order'] ?? 1),
                    'is_enabled' => (bool) ($block['isVisible'] ?? true),
                ]);
            }

            $versionNumber = 1;

            foreach ($row['versions'] ?? [] as $version) {
                PageVersion::updateOrCreate(['id' => $page->id.'-'.Str::slug($version['versionId'])], [
                    'page_id' => $page->id,
                    'version_number' => $versionNumber++,
                    'label' => $version['versionId'],
                    'snapshot' => ['blocks' => $version['blocks'] ?? []],
                    'status' => 'archived',
                    'changelog_notes' => $version['comment'] ?? null,
                    'created_by' => $version['savedBy'] ?? null,
                    'created_at' => $this->asTimestamp($version['savedAt'] ?? null) ?? now(),
                ]);
            }
        }
    }

    // ------------------------------------------------------------------- Guides

    protected function seedGuideSteps(): void
    {
        foreach ($this->dataset('user_guide_steps') as $system => $steps) {
            foreach ($steps as $step) {
                UserGuideStep::updateOrCreate(
                    ['system' => $system, 'step_number' => (int) $step['stepNumber']],
                    [
                        'title_ar' => $step['titleAr'],
                        'title_en' => $step['titleEn'] ?? null,
                        'description_ar' => $step['descriptionAr'] ?? null,
                        'description_en' => $step['descriptionEn'] ?? null,
                        'details_ar' => $step['keyPoints'] ?? $step['detailsAr'] ?? [],
                        'details_en' => $step['keyPointsEn'] ?? $step['detailsEn'] ?? [],
                        'tips_ar' => array_filter((array) ($step['tipsAr'] ?? [])),
                        'tips_en' => array_filter((array) ($step['tipsEn'] ?? [])),
                        'icon_name' => Str::kebab($step['iconName'] ?? 'info'),
                    ],
                );
            }
        }
    }

    // ------------------------------------------------------------------ Settings

    protected function seedSettings(): void
    {
        $legacy = $this->dataset('site_settings');

        $settings = [
            'site_name_ar' => $legacy['siteTitleAr'] ?? 'منصة برنامج خادم الحرمين الشريفين للابتعاث',
            'site_name_en' => $legacy['siteTitleEn'] ?? 'The Custodian of the Two Holy Mosques Scholarship Program',
            'tagline_ar' => 'البوابة الوطنية الموحدة للابتعاث الخارجي',
            'tagline_en' => 'The unified national gateway for overseas scholarships',
            'maintenance_mode' => (bool) ($legacy['maintenanceMode'] ?? false),
            'official_apply_url' => $legacy['officialApplicationUrl'] ?? config('kasp.apply_url'),
            'support_email' => $legacy['supportEmail'] ?? config('kasp.support.email'),
            'support_phone' => $legacy['hotlinePhone'] ?? config('kasp.support.phone'),
            'allow_public_ai_chat' => (bool) ($legacy['allowPublicAiChat'] ?? true),
            'cache_ttl_seconds' => (int) ($legacy['cacheTtlSeconds'] ?? 3600),
            'primary_color' => '#005A36',
            'moe_portal_url' => config('kasp.moe_url'),
            'vision_2030_url' => config('kasp.vision_url'),
            'social_links' => [
                'x_twitter' => 'https://x.com/moe_gov_sa',
                'youtube' => 'https://www.youtube.com/@MOEGOVSA',
                'linkedin' => 'https://www.linkedin.com/company/moe-gov-sa',
                'instagram' => 'https://www.instagram.com/moe_gov_sa',
            ],
            'announcement_banner' => [
                'is_active' => true,
                'text_ar' => 'التقديم على مسارات الابتعاث متاح حصراً عبر بوابة الابتعاث الموحدة الرسمية.',
                'text_en' => 'Scholarship applications are accepted only through the official unified portal.',
                'action_url' => config('kasp.apply_url'),
            ],
        ];

        foreach ($settings as $key => $value) {
            SiteSetting::updateOrCreate(['key' => $key], ['value' => $value]);
        }
    }

    protected function seedSeo(): void
    {
        SeoMetadata::updateOrCreate(['page_slug' => 'home'], [
            'meta_title_ar' => 'برنامج خادم الحرمين الشريفين للابتعاث | البوابة الوطنية الموحدة',
            'meta_title_en' => 'The Custodian of the Two Holy Mosques Scholarship Program | National Portal',
            'meta_description_ar' => 'البوابة الرسمية لبرنامج خادم الحرمين الشريفين للابتعاث: استكشف المسارات الستة، الجامعات المعتمدة، الشروط، ومحطات رحلة الابتعاث.',
            'meta_description_en' => 'Official portal of the Custodian of the Two Holy Mosques Scholarship Program: explore the six tracks, accredited universities, criteria and the scholarship journey.',
            'keywords_ar' => ['الابتعاث', 'مسارات الابتعاث', 'الجامعات المعتمدة', 'وزارة التعليم', 'رؤية 2030'],
            'keywords_en' => ['scholarship', 'saudi scholarship', 'accredited universities', 'ministry of education', 'vision 2030'],
            'canonical_url' => config('app.url'),
            'og_image' => '/images/saudi-scholars-hero.jpg',
        ]);
    }
}
