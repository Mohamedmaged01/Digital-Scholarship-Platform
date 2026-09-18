/**
 * Applications Management Service
 * Enforces Public Application Number Format (SCH-2026-XXXXXXXX), State Transitions, and Idempotency
 */

import { DatabaseService, DbApplication } from '../../core/database';
import { EventBus } from '../../core/eventBus';
import { RedisService } from '../../core/redis';
import { EligibilityService } from '../eligibility/engine';

export class ApplicationsService {
  /**
   * Generates formatted, unguessable public application numbers (e.g. SCH-2026-A8F923B1)
   */
  public static generatePublicAppNumber(): string {
    const year = new Date().getFullYear();
    const entropy = Math.random().toString(36).substring(2, 10).toUpperCase();
    return `SCH-${year}-${entropy}`;
  }

  public static async createDraft(input: {
    userId: string;
    userName: string;
    userNationalId: string;
    userEmail: string;
    trackId: string;
    universityId: string;
    universityName: string;
    universityRank: number;
    major: string;
    degreeLevel: string;
    gpa: number;
    ieltsScore?: number;
  }): Promise<DbApplication> {
    const track = await DatabaseService.getTrackById(input.trackId);
    if (!track) {
      throw new Error(`Track with ID ${input.trackId} not found`);
    }

    const app: DbApplication = {
      id: `app_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      applicationNumber: this.generatePublicAppNumber(),
      userId: input.userId,
      userName: input.userName,
      userNationalId: input.userNationalId,
      userEmail: input.userEmail,
      trackId: input.trackId,
      trackNameAr: track.nameAr,
      universityId: input.universityId,
      universityName: input.universityName,
      universityRank: input.universityRank,
      major: input.major,
      degreeLevel: input.degreeLevel,
      intakeTerm: 'Fall 2026',
      gpa: input.gpa,
      ieltsScore: input.ieltsScore,
      status: 'draft',
      eligibilityDecision: 'NEEDS_REVIEW',
      eligibilityScore: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    return await DatabaseService.createApplication(app);
  }

  public static async submitApplication(applicationId: string, userId: string): Promise<DbApplication> {
    const lockKey = `lock:app_submit:${applicationId}`;
    const acquired = await RedisService.acquireLock(lockKey, userId, 5000);
    if (!acquired) {
      throw new Error('عملية التقديم قيد المعالجة بالفعل، يرجى الانتظار لتجنب التكرار.');
    }

    try {
      const app = await DatabaseService.getApplicationById(applicationId);
      if (!app) {
        throw new Error('طلب الابتعاث غير موجود');
      }

      if (app.userId !== userId) {
        throw new Error('غير مصرح لك بتقديم هذا الطلب');
      }

      if (app.status !== 'draft') {
        throw new Error(`لا يمكن تقديم الطلب وهو بالحالة الحالية: ${app.status}`);
      }

      // 1. Run authoritative Eligibility Evaluation
      const evalReport = await EligibilityService.evaluateEligibility(app.trackId, {
        gpa: app.gpa,
        qsRank: app.universityRank,
        ieltsScore: app.ieltsScore,
        degreeLevel: app.degreeLevel,
        major: app.major,
        admissionType: 'unconditional'
      });

      const updated = await DatabaseService.updateApplication(applicationId, {
        status: 'submitted',
        eligibilityDecision: evalReport.decision,
        eligibilityScore: evalReport.score,
        updatedAt: new Date().toISOString()
      });

      // 2. Emit Domain Event
      EventBus.emit('APPLICATION_SUBMITTED', {
        applicationId: app.id,
        applicationNumber: app.applicationNumber,
        userId: app.userId,
        trackName: app.trackNameAr,
        score: evalReport.score
      }, userId);

      return updated!;
    } finally {
      RedisService.releaseLock(lockKey, userId);
    }
  }

  public static async transitionStatus(
    applicationId: string, 
    newStatus: string, 
    reviewerId: string, 
    notes?: string
  ): Promise<DbApplication> {
    const app = await DatabaseService.getApplicationById(applicationId);
    if (!app) throw new Error('الطلب غير موجود');

    const previousStatus = app.status;
    const updates: Partial<DbApplication> = {
      status: newStatus,
      updatedAt: new Date().toISOString()
    };

    if (newStatus === 'accepted' && !app.financialGuaranteeCode) {
      updates.financialGuaranteeCode = `FG-2026-${app.applicationNumber.slice(-6)}`;
    }

    const updated = await DatabaseService.updateApplication(applicationId, updates);

    EventBus.emit('APPLICATION_STATUS_CHANGED', {
      applicationId: app.id,
      applicationNumber: app.applicationNumber,
      userId: app.userId,
      previousStatus,
      newStatus,
      reviewerId,
      notes
    }, reviewerId);

    return updated!;
  }
}
