import { Component,ViewChild,ElementRef } from '@angular/core';
import { IonicPage,NavController,NavParams } from 'ionic-angular';
import { BarcodeScanner,BarcodeScannerOptions} from '@ionic-native/barcode-scanner';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { ModalPage } from '../modal/modal';
import { MenuPage } from '../menu/menu';
import { PremiosPage } from '../premios/premios';
import { ModalController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';

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
  puntaje:string="0";
  carita:string="";


  constructor(private barcode:BarcodeScanner,private alertCtrl: AlertController,public navCtrl: NavController,public httpClient:HttpClient) {
    
  }

  ionViewDidLoad(){
    this.showMap();

    this.httpClient.get('http://desarrollosahora.com/nequi/index.php/Qr/loadAllQrs?idUsuario=1')
            .subscribe(data => {
              let responseData = data;
              
              if(responseData["status"]){
                var usuario=responseData["usuario"];
                this.puntaje=usuario.Puntos;
                if(parseInt(usuario.Puntos)<1000)
                {
                  this.carita="cara1.png";
                }else if(parseInt(usuario.Puntos)<2000)
                {
                  this.carita="cara2.png";
                }else
                {
                  this.carita="cara3.png";
                }

                responseData["lista"].forEach(element => {
                  console.log(element); 
                  var icono="";
                  if(element.OficialNequi==1){
                    icono="marcca-rearga.png";
                  }else{
                    icono="marcca-comercio.png";
                  }
                  this.addMarket(new google.maps.LatLng(element.Latitud,element.Longitud),this.map,element.Nombre,icono,element.Calificacion,element.OficialNequi);
                          
                });
              }
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
    this.presentConfirm(this.results["text"]);
    
    //console.log(results);
    
  }

  presentConfirm(valor) {
  let alert = this.alertCtrl.create({
    title: 'Confirmar Compra',
    message: 'Desea hacer esta compra por $80.000 en Restaurante Bogota 1  <br/>Calificar:<br/>'+
    '<img src="assets/imgs/estrellas.png"/>',
    buttons: [
      {
        text: 'Cancelar',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      },
      {
        text: 'Pagar',
        handler: () => {
         this.httpClient.get('http://desarrollosahora.com/nequi/index.php/Qr/setScore?IdUsuario=1&score='+this.results["text"])
            .subscribe(data => {
             let responseData = data;
              
              if(responseData["status"]){
                this.puntaje=responseData["lista"];
                this.navCtrl.push(HomePage);
              }
          },
                err => {
                    console.log(err);
          });
        }
      }
    ]
  });
  alert.present();
  }

  async encodeData(){
    const results =await this.barcode.encode(this.barcode.Encode.TEXT_TYPE,'test');
  }

  showMap(){
    const location=new google.maps.LatLng(4.6288839,-74.0836992);
    const mapOptions={
      center:location,
      zoom:10,
      zoomControl: false,
      mapTypeControl: false,
      scaleControl: false,
      streetViewControl: false,
    };

    this.map=new google.maps.Map(this.mapRef.nativeElement,mapOptions);
    
    //
    //this.map.setCenter(google.maps.LatLng(4.6288839,-74.08369));
  }


  openModal(titulo,calificacion,OficialNequi) {
    let obj = {titulo: titulo, calificacion: calificacion,OficialNequi:OficialNequi};
    let myModal = this.navCtrl.push(ModalPage, obj);
    //myModal.present();
  }

  abrirMenu(){
    this.navCtrl.push(MenuPage);
  }

  abrirPremios(){
    this.navCtrl.push(PremiosPage);
  }
  
  addMarket(position,map,title,icon,calificacion,OficialNequi){
    var marker= new google.maps.Marker({
      position:position,
      map:map,
      title:title,
      icon: 'assets/imgs/'+icon,
      calificacion:calificacion,
      OficialNequi:OficialNequi

    });

    marker.addListener('click', (event) =>{
          //alert(marker.test);
          this.openModal(marker.title,marker.calificacion,marker.OficialNequi);
          /*map.setZoom(8);
          map.setCenter(marker.getPosition());*/
    });

    return marker;
  }
}


