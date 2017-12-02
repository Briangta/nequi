import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { BarcodeScanner,BarcodeScannerOptions} from '@ionic-native/barcode-scanner';
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  options: BarcodeScannerOptions;
  results:{};


  constructor(private barcode:BarcodeScanner,public navCtrl: NavController) {
    
  }

  async scanBarcode(){
    this.options={
      prompt:"Acerca un codigo Qr para pagar y adquirir tus Puntos"
    }
    this.results=await this.barcode.scan(this.options);

    //console.log(results);
    
  }

  async encodeData(){
    const results =await this.barcode.encode(this.barcode.Encode.TEXT_TYPE,'test');
  }
}


