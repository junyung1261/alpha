import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular/navigation/ionic-page';
import { DataProvider, NotificationProvider } from '../../providers';
import * as firebase from 'firebase';
import { Subscription } from 'rxjs/Subscription';
import { User } from '../../models';
import { App } from 'ionic-angular';


@IonicPage()
@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = 'HomePage';
  tab2Root = 'ChatPage';
  tab3Root = 'NotePage';
  tab4Root = 'ContestPage';
  tab5Root = 'ProfilePage';
  
  private user: User;
  private subscriptions: Subscription[];

  constructor(
    private dataProvider: DataProvider,
    private notification: NotificationProvider,
    private app: App
  ) {
    

  }

  ionViewDidLoad() {
    this.subscriptions = [];
    // Subscribe to current user data on Firestore and sync.
    this.dataProvider.get('accounts/' + firebase.auth().currentUser.uid).then(ref => {
      let subscription = ref.valueChanges().subscribe((user: User) => {
        this.user = user;
        
      });
      this.subscriptions.push(subscription);
      // Initialize the push notifications (set pushToken) when user logged in.
      ref.valueChanges().take(1).subscribe((user: User) => {
        if (user.notifications) {
          console.log('sdfasdfasdf');
          this.notification.init();
          this.notification.setApp(this.app);
        }
      });
    }).catch(() => { });
  }
}
