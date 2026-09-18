<?php

namespace App\Http\Controllers;

use App\Models\UserGuideStep;
use App\Services\PlatformAnalytics;
use Illuminate\Contracts\View\View;
use Illuminate\Http\Request;

class GuideController extends Controller
{
    public function index(Request $request, PlatformAnalytics $analytics): View
    {
        $analytics->recordPageView($request->path());

        $system = $request->string('system')->toString() === 'safeer' ? 'safeer' : 'qabool';

        return view('guide.index', [
            'system' => $system,
            'steps' => UserGuideStep::forSystem($system)->get(),
        ]);
    }
}
