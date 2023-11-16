import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ZXingScannerModule } from '@zxing/ngx-scanner';

import { HacketonScanner1Component } from './scanner1/hacketon-scanner1.component';
import { HacketonScanner2Component } from './scanner2/hacketon-scanner2.component';
import { HacketonScannersComponent } from './scanners/hacketon-scanners.component';

@NgModule({
  declarations: [HacketonScanner1Component, HacketonScanner2Component, HacketonScannersComponent],
  imports: [CommonModule, ZXingScannerModule],
  exports: [HacketonScannersComponent],
})
export class HacketonScannerModule {}
