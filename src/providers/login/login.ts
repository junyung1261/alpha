import { Injectable } from '@angular/core';
import { NavController, App } from 'ionic-angular';
import { LoadingProvider, AlertProvider } from '../';
import { AngularFireAuth } from 'angularfire2/auth';

@Injectable()
export class LoginProvider {
  
  private navCtrl: NavController;

  constructor(public loadingProvider: LoadingProvider, public alertProvider: AlertProvider, public afAuth: AngularFireAuth, public appCtrl: App) {
    console.log("Initializing Login Provider");
  }

  setNavController(navCtrl) {
    this.navCtrl = navCtrl;
  }
  // Anonymous Login, after successful authentication, triggers firebase.auth().onAuthStateChanged((user) on top and
  // redirects the user to its respective views. Make sure to enable Anonymous login on Firebase app authentication console.
  // Login on Firebase given the email and password.
  emailLogin(email, password) {
    this.loadingProvider.show();
    this.afAuth.auth.signInWithEmailAndPassword(email, password)
      .then((success) => {
        this.loadingProvider.hide();
       
      })
      .catch((error) => {
        this.loadingProvider.hide();
        let code = error["code"];
        this.alertProvider.showErrorMessage(code);
      });
  }

  // Register user on Firebase given the email and password.
  register(email, password, nickname) {
    this.loadingProvider.show();
    this.afAuth.auth.createUserWithEmailAndPassword(email, password)
      .then((success) => {
        success.updateProfile({
          displayName: nickname
        }).then((success) => {
          this.loadingProvider.hide();
          this.navCtrl.setRoot('VerificationPage');
        });
        
      })
      .catch((error) => {
        this.loadingProvider.hide();
        let code = error["code"];
        this.alertProvider.showErrorMessage(code);
      });
  }

  // Send Password Reset Email to the user.
  sendPasswordReset(email) {
    this.loadingProvider.show();
    this.afAuth.auth.sendPasswordResetEmail(email)
      .then((success) => {
        this.loadingProvider.hide();
        this.alertProvider.showPasswordResetMessage(email);
      })
      .catch((error) => {
        this.loadingProvider.hide();
        let code = error["code"];
        this.alertProvider.showErrorMessage(code);
      });
  }

}