import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { pick } from 'lodash-es';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';
import { anything, instance, mock, when } from 'ts-mockito';

import { Address } from 'ish-core/models/address/address.model';
import { FormlyTestingModule } from 'ish-shared/formly/dev/testing/formly-testing.module';

import { AddressDoctorFacade } from '../../facades/address-doctor.facade';

import { AddressDoctorModalComponent } from './address-doctor-modal.component';

const mockAddresses = [
  {
    id: '0001"',
    urn: 'urn:address:customer:JgEKAE8BA50AAAFgDtAd1LZU:1001',
    title: 'Ms.',
    firstName: 'Patricia',
    lastName: 'Miller',
    addressLine1: 'Potsdamer Str. 20',
    postalCode: '14483',
    city: 'Berlin',
  },
  {
    id: '0002"',
    urn: 'urn:address:customer:JgEKAE8BA50AAAFgDtAd1LZU:1002',
    title: 'Ms.',
    firstName: 'Patricia',
    lastName: 'Miller',
    addressLine1: 'Berliner Str. 20',
    postalCode: '14482',
    city: 'Berlin',
  },
  {
    id: '0003"',
    urn: 'urn:address:customer:JgEKAE8BA50AAAFgDtAd1LZU:1003',
    title: 'Ms.',
    firstName: 'Patricia',
    lastName: 'Miller',
    addressLine1: 'Neue Promenade 5',
    postalCode: '10178',
    city: 'Berlin',
    companyName1: 'Intershop Communications AG',
  },
  {
    id: '0004"',
    urn: 'urn:address:customer:JgEKAE8BA50AAAFgDtAd1LZU:1004',
    title: 'Ms.',
    firstName: 'Patricia',
    lastName: 'Miller',
    addressLine1: 'Intershop Tower',
    postalCode: '07743',
    city: 'Jena',
    companyName1: 'Intershop Communications AG',
  },
] as Address[];

describe('Address Doctor Modal Component', () => {
  let component: AddressDoctorModalComponent;
  let fixture: ComponentFixture<AddressDoctorModalComponent>;
  let element: HTMLElement;

  let addressDoctorFacade: AddressDoctorFacade;

  beforeEach(async () => {
    addressDoctorFacade = mock(AddressDoctorFacade);

    await TestBed.configureTestingModule({
      imports: [FormlyTestingModule, RouterTestingModule, TranslateModule.forRoot()],
      declarations: [AddressDoctorModalComponent, MockComponent(FaIconComponent)],
      providers: [{ provide: AddressDoctorFacade, useFactory: () => instance(addressDoctorFacade) }],
    }).compileComponents();

    when(addressDoctorFacade.checkAddress(anything())).thenReturn(of(mockAddresses));
  });

  beforeEach(() => {
    fixture = TestBed.createComponent<typeof component>(AddressDoctorModalComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should display modal dialog when open function is called', done => {
    fixture.detectChanges();
    component.openModal(mockAddresses[0]);
    expect(component.ngbModalRef).toBeTruthy();

    component.fields$.subscribe(fields => {
      const mapped = fields.map(field => pick(field, ['type', 'key']));
      expect(mapped).toMatchInlineSnapshot(
        `
        [
          {
            "key": "defaultText",
            "type": "ish-html-text-field",
          },
          {
            "key": "address",
            "type": "ish-radio-field",
          },
          {
            "key": "suggestionText",
            "type": "ish-html-text-field",
          },
          {
            "key": "address",
            "type": "ish-radio-field",
          },
          {
            "key": "address",
            "type": "ish-radio-field",
          },
          {
            "key": "address",
            "type": "ish-radio-field",
          },
          {
            "key": "address",
            "type": "ish-radio-field",
          },
        ]
      `
      );
      done();
    });
  });

  it('should not display modal dialog when open function is not called', () => {
    fixture.detectChanges();
    expect(component.ngbModalRef).toBeFalsy();
  });
});
