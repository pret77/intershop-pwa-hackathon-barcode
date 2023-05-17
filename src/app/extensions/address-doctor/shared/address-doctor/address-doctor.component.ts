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

import { AccountFacade } from 'ish-core/facades/account.facade';
import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { Address } from 'ish-core/models/address/address.model';
import { FeatureEventNotifierService } from 'ish-core/utils/feature-event-notifier/feature-event-notifier.service';
import { GenerateLazyComponent } from 'ish-core/utils/module-loader/generate-lazy-component.decorator';
import { whenPropertyHasValue } from 'ish-core/utils/operators';

import { AddressDoctorFacade } from '../../facades/address-doctor.facade';

export type AddressDoctorPageVariant =
  | 'register'
  | 'account-create'
  | 'account-update'
  | 'checkout-invoice-create'
  | 'checkout-shipping-create'
  | 'checkout-update';

interface CheckAddressOptions {
  address: Address;
  pageVariant: AddressDoctorPageVariant;
}

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

  private addressDoctorPageVariant: AddressDoctorPageVariant;
  private destroy$ = new Subject<void>();

  constructor(
    private ngbModal: NgbModal,
    private accountFacade: AccountFacade,
    private checkoutFacade: CheckoutFacade,
    private addressDoctorFacade: AddressDoctorFacade,
    private featureEventNotifier: FeatureEventNotifierService
  ) {}

  ngOnInit(): void {
    this.featureEventNotifier.eventNotifier$
      .pipe(whenPropertyHasValue('feature', 'addressDoctor'), takeUntil(this.destroy$))
      .subscribe(({ event, options }) => {
        if (event === 'check-address') {
          if (this.isCheckAddressOptions(options)) {
            const { address, pageVariant } = options;
            this.checkAddress(address, pageVariant);
          } else {
            throwError(() => 'check-address event has no correct options');
          }
        }
      });
  }

  private isCheckAddressOptions(object: any): object is CheckAddressOptions {
    return 'address' in object && 'pageVariant' in object;
  }

  open() {
    const size = this.size;
    this.ngbModalRef = this.ngbModal.open(this.modalDialogTemplate, { size });
    this.ngbModalRef.dismissed.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.sendAddress(this.address);
    });
  }

  hide() {
    this.sendAddress(this.address);
    this.ngbModalRef.close();
  }

  confirm() {
    this.ngbModalRef.close();
    this.sendAddress(this.newAddress);
  }

  change(address: Address) {
    this.newAddress = address;
  }

  checkAddress(address: Address, pageVariant: AddressDoctorPageVariant) {
    this.address = address;
    this.newAddress = address;
    this.addressDoctorPageVariant = pageVariant;
    this.suggestions$ = this.addressDoctorFacade.checkAddress(address);
    this.open();
  }

  sendAddress(address: Address) {
    switch (this.addressDoctorPageVariant) {
      case 'register': {
        this.register.emit(this.newAddress);
        break;
      }
      case 'account-create': {
        this.accountFacade.createCustomerAddress(address);
        break;
      }
      case 'account-update': {
        this.accountFacade.updateCustomerAddress(address);
        break;
      }
      case 'checkout-invoice-create': {
        this.checkoutFacade.createBasketAddress(address, 'invoice');
        break;
      }
      case 'checkout-shipping-create': {
        this.checkoutFacade.createBasketAddress(address, 'shipping');
        break;
      }
      case 'checkout-update': {
        this.checkoutFacade.updateBasketAddress(address);
        break;
      }
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}