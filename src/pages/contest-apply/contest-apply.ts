import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import { DataProvider } from '../../providers';
import * as firebase from 'firebase';
import { ImageUploadContest } from "../../components/image-upload-contest/image-upload-contest";
import { refCount } from 'rxjs/operators';

@IonicPage()
@Component({
  selector: 'page-contest-apply',
  templateUrl: 'contest-apply.html',
})
export class ContestApplyPage {
  @ViewChild(ImageUploadContest) imageUploadContest : ImageUploadContest;

  private user;
  private lastContest: any;
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

  
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ContestApplyPage');
    //접속 사용자 정보 로딩//
    this.lastContest = this.navParams.get('lastContest');
    this.user = this.navParams.get('user');

  }

  insertApply(){
    
    
    this.afDB.database.ref('/contests/' + this.lastContest.key + '/applicant').update({[this.user.key]: this.user.payload.val().gender})
    .then((success) => {

      var myContest = {
        myContest : this.lastContest.key,
        place : this.place,
        tag : this.tag,
        speech : this.speech,
      };
     


      this.dataProvider.getCurrentUser().update({contest: myContest }).then((success) => {
        if(this.imageUploadContest.images.length > 0) this.imageUploadContest.uploadImages();
      });

    this.viewCtrl.dismiss( {data : true } );

    })
    
  }

  
}