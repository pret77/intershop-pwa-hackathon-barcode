import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { Address } from 'ish-core/models/address/address.model';

import { AddressDoctorPageVariant } from '../../shared/address-doctor/address-doctor.component';

@Injectable({
  providedIn: 'root',
})
export class AddressDoctorNotifierService {
  private internalCheckAddressNotifier$ = new Subject<{
    address: Address;
    pageVariant: AddressDoctorPageVariant;
  }>();

  checkAddressNotifier$ = this.internalCheckAddressNotifier$.asObservable();

  updateCheckAddressNotifier(address: Address, pageVariant: AddressDoctorPageVariant) {
    this.internalCheckAddressNotifier$.next({ address, pageVariant });
  }
}
