import { Address } from 'ish-core/models/address/address.model';

import { AddressDoctorVariant } from './address-doctor-variant.interface';

export class AddressDoctorMapper {
  static fromData(variant: AddressDoctorVariant): Partial<Address> {
    let city = '';

    for (const locality of variant.AddressElements.Locality) {
      city += ` ${locality.Value}`;
    }

    return {
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
