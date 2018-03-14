import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, Platform } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';

@IonicPage()
@Component({
  selector: 'page-chat-status',
  templateUrl: 'chat-status.html',
})
export class ChatStatusPage {

  private sender : any;
  private receiver : any;
  private type : any;   //sender인지 receiver인지
  private explain_sender : string;
  private explain_receiver : string;
  private senderState : string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public afDB:AngularFireDatabase, public viewCtrl:ViewController, public platform : Platform) {
    this.sender = navParams.get('senderKey');
    this.receiver = navParams.get('receiverKey');
    this.type = navParams.get('type');
  }

  ionViewWillLeave(){

  }

  ionViewDidLoad() {
    // 모달상태에서 백버튼누르기 -> 초기화 //
    // this.platform.registerBackButtonAction(() => {
    //   let data={status:'canceled'};
    //       this.viewCtrl.dismiss(data);
    //       this.requestInitialize();
    // },1);

    // SENDER //
    if(this.type=='sender'){
      this.afDB.database.ref('/chat-queue/'+this.sender).update({
        status:'sending',
        status_receiver:this.receiver
      });
      this.afDB.database.ref('/chat-queue/'+this.receiver).update({
        status:'receiving',
        status_sender:this.sender
      });
      this.explain_sender = '상대방에게 대화를 요청중입니다.';
      this.senderState = 'sending';

      this.afDB.database.ref('/chat-queue/'+this.sender).on('value',status=>{
        if(status.child('status').val()=='denied'){
          this.explain_sender="대화요청이 거절되었습니다.";
          this.senderState = 'denied';
          this.requestInitialize();
        }
        else if(status.child('status').val()=='canceled'){
          let data={status:'canceled'};
          this.viewCtrl.dismiss(data);
          this.requestInitialize();
        }
        else if(status.child('status').val()=='chatting'){
          let data={status:'chatting',sender:this.sender};
          this.viewCtrl.dismiss(data);
          this.requestAccept();
        }
      });
    }

    // RECEIVER //
    else if(this.type=='receiver'){
      this.explain_receiver = '대화요청이 도착하였습니다';

      this.afDB.database.ref('/chat-queue/'+this.receiver).on('value',status=>{
        if(status.child('status').val()=='denied'){
          let data={status:'denied'};
          this.viewCtrl.dismiss(data);
          this.requestInitialize();
        }
        else if(status.child('status').val()=='canceled'){
          let data={status:'canceled'};
          this.viewCtrl.dismiss(data);
          this.requestInitialize();
        }
        else if(status.child('status').val()=='chatting'){
          let data={status:'chatting',sender:this.sender};
          this.viewCtrl.dismiss(data);
          this.requestAccept();
        }
      });

    }
  }

  requestInitialize(){
    this.afDB.database.ref('/chat-queue/'+this.sender).update({
      status:'ready',
      status_sender:'',
      status_receiver:''
    });
    this.afDB.database.ref('/chat-queue/'+this.receiver).update({
      status:'ready',
      status_sender:'',
      status_receiver:''
    });
  }

  sendCancel(){
    let data={status:'canceled'};
    this.viewCtrl.dismiss(data);
    this.requestInitialize();
  }

  requestAccept(){
    this.afDB.database.ref('/chat-queue/'+this.sender).update({
      status:'chatting'
    });
    this.afDB.database.ref('/chat-queue/'+this.receiver).update({
      status:'chatting'
    });
    
  }

  requestDeny(){
    this.afDB.database.ref('/chat-queue/'+this.sender).update({
      status:'denied'
    });
    this.afDB.database.ref('/chat-queue/'+this.receiver).update({
      status:'denied'
    });
  }
  
  requestCancel(){
    this.afDB.database.ref('/chat-queue/'+this.sender).update({
      status:'canceled'
    });
    this.afDB.database.ref('/chat-queue/'+this.receiver).update({
      status:'canceled'
    });

  }

}
