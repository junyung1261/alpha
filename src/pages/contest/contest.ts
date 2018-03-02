import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, LoadingController } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import * as firebase from 'firebase';
import { Observable } from '@firebase/util';
import { DataProvider } from '../../providers/data/data';
import { LoadingProvider } from '../../providers/loading/loading';

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
  }


  private pageFlag: boolean = false;
  lastContest: any;
  numOfMale = 0;
  numOfFemale = 0;
  candidate: any;
  user: any;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public modalCtrl: ModalController, 
    public afDB: AngularFireDatabase, 
    public loadingProvider: LoadingProvider,
    public dataProvider: DataProvider) {

    // let loading = this.loadingCtrl.create({
    //   content: 'Fuck you...'
    // });
    // console.log("constructor")
    // loading.present();
    // setTimeout(() => {
    //   loading.dismiss();
    //   this.pageFlag = true;
    // }, 3000);
    

  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad MatchingPage');
    
    
    
    this.dataProvider.getCurrentUser().snapshotChanges().subscribe(user => {
      this.user = user;

      let interval = setInterval(function(){

        this.loadingProvider.show();
        this.dataProvider.getLastContestId().once('value', snapshot => {
          
          let lastContestId = snapshot.val();
          
          this.dataProvider.getContest(lastContestId).once('value', snapshot => {
            this.lastContest = snapshot;
            this.contestProgress = snapshot.val().stage;
                     
            if( this.contestProgress == 'join' ){
    
              this.dataProvider.getCandidate(lastContestId).snapshotChanges().take(1).subscribe(candidates => {
                let list = [];
                candidates.forEach(candidate => {
                  list.push(candidate.key);
                })
                this.candidate = list;
              }); 
              this.loadingProvider.hide();
            }
            else {
              
            }
          })
        });

      },60000);
      
      
     
    })
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
    
    let applyModal = this.modalCtrl.create('ContestApplyPage',{lastContest: this.lastContest, user: this.user},this.opts);
    applyModal.present();
  }

  

  cancelApply(){
    this.afDB.database.ref('/contests/' + this.lastContest.key + '/candidate/' + this.user.key).remove()
    .then((success) => {

      this.dataProvider.getCurrentUser().update({contest: null});
      if(this.user.payload.val().gender == 'male') {
        this.afDB.database.ref('/contests/' + this.lastContest.key).child('numOfMale').transaction(function(currentCount){
          return currentCount-1;
        })
      }
      else{
        this.afDB.database.ref('/contests/' + this.lastContest.key).child('numOfFemale').transaction(function(currentCount){
          return currentCount-1;
        })
      }
     })
  }
}