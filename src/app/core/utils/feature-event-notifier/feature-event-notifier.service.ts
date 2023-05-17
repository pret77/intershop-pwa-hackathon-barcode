import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FeatureEventNotifierService {
  private internalEventNotifier$ = new Subject<{ feature: string; event: string; options?: any }>();

  /**
   * Event stream to notify extensions for further actions
   */
  eventNotifier$ = this.internalEventNotifier$.asObservable();

  /**
   * Will send new notification to event stream. Subscriber (extensions) to this event stream could react accordingly.
   * @param feature responsible extension
   * @param event event type
   * @param options optional data for event
   */
  sendNotification(feature: string, event: string, options?: any) {
    this.internalEventNotifier$.next({ feature, event, options });
  }
}
