import { Injectable } from '@angular/core';
import { App } from 'ionic-angular';
import { LoadingProvider } from '../../providers';
import * as firebase from 'firebase';

@Injectable()
export class LogoutProvider {
  constructor(public app: App, public loadingProvider: LoadingProvider) {
    console.log("Initializing Logout Provider");
  }

  setApp(app) {
    this.app = app;
  }

  logout() {
    this.loadingProvider.show();
    // Sign the user out on Firebase
    firebase.auth().signOut().then((success) => {
      // Clear navigation stacks
      this.app.getRootNav().popToRoot().then(() => {
        this.loadingProvider.hide();
        // Restart the entire app
        document.location.href = 'index.html';
      });
    });
  }

}