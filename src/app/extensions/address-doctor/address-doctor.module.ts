import { NgModule } from '@angular/core';

import { SharedModule } from 'ish-shared/shared.module';

import { AddressDoctorModalComponent } from './shared/address-doctor-modal/address-doctor-modal.component';
import { AddressDoctorComponent } from './shared/address-doctor/address-doctor.component';

@NgModule({
  imports: [SharedModule],
  declarations: [AddressDoctorComponent, AddressDoctorModalComponent],
  exports: [SharedModule],
})
export class AddressDoctorModule {}
