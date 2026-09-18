/**
 * Comprehensive Platform QA Audit & Verification Suite
 * Executes rigorous functional, security (RBAC/IDOR), database, and integration tests
 */

import { DatabaseService } from '../core/database';
import { RedisService } from '../core/redis';
import { EligibilityService } from '../modules/eligibility/engine';
import { ApplicationsService } from '../modules/applications/service';
import { AIService } from '../modules/ai/service';
import { generateToken, verifyToken } from '../core/securityUtils';
import { runLoadTest } from './loadTest';

interface TestResult {
  suite: string;
  name: string;
  passed: boolean;
  durationMs: number;
  details?: any;
}

export async function executeComprehensiveAudit(): Promise<{
  timestamp: string;
  totalTests: number;
  passedCount: number;
  failedCount: number;
  results: TestResult[];
  benchmarks: any;
}> {
  const results: TestResult[] = [];

  async function test(suite: string, name: string, fn: () => Promise<void> | void) {
    const t0 = performance.now();
    try {
      await fn();
      results.push({
        suite,
        name,
        passed: true,
        durationMs: Math.round((performance.now() - t0) * 100) / 100
      });
    } catch (err: any) {
      results.push({
        suite,
        name,
        passed: false,
        durationMs: Math.round((performance.now() - t0) * 100) / 100,
        details: err.message || err
      });
    }
  }

  // Initialize DB
  DatabaseService.initialize();

  // --------------------------------------------------------------------------
  // SUITE 1: DATABASE & ENTITY CRUD INTEGRITY
  // --------------------------------------------------------------------------
  await test('Database', 'Verify tracks retrieval and schema', () => {
    const tracks = DatabaseService.getTracks();
    if (!tracks || tracks.length < 4) throw new Error('Expected at least 4 tracks');
    const pioneers = DatabaseService.getTrackById('track-pioneers');
    if (!pioneers || !pioneers.nameAr) throw new Error('Track pioneers not found');
  });

  await test('Database', 'Verify universities list and filtration', () => {
    const unis = DatabaseService.getUniversities({ maxRank: 10 });
    if (!unis.items || unis.items.length === 0) throw new Error('Expected universities <= 10');
    if (unis.items.some(u => u.qsRank > 10)) throw new Error('MaxRank filter failed');
  });

  await test('Database', 'Admin users data verification (Super Admin & Content Manager names)', () => {
    const users = DatabaseService.getAdminUsers();
    const superAdmin = users.find(u => u.username === 'superadmin' || u.role === 'SUPER_ADMIN');
    if (!superAdmin) throw new Error('Super admin not found');
    if (!superAdmin.fullNameAr.includes('د. عبدالاله الغامدي')) {
      throw new Error(`Expected Super Admin name to be د. عبدالاله الغامدي, got: ${superAdmin.fullNameAr}`);
    }

    const contentManager = users.find(u => u.username === 'content_mgr' || u.role === 'CONTENT_MANAGER');
    if (!contentManager) throw new Error('Content manager not found');
    if (!contentManager.fullNameAr.includes('ا. فهد الدوسري')) {
      throw new Error(`Expected Content Manager name to be ا. فهد الدوسري, got: ${contentManager.fullNameAr}`);
    }
  });

  await test('Database', 'News article creation, update, and retrieval', () => {
    const admin = DatabaseService.getAdminUsers()[0];
    const initialCount = DatabaseService.getNews(false).length;
    const created = DatabaseService.createNews({
      id: `test-news-${Date.now()}`,
      slug: `test-article-${Date.now()}`,
      titleAr: 'خبر تجريبي لأغراض الفحص والتدقيق',
      titleEn: 'QA Audit Test Article',
      summaryAr: 'ملخص الخبر التجريبي',
      summaryEn: 'QA Audit Summary',
      contentAr: 'المحتوى الكامل للخبر التجريبي',
      contentEn: 'Full test article content',
      category: 'announcement',
      publishDate: '2026-09-15',
      authorAr: 'فريق الفحص البرمجي',
      authorEn: 'QA Team',
      imageUrl: 'https://images.unsplash.com/test.jpg',
      isFeatured: false,
      status: 'published',
      readTimeMinutes: 2
    }, admin);

    if (!created || !created.id) throw new Error('Failed to create news');
    const fetched = DatabaseService.getNewsById(created.id);
    if (!fetched || fetched.titleAr !== 'خبر تجريبي لأغراض الفحص والتدقيق') {
      throw new Error('News fetch by ID mismatch');
    }

    // Cleanup
    DatabaseService.deleteNews(created.id, admin);
  });

  // --------------------------------------------------------------------------
  // SUITE 2: RBAC & AUTHENTICATION SECURITY
  // --------------------------------------------------------------------------
  await test('RBAC', 'Super Admin JWT issuance and full permission grants', () => {
    const superAdmin = DatabaseService.getAdminUsers().find(u => u.role === 'SUPER_ADMIN')!;
    const token = generateToken(superAdmin.id, superAdmin.role, superAdmin.permissions);
    const verified = verifyToken(token);
    if (!verified || verified.role !== 'SUPER_ADMIN') throw new Error('Token verification failed');
    if (!superAdmin.permissions.includes('users:manage')) throw new Error('Super admin must have users:manage');
    if (!superAdmin.permissions.includes('backup:manage')) throw new Error('Super admin must have backup:manage');
    if (!superAdmin.permissions.includes('ai:write')) throw new Error('Super admin must have ai:write');
  });

  await test('RBAC', 'Content Manager permission boundaries (Deny users:manage & backup:manage)', () => {
    const contentMgr = DatabaseService.getAdminUsers().find(u => u.role === 'CONTENT_MANAGER')!;
    const token = generateToken(contentMgr.id, contentMgr.role, contentMgr.permissions);
    const verified = verifyToken(token);
    if (!verified) throw new Error('Token verification failed');
    if (!contentMgr.permissions.includes('news:write')) throw new Error('Content manager must have news:write');
    if (!contentMgr.permissions.includes('faqs:write')) throw new Error('Content manager must have faqs:write');
    if (contentMgr.permissions.includes('users:manage')) throw new Error('Content manager must NOT have users:manage');
    if (contentMgr.permissions.includes('backup:manage')) throw new Error('Content manager must NOT have backup:manage');
  });

  await test('RBAC', 'Tampered or invalid token rejection', () => {
    const invalidToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.tampered.signature';
    const verified = verifyToken(invalidToken);
    if (verified !== null) throw new Error('Tampered token should be rejected with null');
  });

  // --------------------------------------------------------------------------
  // SUITE 3: BOLA / IDOR APPLICATION ACCESS CONTROLS
  // --------------------------------------------------------------------------
  await test('BOLA/IDOR', 'Applicant cannot access another applicant application', async () => {
    const apps = (await DatabaseService.getApplications({ limit: 10 })).items;
    if (apps.length < 2) throw new Error('Insufficient sample applications');

    const app1 = apps[0];
    const app2 = apps[1];

    // Simulating user 1 requesting application 2
    const accessedAsApp1User = await DatabaseService.getApplicationById(app2.id, app1.userId);
    if (accessedAsApp1User !== null) {
      throw new Error('IDOR vulnerability detected: applicant accessed another applicant record!');
    }

    // Accessing own application should succeed
    const accessedOwn = await DatabaseService.getApplicationById(app1.id, app1.userId);
    if (!accessedOwn || accessedOwn.id !== app1.id) {
      throw new Error('Applicant failed to access own application');
    }
  });

  // --------------------------------------------------------------------------
  // SUITE 4: DYNAMIC ELIGIBILITY RULES ENGINE
  // --------------------------------------------------------------------------
  await test('Eligibility Engine', 'Pioneers Track: Approved applicant (Top 30, IELTS 7.5, Unconditional)', async () => {
    const candidate = {
      gpa: 4.85,
      qsRank: 12,
      ieltsScore: 7.5,
      degreeLevel: 'Master',
      admissionType: 'unconditional'
    };
    const report = await EligibilityService.evaluateEligibility('track-pioneers', candidate);
    if (report.status !== 'ELIGIBLE') {
      throw new Error(`Expected ELIGIBLE, got: ${report.status}`);
    }
  });

  await test('Eligibility Engine', 'Pioneers Track: Rejected applicant (Rank 65 > Max 30)', async () => {
    const candidate = {
      gpa: 4.85,
      qsRank: 65,
      ieltsScore: 7.5,
      degreeLevel: 'Master',
      admissionType: 'unconditional'
    };
    const report = await EligibilityService.evaluateEligibility('track-pioneers', candidate);
    if (report.status === 'ELIGIBLE') {
      throw new Error('Expected INELIGIBLE or CONDITIONALLY_ELIGIBLE for rank 65 in Pioneers');
    }
  });

  // --------------------------------------------------------------------------
  // SUITE 5: AI GROUNDING & FAQ AUTO-PROMOTION
  // --------------------------------------------------------------------------
  await test('AI & Knowledge Base', 'Unanswered inquiry capture and automatic FAQ promotion', async () => {
    const novelQuestion = `هل يوجد بدل تميز لحملة براءات الاختراع الطبية المسجلة دولياً في مسار واعد؟ (${Date.now()})`;
    
    // 1. Beneficiary asks novel question
    const response = await AIService.chatWithAssistant(novelQuestion, 'user-qa-01');
    if (!response) throw new Error('AI Assistant did not respond');

    // 2. Verify captured in unanswered queue
    const unanswered = DatabaseService.getUnansweredQuestions();
    const captured = unanswered.find(u => u.question === novelQuestion);
    if (!captured) {
      throw new Error('Novel question was not captured in Unanswered Questions queue');
    }

    // 3. Admin answers and approves the question
    const officialAnswer = 'نعم، يمنح برنامج خادم الحرمين الشريفين مكافأة تميز براءة اختراع معتمدة وفق الضوابط الأكاديمية لمسار واعد.';
    const admin = DatabaseService.getAdminUsers()[0];
    const promotedFaq = DatabaseService.answerUnansweredQuestion(captured.id, officialAnswer, admin);

    if (!promotedFaq) throw new Error('Failed to auto-promote answered question to FAQ');

    // 4. Verify question now exists in official FAQs
    const faqs = DatabaseService.getFaqs();
    const foundInFaq = faqs.find(f => f.questionAr === novelQuestion);
    if (!foundInFaq) {
      throw new Error('Promoted question was not found in FAQ database');
    }
    if (foundInFaq.answerAr !== officialAnswer) {
      throw new Error('Promoted FAQ answer does not match admin answer');
    }

    // 5. Subsequent inquiry must now intercept and answer immediately from Knowledge Base
    const secondResponse = await AIService.chatWithAssistant(novelQuestion, 'user-qa-02');
    if (!secondResponse.includes(officialAnswer)) {
      throw new Error('Subsequent query failed to return newly promoted FAQ answer');
    }
  });

  // --------------------------------------------------------------------------
  // SUITE 6: GLOBAL MULTI-ENTITY SEARCH
  // --------------------------------------------------------------------------
  await test('Search Engine', 'Global multi-entity search across tracks and universities', () => {
    const searchTracks = DatabaseService.globalSearch('الرواد');
    if (searchTracks.tracks.length === 0) throw new Error('Search failed to find track Pioneers');

    const searchUni = DatabaseService.globalSearch('Oxford');
    if (searchUni.universities.length === 0) throw new Error('Search failed to find Oxford university');
  });

  // --------------------------------------------------------------------------
  // SUITE 7: LOAD & STRESS BENCHMARK
  // --------------------------------------------------------------------------
  let benchmarkResults: any = null;
  await test('Performance & Stress', 'Execute high-scale benchmarks (Eligibility, Cache, Pagination)', async () => {
    benchmarkResults = await runLoadTest();
    if (!benchmarkResults || !benchmarkResults.eligibilityEngine) {
      throw new Error('Benchmark suite failed to complete');
    }
  });

  const passedCount = results.filter(r => r.passed).length;
  const failedCount = results.filter(r => !r.passed).length;

  return {
    timestamp: new Date().toISOString(),
    totalTests: results.length,
    passedCount,
    failedCount,
    results,
    benchmarks: benchmarkResults
  };
}
