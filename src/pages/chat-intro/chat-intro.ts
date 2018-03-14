import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { ChatWaitingPage } from '../chat-waiting/chat-waiting';

@IonicPage()
@Component({
  selector: 'page-chat-intro',
  templateUrl: 'chat-intro.html',
})
export class ChatIntroPage {
  private introduce : string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl:ViewController) {
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad ChatIntroPage');
  }
  viewChatWaiting() {
    this.viewCtrl.dismiss();
    this.navCtrl.push('ChatWaitingPage',{introduce:this.introduce});
  }
  
  
}
