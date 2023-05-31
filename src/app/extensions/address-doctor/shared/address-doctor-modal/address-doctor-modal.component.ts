import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subject, map, takeUntil } from 'rxjs';

import { Address } from 'ish-core/models/address/address.model';
import { FeatureEventService } from 'ish-core/utils/feature-event-notifier/feature-event-notifier.service';

import { AddressDoctorFacade } from '../../facades/address-doctor.facade';
import { AddressDoctorEvents } from '../../models/address-doctor-event.model';

@Component({
  selector: 'ish-address-doctor-modal',
  templateUrl: './address-doctor-modal.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class AddressDoctorModalComponent implements OnDestroy {
  @Input() size: string = undefined;
  @Output() confirmAddress = new EventEmitter<Address>();
  @ViewChild('template', { static: true }) modalDialogTemplate: TemplateRef<unknown>;

  ngbModalRef: NgbModalRef;

  form: FormGroup = new FormGroup({});
  fields$: Observable<FormlyFieldConfig[]>;
  model: {
    defaultText: string;
    suggestionText: string;
    address: Address;
  };

  private eventId: string;
  private destroy$ = new Subject<void>();

  constructor(
    private ngbModal: NgbModal,
    private addressDoctorFacade: AddressDoctorFacade,
    private featureEventService: FeatureEventService,
    private translateService: TranslateService
  ) {}

  openModal(address: Address) {
    this.fields$ = this.getFields(address);
    this.model = {
      defaultText: `<p>${this.translateService.instant(
        'address.doctor.suggestion.text.1'
      )} ${this.translateService.instant('address.doctor.suggestion.text.2')}</p><h3>${this.translateService.instant(
        'address.doctor.suggestion.actual.address'
      )}</h3>`,
      suggestionText: `<h3>${this.translateService.instant('address.doctor.suggestion.proposals')}</h3>`,
      address,
    };

    const size = this.size;
    this.ngbModalRef = this.ngbModal.open(this.modalDialogTemplate, { size });
    this.ngbModalRef.hidden.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.featureEventService.sendResult(this.eventId, AddressDoctorEvents.CheckAddressCancelled, true);
    });
  }

  hide() {
    this.ngbModalRef.close();
  }

  confirm() {
    this.ngbModalRef.close();
    this.confirmAddress.emit(this.model.address);
  }

  getFields(address: Address): Observable<FormlyFieldConfig[]> {
    return this.addressDoctorFacade.checkAddress(address).pipe(
      map(suggestions => [
        {
          type: 'ish-html-text-field',
          key: 'defaultText',
          props: {
            inputClass: ' ',
          },
        },
        {
          type: 'ish-radio-field',
          key: 'address',
          props: {
            fieldClass: ' ',
            id: address.id,
            value: address,
            label: this.formatAddress(address),
          },
        },
        {
          type: 'ish-html-text-field',
          key: 'suggestionText',
          props: {
            inputClass: ' ',
          },
        },
        ...suggestions.map(suggestion => ({
          type: 'ish-radio-field',
          key: 'address',
          props: {
            fieldClass: ' ',
            id: suggestion.id,
            value: suggestion,
            label: this.formatAddress(suggestion),
          },
        })),
      ])
    );
  }

  private formatAddress(address: Address): string {
    return `${address.addressLine1}, ${address.postalCode}, ${address.city}`;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
