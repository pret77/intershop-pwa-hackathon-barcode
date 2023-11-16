import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ZXingScannerModule } from '@zxing/ngx-scanner';

import { HackathonScannerScanditComponent } from './scanner-scandit/hackathon-scanner-scandit.component';
import { HackathonScannerZingxComponent } from './scanner-zingx/hackathon-scanner-zingx.component';
import { HackathonScannersComponent } from './scanners/hackathon-scanners.component';

@NgModule({
  declarations: [HackathonScannerScanditComponent, HackathonScannersComponent, HackathonScannerZingxComponent],
  imports: [CommonModule, ZXingScannerModule],
  exports: [HackathonScannersComponent],
})
export class HackathonScannerModule {}
