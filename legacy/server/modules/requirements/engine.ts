/**
 * Dynamic Requirements Rule Evaluator Engine
 * Pure functional execution of configurable database rules without hardcoding
 */

import { DbRequirementRule } from '../../core/database';

export interface EvaluationInput {
  gpa: number;
  gpaScale?: number;
  age?: number;
  qsRank: number;
  ieltsScore?: number;
  toeflScore?: number;
  admissionType?: string; // 'unconditional' | 'conditional_language'
  degreeLevel?: string;
  major?: string;
  countryCode?: string;
}

export interface RuleCheckResult {
  ruleCode: string;
  titleAr: string;
  titleEn: string;
  passed: boolean;
  actualValue: any;
  expectedValue: any;
  weight: number;
  messageAr: string;
  messageEn: string;
}

export class RequirementsEngine {
  public static evaluateRule(rule: DbRequirementRule, input: EvaluationInput): RuleCheckResult {
    let actualValue = (input as any)[rule.fieldName];
    let passed = false;

    // Normalize GPA to 5.0 scale if provided on 4.0 scale
    if (rule.fieldName === 'gpa' && input.gpaScale === 4.0) {
      actualValue = (input.gpa / 4.0) * 5.0;
    }

    switch (rule.operator) {
      case '>=':
        passed = typeof actualValue === 'number' && actualValue >= Number(rule.expectedValue);
        break;
      case '<=':
        passed = typeof actualValue === 'number' && actualValue <= Number(rule.expectedValue);
        break;
      case '==':
        passed = String(actualValue).toLowerCase() === String(rule.expectedValue).toLowerCase();
        break;
      case 'IN':
        if (Array.isArray(rule.expectedValue)) {
          passed = rule.expectedValue.map(v => String(v).toLowerCase()).includes(String(actualValue).toLowerCase());
        }
        break;
      case 'CONTAINS':
        passed = String(actualValue).toLowerCase().includes(String(rule.expectedValue).toLowerCase());
        break;
      default:
        passed = false;
    }

    return {
      ruleCode: rule.ruleCode,
      titleAr: rule.titleAr,
      titleEn: rule.titleEn,
      passed,
      actualValue,
      expectedValue: rule.expectedValue,
      weight: rule.weight,
      messageAr: passed ? 'مستوفى بنجاح' : rule.errorMessageAr,
      messageEn: passed ? 'Condition satisfied' : rule.errorMessageEn
    };
  }
}
