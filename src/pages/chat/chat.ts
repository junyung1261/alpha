import { Component } from '@angular/core';
import { IonicPage, ModalController, NavController, AlertController } from 'ionic-angular';
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
    cssClass:'chat-loading'
  }
  private user;
  constructor(
    public modalCtrl:ModalController, 
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public afDB: AngularFireDatabase,
    public afAuth: AngularFireAuth) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChatPage');
    this.user = this.afAuth.auth.currentUser;
  }

  openChatRandom() {
    let chatRandomModal = this.modalCtrl.create('ChatRandomPage');
    chatRandomModal.present();
  }
  openChatShake() {
    let chatShakeModal = this.modalCtrl.create('ChatShakePage', {}, this.opts);
    chatShakeModal.present();
    
  }
  openChatLocation() {
    let chatLocationModal = this.modalCtrl.create('ChatLocationPage', {}, this.opts);
    chatLocationModal.present();
  }

  presentPrompt() {
    let alert = this.alertCtrl.create({
      title: '인사말',
      subTitle: '대화방 인사말을 적어주세요. 대화방 목록에 노출됩니다.',
      inputs: [
        {
          name: 'chatRommIntro',
          placeholder: '대화방 소개',
          type: 'text'
        }
      ],
      buttons: [
        {
          text: '대화하기',
          handler: data => {
            console.log(data);
            this.openChatList();
          }
        },
        {
          text: '취소',
          role: 'cancel'
        }
      ]
    });
    alert.present();
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
