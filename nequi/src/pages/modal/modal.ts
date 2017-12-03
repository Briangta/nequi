import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Ionic2RatingModule } from 'ionic2-rating';
/**
 * Generated class for the ModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
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
