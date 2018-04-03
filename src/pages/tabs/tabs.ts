import { Component, ViewChild } from '@angular/core';
import { IonicPage } from 'ionic-angular/navigation/ionic-page';
import { DataProvider, NotificationProvider } from '../../providers';
import * as firebase from 'firebase';
import { Subscription } from 'rxjs/Subscription';
import { User } from '../../models';
import { App, NavParams, Tabs } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';


@IonicPage()
@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  @ViewChild("tabs") tabs: Tabs;
  tab1Root = 'HomePage';
  tab2Root = 'RequestsPage';
  tab3Root = 'ChatListPage';
  tab4Root = 'ContestPage';
  tab5Root = 'ProfileSettingsPage';
  
  private user: User;
  private subscriptions: Subscription[];
  private selectedIndex: any;

  constructor(
    private afAuth: AngularFireAuth,
    private dataProvider: DataProvider,
    private notification: NotificationProvider,
    private navParams: NavParams,
    private app: App
  ) {
    this.selectedIndex = navParams.data.tabIndex || 0;

  }

  ionViewDidLoad() {
    
    this.subscriptions = [];
    // Subscribe to current user data on Firestore and sync.
    this.dataProvider.get('/accounts/' + this.afAuth.auth.currentUser.uid).then(ref => {
      let subscription = ref.valueChanges().subscribe((user: User) => {
        this.user = user;
        
      });
      this.subscriptions.push(subscription);
      // Initialize the push notifications (set pushToken) when user logged in.
      ref.valueChanges().take(1).subscribe((user: User) => {
        if (user.notifications) {
          
          this.notification.init();
          this.notification.setApp(this.app);
        }
      });
    }).catch(() => { });
  }

  i
}
