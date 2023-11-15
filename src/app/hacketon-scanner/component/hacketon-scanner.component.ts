import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { BrowserMultiFormatReader } from '@zxing/library';

@Component({
  selector: 'ish-hacketon-scanner',
  templateUrl: './hacketon-scanner.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HacketonScannerComponent implements OnInit {
  private reader = new BrowserMultiFormatReader();
  private device = this.reader.listVideoInputDevices().then((devices: any) => devices[0].deviceId);
  scannerVisible = false;
  header: HTMLElement | null = undefined;

  code?: any;

  ngOnInit(): void {
    this.header = document.querySelector('header.top');
    console.log(this.header);
  }

  toggleScanner() {
    this.scannerVisible = !this.scannerVisible;
    this.header?.classList.toggle('hide');
    this.scannerStart();
  }

  scannerStart = async () => {
    console.log('scannerStart');
    try {
      await this.reader.decodeFromVideoDevice(await this.device, 'scanner', this.scannerRead);
    } catch (e) {}
  };

  scannerStop = () => {
    this.reader.reset();
  };

  scannerRead = (res: any, _: any) => {
    if (res && res !== 16584922671032) {
      this.code = res;
      console.log('scannerRead', res);
    }
  };
}
