import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  TemplateRef,
  ViewChild,
  inject,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TranslateService } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';

import { Address } from 'ish-core/models/address/address.model';

@Component({
  selector: 'ish-address-doctor-modal',
  templateUrl: './address-doctor-modal.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class AddressDoctorModalComponent implements OnDestroy {
  @Input() size: string = undefined;
  @Output() confirmAddress = new EventEmitter<Address>();
  @Output() hidden = new EventEmitter<boolean>();
  @ViewChild('template', { static: true }) modalDialogTemplate: TemplateRef<unknown>;

  private ngbModal = inject(NgbModal);
  private translateService = inject(TranslateService);

  ngbModalRef: NgbModalRef;

  form: FormGroup = new FormGroup({});
  fields: FormlyFieldConfig[];
  model: {
    defaultText: string;
    suggestionText: string;
    address: Address;
  };

  private destroy$ = new Subject<void>();

  openModal(address: Address, suggestions: Address[]) {
    this.fields = this.getFields(address, suggestions);
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
      this.hidden.emit(true);
    });
  }

  hide() {
    this.ngbModalRef.close();
  }

  confirm() {
    this.ngbModalRef.close();
    this.confirmAddress.emit(this.model.address);
  }

  getFields(address: Address, suggestions: Address[]): FormlyFieldConfig[] {
    return [
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
    ];
  }

  private formatAddress(address: Address): string {
    return `${address.addressLine1}, ${address.postalCode}, ${address.city}`;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
