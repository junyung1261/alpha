import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { environment } from "../../src/environments/environment"

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { MobileAccessibility } from '@ionic-native/mobile-accessibility';
import { AngularFireDatabaseModule } from 'angularfire2/database';


import { LoadingProvider } from '../providers/loading/loading';
import { LoginProvider } from '../providers/auth/login';
import { LogoutProvider } from '../providers/auth/logout';
import { AlertProvider } from '../providers/alert/alert';
import { DataProvider } from '../providers/data/data';
import { ImageProvider } from '../providers/data/image';
//import { RequestProvider } from '../providers/data/request';


import { Camera } from '@ionic-native/camera';


@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    StatusBar,
    SplashScreen,
    MobileAccessibility,
    {provide: ErrorHandler, useClass: IonicErrorHandler},

    LoadingProvider,
    LoginProvider,
    LogoutProvider,
    AlertProvider,
    DataProvider,
    ImageProvider,


    Camera
  ]
})
export class AppModule {}
