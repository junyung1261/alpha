import { Component } from '@angular/core';
import { IonicPage, ModalController, NavController, AlertController } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase';


@IonicPage()
@Component({
  selector: 'page-chat-v2',
  templateUrl: 'chat-v2.html',
})
export class ChatV2Page {
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

  openChatWaiting() {
    let chatIntroduceModal = this.modalCtrl.create('ChatIntroPage',{}, this.opts);
    chatIntroduceModal.present();
  }
  openChatShake() {
    let chatShakeModal = this.modalCtrl.create('ChatShakePage', {}, this.opts);
    chatShakeModal.present();
    
  }
  openChatLocation() {
    let chatLocationModal = this.modalCtrl.create('ChatLocationPage', {}, this.opts);
    chatLocationModal.present();
  }

}
