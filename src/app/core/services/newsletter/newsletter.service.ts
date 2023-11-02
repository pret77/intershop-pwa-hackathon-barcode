import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

import { ApiService } from 'ish-core/services/api/api.service';

@Injectable({ providedIn: 'root' })
export class NewsletterService {
  constructor(private apiService: ApiService) {}

  subscribe(userEmail: string) {
    const body = {
      name: 'Newsletter',
      type: 'Subscription',
      active: true,
      recipient: userEmail,
    };

    this.apiService.post(`subscriptions`, body).subscribe(data => console.log('data: ', data));
  }

  getSubscription(userEmail: string): Observable<boolean> {
    return this.apiService.get(`subscriptions/${userEmail}`).pipe(map((params: { active: boolean }) => params.active));
  }

  unsubscribe(userEmail: string) {
    return this.apiService.delete(`subscriptions/${userEmail}`);
  }
}
