<?php

namespace App\Http\Controllers;

use App\Models\CulturalMission;
use App\Models\Faq;
use App\Models\UserGuideStep;
use App\Services\PlatformAnalytics;
use Illuminate\Contracts\View\View;
use Illuminate\Http\Request;

class HelpCenterController extends Controller
{
    /** Tabs of the unified help centre, in display order. */
    public const TABS = ['overview', 'guide', 'faq', 'steps', 'support', 'appointment'];

    public function index(Request $request, PlatformAnalytics $analytics): View
    {
        $analytics->recordPageView($request->path());

        $tab = $request->string('tab')->toString();
        $tab = in_array($tab, self::TABS, true) ? $tab : 'overview';

        return view('help.index', [
            'tab' => $tab,
            'tabs' => self::TABS,
            'qaboolSteps' => UserGuideStep::forSystem('qabool')->get(),
            'safeerSteps' => UserGuideStep::forSystem('safeer')->get(),
            'faqs' => Faq::published()->ordered()->limit(8)->get(),
            'missions' => CulturalMission::query()->where('is_active', true)->orderBy('country_ar')->get(),
            'appointmentTypes' => collect([
                'academic_advising', 'visa_inquiry', 'scholarship_contract', 'financial_guarantee', 'general_support',
            ])->mapWithKeys(fn (string $type): array => [$type => __('operations.appointment_types.'.$type)])->all(),
        ]);
    }
}
