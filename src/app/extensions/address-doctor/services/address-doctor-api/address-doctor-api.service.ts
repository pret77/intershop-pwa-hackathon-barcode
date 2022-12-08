import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';

import { Address } from 'ish-core/models/address/address.model';

import { environment } from '../../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AddressDoctorApiService {
  constructor(private http: HttpClient) {}

  postAddress(address: Address) {
    let addressLine = '';

    if (address.addressLine2) {
      addressLine = `${address.addressLine1};${address.addressLine2};${address.postalCode};${address.city}`;
    } else {
      addressLine = `${address.addressLine1};${address.postalCode};${address.city}`;
    }

    const json = {
      Login: environment.addressDoctor.login,
      Password: environment.addressDoctor.password,
      UseTransactions: 'PRODUCTION',
      Request: {
        Parameters: {
          Mode: 'QuickCapture',

          CountrySets: [
            {
              OutputDetail: {
                PreformattedData: {
                  PostalFormattedAddressLines: true,
                  SingleAddressLine: true,
                  SingleAddressLineDelimiter: 'Semicolon',
                },
                SubItems: true,
              },
              Result: {
                MaxResultCount: environment.addressDoctor.maxResultCount,
                NumericRangeExpansion: {
                  RangesToExpand: 'None',
                  RangeExpansionType: 'Flexible',
                },
              },
              Standardizations: [
                {
                  Default: {
                    PreferredScript: {
                      Script: 'Latin',
                      TransliterationType: 'Default',
                      LimitLatinCharacters: 'Latin1',
                    },
                    FormatWithCountry: false,
                    CountryNameType: 'NameEN',
                    CountryCodeType: 'ISO2',
                    MaxItemLength: 255,
                    Casing: 'PostalAdmin',
                    DescriptorLength: 'Database',
                    AliasHandling: 'PostalAdmin',
                  },
                },
              ],
            },
          ],
        },

        IO: {
          Inputs: [
            {
              AddressElements: {
                Country: address.countryCode,
              },
              PreformattedData: {
                SingleAddressLine: addressLine,
              },
            },
          ],
        },
      },
    };

    return (
      this.http
        .post(environment.addressDoctor.url, json)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .pipe(map((body: any) => body.Response[0].Results))
    );
  }
}
