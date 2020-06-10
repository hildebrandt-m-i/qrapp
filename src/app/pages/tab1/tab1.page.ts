import { Component } from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { DataLocalService } from '../../services/data-local.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  slideOpts = {
    allowSlidePrev: false,
    allowSlideNext: false
  };

  constructor(
    private barcodeScanner: BarcodeScanner,
    private dataLocal: DataLocalService
  ) {}

  scan() {
    this.barcodeScanner.scan().then( barcodeData => {
      if ( !barcodeData.cancelled && barcodeData.format === 'QR_CODE' ) {
        this.dataLocal.saveRegister( barcodeData.format , barcodeData.text );
      }
    }).catch(err => {
        this.dataLocal.saveRegister( 'QRCode' , 'geo:-32.777746015619826,-60.73453202685245' );
    });
  }

}
