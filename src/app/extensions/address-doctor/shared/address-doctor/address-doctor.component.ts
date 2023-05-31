import { AfterViewInit, ChangeDetectionStrategy, Component, Input, OnDestroy, ViewChild } from '@angular/core';
import { Subject, filter, map, takeUntil, tap } from 'rxjs';

import { Address } from 'ish-core/models/address/address.model';
import { FeatureEventService } from 'ish-core/utils/feature-event-notifier/feature-event-notifier.service';
import { GenerateLazyComponent } from 'ish-core/utils/module-loader/generate-lazy-component.decorator';
import { whenPropertyHasValue } from 'ish-core/utils/operators';

import { AddressDoctorEvents } from '../../models/address-doctor-event.model';
import { AddressDoctorModalComponent } from '../address-doctor-modal/address-doctor-modal.component';

@Component({
  selector: 'ish-address-doctor',
  templateUrl: './address-doctor.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
@GenerateLazyComponent()
export class AddressDoctorComponent implements OnDestroy, AfterViewInit {
  @Input() size: string = undefined;
  @ViewChild('modal') modal: AddressDoctorModalComponent;

  private eventId: string;
  private destroy$ = new Subject<void>();

  constructor(private featureEventService: FeatureEventService) {}

  ngAfterViewInit(): void {
    this.featureEventService.eventNotifier$
      .pipe(
        whenPropertyHasValue('feature', 'addressDoctor'),
        filter(({ event }) => event === AddressDoctorEvents.CheckAddress),
        tap(({ id }) => (this.eventId = id)),
        map(({ data }) => this.mapToAddress(data)),
        takeUntil(this.destroy$)
      )
      .subscribe(address => this.modal.openModal(address));
  }

  mapToAddress(data: any): Address {
    if (this.isCheckAddressOptions(data)) {
      const { address } = data;
      return address;
    }
    return;
  }

  private isCheckAddressOptions(object: any): object is {
    address: Address;
  } {
    return 'address' in object;
  }

  sendAddress(address: Address) {
    this.featureEventService.sendResult(this.eventId, AddressDoctorEvents.CheckAddressSuccess, true, address);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
