import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ZXingScannerModule } from '@zxing/ngx-scanner';

import { HacketonScannerComponent } from './component/hacketon-scanner.component';

@NgModule({
  declarations: [HacketonScannerComponent],
  imports: [CommonModule, ZXingScannerModule],
  exports: [HacketonScannerComponent],
})
export class HacketonScannerModule {}
