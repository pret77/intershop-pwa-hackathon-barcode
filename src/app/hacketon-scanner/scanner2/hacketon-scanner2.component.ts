import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { first } from 'rxjs';
import * as SDCBarcode from 'scandit-web-datacapture-barcode';
import * as SDCCore from 'scandit-web-datacapture-core';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { ProductsService } from 'ish-core/services/products/products.service';

@Component({
  selector: 'ish-hacketon-scanner-2',
  templateUrl: './hacketon-scanner.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HacketonScanner2Component implements OnInit {
  scannerVisible = false;
  header: HTMLElement | null = undefined;

  constructor(private prodService: ProductsService, private shoppingFacade: ShoppingFacade) {}

  async ngOnInit(): Promise<void> {
    this.header = document.querySelector('header.top');

    await SDCCore.configure({
      licenseKey:
        'AfHj+WFORbwJD5nD7SuWn3I14pFUOfSbdhlgqq0BUWvaTScn2UoBRrFyquxXb3CpMW2lmbpuKjFxB9ZLWmQuxvAiGDxHXICP5HxdGmA1il8xICGVRBqUuvUpNe8+M854CAa0MYNU4Ktm7aS3n4VbQq/RVAfmQX/HE73JazpZiF4Mc0Kggxnul4SqDIBrtk2pfm0sxZjgSC5lFIaLL8u49x5++ev0Cd71qnNuaKGbrfE4o90Tr57scjbOrC8VUZ+7C9pMBcFh0S0Sec74zWAu53wOklbY1iH+hr+x3/Wk1FzzyX6Sr68YECT2r8ORHvQcxFWAQb3ZVueqljp+gvPLC2mExLUCjOjbNi8hK3s4l/RcqsamjbCU+r8wVt/aG2NXtbHa5HNAIpPNiHdCgoHoanXXWgz50TC02Jp5r39g9P+y8YajMZNaxYtippRqttRZQrfcS/9Abs2AnbygIhmNCelVO1k5vGwBUfy0Fx/Z8EbWVDP6rpCQEzfCoqhHWeH4XVFywj8yP3FY3y8Ruiihu1krLPgor1OOkYFd7D5rQpfZKACwkkXDtSN8OuNNsSgYdLBj/0Q0SDAObROaHq3vcHMUNVMKxnr36mVV9ItqKBqPMDCW98hs82m5qESKRO95I3pgJ2n+v3P0rTs6z4u796lQVBXS9kEQTJ9c+7/7nfZzV9ngiQ+/G7Q28Rril9F4Ao5oT7VGsc6yKTytAfV/Eh6nDYWTuJQfrYvXZn4wM8Zw/IbIdVLreRFoi4qrjT+vQSf0b0TnGAXfqMD7/hGEiSefkk711jGa2HMrXzzLdA==',
      libraryLocation: 'https://cdn.jsdelivr.net/npm/scandit-web-datacapture-barcode@6.x/build/engine/',
      moduleLoaders: [SDCBarcode.barcodeCaptureLoader()],
    });

    const context = await SDCCore.DataCaptureContext.create();

    const camera = SDCCore.Camera.default;
    await context.setFrameSource(camera);

    const settings = new SDCBarcode.BarcodeCaptureSettings();
    settings.enableSymbologies([
      SDCBarcode.Symbology.Code128,
      SDCBarcode.Symbology.Code39,
      SDCBarcode.Symbology.QR,
      SDCBarcode.Symbology.EAN8,
      SDCBarcode.Symbology.UPCE,
      SDCBarcode.Symbology.EAN13UPCA,
    ]);

    const symbologySetting = settings.settingsForSymbology(SDCBarcode.Symbology.Code39);
    symbologySetting.activeSymbolCounts = [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];

    const barcodeCapture = await SDCBarcode.BarcodeCapture.forContext(context, settings);
    await barcodeCapture.setEnabled(false);

    barcodeCapture.addListener({
      didScan: async (barcodeCapture, session) => {
        await barcodeCapture.setEnabled(false);
        const barcode = session.newlyRecognizedBarcodes[0];
        const symbology = new SDCBarcode.SymbologyDescription(barcode.symbology);
        //alert("Scanned: "+barcode.data+" "+symbology.readableName);
        this.scannerRead(barcode.data);
        await barcodeCapture.setEnabled(true);
      },
    });

    const view = await SDCCore.DataCaptureView.forContext(context);
    view.connectToElement(document.getElementById('data-capture-view')!);
    view.addControl(new SDCCore.CameraSwitchControl());

    const barcodeCaptureOverlay = await SDCBarcode.BarcodeCaptureOverlay.withBarcodeCaptureForViewWithStyle(
      barcodeCapture,
      view,
      SDCBarcode.BarcodeCaptureOverlayStyle.Frame
    );

    const viewfinder = new SDCCore.RectangularViewfinder(
      SDCCore.RectangularViewfinderStyle.Square,
      SDCCore.RectangularViewfinderLineStyle.Light
    );
    await barcodeCaptureOverlay.setViewfinder(viewfinder);

    await camera.switchToDesiredState(SDCCore.FrameSourceState.On);
    await barcodeCapture.setEnabled(true);
  }

  toggleScanner() {
    this.scannerVisible = !this.scannerVisible;
    this.header?.classList.toggle('hide');
  }

  scannerRead = (res: string) => {
    if (res) {
      this.prodService
        .getProductByGtin(res)
        .pipe(first())
        // eslint-disable-next-line rxjs-angular/prefer-takeuntil
        .subscribe(product => {
          this.shoppingFacade.addProductToBasket(product.sku, product.minOrderQuantity || 1);
        });
    }
  };
}
