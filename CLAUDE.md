# CLAUDE.md

Laravel 12 + Blade portal for the Saudi overseas scholarship programme. Arabic-first
(RTL), bilingual, server-rendered. See `README.md` for setup and a feature tour.

## Shape of the code

- `app/Models` — Eloquent models. Bilingual models list their `*_ar` / `*_en` pairs in
  `$localized` and get `$model->name` resolution from `HasLocalizedAttributes`.
- `app/Services` — the eligibility engine, audit logger, analytics and backup service.
- `app/Services/Ai` — the rule-based `ScholarshipKnowledgeEngine`, the optional
  `GeminiClient`, the `AiAdvisor` that orchestrates them, and `TrackRecommender`.
- `app/Http/Controllers/Admin` — one controller per dashboard section.
- `resources/views/home/sections` — the home page, one file per CMS block.
- `database/data/*.json` — the seed catalogue; the seeders read it verbatim.

## Conventions worth keeping

**Bilingual columns.** Always `<name>_ar` and `<name>_en`, then add the base name to
`$localized`. Blade reads `$model->name`, never `$model->name_ar` directly, except in the
admin forms where both languages are edited side by side.

**UI strings.** `lang/ar/*.php` and `lang/en/*.php`, mirrored. Never inline a
user-visible string in a Blade template. Most of `lang/*` was generated from the previous
build's translation bundle, so keys are snake_case versions of its camelCase names.

**Icons.** `<x-lucide-name />` from `mallardduck/blade-lucide-icons`. Check the name
exists in `vendor/mallardduck/blade-lucide-icons/resources/svg/icons/` before using it —
a missing icon throws at render time.

**Directional layout.** Use logical properties (`ps-*`, `pe-*`, `ms-*`, `start-*`,
`end-*`), never `left`/`right`. Add `class="numeric"` to any element holding a ranking,
GPA, phone number or date so it stays LTR inside Arabic text. Icons that point along the
reading direction get `class="flip-rtl"`.

**Progressive enhancement.** Filters, accordions and tabs are forms, links and
`<details>`. Alpine is used only for the chat widget and the recommender wizard, both of
which have a working fallback. Do not move server-rendered behaviour into JavaScript.

**Blade directives.** `@rtl` / `@ltr`, `@permission('tracks:write')` and
`@adminSection('tracks')` are defined in `AppServiceProvider`. The last one is *not*
called `@section` — that name belongs to Blade.

## Non-negotiables

**No applicant accounts.** The portal is informational. Applications are submitted at
`config('kasp.apply_url')`. Do not add applicant registration, login or Nafath flows;
`routes/web.php` redirects the legacy paths for that reason.

**Every administrative write is audited.** Call `AuditLogger::record()` or
`recordModel()` from any controller action that changes state. `audit_logs` is
append-only.

**RBAC is deny by default.** Reads are gated with `admin.section:<name>`, writes with
`admin.permission:<name>`. Both, on every admin route. Roles live in `config/kasp.php`.

**The advisor never invents criteria.** `ScholarshipKnowledgeEngine` answers from the
database — live tracks, thresholds, universities and missions. When adding an intent,
read the values rather than hard-coding them. Gemini is optional and always falls back to
this engine.

**Eligibility thresholds live in `requirement_rules`,** not in PHP. If you find yourself
writing a numeric comparison against a track, add or edit a rule instead.

## Testing

`php artisan test` — 81 feature tests across `PublicPortalTest`, `AdminAccessTest`,
`ScholarshipEngineTest`, `ContentManagementTest` and `PublicApiTest`. Tests seed the full
catalogue (`TestCase::$seed`), so assert relative to seeded counts rather than absolute
ones. Run `./vendor/bin/pint` before finishing.

## Gotchas found the hard way

- A model's localized attribute shadows a relation of the same name. `University` and
  `CulturalMission` expose `hostCountry()` because `country` is a localized string.
- `Str::lower()` is safe on Arabic; `strtolower()` is not.
- The shell on Windows mangles Arabic in `curl` payloads — use `php artisan tinker` or a
  test for anything that round-trips Arabic text.
