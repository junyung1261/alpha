import { Component } from '@angular/core';
import { IonicPage, ModalController } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
})
export class ChatPage {

  constructor(public modalCtrl:ModalController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChatPage');
  }

  openChatShake() {
    let chatShakeModal = this.modalCtrl.create('ChatShakePage');
    chatShakeModal.present();
    
  }
  openChatLocation() {
    let chatLocationModal = this.modalCtrl.create('ChatLocationPage');
    chatLocationModal.present();
  }

}
