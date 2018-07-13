import { Injectable } from '@angular/core';
import { TranslateProvider, DataProvider } from '../';
import { AngularFireAuth } from 'angularfire2/auth';
import firebase from 'firebase';
import { Subscription } from 'rxjs';
import { AngularFireDatabase } from '../../../node_modules/angularfire2/database';


@Injectable()
export class AuthProvider {
  
  private fbSubscription: Subscription;
  private fsSubscription: Subscription;
  private user: any;

  constructor(
              private translate: TranslateProvider,
              private dataProvider: DataProvider,
              private afDB: AngularFireDatabase,
              private afAuth: AngularFireAuth, 
              ) {

    console.log("Initializing AuthProvider");
  }


  getUserData(): any {
    return this.user;
  }

  getUser(): Promise<firebase.User> {
    return new Promise((resolve, reject) => {
      if (this.fbSubscription) {
        this.fbSubscription.unsubscribe();
      }
      this.fbSubscription = this.afAuth.authState.subscribe((user: firebase.User) => {
        
        // User is logged in on Firebase.
        if (user) {
          let userId = user.uid;
          this.dataProvider.get('accounts/' + user.uid).then(ref => {
            if (this.fsSubscription) {
              this.fsSubscription.unsubscribe();
            }
            
            // Update userData variable from Firestore.
            this.fsSubscription = ref.valueChanges().subscribe((user: any) => {
              this.user = user;
              this.user.userId = userId;
              
            });
            
          }).catch(() => {
            reject();
          });
        }
        resolve(user);
      });
    });
  }

  
  // Anonymous Login, after successful authentication, triggers firebase.auth().onAuthStateChanged((user) on top and
  // redirects the user to its respective views. Make sure to enable Anonymous login on Firebase app authentication console.
  // Login on Firebase given the email and password.
  loginWithEmail(email: string, password: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.afAuth.auth.signInWithEmailAndPassword(email, password).then(res => {
        resolve(res);
      }).catch(err => {
        reject(err);
      });
    });
  }

  // Register user on Firebase given the email and password.
  registerWithEmail(email: string, password: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.afAuth.auth.createUserWithEmailAndPassword(email, password).then(res => {
        resolve(res);
      }).catch(err => {
        reject(err);
      });
    });
  }

  // // Send Password Reset Email to the user.
  // sendPasswordReset(email) {
  //   this.loadingProvider.show();
  //   this.afAuth.auth.sendPasswordResetEmail(email)
  //     .then((success) => {
  //       this.loadingProvider.hide();
  //       this.alertProvider.showPasswordResetMessage(email);
  //     })
  //     .catch((error) => {
  //       this.loadingProvider.hide();
  //       let code = error["code"];
  //       this.alertProvider.showErrorMessage(code);
  //     });
  // }

  logout(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.afDB.database.ref('accounts/' + this.afAuth.auth.currentUser.uid + '/history').push({
        abs: '-' + new Date().getTime(),
        date: new Date().getTime(),
        activity: 'Logged out'
      });

      this.afAuth.auth.signOut().then(() => {
        // this.facebook.logout();
        // this.googlePlus.logout();
        // this.twitterConnect.logout();
        

        resolve();
      }).catch(() => {
        reject();
      });
    });
  }

}