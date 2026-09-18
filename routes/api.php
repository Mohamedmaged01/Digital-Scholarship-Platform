<?php

use App\Http\Controllers\Api\V1\AiController;
use App\Http\Controllers\Api\V1\CatalogController;
use App\Http\Controllers\Api\V1\EligibilityController;
use App\Http\Controllers\Api\V1\SystemController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Read-only public API (v1)
|--------------------------------------------------------------------------
|
| The portal itself is server-rendered Blade; this surface exists so other
| government systems can consume the published catalog. Administrative writes
| are intentionally absent — they happen in the session-authenticated console.
|
*/

Route::prefix('v1')->name('api.v1.')->middleware('throttle:60,1')->group(function (): void {
    Route::get('system/health', [SystemController::class, 'health'])->name('system.health');
    Route::get('system/metrics', [SystemController::class, 'metrics'])->name('system.metrics');

    Route::get('tracks', [CatalogController::class, 'tracks'])->name('tracks.index');
    Route::get('tracks/{track}', [CatalogController::class, 'track'])->name('tracks.show');
    Route::get('tracks/{track}/requirements', [CatalogController::class, 'requirements'])->name('tracks.requirements');

    Route::get('universities', [CatalogController::class, 'universities'])->name('universities.index');
    Route::get('universities/{university}', [CatalogController::class, 'university'])->name('universities.show');

    Route::get('countries', [CatalogController::class, 'countries'])->name('countries.index');
    Route::get('cultural-missions', [CatalogController::class, 'culturalMissions'])->name('missions.index');
    Route::get('faqs', [CatalogController::class, 'faqs'])->name('faqs.index');
    Route::get('news', [CatalogController::class, 'news'])->name('news.index');
    Route::get('search', [CatalogController::class, 'search'])->name('search');

    Route::post('eligibility/check', EligibilityController::class)->name('eligibility.check');
    Route::post('ai/chat', [AiController::class, 'chat'])->middleware('throttle:20,1')->name('ai.chat');
    Route::post('ai/recommend', [AiController::class, 'recommend'])->middleware('throttle:20,1')->name('ai.recommend');
});
