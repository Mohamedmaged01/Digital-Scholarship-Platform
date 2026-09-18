# برنامج خادم الحرمين الشريفين للابتعاث — المنصة الرقمية الموحدة

**The Custodian of the Two Holy Mosques Scholarship Program — Unified Digital Platform**

A bilingual (Arabic-first, RTL) informational portal for the Saudi overseas scholarship
programme, plus the administrative console the Ministry uses to run it. Built as a
server-rendered Laravel + Blade application.

The portal is informational by design: **there are no applicant accounts here.**
Every "apply" action points at the Ministry's official platform,
[kasp.moe.gov.sa](https://kasp.moe.gov.sa). The only people who sign in are ministry
staff, through the administrative console.

---

## Requirements

| | |
|---|---|
| PHP | 8.2 or newer, with `pdo_sqlite` (or `pdo_mysql` / `pdo_pgsql`) |
| Composer | 2.x |
| Node.js | 20 or newer |
| Database | SQLite out of the box; MySQL 8 or PostgreSQL 14+ also supported |

## Getting started

```bash
composer install
npm install

cp .env.example .env
php artisan key:generate

# SQLite needs nothing but an empty file
touch database/database.sqlite

php artisan migrate --seed
php artisan storage:link

npm run build          # or: npm run dev
php artisan serve
```

The portal is then at `http://127.0.0.1:8000`, and the console at
`http://127.0.0.1:8000/admin`.

### Signing in

Seeding creates the nine ministry staff accounts, all with the bootstrap password
`Admin@Kasp2026!`. **Rotate these before the portal is reachable from anywhere but
your machine.**

| Username | Role | Opens |
|---|---|---|
| `super.admin` | SUPER_ADMIN | everything |
| `content.lead` | CONTENT_MANAGER | pages, news, FAQs, media |
| `tracks.manager` | SCHOLARSHIP_MANAGER | tracks, countries |
| `uni.manager` | UNIVERSITY_MANAGER | universities, countries |
| `faq.officer` | FAQ_MANAGER | FAQs |
| `media.specialist` | MEDIA_MANAGER | media library |
| `ai.director` | AI_MANAGER | AI advisor, KPIs |
| `editor.staff` | EDITOR | pages, news, FAQs, media — draft only |
| `viewer.auditor` | VIEWER | read-only, including the audit log |

### Using MySQL or PostgreSQL instead

Set `DB_CONNECTION=mysql` (or `pgsql`) in `.env` along with the usual credentials, then
re-run `php artisan migrate --seed`. Nothing in the schema is SQLite-specific.

---

## What is in the box

### Public portal

| Route | Page |
|---|---|
| `/` | Home — hero, quick services, the six tracks, the eight-stop journey, strategy, AI recommender, universities, news, FAQ, closing CTA |
| `/tracks`, `/tracks/{slug}` | Track catalogue and per-track criteria, benefits and accredited universities |
| `/universities`, `/universities/{id}` | Searchable directory with country, track, degree and ranking-tier filters |
| `/countries`, `/countries/{code}` | Host countries with visa overviews and supervising missions |
| `/guide` | Qabool (application) and Safeer (post-nomination) walkthroughs |
| `/cultural-missions`, `/cultural-missions/{id}` | Attaché directory with hours and emergency numbers |
| `/faq` | Searchable, categorised FAQ bank |
| `/news`, `/news/{slug}` | Official announcements |
| `/help-center` | Support channels plus advisory appointment booking |
| `/search` | Cross-catalogue search |

### Administrative console (`/admin`)

Twelve sections, each gated by role: KPIs, tracks, universities, countries, FAQs, news,
CMS page builder, media library, AI advisor, users & RBAC, audit log and settings.

### Read-only JSON API (`/api/v1`)

For other government systems. `system/health`, `tracks`, `tracks/{slug}/requirements`,
`universities`, `countries`, `cultural-missions`, `faqs`, `news`, `search`, plus
`POST eligibility/check`, `POST ai/chat` and `POST ai/recommend`. Append `?lang=en` to
get English labels; the payloads carry both languages regardless.

---

## How it is put together

### Bilingual content

Bilingual fields are stored as sibling columns (`name_ar` / `name_en`). Models list them
in `$localized`, and `HasLocalizedAttributes` resolves `$track->name` against the active
locale, falling back to Arabic — the authoritative language of the portal. UI strings live
in `lang/ar` and `lang/en`.

The header's language toggle writes to the session; API requests use `?lang=`.

### The eligibility engine

`App\Services\EligibilityEngine` scores a candidate against the `requirement_rules` rows
belonging to a track. Each rule is a field, an operator and a threshold, so an
administrator retunes eligibility from **Tracks → Eligibility rules** without a deploy.
Every evaluation is written to `eligibility_evaluations`.

### The AI advisor

`App\Services\Ai\AiAdvisor` answers in this order:

1. the published FAQ bank, when a question overlaps one closely enough;
2. Gemini, when `GEMINI_API_KEY` is set and `AI_ASSISTANT_DRIVER=gemini`;
3. `ScholarshipKnowledgeEngine` — the portal's own rule-based advisor, which reads the
   live tracks, thresholds and universities out of the database.

Step 3 is the default and also the fallback, so the advisor never goes silent and never
invents criteria. Anything it could not answer is queued in `unanswered_questions` for the
AI manager to turn into an official FAQ. Every call is timed into `ai_telemetry`.

Answers are rendered from a small Markdown subset by `App\Support\AdvisorMarkdown`, which
escapes everything else — model output never becomes markup.

### The CMS page builder

The home page is assembled from `page_blocks`. Toggling a block in **Pages → home** hides
that section for visitors; reordering changes the order on the page. Snapshots are stored
in `page_versions` and can be restored.

### RBAC

Deny by default, enforced twice:

- `admin.section:<name>` gates *reading* a dashboard section and renders the explicit
  "restricted" screen rather than a bare 403.
- `admin.permission:<name>` gates every *write*.

Roles and their sections live in `config/kasp.php`; per-user permissions live on
`admin_users.permissions`. Super admins bypass both. Publishing is separate from editing,
so the EDITOR role can draft but not publish.

Every administrative write goes through `App\Services\AuditLogger` into the append-only
`audit_logs` table, capturing the actor, the changed attributes and their previous values.

### Progressive enhancement

The chat widget and the track recommender are Alpine.js components calling
`POST /ai/chat` and `POST /ai/recommend`. Everything else — filters, the FAQ accordion,
the help-centre tabs, the guide, page-builder reordering — is plain forms, links and
`<details>`, so the portal is fully usable without JavaScript.

---

## Commands

```bash
php artisan test              # 81 feature tests
./vendor/bin/pint             # format PHP
npm run dev                   # Vite dev server with HMR
npm run build                 # production assets
php artisan migrate:fresh --seed   # rebuild the database from the seed catalogue
```

## Seed data

`database/data/*.json` holds the platform catalogue — six tracks, sixteen universities,
nine countries, eight cultural missions, the FAQ bank, news, media and CMS pages. The
seeders read those files, so the JSON is the source of truth for a fresh install.

## Deployment notes

- Set `APP_ENV=production`, `APP_DEBUG=false`, and a fresh `APP_KEY`.
- Rotate the seeded staff passwords.
- Run `php artisan config:cache route:cache view:cache` and `npm run build`.
- Point the web server document root at `public/`.
- `docker-compose.yml` describes a PostgreSQL + Redis deployment carried over from the
  previous build; it needs a `Dockerfile` for this stack before it will come up.

## Where the previous build went

The React + Express version this replaced is preserved under `legacy/`, along with the
script that exported its catalogue into `database/data/`. Nothing in the running
application reads from it, so it can be deleted once you are satisfied with the port.
