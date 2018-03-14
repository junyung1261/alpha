import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import { DataProvider } from '../../providers/data/data';
import * as firebase from 'firebase';

@IonicPage()
@Component({
  selector: 'page-chat-waiting',
  templateUrl: 'chat-waiting.html',
})
export class ChatWaitingPage {
  private currentUser : any;   //로그온 사용자
  private currentUserId : any;
  private users : any;  //채팅방 참여자리스트
  private introduce : string; //채팅방 인사말

  private opts: any = {
    showBackdrop: true,
    enableBackdropDismiss: false,
    cssClass:'chat-msg'
  }
  
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public dataProvider:DataProvider,
    public afDB:AngularFireDatabase, 
    public modalCtrl:ModalController) {
      
      
      this.currentUser = firebase.auth().currentUser.uid;
      
      //입장시 채팅대기열 추가//
      this.afDB.database.ref('/chat-queue/'+firebase.auth().currentUser.uid).set({
        status:'ready',
        introduce:this.navParams.get('introduce')
      });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NotePage');
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

    this.afDB.database.ref('/chat-queue/'+firebase.auth().currentUser.uid).on('value',status=>{
      if(status.child('status').val()=='receiving'){
        this.chatRequest(status.child('status_sender').val(),status.key,'receiver');
      }
    })
  }
  ionViewWillLeave(){
    this.afDB.database.ref('/chat-queue/'+firebase.auth().currentUser.uid).remove();
  }

  chatRequest(sender, receiver, type){
    let statusModal = this.modalCtrl.create('ChatStatusPage',{senderKey:sender,receiverKey:receiver,type:type}, this.opts);
    statusModal.present();
    statusModal.onDidDismiss(data => {
      if(data.status=='chatting'){
        this.navCtrl.push('ChatProcessingPage',{sender:data.sender,roomtype:'normal'});
      }
    })
  }

  chatWaitingClose(){
    this.afDB.database.ref('/chat-queue/'+firebase.auth().currentUser.uid).remove();
    this.navCtrl.pop();
  }

  noteRequest(requestTarget){
    let noteRequestModal = this.modalCtrl.create('NoteRequestPage',{target:requestTarget},this.opts);
    noteRequestModal.present();
  }
  
}
