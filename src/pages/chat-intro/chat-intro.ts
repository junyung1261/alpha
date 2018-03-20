import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { ChatWaitingPage } from '../chat-waiting/chat-waiting';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';

@IonicPage()
@Component({
  selector: 'page-chat-intro',
  templateUrl: 'chat-intro.html',
})
export class ChatIntroPage {
  private introduce : string;
  private user : string;
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl:ViewController, public afDB:AngularFireDatabase, public afAuth:AngularFireAuth) {
    this.user = afAuth.auth.currentUser.uid;
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad ChatIntroPage');

  }
  insertChatQueue() {
    this.afDB.database.ref('/chat-queue/'+this.user).set({
      status:'ready',
      introduce:this.introduce
    })
    this.viewCtrl.dismiss();
    this.navCtrl.push('ChatWaitingPage',{});
  }
  
  
}
