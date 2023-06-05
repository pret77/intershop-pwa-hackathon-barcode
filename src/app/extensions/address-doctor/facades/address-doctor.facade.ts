import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { Address } from 'ish-core/models/address/address.model';

import { AddressDoctorApiService } from '../services/address-doctor-api/address-doctor-api.service';

@Injectable({ providedIn: 'root' })
export class AddressDoctorFacade {
  private addressDoctorApi = inject(AddressDoctorApiService);

  checkAddress(address: Address): Observable<Address[]> {
    return this.addressDoctorApi.postAddress(address);
  }
}
