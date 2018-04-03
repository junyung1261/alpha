import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App, ModalController, Platform } from 'ionic-angular';
import { AuthProvider, TranslateProvider, DataProvider } from '../../providers';
import { Subscription } from 'rxjs/Subscription';
import { AngularFireAuth } from 'angularfire2/auth';


/**
 * Generated class for the ChatListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-chat-list',
  templateUrl: 'chat-list.html',
})
export class ChatListPage {

  private subscriptions: Subscription[];
  private conversations: any[];
  private searchUser: string;
  private user;
  private userConversations: Map<string, any>;
  private partners: Map<string, any>;


  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private modalCtrl: ModalController,
    private afAuth: AngularFireAuth,
    private platform: Platform,
    private dataProvider: DataProvider,
    private translate: TranslateProvider,
    private app: App
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChatListPage');


    this.subscriptions = [];
    this.userConversations = new Map<string, any>();
    this.partners = new Map<string, any>();
    let subscription = this.dataProvider.getConversations().snapshotChanges().subscribe(conversations => {
      conversations.forEach(conversation => {
        let partnerId = conversation.key;
        
        let conversationId = conversation.payload.val().conversationId;
        let subscription = this.dataProvider.getUserConversation(this.afAuth.auth.currentUser.uid, partnerId).snapshotChanges().subscribe(userConversation => {
         
          this.userConversations.set(conversationId, userConversation.payload.val());
        })
        this.subscriptions.push(subscription);

        let subscription_ = this.dataProvider.getConversation(conversationId).valueChanges().subscribe(conversation => {
          this.addOrUpdateConversation(conversation);
          this.subscriptions.push(subscription_);
        });

        let subscription__ = this.dataProvider.getUser(partnerId).snapshotChanges().subscribe(user => {
          this.partners.set(conversationId, user);
          console.log(this.partners)
          this.subscriptions.push(subscription__);
        })
      });
    })
    this.subscriptions.push(subscription);
  }

  ionViewWillUnload() {
    // Clear the subscriptions.
    if (this.subscriptions) {
      for (let i = 0; i < this.subscriptions.length; i++) {
        this.subscriptions[i].unsubscribe();
      }
    }
  }


  private addOrUpdateConversation(conversation): void {
    
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

  // Get the last message given the messages list.
  private getLastMessage(messages): string {
    
    let message = messages[messages.length - 1];
    // Photo Message
    if (message.type == 1) {
      if (message.sender == this.afAuth.auth.currentUser.uid) {
        return this.translate.get('chats.message.sent.photo');
      } else {
        return this.translate.get('chats.message.received.photo');
      }
    } else {
      // Text Message
      if (message.sender == this.afAuth.auth.currentUser.uid) {
        return this.translate.get('chats.message.you') + message.message;
      } else {
        return message.message;
      }
    }
  }

   // Get the last date of the message given the messages list.
   private getLastMessageDate(messages): Date {
    let message = messages[messages.length - 1];
    return message.date;
  }

  // Get the number of unread messages given the conversationId, and messages list.
  private getUnreadMessages(conversationId: string, messages): number {
   
    if (!this.userConversations.get(conversationId))
      return null;
    else {
      let unread = messages.length - this.userConversations.get(conversationId).messagesRead;
      
      if (unread > 0) {
        return unread;
      } else {
        return null;
      }
    }
  }


  // Open the chat with the user given the conversationId.
  private chat(conversationId: string): void {
    if (true)
      this.app.getRootNavs()[0].push('ChatPage', { userId: this.partners.get(conversationId).key });
  }



}
