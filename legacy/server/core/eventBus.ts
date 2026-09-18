/**
 * Event-Driven Architecture (EDA) Domain Event Bus
 * Decouples business transaction logic from side-effects (Audit, Notifications, Analytics)
 */

import { Logger } from './logger';
import { JobQueue } from './queue';
import { RedisService } from './redis';

export type DomainEventType = 
  | 'APPLICATION_SUBMITTED'
  | 'APPLICATION_STATUS_CHANGED'
  | 'ELIGIBILITY_EVALUATED'
  | 'DOCUMENT_UPLOADED'
  | 'APPOINTMENT_SCHEDULED'
  | 'SECURITY_ALERT';

export interface DomainEvent<T = any> {
  eventId: string;
  type: DomainEventType;
  timestamp: string;
  actorId?: string;
  payload: T;
}

type EventHandler<T = any> = (event: DomainEvent<T>) => Promise<void> | void;

export class EventBus {
  private static handlers: Map<DomainEventType, EventHandler[]> = new Map();

  public static subscribe<T>(type: DomainEventType, handler: EventHandler<T>): void {
    const list = this.handlers.get(type) || [];
    list.push(handler);
    this.handlers.set(type, list);
  }

  public static emit<T>(type: DomainEventType, payload: T, actorId?: string): void {
    const event: DomainEvent<T> = {
      eventId: `evt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      type,
      timestamp: new Date().toISOString(),
      actorId,
      payload
    };

    Logger.info(`[EventBus] Emitted ${type}`, { eventId: event.eventId, actorId });

    // Execute handlers asynchronously
    const registered = this.handlers.get(type) || [];
    for (const handler of registered) {
      try {
        Promise.resolve(handler(event)).catch(err => {
          Logger.error(`[EventBus] Handler error for ${type}`, err);
        });
      } catch (err) {
        Logger.error(`[EventBus] Handler sync error for ${type}`, err);
      }
    }
  }
}

// Built-in automatic event subscriptions
EventBus.subscribe('APPLICATION_SUBMITTED', async (evt) => {
  const { applicationNumber, userId, trackName } = evt.payload as any;
  JobQueue.add('NOTIFY_USER', {
    userId,
    title: 'تم استلام طلب الابتعاث بنجاح',
    content: `تم تسجيل طلبك رقم ${applicationNumber} في ${trackName} وهو الآن قيد التدقيق الأكاديمي المبدئي.`
  });
  RedisService.invalidateByPattern('kasp:admin:stats*');
});

EventBus.subscribe('APPLICATION_STATUS_CHANGED', async (evt) => {
  const { userId, applicationNumber, newStatus } = evt.payload as any;
  JobQueue.add('NOTIFY_USER', {
    userId,
    title: 'تحديث حالة طلب الابتعاث',
    content: `تم تحديث حالة طلبك رقم ${applicationNumber} إلى: ${newStatus}`
  });
  RedisService.invalidateByPattern('kasp:admin:stats*');
});
