import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { v4 as uuid } from 'uuid';

@Injectable({
  providedIn: 'root',
})
export class FeatureEventNotifierService {
  private internalEventNotifier$ = new Subject<{ id: string; feature: string; event: string; data?: any }>();
  private internalEventResult$ = new Subject<{ id: string; event: string; successful: boolean; data?: any }>();

  /**
   * Event stream to notify extensions for further actions
   */
  eventNotifier$ = this.internalEventNotifier$.asObservable();

  /**
   * Event stream to notify for event results
   */
  eventResults$ = this.internalEventResult$.asObservable();

  /**
   * Will send new notification to event stream. Subscriber (extensions) to this event stream could react accordingly.
   * @param feature responsible extension
   * @param event event type
   * @param data optional data for event
   * @returns identifier of generated event
   */
  sendNotification(feature: string, event: string, data?: any): string {
    const id = uuid();
    this.internalEventNotifier$.next({ id, feature, event, data });
    return id;
  }

  /**
   * Will send results of event back. Subscriber (event trigger) to this result stream could react accordingly.
   * @param id identifier of generated even
   * @param event event type
   * @param successful Is result successful?
   * @param data optional data for event
   */
  sendResult(id: string, event: string, successful: boolean, data?: any) {
    this.internalEventResult$.next({ id, event, successful, data });
  }
}
