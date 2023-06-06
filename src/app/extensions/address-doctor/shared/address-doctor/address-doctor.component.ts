import { AfterViewInit, ChangeDetectionStrategy, Component, Input, OnDestroy, ViewChild, inject } from '@angular/core';
import { Subject, filter, map, takeUntil, tap } from 'rxjs';

import { Address } from 'ish-core/models/address/address.model';
import { FeatureEventService } from 'ish-core/utils/feature-event-notifier/feature-event-notifier.service';
import { GenerateLazyComponent } from 'ish-core/utils/module-loader/generate-lazy-component.decorator';
import { whenPropertyHasValue } from 'ish-core/utils/operators';

import { AddressDoctorEvents } from '../../models/address-doctor/address-doctor-event.model';
import { AddressDoctorModalComponent } from '../address-doctor-modal/address-doctor-modal.component';

@Component({
  selector: 'ish-address-doctor',
  templateUrl: './address-doctor.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
@GenerateLazyComponent()
export class AddressDoctorComponent implements OnDestroy, AfterViewInit {
  @Input() size: string = undefined;
  // related address doctor modal
  @ViewChild('modal') modal: AddressDoctorModalComponent;

  private featureEventService = inject(FeatureEventService);

  private eventId: string;
  private destroy$ = new Subject<void>();

  ngAfterViewInit(): void {
    // react on all CheckAddress event notifier for 'addressDoctor' feature
    this.featureEventService.eventNotifier$
      .pipe(
        whenPropertyHasValue('feature', 'addressDoctor'),
        filter(({ event }) => event === AddressDoctorEvents.CheckAddress),
        //save notifier id for event result
        tap(({ id }) => (this.eventId = id)),
        map(({ data }) => this.mapToAddress(data)),
        takeUntil(this.destroy$)
      )
      // open related address doctor modal with event notifier address data
      .subscribe(address => this.modal.openModal(address));
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private mapToAddress(data: any): Address {
    if (this.isCheckAddressOptions(data)) {
      const { address } = data;
      return address;
    }
    return;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private isCheckAddressOptions(object: any): object is {
    address: Address;
  } {
    return 'address' in object;
  }

  /**
   * Send event result for given address
   * @param address address callback
   */
  sendAddress(address: Address) {
    this.featureEventService.sendResult(this.eventId, AddressDoctorEvents.CheckAddressSuccess, true, address);
  }

  /**
   * Send event result when modal component was cancelled
   */
  onModalHidden(hidden: boolean) {
    if (hidden) {
      this.featureEventService.sendResult(this.eventId, AddressDoctorEvents.CheckAddressCancelled, true);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
