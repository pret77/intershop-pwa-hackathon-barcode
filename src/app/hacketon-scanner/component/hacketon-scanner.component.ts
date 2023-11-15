import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { BrowserMultiFormatReader } from '@zxing/library';
import { first } from 'rxjs';

import { BasketService } from 'ish-core/services/basket/basket.service';
import { ProductsService } from 'ish-core/services/products/products.service';
import {switchMap} from "rxjs/operators";

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

  constructor(private prodService: ProductsService, private basket: BasketService) {}

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
    try {
      await this.reader.decodeFromVideoDevice(await this.device, 'scanner', this.scannerRead);
    } catch (e) {}
  };

  scannerStop = () => {
    this.reader.reset();
  };

  scannerRead = (res: any, _: any) => {
    if (res) {
      this.prodService
        .getProductByGtin(res.text)
        .pipe(
          first(),
          switchMap((product) =>
            this.basket.addItemsToBasket([{
                sku: product.sku,
                quantity: product.minOrderQuantity || 1,
              }]
            ).pipe(first())
          )
        )
        // eslint-disable-next-line rxjs-angular/prefer-takeuntil
        // .subscribe((x) => console.log(x));
        .subscribe();
    }
  };
}
