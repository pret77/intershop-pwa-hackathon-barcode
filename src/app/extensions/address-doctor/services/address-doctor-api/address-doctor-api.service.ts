import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map, switchMap } from 'rxjs';

import { Address } from 'ish-core/models/address/address.model';
import { whenTruthy } from 'ish-core/utils/operators';
import { StatePropertiesService } from 'ish-core/utils/state-transfer/state-properties.service';

import { AddressDoctorConfig } from '../../models/address-doctor-config.model';

@Injectable({ providedIn: 'root' })
export class AddressDoctorApiService {
  http = inject(HttpClient);
  statePropertiesService = inject(StatePropertiesService);

  postAddress(address: Address) {
    let addressLine = '';

    if (address.addressLine2) {
      addressLine = `${address.addressLine1};${address.addressLine2};${address.postalCode};${address.city}`;
    } else {
      addressLine = `${address.addressLine1};${address.postalCode};${address.city}`;
    }

    return this.mapToBody(address, addressLine).pipe(
      whenTruthy(),
      switchMap(({ url, body }) =>
        this.http
          .post(url, body)
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .pipe(map((body: any) => body.Response[0].Results))
      )
    );
  }

  private mapToBody(address: Address, addressLine: string): Observable<{ url: string; body: any }> {
    return this.statePropertiesService
      .getStateOrEnvOrDefault<AddressDoctorConfig>('ADDRESS_DOCTOR', 'addressDoctor')
      .pipe(
        whenTruthy(),
        map(config => ({
          url: config.url,
          body: {
            Login: config.login,
            Password: config.password,
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
                      MaxResultCount: config.maxResultCount,
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
          },
        }))
      );
  }
}
