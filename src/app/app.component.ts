import { Component, ViewChild, NgZone } from '@angular/core';
import { Platform, Nav, Config, AlertController, IonicApp, ToastController, App } from 'ionic-angular';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { MobileAccessibility } from '@ionic-native/mobile-accessibility';
import { AngularFireAuth } from 'angularfire2/auth';
import { TranslateService } from '@ngx-translate/core';
import { TranslateProvider } from '../providers';
import { ImageLoaderConfig } from 'ionic-image-loader';
import { Keyboard } from '@ionic-native/keyboard';
import { AngularFireDatabase } from 'angularfire2/database';
import firebase from 'firebase';

@Component({
  templateUrl: 'app.html'
})

export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage: any;

  private user : any;
  private alertShown:boolean = false;

  constructor(
    private platform: Platform, 
    private statusBar: StatusBar, 
    private splashScreen: SplashScreen, 
    private mobileAccessibility: MobileAccessibility,
    private afAuth:AngularFireAuth,
    private translateService: TranslateService,
    private translate: TranslateProvider,
    private keyboard: Keyboard,
    private toastCtrl: ToastController,
    private app: App,
    private ionicApp: IonicApp,
    private imageLoader: ImageLoaderConfig,
    private afDB: AngularFireDatabase,
    private screenOrientation : ScreenOrientation

  
    ) {

    platform.ready().then(() => {

//       this.platform.pause.subscribe(() => {
//         this.afDB.database.ref('/accounts/'+this.afAuth.auth.currentUser.uid).update({
//           lastLogin: firebase.database['ServerValue'].TIMESTAMP
//         })
//       });
     

      if (this.platform.is('cordova')) { 
        this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);  
       }

      statusBar.styleDefault();
      splashScreen.hide();
      imageLoader.spinnerEnabled = false;
      imageLoader.fallbackAsPlaceholder = true;
      imageLoader.useImg = true;
      imageLoader.setMaximumCacheAge(7 * 24 * 60 * 60 * 1000);
      
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
      keyboard.disableScroll(true);
      mobileAccessibility.usePreferredTextZoom(false);
      
      translateService.setDefaultLang('en');
      translateService.use('en');
      translateService.getTranslation('en').subscribe(translations => {
      translate.setTranslations(translations);
      this.rootPage = 'LoaderPage';
      })
         

      let lastTimeBackPress = 0;
      let timePeriodToExit = 2000;

      platform.registerBackButtonAction(() => {
        let activePortal = this.ionicApp._loadingPortal.getActive() || // Close If Any Loader Active
        ionicApp._modalPortal.getActive() ||  // Close If Any Modal Active
        ionicApp._overlayPortal.getActive(); // Close If Any Overlay Active

        let nav = app.getActiveNavs()[0];   
        if (activePortal) {
            activePortal.dismiss();
        }
        else if(nav.canGoBack()){
          nav.pop();
        }else{
            //Double check to exit app
            if (new Date().getTime() - lastTimeBackPress < timePeriodToExit) {

              
                this.afDB.database.ref('/accounts/'+this.afAuth.auth.currentUser.uid).update({
                  connection:'disconnected'
                })
                platform.exitApp(); //Exit from app

            } else {
              toastCtrl.create({
                message: "Press back button again to exit",
                duration: 2000,
                position: 'bottom'
              }).present();
              lastTimeBackPress = new Date().getTime();
            }
        }            
      });
      
      


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
      translateService.setDefaultLang('en');
      translateService.use('en');
      translateService.getTranslation('en').subscribe(translations => {
      translate.setTranslations(translations);
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
