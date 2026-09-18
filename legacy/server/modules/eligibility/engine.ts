/**
 * Eligibility Engine
 * Authoritative evaluation of applicant eligibility based strictly on official Database Rules
 */

import { DatabaseService } from '../../core/database';
import { RequirementsEngine, EvaluationInput, RuleCheckResult } from '../requirements/engine';

export type EligibilityDecision = 'ELIGIBLE' | 'CONDITIONALLY_ELIGIBLE' | 'NOT_ELIGIBLE' | 'NEEDS_REVIEW';

export interface EligibilityReport {
  trackId: string;
  trackNameAr: string;
  trackNameEn: string;
  decision: EligibilityDecision;
  score: number; // 0 - 100
  matchedRules: RuleCheckResult[];
  failedRules: RuleCheckResult[];
  warnings: string[];
  reasons: string[];
  evaluatedAt: string;
}

export class EligibilityService {
  public static async evaluateEligibility(
    trackId: string,
    candidateData: EvaluationInput
  ): Promise<EligibilityReport> {
    const track = await DatabaseService.getTrackById(trackId);
    if (!track) {
      throw new Error(`Track with ID ${trackId} not found in database`);
    }

    // 1. Fetch official active rules from database
    const rules = await DatabaseService.getRulesForTrack(trackId);

    const matchedRules: RuleCheckResult[] = [];
    const failedRules: RuleCheckResult[] = [];
    const warnings: string[] = [];
    const reasons: string[] = [];

    let totalWeight = 0;
    let earnedWeight = 0;

    if (rules.length > 0) {
      for (const rule of rules) {
        const result = RequirementsEngine.evaluateRule(rule, candidateData);
        totalWeight += rule.weight;
        if (result.passed) {
          earnedWeight += rule.weight;
          matchedRules.push(result);
        } else {
          failedRules.push(result);
          reasons.push(result.messageAr);
        }
      }
    } else {
      // Default fallback track thresholds if dynamic rules aren't yet configured
      const gpaPassed = candidateData.gpa >= track.minGpa;
      const rankPassed = candidateData.qsRank <= track.topUniversitiesRankLimit;

      totalWeight = 100;
      if (gpaPassed) earnedWeight += 50; else reasons.push(`المعدل التراكمي أقل من ${track.minGpa}`);
      if (rankPassed) earnedWeight += 50; else reasons.push(`تصنيف الجامعة يتجاوز الحد الأقصى للمسار (${track.topUniversitiesRankLimit})`);
    }

    const score = totalWeight > 0 ? Math.round((earnedWeight / totalWeight) * 100) : 75;

    // Decision Logic
    let decision: EligibilityDecision = 'NEEDS_REVIEW';
    const hasFatalFailure = failedRules.some(r => r.ruleCode === 'MAX_QS_RANK' || r.ruleCode === 'UNCONDITIONAL_OFFER');

    if (failedRules.length === 0 && score >= 85) {
      decision = 'ELIGIBLE';
      reasons.unshift('مستوفٍ لكافة الشروط والمتطلبات الأكاديمية والجامعية المعتمدة للمسار.');
    } else if (score >= 60 && !hasFatalFailure) {
      decision = 'CONDITIONALLY_ELIGIBLE';
      warnings.push('مؤهل مشروط: يلزم تقديم متطلبات إضافية كاجتياز اختبار اللغة أو استيفاء موافقة جهة العمل.');
    } else {
      decision = 'NOT_ELIGIBLE';
    }

    return {
      trackId: track.id,
      trackNameAr: track.nameAr,
      trackNameEn: track.nameEn,
      decision,
      score,
      matchedRules,
      failedRules,
      warnings,
      reasons,
      evaluatedAt: new Date().toISOString()
    };
  }
}
