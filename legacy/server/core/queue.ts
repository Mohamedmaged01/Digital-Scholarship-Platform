/**
 * Asynchronous Background Job Queue (BullMQ Pattern)
 * Offloads heavy tasks (OCR, notifications, search indexing) from HTTP request cycle
 */

import { Logger } from './logger';

export type JobType = 
  | 'NOTIFY_USER' 
  | 'PROCESS_ADMISSION_LETTER' 
  | 'AUDIT_ARCHIVE' 
  | 'INDEX_SEARCH'
  | 'GENERATE_FINANCIAL_GUARANTEE';

export interface Job<T = any> {
  id: string;
  type: JobType;
  data: T;
  attempts: number;
  maxAttempts: number;
  status: 'waiting' | 'active' | 'completed' | 'failed';
  error?: string;
  createdAt: number;
  processedAt?: number;
}

export class JobQueue {
  private static queue: Job[] = [];
  private static isProcessing = false;
  private static completedCount = 0;
  private static failedCount = 0;

  public static add<T>(type: JobType, data: T, maxAttempts: number = 3): Job<T> {
    const job: Job<T> = {
      id: `job_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
      type,
      data,
      attempts: 0,
      maxAttempts,
      status: 'waiting',
      createdAt: Date.now()
    };

    this.queue.push(job);
    Logger.info(`Job queued: [${job.type}] with ID ${job.id}`);
    this.scheduleProcessing();
    return job;
  }

  private static scheduleProcessing() {
    if (this.isProcessing) return;
    this.isProcessing = true;

    setImmediate(async () => {
      while (this.queue.length > 0) {
        const job = this.queue.find(j => j.status === 'waiting');
        if (!job) break;

        job.status = 'active';
        job.attempts++;
        job.processedAt = Date.now();

        try {
          await this.executeJob(job);
          job.status = 'completed';
          this.completedCount++;
          Logger.info(`Job completed: [${job.type}] ID: ${job.id}`);
        } catch (err: any) {
          Logger.error(`Job failed: [${job.type}] ID: ${job.id}`, err);
          if (job.attempts < job.maxAttempts) {
            job.status = 'waiting'; // Retry with backoff
          } else {
            job.status = 'failed';
            job.error = err.message;
            this.failedCount++;
          }
        }
      }
      this.isProcessing = false;
    });
  }

  private static async executeJob(job: Job): Promise<void> {
    switch (job.type) {
      case 'NOTIFY_USER':
        // Emulate sending SMS/Email via Gov gateway
        await new Promise(r => setTimeout(r, 20));
        break;

      case 'PROCESS_ADMISSION_LETTER':
        // Emulate OCR parsing pipeline
        await new Promise(r => setTimeout(r, 50));
        break;

      case 'GENERATE_FINANCIAL_GUARANTEE':
        // Emulate crypto signing of digital PDF guarantee
        await new Promise(r => setTimeout(r, 30));
        break;

      case 'INDEX_SEARCH':
        await new Promise(r => setTimeout(r, 10));
        break;

      default:
        break;
    }
  }

  public static getStats() {
    return {
      waiting: this.queue.filter(j => j.status === 'waiting').length,
      active: this.queue.filter(j => j.status === 'active').length,
      completed: this.completedCount,
      failed: this.failedCount,
      totalTracked: this.queue.length
    };
  }
}
