import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { BrowserMultiFormatReader } from '@zxing/library';
import { first } from 'rxjs';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { ProductsService } from 'ish-core/services/products/products.service';

@Component({
  selector: 'ish-hackathon-scanner-zingx',
  templateUrl: './hackathon-scanner-zingx.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HackathonScannerZingxComponent implements OnInit, OnDestroy {
  private reader = new BrowserMultiFormatReader();
  scannerVisible = false;
  header: HTMLElement | null = undefined;

  constructor(private prodService: ProductsService, private shoppingFacade: ShoppingFacade) {}

  ngOnInit(): void {
    this.reader.timeBetweenDecodingAttempts = 1000;
    this.header = document.querySelector('header.top');
  }

  ngOnDestroy(): void {
    console.log('destroy');
  }

  toggleScanner() {
    this.scannerVisible = !this.scannerVisible;
    this.header?.classList.toggle('hide');

    if (this.scannerVisible) {
      this.scannerStart();
    } else {
      this.scannerStop();
    }
  }

  scannerStart = async () => {
    try {
      const device = await this.reader.listVideoInputDevices().then((devices: any) => devices[2].deviceId);
      await this.reader.decodeFromVideoDevice(device, 'scanner', this.scannerRead);
    } catch (e) {}
  };

  scannerStop = () => {
    this.reader.reset();
  };

  scannerRead = (res: any, _: any) => {
    if (res) {
      this.prodService
        .getProductByGtin(res.text)
        .pipe(first())
        // eslint-disable-next-line rxjs-angular/prefer-takeuntil
        .subscribe(product => {
          this.shoppingFacade.addProductToBasket(product.sku, product.minOrderQuantity || 1);
        });
    }
  };
}