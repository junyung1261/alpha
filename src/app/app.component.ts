import { Component, ViewChild } from '@angular/core';
import { Platform, Nav, Config } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { MobileAccessibility } from '@ionic-native/mobile-accessibility';
import { AngularFireAuth } from 'angularfire2/auth';
import { TranslateService } from '@ngx-translate/core';
import * as firebase from 'firebase';
import { timer } from 'rxjs/observable/timer';

@Component({
  templateUrl: 'app.html'
})

export class MyApp {
  @ViewChild(Nav) nav: Nav;
  private user : any;
  showSplash = true;

  constructor(
    private platform: Platform, 
    private statusBar: StatusBar, 
    private splashScreen: SplashScreen, 
    private mobileAccessibility: MobileAccessibility,
    private afAuth:AngularFireAuth,
    private translate: TranslateService,
    private config: Config) {

    platform.ready().then(() => {
      statusBar.styleDefault();
      splashScreen.hide();
      mobileAccessibility.usePreferredTextZoom(false);
      timer(3000).subscribe(() => this.showSplash = false)

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
    this.initTranslate();
  }

  initTranslate() {
    // Set the default language for translation strings, and the current language.
    this.translate.setDefaultLang('en');
    const browserLang = this.translate.getBrowserLang();

    if (browserLang) {
      if (browserLang === 'zh') {
        const browserCultureLang = this.translate.getBrowserCultureLang();

        if (browserCultureLang.match(/-CN|CHS|Hans/i)) {
          this.translate.use('zh-cmn-Hans');
        } else if (browserCultureLang.match(/-TW|CHT|Hant/i)) {
          this.translate.use('zh-cmn-Hant');
        }
      } else {
        this.translate.use(this.translate.getBrowserLang());
      }
    } else {
      this.translate.use('en'); // Set your language here
    }

    this.translate.get(['BACK_BUTTON_TEXT']).subscribe(values => {
      this.config.set('ios', 'backButtonText', values.BACK_BUTTON_TEXT);
    });
  }

}
