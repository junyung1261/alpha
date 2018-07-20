import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';
import firebase from 'firebase';
import { AuthProvider, DataProvider, NotificationProvider } from '../../providers';
import { AngularFireDatabase } from 'angularfire2/database';

@IonicPage()
@Component({
  selector: 'page-loader',
  templateUrl: 'loader.html',
})
export class LoaderPage {

  constructor(private navCtrl: NavController,
    private navParams: NavParams,
    private splashScreen: SplashScreen,
    private storage: Storage,
    private authProvider: AuthProvider,
    private notification: NotificationProvider,
    private alertCtrl: AlertController,
    private afDB: AngularFireDatabase,
    private zone: NgZone) {
  }

  ionViewWillEnter() {
    // Show the splashScreen while the page to show to the user is still loading.
    
    this.storage.get('introShown').then((introShown: boolean) => {
      // Check if user is loading the app for the very first time and show the IntroPage.
      // if (introShown) {
        // Check if user is authenticated on Firebase or not.
        this.authProvider.getUser().then((user) => {
          if (!user) {
            // User is not authenticated, proceed to LoginPage.
            this.navCtrl.setRoot('LoginPage');
            this.splashScreen.hide();
          } else {
            // Check if userData is already created on Firestore.
            if(!user["emailVerified"]){
              this.navCtrl.setRoot('VerificationPage');
              this.splashScreen.hide();
            }
            else{
              this.afDB.database.ref('accounts/' + user.uid).once('value', account => {
                if(!account.exists()){
                  this.navCtrl.setRoot('ProfileCreatePage');
                  this.splashScreen.hide();
                }
                else {                 
                  if(account.val().userIdentify != 'normal'){
                    this.authProvider.logout().then(() => {                        
                      let alert = this.alertCtrl.create({
                        title: '차단회원',
                        subTitle: '부적절한 이용으로 차단된 회원입니다.',
                        buttons: ['확인']
                      });
                      alert.present();
                      alert.onDidDismiss(success => {
                        this.notification.destroy();
                        // this.loadingProvider.hide();
                        // this.app.getRootNavs()[0].setRoot('LoginPage');
                        window.location.reload();
                      });                                  
                    }).catch(() => {});
                  }

                  else{
                    let userId = account.key;
                    this.afDB.database.ref('/accounts/' + userId + '/history').push({
                      abs: '-' + new Date().getTime(),
                      date: new Date().getTime(),
                      activity: 'Logged In'
                    });                    
                    this.zone.run(() => {
                      this.navCtrl.setRoot('TabsPage');
                    });
                  }                   
                  this.splashScreen.hide();
                }
              }).catch(() => { });
            }             
          }
        })
      // } else {
      //   // User is loading the app for the very first time, show IntroPage.
      //   this.navCtrl.setRoot('IntroPage');
      //   this.splashScreen.hide();
      //   this.storage.set('introShown', true);
      // }
    }).catch(() => { });
  }


   
}
