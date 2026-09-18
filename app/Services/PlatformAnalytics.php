<?php

namespace App\Services;

use App\Models\AiTelemetry;
use App\Models\AnalyticsCounter;
use App\Models\Application;
use App\Models\Appointment;
use App\Models\CmsPage;
use App\Models\Country;
use App\Models\Faq;
use App\Models\MediaItem;
use App\Models\PageView;
use App\Models\ScholarshipTrack;
use App\Models\SearchQuery;
use App\Models\UnansweredQuestion;
use App\Models\University;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Request;

/**
 * Aggregates the numbers the admin dashboard reports on, and records the
 * lightweight page-view and search signals that feed them.
 */
class PlatformAnalytics
{
    public function recordPageView(string $path, ?string $entityType = null, ?string $entityId = null): void
    {
        PageView::create([
            'path' => $path,
            'entity_type' => $entityType,
            'entity_id' => $entityId,
            'locale' => app()->getLocale(),
            'device' => $this->device(),
            'session_id' => request()->hasSession() ? session()->getId() : null,
            'created_at' => now(),
        ]);

        AnalyticsCounter::bump('visitors.total');

        if ($entityType === 'TRACK' && $entityId !== null) {
            AnalyticsCounter::bump('track_views.'.$entityId);
        }
    }

    public function recordSearch(string $query, int $results): void
    {
        SearchQuery::create([
            'query' => $query,
            'results_count' => $results,
            'locale' => app()->getLocale(),
        ]);
    }

    /** @return array<string, mixed> */
    public function dashboard(): array
    {
        $tracks = ScholarshipTrack::query()->orderBy('sort_order')->get();

        return [
            'total_quota' => (int) $tracks->sum('allocated_seats'),
            'filled_seats' => (int) $tracks->sum('filled_seats'),
            'active_tracks' => $tracks->where('is_active', true)->count(),
            'tracks_total' => $tracks->count(),
            'universities' => University::query()->count(),
            'countries' => Country::query()->count(),
            'visitors_total' => AnalyticsCounter::value('visitors.total'),
            'visitors_today' => PageView::query()->whereDate('created_at', today())->count()
                ?: AnalyticsCounter::value('visitors.today'),
            'published_pages' => CmsPage::query()->where('status', 'published')->count(),
            'pages_total' => CmsPage::query()->count(),
            'active_faqs' => Faq::query()->where('is_published', true)->count(),
            'media_items' => MediaItem::query()->count(),
            'ai_sessions' => AnalyticsCounter::value('ai.chat_sessions'),
            'ai_finder_runs' => AnalyticsCounter::value('ai.finder_runs'),
            'unanswered' => UnansweredQuestion::query()->whereNull('answered_at')->count(),
            'ai_avg_latency' => (int) round((float) AiTelemetry::query()->avg('latency_ms')),
            'pipeline' => $this->pipeline(),
            'quota_by_track' => $this->quotaByTrack($tracks),
            'top_tracks' => $this->topTracks($tracks),
            'upcoming_appointments' => Appointment::query()->upcoming()->limit(5)->get(),
            'top_searches' => SearchQuery::query()
                ->selectRaw('query, count(*) as hits')
                ->groupBy('query')
                ->orderByDesc('hits')
                ->limit(5)
                ->get(),
        ];
    }

    /** @return array<string, int> */
    public function pipeline(): array
    {
        return Application::query()
            ->selectRaw('status, count(*) as total')
            ->groupBy('status')
            ->pluck('total', 'status')
            ->all();
    }

    /**
     * @param  Collection<int, ScholarshipTrack>  $tracks
     * @return list<array{track: ScholarshipTrack, utilisation: float}>
     */
    protected function quotaByTrack(Collection $tracks): array
    {
        return $tracks
            ->map(fn (ScholarshipTrack $track): array => [
                'track' => $track,
                'utilisation' => $track->seatUtilisation(),
            ])
            ->sortByDesc('utilisation')
            ->values()
            ->all();
    }

    /**
     * @param  Collection<int, ScholarshipTrack>  $tracks
     * @return list<array{track: ScholarshipTrack, views: int}>
     */
    protected function topTracks(Collection $tracks): array
    {
        $views = AnalyticsCounter::map('track_views.');

        return $tracks
            ->map(fn (ScholarshipTrack $track): array => [
                'track' => $track,
                'views' => (int) ($views[$track->id] ?? 0),
            ])
            ->sortByDesc('views')
            ->take(6)
            ->values()
            ->all();
    }

    protected function device(): string
    {
        $agent = (string) Request::userAgent();

        return match (true) {
            str_contains($agent, 'Mobile') || str_contains($agent, 'Android') => 'mobile',
            str_contains($agent, 'Tablet') || str_contains($agent, 'iPad') => 'tablet',
            default => 'desktop',
        };
    }
}
