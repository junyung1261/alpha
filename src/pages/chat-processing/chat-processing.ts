import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Content } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import * as firebase from 'firebase';
import { DataProvider } from '../../providers';
import { AngularFireAuth } from 'angularfire2/auth';
import { ElementRef } from '@angular/core';


@IonicPage()
@Component({
  selector: 'page-chat-processing',
  templateUrl: 'chat-processing.html',
})
export class ChatProcessingPage {
  
  @ViewChild(Content) content: Content;

  data = { type:'', nickname:'', message:'' };
  chats = [];
  roomkey:string;
  roomType:string;
  userType:string;
  nickname:string;
  offStatus:boolean = false;

  // 채팅 방을 waiting단에서 만들어도 되나, 코드최적화를 위해서 여기서 푸시함 //
  constructor(public navCtrl: NavController, public navParams: NavParams, public afDB:AngularFireDatabase, public afAuth: AngularFireAuth) {

    // 요청자(SENDER)의  KEY가 방의 KEY로 ! //
    this.roomkey = this.navParams.get("roomkey") as string;
    this.roomType = this.navParams.get("roomType") as string;
    this.userType = this.navParams.get("userType") as string;
    this.nickname = this.afAuth.auth.currentUser.displayName;
    this.data.type = 'message';
    this.data.nickname = this.nickname;
    
  }
  ionViewDidLoad() {
    // 참가자 두명 세팅 //
    let joinData = this.afDB.database.ref('chat-room/'+this.roomkey+'/chats').push();
    joinData.set({
      type:'join',
      user:this.nickname,
      message:this.nickname+'님이 대화방에 참가하셨습니다.',
      sendDate:Date()
    });

    // 방 타입 세팅 (1:대화방, 2:흔들기, 3: 위치) //
    // 방 생성 시 업데이트 두번일어남 -> 유저가 두명이기때문에 -> 그냥 둠.. //
    this.afDB.database.ref('chat-room/'+this.roomkey+"/").update({
      roomType:this.roomType
    });

    this.data.message = '';

    this.afDB.database.ref('chat-room/'+this.roomkey+'/chats').on('value', resp => {
      this.chats = [];
      this.chats = snapshotToArray(resp);
      setTimeout(() => {
        if(this.offStatus === false) {
          this.content.scrollToBottom(300);
        }
      }, 1000);
    });

    // 대화방 참여인원 모두 나갔을 때 채팅방 제거 //
    this.afDB.database.ref('chat-room/'+this.roomkey+'/user/').on('value',status=>{
      if(status.numChildren()==0){
        this.afDB.database.ref('chat-room/'+this.roomkey).remove();
      }
    })
    

  }
  sendMessage() {
    let newData = this.afDB.database.ref('chat-room/'+this.roomkey+'/chats').push();
    newData.set({
      type:this.data.type,
      user:this.data.nickname,
      message:this.data.message,
      sendDate:Date()
    });
    this.data.message = '';
  }

  exitChat() {
    let exitData = this.afDB.database.ref('chat-room/'+this.roomkey+'/chats').push();
    exitData.set({
      type:'exit',
      user:this.nickname,
      message:this.nickname+' 님이 대화방을 나갔습니다.',
      sendDate:Date()
    });
    this.offStatus = true;
    
    
    // 대화방 나갔을 경우 대기열 큐 초기화 //
    this.afDB.database.ref('chat-queue/'+this.afAuth.auth.currentUser.uid).update({
      status:'ready',
      target:'',
      roomkey:''
    });

    this.afDB.database.ref('chat-room/'+this.roomkey+'/user/'+this.userType).remove();
    this.navCtrl.pop();
    
    
  }

}
export const snapshotToArray = snapshot => {
  let returnArr = [];

  snapshot.forEach(childSnapshot => {
      let item = childSnapshot.val();
      item.key = childSnapshot.key;
      returnArr.push(item);
  });

  return returnArr;
};
