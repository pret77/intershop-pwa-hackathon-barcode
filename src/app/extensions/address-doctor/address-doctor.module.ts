import { NgModule } from '@angular/core';

import { SharedModule } from 'ish-shared/shared.module';

import { AddressDoctorComponent } from './shared/address-doctor/address-doctor.component';

@NgModule({
  imports: [SharedModule],
  declarations: [AddressDoctorComponent],
  exports: [SharedModule],
})
export class AddressDoctorModule {}
