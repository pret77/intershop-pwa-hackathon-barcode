import { Injectable, inject } from '@angular/core';
import { isEqual } from 'lodash-es';
import { Observable, map, of, race, tap, timer } from 'rxjs';

import { Address } from 'ish-core/models/address/address.model';

import { AddressDoctorApiService } from '../services/address-doctor-api/address-doctor-api.service';

@Injectable({ providedIn: 'root' })
export class AddressDoctorFacade {
  private addressDoctorApi = inject(AddressDoctorApiService);

  private lastAddressCheck: Address;
  private lastAddressCheckResult: Address[] = [];

  checkAddress(address: Address): Observable<Address[]> {
    if (isEqual(address, this.lastAddressCheck)) {
      return of(this.lastAddressCheckResult);
    }

    this.lastAddressCheck = address;
    return race(
      this.addressDoctorApi.postAddress(address).pipe(
        tap(result => {
          this.lastAddressCheckResult = result;
        })
      ),
      timer(5000).pipe(map(() => []))
    );
  }
}
