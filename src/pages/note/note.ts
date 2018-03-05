import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import { DataProvider } from '../../providers/data/data';
import * as firebase from 'firebase';

@IonicPage()
@Component({
  selector: 'page-note',
  templateUrl: 'note.html',
})
export class NotePage {
  private currentUser : any;   //로그온 사용자
  private currentUserId : any;
  private users : any;  //채팅방 참여자리스트
  private txt : string;


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
      //현재 접속중인 사용자의 키 //
      this.dataProvider.getCurrentUser().snapshotChanges().take(1).subscribe(info=>{
        this.currentUser = info;
      });
      this.txt = "asdf";
      
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NotePage');
    // 채팅 참여자 목록 //
    this.dataProvider.getTestUser().snapshotChanges().subscribe(users=>{
      this.users = users;
      // 채팅 참여자 개인정보 (닉네임, 이미지)//
      this.users.forEach(user=>{
        this.dataProvider.getUser(user.payload.key).snapshotChanges().subscribe(info=>{
          user.nickname = info.payload.val().username;
          user.profileImg = info.payload.val().profileImg;
        });
      });
    });

    this.afDB.database.ref('/test/'+firebase.auth().currentUser.uid).on('value',status=>{
      if(status.child('status').val()=='receiving'){
        this.chatRequest(status.child('status_sender').val(),status.key,'receiver');
      }
    })


   
  }

  chatRequest(sender, receiver, type){
    let statusModal = this.modalCtrl.create('StatusPage',{senderKey:sender,receiverKey:receiver,type:type}, this.opts);
    statusModal.present();
    statusModal.onDidDismiss(data => {
      console.log(data.status);
      if(data.status=='chatting'){
        this.navCtrl.push('Chat1Page',{sender:data.sender})
      }
    })
  }

  
}
