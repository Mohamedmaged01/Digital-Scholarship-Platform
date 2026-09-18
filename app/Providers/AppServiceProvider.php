<?php

namespace App\Providers;

use App\Models\ScholarshipTrack;
use App\Models\SiteSetting;
use Illuminate\Pagination\Paginator;
use Illuminate\Support\Facades\Blade;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\View;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        Paginator::useTailwind();

        $this->shareLayoutData();
        $this->registerBladeDirectives();

        if ($this->app->environment('production')) {
            URL::forceScheme('https');
        }
    }

    /**
     * Data the public shell always needs: platform settings, the navigation
     * tracks, and the text direction that drives the RTL layout.
     */
    protected function shareLayoutData(): void
    {
        View::composer(['layouts.public', 'partials.navbar', 'partials.footer'], function ($view): void {
            $view->with([
                'settings' => SiteSetting::allValues(),
                'navTracks' => ScholarshipTrack::published()->ordered()->get(['id', 'slug', 'name_ar', 'name_en', 'code']),
            ]);
        });
    }

    protected function registerBladeDirectives(): void
    {
        // @rtl / @ltr keep directional markup readable in the templates.
        Blade::if('rtl', fn (): bool => app()->getLocale() === 'ar');
        Blade::if('ltr', fn (): bool => app()->getLocale() !== 'ar');

        // @permission('tracks:write') guards admin UI affordances.
        Blade::if('permission', function (string $permission): bool {
            return auth()->check() && auth()->user()->hasPermission($permission);
        });

        // Named adminSection, not "section": Blade already owns @section.
        Blade::if('adminSection', function (string $section): bool {
            return auth()->check() && auth()->user()->canOpenSection($section);
        });
    }
}
