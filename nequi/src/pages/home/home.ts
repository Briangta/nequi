import { Component,ViewChild,ElementRef } from '@angular/core';
import { IonicPage,NavController,NavParams } from 'ionic-angular';
import { BarcodeScanner,BarcodeScannerOptions} from '@ionic-native/barcode-scanner';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';

declare var google:any;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  service: Observable<any>;

  @ViewChild('map') mapRef:ElementRef;
  map:any;
  options: BarcodeScannerOptions;
  results:{};
  puntaje:string;


  constructor(private barcode:BarcodeScanner,public navCtrl: NavController,public httpClient:HttpClient) {
    
  }

  ionViewDidLoad(){
    this.showMap();

    this.httpClient.get('http://desarrollosahora.com/nequi/index.php/Qr/loadAllQrs?idUsuario=1')
            .subscribe(data => {
              let responseData = data;
              
              if(responseData["status"]){
                var usuario=responseData["usuario"];
                this.puntaje=usuario.Puntos;


                responseData["lista"].forEach(element => {

                  this.addMarket(new google.maps.LatLng(element.latitud,element.longitud),this.map,"test");
                  //console.log();         
                });
              }
              

              
              /*if(responseData.status){
                data=>lista.forEach(element => {
                  
                });
              }*/
       },
            err => {
                console.log(err);
      });
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

  showMap(){
    const location=new google.maps.LatLng(4.6288839,-74.0836992);
    const mapOptions={
      center:location,
      zoom:10
    };

    this.map=new google.maps.Map(this.mapRef.nativeElement,mapOptions);
    
    //
    //this.map.setCenter(google.maps.LatLng(4.6288839,-74.08369));
  }

  addMarket(position,map,title){
    return new google.maps.Marker({
      position:position,
      map:map,
      title:title,
      icon: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png'
    })
  }
}


