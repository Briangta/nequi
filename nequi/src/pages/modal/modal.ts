import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Ionic2RatingModule } from 'ionic2-rating';

/**
  Este es un controlador generico, el core (y comentado esta en home.ts)
 */

@IonicPage()
@Component({
  selector: 'page-modal',
  templateUrl: 'modal.html',
})
export class ModalPage {
  titulo: string = this.navParams.get('titulo');
  calificacion: string = this.navParams.get('calificacion');
  OficialNequi: string = this.navParams.get('OficialNequi');

  

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    
    //dependiendo si es oficinaNequi o es un comercio asigna el mensaje para la vista
    if(this.OficialNequi=="1"){
      this.OficialNequi="Recarga";
    }else{
      this.OficialNequi="Comercio";
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ModalPage');
  }

}
