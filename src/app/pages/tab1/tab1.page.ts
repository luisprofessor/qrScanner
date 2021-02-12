import { Component } from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { DataLocalService } from '../../services/data-local.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

constructor(private barcodeScanner: BarcodeScanner, private dataLocal:DataLocalService) {}

opcionesSlide={

  allowSlidePrev:false,
  allowSlideNext:false
};
  ionViewDidEnter(){
   
  }
 iniciarScan(){
   this.barcodeScanner.scan().then(barcodeData => {
      
      this.dataLocal.guardarRegistro(barcodeData.format,barcodeData.text);
     }).catch(err => {
         this.dataLocal.guardarRegistro('QRCode','http://www.secsanluis.com.ar');
     });
  }
}
