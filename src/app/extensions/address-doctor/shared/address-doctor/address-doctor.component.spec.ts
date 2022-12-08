import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { instance, mock } from 'ts-mockito';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { CheckoutFacade } from 'ish-core/facades/checkout.facade';

import { AddressDoctorFacade } from '../../facades/address-doctor.facade';

import { AddressDoctorComponent } from './address-doctor.component';

describe('Address Doctor Component', () => {
  let component: AddressDoctorComponent;
  let fixture: ComponentFixture<AddressDoctorComponent>;
  let element: HTMLElement;
  let accountFacade: AccountFacade;
  let checkoutFacade: CheckoutFacade;
  let addressDoctorFacade: AddressDoctorFacade;

  beforeEach(async () => {
    accountFacade = mock(AccountFacade);
    checkoutFacade = mock(CheckoutFacade);
    addressDoctorFacade = mock(AddressDoctorFacade);

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, TranslateModule.forRoot()],
      declarations: [AddressDoctorComponent, MockComponent(FaIconComponent)],
      providers: [
        { provide: AccountFacade, useFactory: () => instance(accountFacade) },
        { provide: AddressDoctorFacade, useFactory: () => instance(addressDoctorFacade) },
        { provide: CheckoutFacade, useFactory: () => instance(checkoutFacade) },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent<typeof component>(AddressDoctorComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should display modal dialog when open function is called', () => {
    fixture.detectChanges();
    component.open();
    expect(component.ngbModalRef).toBeTruthy();
  });

  it('should not display modal dialog when open function is not called', () => {
    fixture.detectChanges();
    expect(component.ngbModalRef).toBeFalsy();
  });

  // it('should render address', () => {
  //   const addressData = {
  //     id: 'addressId',
  //     addressLine1: 'High Street',
  //     addressLine2: 'PostCode 5',
  //     city: 'Town',
  //     postalCode: '11111',
  //   } as unknown as Address;

  //   fixture.detectChanges();
  //   component.address = addressData;
  //   component.open();
  //   expect(element).toMatchInlineSnapshot(`
  //     <label class="col-12">
  //       <input type="radio" name="address-suggestion" checked="checked" value="addressId" (change)="change(address)" />
  //       High Street, PostCode 5, 11111, Town
  //     </label>
  //   `);
  // });

  // it('should render suggestions', () => {
  //   const addressData = [
  //     {
  //       id: '1',
  //       addressLine1: 'Saalstr. 2',
  //       city: 'Jena Zentrum',
  //       postalCode: '07743',
  //     },
  //   ] as unknown as Address[];

  //   fixture.detectChanges();
  //   component.suggestions$ = of(addressData);
  //   component.open();
  //   expect(element).toMatchInlineSnapshot(`
  //     <label class="col-12">
  //       <input type="radio" name="address-suggestion" value="1" (change)="change(address)" />
  //       Saalstr. 2, 07743, Jena Zentrum
  //     </label>
  //   `);
  // });
});

// Test Data

// export const data = [
//   {
//     Variants: [
//       {
//         StatusValues: {
//           AddressType: 'S',
//           ResultGroup: 'Street',
//           LanguageISO3: 'DEU',
//           UsedVerificationLevel: 'None',
//           MatchPercentage: '95.23',
//           Script: 'Latin1',
//           AddressCount: '1',
//           ResultQuality: 5,
//         },
//         AddressElements: {
//           Street: [
//             {
//               Value: 'Saalstr.',
//               SubItems: {
//                 Name: 'Saalstr.',
//               },
//             },
//           ],
//           HouseNumber: [
//             {
//               Value: '2',
//               SubItems: {
//                 // eslint-disable-next-line id-blacklist
//                 Number: '2',
//               },
//             },
//           ],
//           Locality: [
//             {
//               Value: 'Jena',
//               SubItems: {
//                 Name: 'Jena',
//               },
//             },
//             {
//               Value: 'Zentrum',
//               SubItems: {
//                 Name: 'Zentrum',
//               },
//             },
//           ],
//           PostalCode: [
//             {
//               Value: '07743',
//               SubItems: {
//                 Base: '07743',
//               },
//             },
//           ],
//           AdministrativeDivision: [
//             {
//               Value: 'Thüringen',
//               Variants: {
//                 Extended: 'Thüringen',
//                 ISO: 'TH',
//                 Abbreviation: 'TH',
//               },
//             },
//           ],
//           Country: [
//             {
//               Code: 'DE',
//               Name: 'GERMANY',
//             },
//           ],
//         },
//         PreformattedData: {
//           SingleAddressLine: {
//             Value: 'Saalstr. 2;07743 Jena',
//           },
//           PostalDeliveryAddressLines: [
//             {
//               Value: 'Saalstr. 2',
//             },
//           ],
//           PostalFormattedAddressLines: [
//             {
//               Value: 'Saalstr. 2',
//             },
//             {
//               Value: '07743 Jena',
//             },
//           ],
//           PostalLocalityLine: {
//             Value: '07743 Jena',
//           },
//         },
//       },
//     ],
//   },
//   {
//     Variants: [
//       {
//         StatusValues: {
//           AddressType: 'S',
//           ResultGroup: 'Street',
//           LanguageISO3: 'DEU',
//           UsedVerificationLevel: 'None',
//           MatchPercentage: '94.44',
//           Script: 'Latin1',
//           AddressCount: '1',
//           ResultQuality: 5,
//         },
//         AddressElements: {
//           Street: [
//             {
//               Value: 'Talstr.',
//               SubItems: {
//                 Name: 'Talstr.',
//               },
//             },
//           ],
//           HouseNumber: [
//             {
//               Value: '2',
//               SubItems: {
//                 // eslint-disable-next-line id-blacklist
//                 Number: '2',
//               },
//             },
//           ],
//           Locality: [
//             {
//               Value: 'Jena',
//               SubItems: {
//                 Name: 'Jena',
//               },
//             },
//             {
//               Value: 'West',
//               SubItems: {
//                 Name: 'West',
//               },
//             },
//           ],
//           PostalCode: [
//             {
//               Value: '07743',
//               SubItems: {
//                 Base: '07743',
//               },
//             },
//           ],
//           AdministrativeDivision: [
//             {
//               Value: 'Thüringen',
//               Variants: {
//                 Extended: 'Thüringen',
//                 ISO: 'TH',
//                 Abbreviation: 'TH',
//               },
//             },
//           ],
//           Country: [
//             {
//               Code: 'DE',
//               Name: 'GERMANY',
//             },
//           ],
//         },
//         PreformattedData: {
//           SingleAddressLine: {
//             Value: 'Talstr. 2;07743 Jena',
//           },
//           PostalDeliveryAddressLines: [
//             {
//               Value: 'Talstr. 2',
//             },
//           ],
//           PostalFormattedAddressLines: [
//             {
//               Value: 'Talstr. 2',
//             },
//             {
//               Value: '07743 Jena',
//             },
//           ],
//           PostalLocalityLine: {
//             Value: '07743 Jena',
//           },
//         },
//       },
//     ],
//   },
// ];

// export const dataEmpty: unknown[] = [];
