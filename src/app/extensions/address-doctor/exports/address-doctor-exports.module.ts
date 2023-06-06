import { CommonModule } from '@angular/common';
import { NgModule, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { filter, take, takeUntil } from 'rxjs/operators';

import {
  FEATURE_EVENT_RESULT_LISTENER,
  FeatureEventService,
} from 'ish-core/utils/feature-event-notifier/feature-event-notifier.service';
import { whenTruthy } from 'ish-core/utils/operators';

import { AddressDoctorEvents } from '../models/address-doctor/address-doctor-event.model';

import { LazyAddressDoctorComponent } from './lazy-address-doctor/lazy-address-doctor.component';

export function checkAddressResultListenerFactory() {
  const featureEventService = inject(FeatureEventService);
  return {
    feature: 'addressDoctor',
    event: AddressDoctorEvents.CheckAddress,
    resultListener$: (id: string) => {
      if (!id) {
        return;
      }

      return featureEventService.eventResults$.pipe(
        whenTruthy(),
        // respond only when CheckAddressSuccess event is emitted for specific notification id
        filter(
          result => result.id === id && result.event === AddressDoctorEvents.CheckAddressSuccess && result.successful
        ),
        take(1),
        takeUntil(
          featureEventService.eventResults$.pipe(
            whenTruthy(),
            // close event stream when CheckAddressCancelled event is emitted for specific notification id
            filter(result => result.id === id && result.event === AddressDoctorEvents.CheckAddressCancelled)
          )
        )
      );
    },
  };
}

@NgModule({
  imports: [CommonModule, TranslateModule],
  declarations: [LazyAddressDoctorComponent],
  exports: [LazyAddressDoctorComponent],
  providers: [
    {
      provide: FEATURE_EVENT_RESULT_LISTENER,
      useFactory: checkAddressResultListenerFactory,
      multi: true,
    },
  ],
})
export class AddressDoctorExportsModule {}
