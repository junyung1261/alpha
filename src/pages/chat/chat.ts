import { Component } from '@angular/core';
import { IonicPage, ModalController, NavController } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase';


@IonicPage()
@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
})
export class ChatPage {
  opts: any = {
    showBackdrop: true,
    enableBackdropDismiss: true,
    cssClass:'mini-modal'
  }
  private user;
  constructor(
    public modalCtrl:ModalController, 
    public navCtrl: NavController, 
    public afDB: AngularFireDatabase,
    public afAuth: AngularFireAuth) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChatPage');
    this.user = this.afAuth.auth.currentUser;
  }

  openChatShake() {
    let chatShakeModal = this.modalCtrl.create('ChatShakePage', {}, this.opts);
    chatShakeModal.present();
    
  }
  openChatLocation() {
    let chatLocationModal = this.modalCtrl.create('ChatLocationPage', {}, this.opts);
    chatLocationModal.present();
  }

  openChatList() {
    this.afDB.list('/chat').update(this.user.uid, {
      lastUpdate: firebase.database['ServerValue'].TIMESTAMP,
      username: this.user.displayName,
      profileImg: this.user.photoURL,
      inTalk: false
      
    }).then((success)=> {
      this.navCtrl.push('ChatListPage',{user: this.user});
    })
   
  }
}
