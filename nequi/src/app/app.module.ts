import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { BarcodeScanner} from '@ionic-native/barcode-scanner';
import { MyApp } from './app.component';

import { HomePage } from '../pages/home/home';
import { SubMapPage } from '../pages/sub-map/sub-map';
import { MenuPage } from '../pages/menu/menu';
import { PremiosPage } from '../pages/premios/premios';

import { StartPage } from '../pages/start/start';
import { ModalPage } from '../pages/modal/modal';
import { HttpClientModule } from '@angular/common/http';
@NgModule({
  declarations: [
    MyApp,
    StartPage,
    HomePage,
    ModalPage,
    SubMapPage,
    MenuPage,
    PremiosPage,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    StartPage,
    HomePage,
    ModalPage,SubMapPage,
    MenuPage,
    PremiosPage,
    
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    BarcodeScanner
  ]
})
export class AppModule {}
