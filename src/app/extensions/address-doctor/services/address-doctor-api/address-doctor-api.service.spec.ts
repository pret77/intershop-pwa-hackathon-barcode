import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { AddressDoctorApiService } from './address-doctor-api.service';

describe('Address Doctor Api Service', () => {
  let addressDoctorApiService: AddressDoctorApiService;
  let controller: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [],
    });
    addressDoctorApiService = TestBed.inject(AddressDoctorApiService);

    controller = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    controller.verify();
  });

  it('should be created', () => {
    expect(addressDoctorApiService).toBeTruthy();
  });
});
