import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subject, takeUntil, throwError } from 'rxjs';

import { Address } from 'ish-core/models/address/address.model';
import { FeatureEventNotifierService } from 'ish-core/utils/feature-event-notifier/feature-event-notifier.service';
import { GenerateLazyComponent } from 'ish-core/utils/module-loader/generate-lazy-component.decorator';
import { whenPropertyHasValue } from 'ish-core/utils/operators';

import { AddressDoctorFacade } from '../../facades/address-doctor.facade';

@Component({
  selector: 'ish-address-doctor',
  templateUrl: './address-doctor.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
@GenerateLazyComponent()
export class AddressDoctorComponent implements OnInit, OnDestroy {
  @Input() size: string = undefined;
  @Output() register = new EventEmitter<Address>();
  @ViewChild('template', { static: true }) modalDialogTemplate: TemplateRef<unknown>;

  address: Address;
  ngbModalRef: NgbModalRef;
  suggestions$: Observable<Address[]>;
  newAddress: Address;

  private eventId: string;
  private destroy$ = new Subject<void>();

  constructor(
    private ngbModal: NgbModal,
    private addressDoctorFacade: AddressDoctorFacade,
    private featureEventNotifier: FeatureEventNotifierService
  ) {}

  ngOnInit(): void {
    this.featureEventNotifier.eventNotifier$
      .pipe(whenPropertyHasValue('feature', 'addressDoctor'), takeUntil(this.destroy$))
      .subscribe(({ id, event, data }) => {
        if (event === 'check-address') {
          if (this.isCheckAddressOptions(data)) {
            const { address } = data;
            this.eventId = id;
            this.checkAddress(address);
          } else {
            throwError(() => 'check-address event has no correct options');
          }
        }
      });
  }

  private isCheckAddressOptions(object: any): object is {
    address: Address;
  } {
    return 'address' in object;
  }

  open() {
    const size = this.size;
    this.ngbModalRef = this.ngbModal.open(this.modalDialogTemplate, { size });
    this.ngbModalRef.hidden.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.featureEventNotifier.sendResult(this.eventId, 'check-address-cancellation', true);
    });
  }

  hide() {
    this.ngbModalRef.close();
  }

  confirm() {
    this.ngbModalRef.close();
    this.sendAddress(this.newAddress);
  }

  change(address: Address) {
    this.newAddress = address;
  }

  checkAddress(address: Address) {
    this.address = address;
    this.newAddress = address;
    this.suggestions$ = this.addressDoctorFacade.checkAddress(address);
    this.open();
  }

  sendAddress(address: Address) {
    this.featureEventNotifier.sendResult(this.eventId, 'check-address-successful', true, address);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
