<?php

use App\Http\Middleware\EnsureAdminPermission;
use App\Http\Middleware\EnsureAdminSection;
use App\Http\Middleware\MaintenanceGate;
use App\Http\Middleware\SetLocale;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        // Every rendered page needs the resolved locale before Blade runs.
        $middleware->web(append: [
            SetLocale::class,
        ]);

        $middleware->api(prepend: [
            SetLocale::class,
        ]);

        $middleware->alias([
            'admin.section' => EnsureAdminSection::class,
            'admin.permission' => EnsureAdminPermission::class,
            'maintenance' => MaintenanceGate::class,
        ]);

        $middleware->redirectGuestsTo(fn () => route('admin.login'));
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();
