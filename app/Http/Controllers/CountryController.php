<?php

namespace App\Http\Controllers;

use App\Models\Country;
use App\Models\CulturalMission;
use App\Models\University;
use App\Services\PlatformAnalytics;
use Illuminate\Contracts\View\View;
use Illuminate\Http\Request;

class CountryController extends Controller
{
    public function index(Request $request, PlatformAnalytics $analytics): View
    {
        $analytics->recordPageView($request->path());

        return view('countries.index', [
            'countries' => Country::query()
                ->where('is_active', true)
                ->withCount('universities')
                ->orderByDesc('is_popular')
                ->orderBy('name_ar')
                ->get(),
        ]);
    }

    public function show(Request $request, Country $country, PlatformAnalytics $analytics): View
    {
        abort_unless($country->is_active, 404);

        $analytics->recordPageView($request->path(), 'COUNTRY', $country->code);

        return view('countries.show', [
            'country' => $country,
            'universities' => University::active()->where('country_code', $country->code)->orderBy('qs_rank')->get(),
            'missions' => CulturalMission::query()->where('country_code', $country->code)->get(),
        ]);
    }
}
