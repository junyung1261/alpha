import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import { DataProvider } from '../../providers/data/data';
import * as firebase from 'firebase';
import { ImageUploadContest } from "../../components/image-upload-contest/image-upload-contest";

@IonicPage()
@Component({
  selector: 'page-contest-apply',
  templateUrl: 'contest-apply.html',
})
export class ContestApplyPage {
  @ViewChild(ImageUploadContest) imageUploadContest : ImageUploadContest;

  private user;

  private checkOverlap;   //중복검사 플래그
  private checkApplierCount;  //인원검사 플래그

  private roundStatus;
  private voteStatus;
  private applyTime;

  private place : string = '선택';
  private tag;
  private speech;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public afDB : AngularFireDatabase,
    public dataProvider : DataProvider,
    public viewCtrl: ViewController) {

    this.checkOverlap = 1;
    this.checkApplierCount = 1;
    this.roundStatus = 1; //최초 후보 등록 시 라운드 = 1
    this.voteStatus = 1;  //최초 후보 등록 시 투표 = 0
    this.applyTime =  firebase.database['ServerValue'].TIMESTAMP;  //최초 후보 등록 시의 시간
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ContestApplyPage');
    //접속 사용자 정보 로딩//
    this.dataProvider.getCurrentUser().snapshotChanges().take(1).subscribe(user => {
      this.user = user;
    });
  }

  insertApply(){
    
    this.afDB.database.ref('/contests/contestPK/'+this.user.payload.val().gender).on('value',(snapshot) => {
      //후보 인원검사 //
      if(snapshot.numChildren()>8){
        this.checkApplierCount = 0;
      } else {
        this.checkApplierCount = 1;
      }
      snapshot.forEach((snap)=>{
        //후보 중복검사 //
        if(snap.key==this.user.key){
          this.checkOverlap = 0;
        }else {
          this.checkOverlap = 1;
        }
        return false;
      });
    });

    if(this.checkApplierCount * this.checkOverlap == 1 && this.place != '선택'){
      this.afDB.database.ref('/contests/contestPK/'+this.user.payload.val().gender+'/'+this.user.key).set({
        votes : this.voteStatus,
        round : this.roundStatus,
        applytime: this.applyTime,
      }).then((success)=> {
        this.afDB.database.ref('accounts/' + this.user.key).update({
          contestSpeech: this.speech,
          contestTag: this.tag,
          contestPlace : this.place,
        });
        if(this.imageUploadContest.images.length > 0) {
          this.imageUploadContest.key = this.user.key;
          this.imageUploadContest.uploadImages();
        }
        this.viewCtrl.dismiss();
      })
    } else {
      console.log('등록 실패'+'fac'+this.checkApplierCount + 'fo'+this.checkOverlap);
    } 

    
  }
}