import { Injectable, inject } from '@angular/core';
import { filter, map } from 'rxjs';

import { Address } from 'ish-core/models/address/address.model';

import { AddressDoctorVariant, AddressDoctorVariants } from '../models/address-doctor-variant.model';
import { AddressDoctorApiService } from '../services/address-doctor-api/address-doctor-api.service';

@Injectable({ providedIn: 'root' })
export class AddressDoctorFacade {
  private addressDoctorApi = inject(AddressDoctorApiService);

  checkAddress(address: Address) {
    return this.addressDoctorApi.postAddress(address).pipe(
      filter(variants => variants.length > 0),
      map((variants: unknown[]) =>
        variants.map((variant: AddressDoctorVariants) => this.mapAddress(address, variant.Variants[0]))
      )
    );
  }

  mapAddress(address: Address, variant: AddressDoctorVariant): Address {
    let city = '';

    for (const locality of variant.AddressElements.Locality) {
      city += ` ${locality.Value}`;
    }

    return {
      ...address,
      addressLine1: `${variant.AddressElements.Street ? variant.AddressElements.Street[0].Value : ''} ${
        variant.AddressElements.HouseNumber ? variant.AddressElements.HouseNumber[0].Value : ''
      }`,
      postalCode: variant.AddressElements.PostalCode ? variant.AddressElements.PostalCode[0].Value : '',
      city,
      mainDivision: variant.AddressElements.AdministrativeDivision
        ? variant.AddressElements.AdministrativeDivision[0].Value
        : '',
    };
  }
}
