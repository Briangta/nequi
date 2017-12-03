import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SubMapPage } from '../sub-map/sub-map';

/**
  Este es un controlador generico, el core (y comentado esta en home.ts)
 */

@IonicPage()
@Component({
  selector: 'page-start',
  templateUrl: 'start.html',
})
export class StartPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad StartPage');
  }

  cambiarPantalla(){
    this.navCtrl.push(SubMapPage);
  }


}
