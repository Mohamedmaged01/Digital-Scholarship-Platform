<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Country;
use App\Models\CulturalMission;
use App\Models\ScholarshipTrack;
use App\Models\University;
use App\Services\AuditLogger;
use Illuminate\Contracts\View\View;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class UniversityController extends Controller
{
    public function __construct(protected AuditLogger $audit) {}

    public function index(Request $request): View
    {
        $filters = [
            'q' => $request->string('q')->toString(),
            'country' => $request->string('country')->toString() ?: 'all',
            'track' => $request->string('track')->toString() ?: 'all',
            'tier' => $request->string('tier')->toString() ?: 'all',
        ];

        return view('admin.universities.index', [
            'universities' => University::query()
                ->filter($filters)
                ->with('tracks:id,name_ar,name_en')
                ->orderBy('qs_rank')
                ->paginate(15)
                ->withQueryString(),
            'filters' => $filters,
            'countries' => Country::query()->orderBy('name_ar')->get(),
            'tracks' => ScholarshipTrack::query()->orderBy('sort_order')->get(['id', 'name_ar', 'name_en']),
        ]);
    }

    public function create(): View
    {
        return view('admin.universities.form', [
            'university' => new University([
                'min_ielts' => 6.5,
                'min_toefl' => 85,
                'top_majors_ar' => [],
                'top_majors_en' => [],
                'degrees_available' => ['Bachelor', 'Master', 'PhD'],
                'is_active' => true,
            ]),
            ...$this->formOptions(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validated($request);
        $tracks = $data['tracks'] ?? [];
        unset($data['tracks']);

        $university = University::create([
            ...$data,
            'id' => 'uni-'.Str::slug(Str::limit($data['name_en'], 40, '')),
        ]);

        $university->tracks()->sync($this->accreditationPayload($tracks));
        $this->syncRankFlags($university);

        $this->audit->recordModel('CREATE', 'UNIVERSITY', $university, $university->name_ar, 'إضافة جامعة معتمدة');

        return redirect()
            ->route('admin.universities.edit', $university)
            ->with('status', __('common.created'));
    }

    public function edit(University $university): View
    {
        $university->load('tracks:id');

        return view('admin.universities.form', [
            'university' => $university,
            ...$this->formOptions(),
        ]);
    }

    public function update(Request $request, University $university): RedirectResponse
    {
        $data = $this->validated($request);
        $tracks = $data['tracks'] ?? [];
        unset($data['tracks']);

        $university->fill($data)->save();
        $university->tracks()->sync($this->accreditationPayload($tracks));
        $this->syncRankFlags($university);

        $this->audit->recordModel('UPDATE', 'UNIVERSITY', $university, $university->name_ar, 'تعديل بيانات جامعة');

        return back()->with('status', __('common.updated'));
    }

    public function destroy(University $university): RedirectResponse
    {
        $label = $university->name_ar;
        $university->delete();

        $this->audit->record('DELETE', 'UNIVERSITY', $university->id, $label, 'حذف جامعة من الدليل');

        return redirect()->route('admin.universities.index')->with('status', __('common.deleted'));
    }

    /** Ranking tier flags are derived, never hand-entered. */
    protected function syncRankFlags(University $university): void
    {
        $university->forceFill([
            'is_top_30' => $university->qs_rank <= 30,
            'is_top_100' => $university->qs_rank <= 100,
            'is_top_200' => $university->qs_rank <= 200,
        ])->save();
    }

    protected function accreditationPayload(array $trackIds): array
    {
        return collect($trackIds)
            ->filter()
            ->mapWithKeys(fn (string $id): array => [$id => ['accredited_since' => now()->toDateString()]])
            ->all();
    }

    protected function validated(Request $request): array
    {
        $data = $request->validate([
            'name_ar' => ['required', 'string', 'max:190'],
            'name_en' => ['required', 'string', 'max:190'],
            'country_code' => ['required', 'exists:countries,code'],
            'country_ar' => ['required', 'string', 'max:120'],
            'country_en' => ['required', 'string', 'max:120'],
            'city_ar' => ['required', 'string', 'max:120'],
            'city_en' => ['nullable', 'string', 'max:120'],
            'qs_rank' => ['required', 'integer', 'min:1', 'max:2000'],
            'the_rank' => ['nullable', 'integer', 'min:1', 'max:2000'],
            'min_ielts' => ['required', 'numeric', 'min:1', 'max:9'],
            'min_toefl' => ['required', 'integer', 'min:1', 'max:120'],
            'acceptance_rate' => ['nullable', 'string', 'max:16'],
            'top_majors_ar' => ['nullable', 'string'],
            'top_majors_en' => ['nullable', 'string'],
            'degrees_available' => ['required', 'array', 'min:1'],
            'degrees_available.*' => [Rule::in(['Bachelor', 'Master', 'PhD', 'Fellowship'])],
            'website_url' => ['nullable', 'url', 'max:2048'],
            'image_url' => ['nullable', 'string', 'max:2048'],
            'cultural_mission_id' => ['nullable', 'exists:cultural_missions,id'],
            'tracks' => ['nullable', 'array'],
            'tracks.*' => ['exists:scholarship_tracks,id'],
            'is_featured' => ['nullable', 'boolean'],
            'is_active' => ['nullable', 'boolean'],
        ]);

        $data['top_majors_ar'] = $this->lines($data['top_majors_ar'] ?? null);
        $data['top_majors_en'] = $this->lines($data['top_majors_en'] ?? null);
        $data['is_featured'] = $request->boolean('is_featured');
        $data['is_active'] = $request->boolean('is_active');

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

    protected function formOptions(): array
    {
        return [
            'countries' => Country::query()->orderBy('name_ar')->get(),
            'tracks' => ScholarshipTrack::query()->orderBy('sort_order')->get(),
            'missions' => CulturalMission::query()->orderBy('country_ar')->get(),
            'degreeOptions' => collect(['Bachelor', 'Master', 'PhD', 'Fellowship'])
                ->mapWithKeys(fn (string $degree): array => [$degree => __('catalog.degrees.'.$degree)])
                ->all(),
        ];
    }
}
