import { Component, ViewChild } from '@angular/core';
import { Platform, Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { MobileAccessibility } from '@ionic-native/mobile-accessibility';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase';

@Component({
  templateUrl: 'app.html'
})

export class MyApp {
  @ViewChild(Nav) nav: Nav;
  private user : any;

  constructor(
    private platform: Platform, 
    private statusBar: StatusBar, 
    private splashScreen: SplashScreen, 
    private mobileAccessibility: MobileAccessibility,
    private afAuth:AngularFireAuth) {

    platform.ready().then(() => {
      statusBar.styleDefault();
      splashScreen.hide();
      mobileAccessibility.usePreferredTextZoom(false);
      this.afAuth.authState.subscribe(user => {
        if (!user) {
          this.nav.setRoot('LoginPage');
        }
        else {
          if (true) {
            if (true) {
              //user["emailVerified"]
              //Goto Home Page.
             
              this.nav.setRoot('TabsPage', { animate: false });
              this.user = firebase.auth().currentUser;
              
           } //else {
            //   //Goto Verification Page.
              
            //   this.nav.setRoot('VerificationPage', { animate: false });
            // }
          }
        }
  
      });
    });
  }
}
