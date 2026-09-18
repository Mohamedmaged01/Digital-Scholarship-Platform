<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\RequirementRule;
use App\Models\ScholarshipTrack;
use App\Services\AuditLogger;
use Illuminate\Contracts\View\View;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class TrackController extends Controller
{
    public function __construct(protected AuditLogger $audit) {}

    public function index(): View
    {
        return view('admin.tracks.index', [
            'tracks' => ScholarshipTrack::query()->withCount('universities')->orderBy('sort_order')->get(),
        ]);
    }

    public function create(): View
    {
        return view('admin.tracks.form', [
            'track' => new ScholarshipTrack([
                'badge_color' => 'emerald',
                'icon_name' => 'graduation-cap',
                'min_gpa' => 3.5,
                'max_age' => 35,
                'required_ielts' => 6.5,
                'required_toefl' => 85,
                'top_universities_rank_limit' => 200,
                'required_degrees' => ['Bachelor', 'Master'],
                'target_sectors_ar' => [],
                'features_ar' => [],
                'is_active' => true,
                'is_published' => true,
                'sort_order' => (int) ScholarshipTrack::query()->max('sort_order') + 1,
            ]),
            'degreeOptions' => $this->degreeOptions(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validated($request);

        $track = ScholarshipTrack::create([
            ...$data,
            'id' => 'track-'.Str::slug($data['slug']),
            'details' => ['official_apply_url' => config('kasp.apply_url')],
        ]);

        $this->audit->recordModel('CREATE', 'TRACK', $track, $track->name_ar, 'إضافة مسار ابتعاث جديد');

        return redirect()
            ->route('admin.tracks.edit', $track)
            ->with('status', __('common.created'));
    }

    public function edit(ScholarshipTrack $track): View
    {
        $track->load(['rules' => fn ($query) => $query->orderByDesc('weight')]);

        return view('admin.tracks.form', [
            'track' => $track,
            'degreeOptions' => $this->degreeOptions(),
        ]);
    }

    public function update(Request $request, ScholarshipTrack $track): RedirectResponse
    {
        $track->fill($this->validated($request, $track))->save();

        $this->audit->recordModel('UPDATE', 'TRACK', $track, $track->name_ar, 'تعديل بيانات وشروط المسار');

        return back()->with('status', __('common.updated'));
    }

    public function destroy(ScholarshipTrack $track): RedirectResponse
    {
        $label = $track->name_ar;
        $track->delete();

        $this->audit->record('DELETE', 'TRACK', $track->id, $label, 'حذف مسار ابتعاث');

        return redirect()->route('admin.tracks.index')->with('status', __('common.deleted'));
    }

    /**
     * Retune one eligibility threshold. The engine reads these rows directly, so
     * the change takes effect on the next evaluation.
     */
    public function updateRule(Request $request, ScholarshipTrack $track, RequirementRule $rule): RedirectResponse
    {
        abort_unless($rule->track_id === $track->id, 404);

        $data = $request->validate([
            'operator' => ['required', Rule::in(['>=', '<=', '>', '<', '==', '!=', 'IN', 'NOT_IN', 'CONTAINS'])],
            'expected_value' => ['required', 'string', 'max:255'],
            'weight' => ['required', 'integer', 'min:1', 'max:100'],
            'is_mandatory' => ['nullable', 'boolean'],
            'is_active' => ['nullable', 'boolean'],
        ]);

        $rule->fill([
            'operator' => $data['operator'],
            'expected_value' => ['value' => $this->castExpected($data['expected_value'], $data['operator'])],
            'weight' => $data['weight'],
            'is_mandatory' => $request->boolean('is_mandatory'),
            'is_active' => $request->boolean('is_active'),
        ])->save();

        $this->audit->recordModel('UPDATE', 'TRACK', $rule, $track->name_ar.' — '.$rule->rule_code, 'تعديل قاعدة أهلية');

        return back()->with('status', __('common.updated'));
    }

    /** "Bachelor, Master" for an IN rule; a number where the operator is numeric. */
    protected function castExpected(string $value, string $operator): mixed
    {
        if (in_array($operator, ['IN', 'NOT_IN'], true)) {
            return collect(explode(',', $value))
                ->map(fn (string $item): string => trim($item))
                ->filter()
                ->values()
                ->all();
        }

        return is_numeric($value) ? (float) $value : trim($value);
    }

    protected function validated(Request $request, ?ScholarshipTrack $track = null): array
    {
        $data = $request->validate([
            'code' => ['required', 'string', 'max:32', Rule::unique('scholarship_tracks', 'code')->ignore($track?->id, 'id')],
            'slug' => ['required', 'string', 'max:64', 'alpha_dash', Rule::unique('scholarship_tracks', 'slug')->ignore($track?->id, 'id')],
            'name_ar' => ['required', 'string', 'max:190'],
            'name_en' => ['required', 'string', 'max:190'],
            'description_ar' => ['required', 'string'],
            'description_en' => ['required', 'string'],
            'objective_ar' => ['nullable', 'string'],
            'objective_en' => ['nullable', 'string'],
            'badge_color' => ['required', 'string', 'max:32'],
            'icon_name' => ['required', 'string', 'max:64'],
            'image_url' => ['nullable', 'string', 'max:2048'],
            'min_gpa' => ['required', 'numeric', 'min:1', 'max:5'],
            'max_age' => ['required', 'integer', 'min:18', 'max:70'],
            'required_ielts' => ['required', 'numeric', 'min:1', 'max:9'],
            'required_toefl' => ['required', 'integer', 'min:1', 'max:120'],
            'top_universities_rank_limit' => ['required', 'integer', 'min:1', 'max:2000'],
            'required_degrees' => ['required', 'array', 'min:1'],
            'required_degrees.*' => [Rule::in(['Bachelor', 'Master', 'PhD', 'Fellowship', 'Training'])],
            'target_sectors_ar' => ['nullable', 'string'],
            'target_sectors_en' => ['nullable', 'string'],
            'features_ar' => ['nullable', 'string'],
            'features_en' => ['nullable', 'string'],
            'allocated_seats' => ['required', 'integer', 'min:0'],
            'filled_seats' => ['required', 'integer', 'min:0'],
            'sort_order' => ['required', 'integer', 'min:1', 'max:99'],
            'is_active' => ['nullable', 'boolean'],
            'is_published' => ['nullable', 'boolean'],
        ]);

        $data['target_sectors_ar'] = $this->lines($data['target_sectors_ar'] ?? null);
        $data['target_sectors_en'] = $this->lines($data['target_sectors_en'] ?? null);
        $data['features_ar'] = $this->lines($data['features_ar'] ?? null);
        $data['features_en'] = $this->lines($data['features_en'] ?? null);
        $data['is_active'] = $request->boolean('is_active');
        $data['is_published'] = $request->boolean('is_published');

        return $data;
    }

    /** @return list<string> */
    protected function lines(?string $value): array
    {
        return collect(preg_split('/\r?\n/', (string) $value))
            ->map(fn (string $line): string => trim($line))
            ->filter()
            ->values()
            ->all();
    }

    /** @return array<string, string> */
    protected function degreeOptions(): array
    {
        return collect(['Bachelor', 'Master', 'PhD', 'Fellowship', 'Training'])
            ->mapWithKeys(fn (string $degree): array => [$degree => __('catalog.degrees.'.$degree)])
            ->all();
    }
}
