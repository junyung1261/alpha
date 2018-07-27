import { Component, ViewChild } from '@angular/core';
import { IonicPage } from 'ionic-angular/navigation/ionic-page';
import { DataProvider, NotificationProvider, AuthProvider } from '../../providers';
import * as firebase from 'firebase';
import { Subscription } from 'rxjs/Subscription';
import { User } from '../../models';
import { App, NavParams, Tabs } from 'ionic-angular';
import { AngularFireDatabase } from '../../../node_modules/angularfire2/database';


@IonicPage()
@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  @ViewChild("tabs") tabs: Tabs;

  tab1Root = 'HomePage';
  tab2Root = 'UserListPage';
  tab3Root = 'ChatListPage';
  tab4Root = 'ContestPage';
  tab5Root = 'ProfilePage';
  
  
  private user: User;
  private subscriptions: Subscription[];
  private selectedIndex: any;
  private conversations: any[];
  private userConversations: Map<string, any>;

  constructor(
    private dataProvider: DataProvider,
    private authProvider: AuthProvider,
    private notification: NotificationProvider,
    private navParams: NavParams,
    private afDB: AngularFireDatabase,
    private app: App
  ) {
    this.selectedIndex = navParams.data.tabIndex || 0;

   
  }

  ionViewDidLoad() {
    


    this.userConversations = new Map<string, any>();
    
    this.subscriptions = [];
    // Subscribe to current user data on Firestore and sync.

    
    let userData = this.authProvider.getUserData();
    if (this.authProvider.getUserData().notifications) {
      this.notification.init();
      this.notification.setApp(this.app);
    }

    this.dataProvider.getUser(userData.userId).valueChanges().subscribe((user: any) => {
      this.user = user;
    })

   

    
    let conversationSubscription = this.dataProvider.getConversations().snapshotChanges().subscribe(conversations => {
      conversations.forEach(conversation => {
        let partnerId = conversation.key;
        let conversationId = conversation.payload.val().conversationId;
        let subscription  = this.dataProvider.getUserConversation(this.authProvider.getUserData().userId, partnerId).valueChanges().subscribe(userConversation => {
          this.userConversations.set(conversationId, userConversation);
        })
        this.subscriptions.push(subscription);
        let subscription_ = this.dataProvider.getConversation(conversationId).valueChanges().subscribe((conversation: any) => {
          if(conversation){
            if(conversation.users.indexOf(this.authProvider.getUserData().userId) > -1){
              this.addOrUpdateConversation(conversation);
            }else {
              this.deleteConversationById(conversationId);
              this.userConversations.delete(conversationId);
              if(this.conversations && this.conversations.length == 0) {
                this.conversations = null;
              }
            }
          }else{
            this.deleteConversationById(conversationId);
            this.userConversations.delete(conversationId);
            if(this.conversations && this.conversations.length == 0) {
              this.conversations = null;
            }
          }
          
          this.subscriptions.push(subscription_);   
        })
      })
    })
    this.subscriptions.push(conversationSubscription);
    }

  ionViewWillUnload() {
    // Clear subscriptions.
    if (this.subscriptions) {
      for (let i = 0; i < this.subscriptions.length; i++) {
        this.subscriptions[i].unsubscribe();
      }
      this.conversations = null;
    
    }
  }


  addOrUpdateConversation(conversation): void {
    if (this.conversations) {
      let index = -1;
      for (let i = 0; i < this.conversations.length; i++) {
        if (conversation.conversationId == this.conversations[i].conversationId) {
          index = i;
        }
      }
      if (index > -1) {
        this.conversations[index] = conversation;
      }
      else {
        this.conversations.push(conversation);
      }
    } else {
      this.conversations = [conversation];
    }
  }

  deleteConversationById(conversationId): void {
    if (this.conversations) {
      let index = -1;
      for (let i = 0; i < this.conversations.length; i++) {
        if (conversationId == this.conversations[i].conversationId) {
          index = i;
        }
      }
      if (index > -1) {
        this.conversations.splice(index, 1);
      }
    }
  }
   

  getRequestsReceived(): number {
    if (this.user && this.user.requestsReceived) {
      return this.user.requestsReceived.length;
    }
    return null;
  }

  getUnreadMessages(): number {    
    if (this.conversations) {
      let unread = 0;
      this.conversations.forEach(conversation => {
         if(conversation.messages && this.userConversations.get(conversation.conversationId)){
           unread +=  conversation.messages.length - this.userConversations.get(conversation.conversationId).messagesRead;
         }
      })
      if (unread > 0) {
        return unread;
      } else {
        return null;
      }
    } else {
      return null;
    }
  }



  
}
