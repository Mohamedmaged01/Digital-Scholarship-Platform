import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';

import {
  ALL_SIX_TRACKS,
  UNIVERSITIES_DATABASE,
  FAQ_DATABASE,
  USER_GUIDE_STEPS,
  CULTURAL_MISSIONS_DIRECTORY,
  TRACK_DETAILS_CONTENT,
  COUNTRIES_DIRECTORY
} from './src/data/scholarshipCatalog';

import {
  INITIAL_USERS,
  INITIAL_APPLICATIONS,
  INITIAL_NOTIFICATIONS,
  INITIAL_APPOINTMENTS,
  INITIAL_AI_LOGS,
  SAMPLE_ADMISSION_LETTERS
} from './src/data/initialData';

import {
  ADMIN_ROLE_PERMISSIONS,
  INITIAL_ADMIN_USERS,
  INITIAL_COUNTRIES,
  INITIAL_NEWS,
  INITIAL_MEDIA,
  INITIAL_CMS_PAGES,
  INITIAL_AUDIT_LOGS,
  INITIAL_SETTINGS
} from './src/components/AdminPortal/adminData';

import { TRANSLATIONS } from './src/i18n/translations';

const OUT = join(process.cwd(), '..', 'database', 'data');
mkdirSync(OUT, { recursive: true });

const dump = (name: string, data: unknown) => {
  const file = join(OUT, `${name}.json`);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
  const count = Array.isArray(data) ? data.length : Object.keys(data as object).length;
  console.log(`  ${name}.json  (${count} entries)`);
};

console.log('Exporting legacy catalog data ->', OUT);
dump('tracks', ALL_SIX_TRACKS);
dump('universities', UNIVERSITIES_DATABASE);
dump('faqs', FAQ_DATABASE);
dump('user_guide_steps', USER_GUIDE_STEPS);
dump('cultural_missions', CULTURAL_MISSIONS_DIRECTORY);
dump('track_details', TRACK_DETAILS_CONTENT);
dump('countries_directory', COUNTRIES_DIRECTORY);
dump('platform_users', INITIAL_USERS);
dump('applications', INITIAL_APPLICATIONS);
dump('notifications', INITIAL_NOTIFICATIONS);
dump('appointments', INITIAL_APPOINTMENTS);
dump('ai_logs', INITIAL_AI_LOGS);
dump('sample_admission_letters', SAMPLE_ADMISSION_LETTERS);
dump('admin_role_permissions', ADMIN_ROLE_PERMISSIONS);
dump('admin_users', INITIAL_ADMIN_USERS);
dump('scholarship_countries', INITIAL_COUNTRIES);
dump('news', INITIAL_NEWS);
dump('media', INITIAL_MEDIA);
dump('cms_pages', INITIAL_CMS_PAGES);
dump('audit_logs', INITIAL_AUDIT_LOGS);
dump('site_settings', INITIAL_SETTINGS);
dump('translations', TRANSLATIONS);
console.log('Done.');
