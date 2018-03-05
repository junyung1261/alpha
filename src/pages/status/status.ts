import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';


@IonicPage()
@Component({
  selector: 'page-status',
  templateUrl: 'status.html',
})
export class StatusPage {

  private sender : any;
  private receiver : any;
  private type : any;   //sender인지 receiver인지
  private explain_sender : string;
  private explain_receiver : string;
  private senderState : string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public afDB:AngularFireDatabase, public viewCtrl:ViewController) {
    this.sender = navParams.get('senderKey');
    this.receiver = navParams.get('receiverKey');
    this.type = navParams.get('type');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad StatusPage');
    // SENDER //
    if(this.type=='sender'){
      this.afDB.database.ref('/test/'+this.sender).update({
        status:'sending',
        status_receiver:this.receiver
      });
      this.afDB.database.ref('/test/'+this.receiver).update({
        status:'receiving',
        status_sender:this.sender
      });
      this.explain_sender = '상대방에게 대화를 요청중입니다.';
      this.senderState = 'sending';

      this.afDB.database.ref('/test/'+this.sender).on('value',status=>{
        if(status.child('status').val()=='denied'){
          this.explain_sender="대화요청이 거절되었습니다.";
          this.senderState = 'denied';
          this.requestInitialize();
        }
        else if(status.child('status').val()=='canceled'){
          this.viewCtrl.dismiss();
          this.requestInitialize();
        }
        else if(status.child('status').val()=='chatting'){
          let data={status:'chatting',sender:this.sender};
          this.viewCtrl.dismiss(data);
          this.requestAccept();
          console.log("송신자 입장");
        }
      });
    }

    // RECEIVER //
    else if(this.type=='receiver'){
      this.explain_receiver = '대화요청이 도착하였습니다';
      this.afDB.database.ref('/test/'+this.receiver).on('value',status=>{
      });

      this.afDB.database.ref('/test/'+this.receiver).on('value',status=>{
        if(status.child('status').val()=='denied'){
          this.viewCtrl.dismiss();
          this.requestInitialize();
        }
        else if(status.child('status').val()=='canceled'){
          this.viewCtrl.dismiss();
          this.requestInitialize();
        }
        else if(status.child('status').val()=='chatting'){
          let data={status:'chatting',sender:this.sender};
          this.viewCtrl.dismiss(data);
          this.requestAccept();
          console.log("수신자 입장");
        }
      });

    }
  }

  requestInitialize(){
    this.afDB.database.ref('/test/'+this.sender).set({
      status:'ready'
    });
    this.afDB.database.ref('/test/'+this.receiver).set({
      status:'ready'
    });
  }

  sendCancel(){
    this.viewCtrl.dismiss();
    this.requestInitialize();
  }

  requestAccept(){
    this.afDB.database.ref('/test/'+this.sender).update({
      status:'chatting'
    });
    this.afDB.database.ref('/test/'+this.receiver).update({
      status:'chatting'
    });
    
  }

  requestDeny(){
    this.afDB.database.ref('/test/'+this.sender).update({
      status:'denied'
    });
    this.afDB.database.ref('/test/'+this.receiver).update({
      status:'denied'
    });
  }
  
  requestCancel(){
    this.afDB.database.ref('/test/'+this.sender).update({
      status:'canceled'
    });
    this.afDB.database.ref('/test/'+this.receiver).update({
      status:'canceled'
    });

  }

}
