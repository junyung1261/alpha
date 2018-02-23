import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, LoadingController } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import * as firebase from 'firebase';
import { Observable } from '@firebase/util';

@IonicPage()
@Component({
  selector: 'page-contest',
  templateUrl: 'contest.html',
})
export class ContestPage {

  private contestProgress : any;
  opts: any = {
    showBackdrop: true,
    enableBackdropDismiss: true,
    cssClass:'mini-modal'
<<<<<<< HEAD
  }

  private numOfMale: any;
  private numOfFemale: any;
  private participents: any;
  // private participentKey :any = {nickname : ""};
  private participentKey = [];
  // private participentInfo = [];
  private participentInfo: any;

  private pageFlag: boolean = false;




  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController, public afDB: AngularFireDatabase, public loadingCtrl: LoadingController) {

    // let loading = this.loadingCtrl.create({
    //   content: 'Fuck you...'
    // });
    // console.log("constructor")
    // loading.present();
    // setTimeout(() => {
    //   loading.dismiss();
    //   this.pageFlag = true;
    // }, 3000);

    var index = 0;
    this.afDB.list('/contests/contestPK/female', ref=>ref.orderByKey()).snapshotChanges().take(1).subscribe(participents => {
      this.participents = participents;
      this.numOfFemale = participents.length;
      // html에 쓸 때는 participents.payload.val().name 이딴식으로 쓰면 됨.
      console.log("여성 참가자 수 : ", this.numOfFemale);


      participents.forEach(participent => {

        this.participentKey[index] = participent.key;
        console.log("index 값 : ", index, "key 값 : ", this.participentKey[index])

        // this.angularfireDatabase.list('/feed', ref => lastKey?  ref.orderByKey().limitToLast(batch).endAt(lastKey) : ref.orderByKey().limitToLast(batch));

        // this.afDB.database.ref('/accounts/' + this.participentKey[index]).on('value', (snapshot) => {
        //   this.participentInfo[index] = snapshot.child('username').val();
        //   console.log("index 값 : ", index, "닉네임 값 : ", this.participentInfo[index])
        // });

        index = index + 1;

      })

    });

    this.afDB.list('/accounts', ref => ref.orderByChild('contestApply').equalTo(true)).snapshotChanges().take(1).subscribe(participentsInfo => {
      this.participentInfo = participentsInfo;
      console.log(this.participentInfo)
    })



  }

=======
  }

  private contestProgress: any;

  private numOfMale: any;
  private numOfFemale: any;
  private participents: any;
  // private participentKey :any = {nickname : ""};
  private participentKey = [];
  // private participentInfo = [];
  private participentInfo: any;

  private pageFlag: boolean = false;




  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController, public afDB: AngularFireDatabase, public loadingCtrl: LoadingController) {

    // let loading = this.loadingCtrl.create({
    //   content: 'Fuck you...'
    // });
    // console.log("constructor")
    // loading.present();
    // setTimeout(() => {
    //   loading.dismiss();
    //   this.pageFlag = true;
    // }, 3000);

    var index = 0;
    this.afDB.list('/contests/contestPK/female', ref=>ref.orderByKey()).snapshotChanges().take(1).subscribe(participents => {
      this.participents = participents;
      this.numOfFemale = participents.length;
      // html에 쓸 때는 participents.payload.val().name 이딴식으로 쓰면 됨.
      console.log("여성 참가자 수 : ", this.numOfFemale);


      participents.forEach(participent => {

        this.participentKey[index] = participent.key;
        console.log("index 값 : ", index, "key 값 : ", this.participentKey[index])

        // this.angularfireDatabase.list('/feed', ref => lastKey?  ref.orderByKey().limitToLast(batch).endAt(lastKey) : ref.orderByKey().limitToLast(batch));

        // this.afDB.database.ref('/accounts/' + this.participentKey[index]).on('value', (snapshot) => {
        //   this.participentInfo[index] = snapshot.child('username').val();
        //   console.log("index 값 : ", index, "닉네임 값 : ", this.participentInfo[index])
        // });

        index = index + 1;

      })

    });

    this.afDB.list('/accounts', ref => ref.orderByChild('contestApply').equalTo(true)).snapshotChanges().take(1).subscribe(participentsInfo => {
      this.participentInfo = participentsInfo;
      console.log(this.participentInfo)
    })



  }

>>>>>>> 08b45c161b259f600e6fdba9996aff28dc6f5c1c

  ionViewDidLoad() {
    console.log('ionViewDidLoad MatchingPage');
    this.contestProgress = 'stage0';
    let i = 0;

    // let loading = this.loadingCtrl.create({
    //   content: 'Fuck you...'
    // });
    // console.log("constructor")
    // loading.present();
    // setTimeout(() => {
    //   loading.dismiss();
    //   this.pageFlag = true;
    // }, 3000);

    // setTimeout(() => {
    //   this.test[i] = this.afDB.database.ref('/accounts/' + this.participentKey[i]);
    // console.log(this.test[i])
    // }, 3000);



  }



  openProfile() {

    
    let profileModal = this.modalCtrl.create('ContestProfilePage', {},this.opts);

    profileModal.present();
  }
  openVote() {
    let voteModal = this.modalCtrl.create('ContestVotePage',{},this.opts);
    voteModal.present();
  }

  openApply(){
    
    let applyModal = this.modalCtrl.create('ContestApplyPage',{},this.opts);
    applyModal.present();
  }
}