import { Component, ViewChild, NgZone } from '@angular/core';
import { Platform, Nav, Config, Tabs, App } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { MobileAccessibility } from '@ionic-native/mobile-accessibility';
import { AngularFireAuth } from 'angularfire2/auth';
import { TranslateService } from '@ngx-translate/core';
import * as firebase from 'firebase';
import { FCM } from '@ionic-native/fcm';
import { TranslateProvider } from '../providers';
import { timer } from 'rxjs/observable/timer';

@Component({
  templateUrl: 'app.html'
})

export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage: any;

  private user : any;

  constructor(
    private platform: Platform, 
    private statusBar: StatusBar, 
    private splashScreen: SplashScreen, 
    private mobileAccessibility: MobileAccessibility,
    private afAuth:AngularFireAuth,
    private translateService: TranslateService,
    private translate: TranslateProvider,
    private config: Config,
    private fcm: FCM,
    private zone: NgZone,
    private app: App) {

    platform.ready().then(() => {
      statusBar.styleDefault();
      splashScreen.hide();

      // if(platform.is('cordova')){
      //   fcm.subscribeToTopic('test');
      //   fcm.getToken().then(token => {
      //     console.log(token)
      //   })
      //   fcm.onNotification().subscribe(data=>{
      //     if(data.wasTapped){
      //       this.nav.setRoot('TabsPage', { animate: false, tabIndex: 3 });   
      //       console.log("Received in background");
      //     } else {
      //       console.log("Received in foreground");
      //     };
      //   })
      //   fcm.onTokenRefresh().subscribe(token=>{
      //     console.log(token);
      //   });
        
      // }
     
      mobileAccessibility.usePreferredTextZoom(false);
      
      this.translateService.setDefaultLang('en');
      this.translateService.use('en');
      this.translateService.getTranslation('en').subscribe(translations => {
        this.translate.setTranslations(translations);
        this.rootPage = 'LoaderPage';
      })
      
      


      // this.afAuth.authState.subscribe(user => {
      //   if (!user) {
      //     this.nav.setRoot('LoginPage');
      //   }
      //   else {
      //     if (true) {
      //       if (true) {
      //         //user["emailVerified"]
      //         //Goto Home Page.
      //         this.zone.run(()=> {
      //           this.nav.setRoot('TabsPage', { animate: false });    
      //         })
                      
              
      //      } //else {
      //       //   //Goto Verification Page.
              
      //       //   this.nav.setRoot('VerificationPage', { animate: false });
      //       // }
      //     }
      //   }
  
      // });
    }).catch(()=> {
      this.translateService.setDefaultLang('en');
      this.translateService.use('en');
      this.translateService.getTranslation('en').subscribe(translations => {
        this.translate.setTranslations(translations);
        this.rootPage = 'LoaderPage';
      })
    });
    
  }

  // initTranslate() {
  //   // Set the default language for translation strings, and the current language.
  //   this.translate.setDefaultLang('en');
  //   const browserLang = this.translate.getBrowserLang();

  //   if (browserLang) {
  //     if (browserLang === 'zh') {
  //       const browserCultureLang = this.translate.getBrowserCultureLang();

  //       if (browserCultureLang.match(/-CN|CHS|Hans/i)) {
  //         this.translate.use('zh-cmn-Hans');
  //       } else if (browserCultureLang.match(/-TW|CHT|Hant/i)) {
  //         this.translate.use('zh-cmn-Hant');
  //       }
  //     } else {
  //       this.translate.use(this.translate.getBrowserLang());
  //     }
  //   } else {
  //     this.translate.use('en'); // Set your language here
  //   }

  //   this.translate.get(['BACK_BUTTON_TEXT']).subscribe(values => {
  //     this.config.set('ios', 'backButtonText', values.BACK_BUTTON_TEXT);
  //   });
  // }

}
