import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import { DataProvider } from '../../providers';
import * as firebase from 'firebase';

@IonicPage()
@Component({
  selector: 'page-chat-waiting',
  templateUrl: 'chat-waiting.html',
})
export class ChatWaitingPage {
  private currentUser : any;   //로그온 사용자
  private users : any;  //채팅방 참여자리스트

  private opts: any = {
    showBackdrop: true,
    enableBackdropDismiss: false,
    cssClass:'chat-msg'
  }
  
  constructor(
    public navCtrl: NavController, public navParams: NavParams, public dataProvider:DataProvider, public afDB:AngularFireDatabase, public modalCtrl:ModalController) {
      this.currentUser = firebase.auth().currentUser.uid;
  }

  ionViewDidLoad() {
    console.log('채팅방 대기열 진입');
    // 채팅 참여자 목록 //
    this.dataProvider.getChatQueueUser().snapshotChanges().subscribe(users=>{
      this.users = users;
      // 채팅 참여자 개인정보 (닉네임, 이미지)//
      this.users.forEach(user=>{
        this.dataProvider.getUser(user.payload.key).snapshotChanges().subscribe(info=>{
          user.nickname = info.payload.val().username;
          user.profileImg = info.payload.val().profileImg;
        });
      });
    });

    // 상태 감지 ( ready : 수신대기, sending : 대화요청, receiving : 대화요청수신, cancel : 대화요청취소, deny : 대화요청 거절//
    
    // SENDING, RECEIVING //
    this.afDB.database.ref('/chat-queue/'+firebase.auth().currentUser.uid).on('value',status=>{
      if(status.child('status').val()=='sending'){
        this.viewChatProgressModal(status.key,status.child('target').val(),'sending','sender'); //(송신자, 수신자, 상태, 신분)
      }
      else if(status.child('status').val()=='receiving'){
        this.viewChatProgressModal(status.child('target').val(),status.key,'receiving','receiver');//(송신자, 수신자, 상태, 신분)
      }
     


      
         
    })
  }
  

  chatRequestSend(sender, receiver){
    this.afDB.database.ref('/chat-queue/'+sender).update({
      status:'sending',
      target:receiver
    });
    this.afDB.database.ref('/chat-queue/'+receiver).update({
      status:'receiving',
      target:sender
    });
  }

  viewChatProgressModal(sender, receiver, status, type){
    let progressModal = this.modalCtrl.create('ChatStatusPage',{senderKey:sender, receiverKey:receiver, status:status, type:type},this.opts);
    progressModal.present();
    progressModal.onDidDismiss((data)=>{
      if(data.status=='chatting'){
        console.log('채팅진입');
        this.navCtrl.push('ChatProcessingPage',{roomkey:data.roomkey,roomType:data.roomType,userType:data.userType});
      }
    })
  }
 
  chatWaitingClose(){
    this.afDB.database.ref('/chat-queue/'+firebase.auth().currentUser.uid).remove();
    this.navCtrl.pop();
  }

  
}
