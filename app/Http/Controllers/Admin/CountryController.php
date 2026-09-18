<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Country;
use App\Models\CulturalMission;
use App\Services\AuditLogger;
use Illuminate\Contracts\View\View;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class CountryController extends Controller
{
    public function __construct(protected AuditLogger $audit) {}

    public function index(): View
    {
        return view('admin.countries.index', [
            'countries' => Country::query()
                ->withCount('universities')
                ->orderByDesc('is_popular')
                ->orderBy('name_ar')
                ->get(),
            'missions' => CulturalMission::query()->orderBy('country_ar')->get(),
        ]);
    }

    public function edit(Country $country): View
    {
        return view('admin.countries.form', [
            'country' => $country,
            'missions' => CulturalMission::query()->where('country_code', $country->code)->get(),
        ]);
    }

    public function update(Request $request, Country $country): RedirectResponse
    {
        $data = $request->validate([
            'name_ar' => ['required', 'string', 'max:120'],
            'name_en' => ['required', 'string', 'max:120'],
            'flag_emoji' => ['nullable', 'string', 'max:16'],
            'region_ar' => ['nullable', 'string', 'max:120'],
            'region_en' => ['nullable', 'string', 'max:120'],
            'primary_language' => ['nullable', 'string', 'max:64'],
            'visa_processing_days' => ['required', 'integer', 'min:1', 'max:365'],
            'visa_overview_ar' => ['nullable', 'string'],
            'visa_overview_en' => ['nullable', 'string'],
            'cultural_mission_city_ar' => ['nullable', 'string', 'max:160'],
            'cultural_mission_city_en' => ['nullable', 'string', 'max:160'],
            'image_url' => ['nullable', 'string', 'max:2048'],
            'is_popular' => ['nullable', 'boolean'],
            'is_active' => ['nullable', 'boolean'],
        ]);

        $country->fill([
            ...$data,
            'is_popular' => $request->boolean('is_popular'),
            'is_active' => $request->boolean('is_active'),
            // Kept in step with the directory rather than typed by hand.
            'approved_universities_count' => $country->universities()->count(),
        ])->save();

        $this->audit->recordModel('UPDATE', 'COUNTRY', $country, $country->name_ar, 'تعديل بيانات دولة ابتعاث');

        return back()->with('status', __('common.updated'));
    }
}
