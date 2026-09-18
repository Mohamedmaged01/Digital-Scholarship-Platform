<?php

namespace App\Services;

use App\Models\CmsPage;
use App\Models\Country;
use App\Models\CulturalMission;
use App\Models\Faq;
use App\Models\MediaItem;
use App\Models\NewsArticle;
use App\Models\PageBlock;
use App\Models\RequirementRule;
use App\Models\ScholarshipTrack;
use App\Models\SiteSetting;
use App\Models\University;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Throwable;

/**
 * Exports and restores the editable content of the platform as a single JSON
 * document. Operational records (applications, audit trail) are deliberately out
 * of scope: they must never be replaced by an import.
 */
class BackupService
{
    public const VERSION = 1;

    public function export(): array
    {
        return [
            'version' => self::VERSION,
            'generated_at' => now()->toIso8601String(),
            'generated_by' => auth()->user()?->username,
            'data' => [
                'countries' => Country::query()->get()->toArray(),
                'tracks' => ScholarshipTrack::query()->get()->toArray(),
                'requirement_rules' => RequirementRule::query()->get()->toArray(),
                'universities' => University::query()->get()->toArray(),
                'university_track' => DB::table('university_track')->get()->map(fn ($row): array => (array) $row)->all(),
                'cultural_missions' => CulturalMission::query()->get()->toArray(),
                'faqs' => Faq::query()->get()->toArray(),
                'news_articles' => NewsArticle::query()->get()->toArray(),
                'media_items' => MediaItem::query()->get()->toArray(),
                'cms_pages' => CmsPage::query()->get()->toArray(),
                'page_blocks' => PageBlock::query()->get()->toArray(),
                'site_settings' => SiteSetting::query()->get()->toArray(),
            ],
        ];
    }

    public function filename(): string
    {
        return 'kasp-backup-'.now()->format('Y-m-d-His').'.json';
    }

    /**
     * Restore a previously exported document. Returns false when the payload is
     * not a recognisable backup; throws only on a genuine database failure.
     */
    public function import(array $payload): bool
    {
        if (($payload['version'] ?? null) !== self::VERSION || ! is_array($payload['data'] ?? null)) {
            return false;
        }

        $data = $payload['data'];

        $tables = [
            'countries' => ['model' => Country::class, 'key' => 'code'],
            'tracks' => ['model' => ScholarshipTrack::class, 'key' => 'id'],
            'requirement_rules' => ['model' => RequirementRule::class, 'key' => 'id'],
            'universities' => ['model' => University::class, 'key' => 'id'],
            'cultural_missions' => ['model' => CulturalMission::class, 'key' => 'id'],
            'faqs' => ['model' => Faq::class, 'key' => 'id'],
            'news_articles' => ['model' => NewsArticle::class, 'key' => 'id'],
            'media_items' => ['model' => MediaItem::class, 'key' => 'id'],
            'cms_pages' => ['model' => CmsPage::class, 'key' => 'id'],
            'page_blocks' => ['model' => PageBlock::class, 'key' => 'id'],
            'site_settings' => ['model' => SiteSetting::class, 'key' => 'key'],
        ];

        try {
            DB::transaction(function () use ($data, $tables): void {
                foreach ($tables as $name => $meta) {
                    foreach ($data[$name] ?? [] as $row) {
                        if (! is_array($row) || ! isset($row[$meta['key']])) {
                            continue;
                        }

                        /** @var class-string<Model> $model */
                        $model = $meta['model'];
                        $identifier = [$meta['key'] => $row[$meta['key']]];

                        $model::withoutEvents(fn () => $model::updateOrCreate($identifier, $row));
                    }
                }

                foreach ($data['university_track'] ?? [] as $row) {
                    if (! isset($row['university_id'], $row['track_id'])) {
                        continue;
                    }

                    DB::table('university_track')->updateOrInsert(
                        ['university_id' => $row['university_id'], 'track_id' => $row['track_id']],
                        ['accredited_since' => $row['accredited_since'] ?? null],
                    );
                }
            });
        } catch (Throwable) {
            return false;
        }

        SiteSetting::query()->first()?->touch();

        return true;
    }
}
