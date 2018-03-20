import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';

@IonicPage()
@Component({
  selector: 'page-chat-status',
  templateUrl: 'chat-status.html',
})
export class ChatStatusPage {

  private sender : any;
  private receiver : any;
  private status : any;
  private roomkey: any;
  private type : any;   //sender인지 receiver인지
  private explain : string;

  constructor(public navCtrl:NavController, public navParams: NavParams, public afDB:AngularFireDatabase, public viewCtrl:ViewController, public afAuth:AngularFireAuth) {
    this.sender = navParams.get('senderKey');
    this.receiver = navParams.get('receiverKey');
    this.status = navParams.get('status');
    this.type = navParams.get('type');

  }

  ionViewDidLoad() {
    // SENDER //
    if(this.type=='sender'){
      this.explain='상대방에게 대화를 요청중입니다.';
      this.status='sending';
      this.afDB.database.ref('/chat-queue/'+this.sender).on('value',status =>{
        if(status.child('status').val()=='canceled'){
          this.requestInitialize();
          let data = {'status':'canceled','roomkey':'','roomType':'','userType':''};
          this.viewCtrl.dismiss(data);
        }
        else if(status.child('status').val()=='denied'){
          this.explain='상대방이 대화요청을 거절하였습니다';
          this.status='denied';
          this.requestInitialize();
        }
        else if(status.child('status').val()=='chatting'){
          this.roomkey = status.child('roomkey').val();
          let data = {'status':'chatting','roomkey':this.roomkey,'roomType':'normal','userType':'sender'};
          this.viewCtrl.dismiss(data);          
        }
      });
    }

    // RECEIVER //
    else if(this.type=='receiver'){
      this.explain='상대방으로부터 대화요청이 도착했습니다.';

      this.afDB.database.ref('/chat-queue/'+this.receiver).on('value',status =>{
        if(status.child('status').val()=='canceled'){
          this.requestInitialize();
          let data = {'status':'canceled','roomkey':'','roomType':'','userType':''};
          this.viewCtrl.dismiss(data);
          
        }
        else if(status.child('status').val()=='denied'){
          let data = {'status':'denied','roomkey':'','roomType':'','userType':''};
          this.viewCtrl.dismiss(data);
        }
        else if(status.child('status').val()=='chatting'){          
          this.roomkey = status.child('roomkey').val();
          let data = {'status':'chatting','roomkey':this.roomkey,'roomType':'normal','userType':'receiver'};
          this.viewCtrl.dismiss(data);
        }
      });
    }
  }

  // 전송자가 요청을 취소하는경우 //
  sendingCancel(){
    this.afDB.database.ref('/chat-queue/'+this.receiver).update({
      status:'canceled'
    });
    this.afDB.database.ref('/chat-queue/'+this.sender).update({
      status:'canceled'
    });
    this.afDB.database.ref('chat-queue/'+this.receiver).child('target').remove();
    this.afDB.database.ref('chat-queue/'+this.sender).child('target').remove();
  }

  // 수신자가 요청을 거부하는경우 //
  requestDeny(){
    this.afDB.database.ref('/chat-queue/'+this.receiver).update({
      status:'denied'
    });
    this.afDB.database.ref('/chat-queue/'+this.sender).update({
      status:'denied'
    });
    this.afDB.database.ref('chat-queue/'+this.receiver).child('target').remove();
    this.afDB.database.ref('chat-queue/'+this.sender).child('target').remove();
  }

  // 큐 상태 초기화 //
  requestInitialize(){
    this.afDB.database.ref('/chat-queue/'+this.receiver).update({
      status:'ready'
    });
    this.afDB.database.ref('/chat-queue/'+this.sender).update({
      status:'ready'
    });
  }

  // 수신자가 요청거부 확인 후 닫을 경우 //
  requestClose(){
    this.requestInitialize();
    let data = {'status':'canceled','roomkey':'','roomType':'','userType':''};
    this.viewCtrl.dismiss(data);
  }

  // 수신자가 동의한경우 //
  requestAccept(){
    // 방 만들고, 룸키 저장 //
    this.afDB.database.ref('/chat-room/').push({
      user:{sender:this.sender,receiver:this.receiver}
    }).then(success=>{ 
      this.afDB.database.ref('/chat-queue/'+this.sender).update({
        status:'chatting',
        roomkey:success.key
      });
      this.afDB.database.ref('/chat-queue/'+this.receiver).update({
        status:'chatting',
        roomkey:success.key
      });
    })
  }

}
