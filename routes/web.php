<?php

use App\Http\Controllers\Admin\AiManagerController;
use App\Http\Controllers\Admin\AuditLogController;
use App\Http\Controllers\Admin\BackupController;
use App\Http\Controllers\Admin\CountryController as AdminCountryController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\FaqController as AdminFaqController;
use App\Http\Controllers\Admin\LoginController;
use App\Http\Controllers\Admin\MediaController;
use App\Http\Controllers\Admin\NewsController as AdminNewsController;
use App\Http\Controllers\Admin\PageBuilderController;
use App\Http\Controllers\Admin\SettingsController;
use App\Http\Controllers\Admin\TrackController as AdminTrackController;
use App\Http\Controllers\Admin\UniversityController as AdminUniversityController;
use App\Http\Controllers\Admin\UserController as AdminUserController;
use App\Http\Controllers\AiAdvisorController;
use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\CountryController;
use App\Http\Controllers\CulturalMissionController;
use App\Http\Controllers\EligibilityController;
use App\Http\Controllers\FaqController;
use App\Http\Controllers\GuideController;
use App\Http\Controllers\HelpCenterController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\LocaleController;
use App\Http\Controllers\NewsController;
use App\Http\Controllers\SearchController;
use App\Http\Controllers\TrackController;
use App\Http\Controllers\UniversityController;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Public portal
|--------------------------------------------------------------------------
|
| An informational, bilingual (Arabic-first, RTL) portal. There is deliberately
| no applicant account here: every "apply" action points at the Ministry's
| official platform.
|
*/

Route::get('language/{locale}', LocaleController::class)
    ->whereIn('locale', array_keys(config('kasp.locales')))
    ->name('language.switch');

Route::middleware('maintenance')->group(function (): void {
    Route::get('/', [HomeController::class, 'index'])->name('home');

    Route::get('tracks', [TrackController::class, 'index'])->name('tracks.index');
    Route::get('tracks/{track}', [TrackController::class, 'show'])->name('tracks.show');

    Route::get('universities', [UniversityController::class, 'index'])->name('universities.index');
    Route::get('universities/{university}', [UniversityController::class, 'show'])->name('universities.show');

    Route::get('countries', [CountryController::class, 'index'])->name('countries.index');
    Route::get('countries/{country}', [CountryController::class, 'show'])->name('countries.show');

    Route::get('guide', [GuideController::class, 'index'])->name('guide.index');
    Route::get('cultural-missions', [CulturalMissionController::class, 'index'])->name('missions.index');
    Route::get('cultural-missions/{mission}', [CulturalMissionController::class, 'show'])->name('missions.show');

    Route::get('faq', [FaqController::class, 'index'])->name('faq.index');

    Route::get('news', [NewsController::class, 'index'])->name('news.index');
    Route::get('news/{article}', [NewsController::class, 'show'])->name('news.show');

    Route::get('help-center', [HelpCenterController::class, 'index'])->name('help.index');
    Route::post('help-center/appointments', [AppointmentController::class, 'store'])
        ->middleware('throttle:10,1')
        ->name('appointments.store');

    Route::get('search', SearchController::class)->name('search');

    // Progressive-enhancement endpoints used by the Alpine widgets.
    Route::post('ai/chat', [AiAdvisorController::class, 'chat'])->middleware('throttle:30,1')->name('ai.chat');
    Route::post('ai/recommend', [AiAdvisorController::class, 'recommend'])->middleware('throttle:30,1')->name('ai.recommend');
    Route::post('eligibility/check', EligibilityController::class)->middleware('throttle:30,1')->name('eligibility.check');
});

/*
|--------------------------------------------------------------------------
| Legacy student endpoints
|--------------------------------------------------------------------------
|
| The previous build advertised applicant logins and Nafath callbacks. They are
| not hosted here, so they redirect rather than 404 for people with old bookmarks.
|
*/

foreach (['student/login', 'student/register', 'student/dashboard', 'nafath', 'auth/national-id'] as $legacyPath) {
    Route::any($legacyPath, fn (): RedirectResponse => redirect()->route('home'));
}

/*
|--------------------------------------------------------------------------
| Administration portal
|--------------------------------------------------------------------------
|
| Ministry staff only, RBAC enforced per section (read) and per permission (write).
|
*/

Route::prefix('admin')->name('admin.')->group(function (): void {
    Route::middleware('guest')->group(function (): void {
        Route::get('login', [LoginController::class, 'create'])->name('login');
        Route::post('login', [LoginController::class, 'store'])->middleware('throttle:10,1')->name('login.attempt');
    });

    Route::middleware('auth')->group(function (): void {
        Route::post('logout', [LoginController::class, 'destroy'])->name('logout');

        Route::get('/', [DashboardController::class, 'index'])
            ->middleware('admin.section:statistics')
            ->name('dashboard');

        // --- Scholarship tracks -------------------------------------------------
        Route::middleware('admin.section:tracks')->group(function (): void {
            Route::get('tracks', [AdminTrackController::class, 'index'])->name('tracks.index');
            Route::get('tracks/{track}/edit', [AdminTrackController::class, 'edit'])->name('tracks.edit');

            Route::middleware('admin.permission:tracks:write')->group(function (): void {
                Route::get('tracks/create', [AdminTrackController::class, 'create'])->name('tracks.create');
                Route::post('tracks', [AdminTrackController::class, 'store'])->name('tracks.store');
                Route::put('tracks/{track}', [AdminTrackController::class, 'update'])->name('tracks.update');
                Route::delete('tracks/{track}', [AdminTrackController::class, 'destroy'])->name('tracks.destroy');
                Route::put('tracks/{track}/rules/{rule}', [AdminTrackController::class, 'updateRule'])->name('tracks.rules.update');
            });
        });

        // --- Universities -------------------------------------------------------
        Route::middleware('admin.section:universities')->group(function (): void {
            Route::get('universities', [AdminUniversityController::class, 'index'])->name('universities.index');
            Route::get('universities/{university}/edit', [AdminUniversityController::class, 'edit'])->name('universities.edit');

            Route::middleware('admin.permission:universities:write')->group(function (): void {
                Route::get('universities/create', [AdminUniversityController::class, 'create'])->name('universities.create');
                Route::post('universities', [AdminUniversityController::class, 'store'])->name('universities.store');
                Route::put('universities/{university}', [AdminUniversityController::class, 'update'])->name('universities.update');
                Route::delete('universities/{university}', [AdminUniversityController::class, 'destroy'])->name('universities.destroy');
            });
        });

        // --- Countries & cultural missions --------------------------------------
        Route::middleware('admin.section:countries')->group(function (): void {
            Route::get('countries', [AdminCountryController::class, 'index'])->name('countries.index');
            Route::get('countries/{country}/edit', [AdminCountryController::class, 'edit'])->name('countries.edit');
            Route::put('countries/{country}', [AdminCountryController::class, 'update'])
                ->middleware('admin.permission:universities:write')
                ->name('countries.update');
        });

        // --- FAQs ---------------------------------------------------------------
        Route::middleware('admin.section:faqs')->group(function (): void {
            Route::get('faqs', [AdminFaqController::class, 'index'])->name('faqs.index');
            Route::get('faqs/{faq}/edit', [AdminFaqController::class, 'edit'])->name('faqs.edit');

            Route::middleware('admin.permission:faqs:write')->group(function (): void {
                Route::get('faqs/create', [AdminFaqController::class, 'create'])->name('faqs.create');
                Route::post('faqs', [AdminFaqController::class, 'store'])->name('faqs.store');
                Route::put('faqs/{faq}', [AdminFaqController::class, 'update'])->name('faqs.update');
                Route::delete('faqs/{faq}', [AdminFaqController::class, 'destroy'])->name('faqs.destroy');
            });
        });

        // --- News ---------------------------------------------------------------
        Route::middleware('admin.section:news')->group(function (): void {
            Route::get('news', [AdminNewsController::class, 'index'])->name('news.index');
            Route::get('news/{article}/edit', [AdminNewsController::class, 'edit'])->name('news.edit');

            Route::middleware('admin.permission:news:write')->group(function (): void {
                Route::get('news/create', [AdminNewsController::class, 'create'])->name('news.create');
                Route::post('news', [AdminNewsController::class, 'store'])->name('news.store');
                Route::put('news/{article}', [AdminNewsController::class, 'update'])->name('news.update');
                Route::patch('news/{article}/status', [AdminNewsController::class, 'updateStatus'])->name('news.status');
                Route::delete('news/{article}', [AdminNewsController::class, 'destroy'])->name('news.destroy');
            });
        });

        // --- CMS page builder ---------------------------------------------------
        Route::middleware('admin.section:pages')->group(function (): void {
            Route::get('pages', [PageBuilderController::class, 'index'])->name('pages.index');
            Route::get('pages/{page}', [PageBuilderController::class, 'show'])->name('pages.show');

            Route::middleware('admin.permission:pages:write')->group(function (): void {
                Route::put('pages/{page}', [PageBuilderController::class, 'update'])->name('pages.update');
                Route::put('pages/{page}/blocks/{block}', [PageBuilderController::class, 'updateBlock'])->name('pages.blocks.update');
                Route::patch('pages/{page}/blocks/{block}/toggle', [PageBuilderController::class, 'toggleBlock'])->name('pages.blocks.toggle');
                Route::patch('pages/{page}/blocks/{block}/move', [PageBuilderController::class, 'moveBlock'])->name('pages.blocks.move');
                Route::post('pages/{page}/versions', [PageBuilderController::class, 'storeVersion'])->name('pages.versions.store');
                Route::post('pages/{page}/versions/{version}/restore', [PageBuilderController::class, 'restoreVersion'])->name('pages.versions.restore');
            });
        });

        // --- Media library ------------------------------------------------------
        Route::middleware('admin.section:media')->group(function (): void {
            Route::get('media', [MediaController::class, 'index'])->name('media.index');

            Route::middleware('admin.permission:media:write')->group(function (): void {
                Route::post('media', [MediaController::class, 'store'])->name('media.store');
                Route::put('media/{item}', [MediaController::class, 'update'])->name('media.update');
                Route::delete('media/{item}', [MediaController::class, 'destroy'])->name('media.destroy');
            });
        });

        // --- AI advisor ---------------------------------------------------------
        Route::middleware('admin.section:ai')->group(function (): void {
            Route::get('ai', [AiManagerController::class, 'index'])->name('ai.index');
            Route::post('ai/test', [AiManagerController::class, 'test'])->name('ai.test');

            Route::middleware('admin.permission:ai:write')->group(function (): void {
                Route::put('ai/config', [AiManagerController::class, 'updateConfig'])->name('ai.config.update');
                Route::post('ai/questions/{question}/answer', [AiManagerController::class, 'answerQuestion'])->name('ai.questions.answer');
                Route::delete('ai/questions/{question}', [AiManagerController::class, 'destroyQuestion'])->name('ai.questions.destroy');
            });
        });

        // --- Administrators & RBAC ----------------------------------------------
        Route::middleware(['admin.section:users', 'admin.permission:users:manage'])->group(function (): void {
            Route::get('users', [AdminUserController::class, 'index'])->name('users.index');
            Route::get('users/create', [AdminUserController::class, 'create'])->name('users.create');
            Route::post('users', [AdminUserController::class, 'store'])->name('users.store');
            Route::get('users/{user}/edit', [AdminUserController::class, 'edit'])->name('users.edit');
            Route::put('users/{user}', [AdminUserController::class, 'update'])->name('users.update');
            Route::delete('users/{user}', [AdminUserController::class, 'destroy'])->name('users.destroy');
        });

        // --- Audit trail --------------------------------------------------------
        Route::middleware(['admin.section:audit', 'admin.permission:audit:read'])
            ->get('audit', AuditLogController::class)
            ->name('audit.index');

        // --- Settings & backup --------------------------------------------------
        Route::middleware('admin.section:settings')->group(function (): void {
            Route::get('settings', [SettingsController::class, 'edit'])->name('settings.edit');
            Route::put('settings', [SettingsController::class, 'update'])
                ->middleware('admin.permission:settings:write')
                ->name('settings.update');

            Route::middleware('admin.permission:backup:manage')->group(function (): void {
                Route::get('backup/export', [BackupController::class, 'export'])->name('backup.export');
                Route::post('backup/import', [BackupController::class, 'import'])->name('backup.import');
            });
        });
    });
});
