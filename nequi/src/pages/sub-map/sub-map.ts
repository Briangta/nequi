import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HomePage } from '../home/home';
/**
  Este es un controlador generico, el core (y comentado esta en home.ts)
 */

@IonicPage()
@Component({
  selector: 'page-sub-map',
  templateUrl: 'sub-map.html',
})
export class SubMapPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SubMapPage');
  }

  cambiarPantalla(){
    this.navCtrl.push(HomePage);
  }

}
