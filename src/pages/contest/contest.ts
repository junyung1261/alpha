import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, LoadingController, AlertController } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import * as firebase from 'firebase';
import { Observable } from '@firebase/util';
import { DataProvider } from '../../providers/data/data';
import { LoadingProvider } from '../../providers/loading/loading';
import { filter } from 'rxjs/operator/filter';

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
  currentStage: any;
  candidates = [];
  candidates_round2 = [];
  candidates_round3 = [];
  chunckedCanditates = [];
  champions = [];
  applicants: any;
  user: any;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public modalCtrl: ModalController, 
    public alertCtrl: AlertController,
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
    
    
    this.loadingProvider.show();
    this.dataProvider.getCurrentUser().snapshotChanges().subscribe(user => {
      this.user = user;
    })
    this.dataProvider.getLastContest().snapshotChanges().take(1).subscribe( snapshot => {
          
      this.lastContest = snapshot[0];
      firebase.database().ref('/contests/' + this.lastContest.key +'/stage').on('value', snapshot => {
        this.currentStage = snapshot.val();
        this.contestProgress = snapshot.val();
       
                  
        if( snapshot.val()  == 'join' ){
          
          this.dataProvider.getApplicant(this.lastContest.key).snapshotChanges().subscribe(applicants => {
            this.applicants = applicants;
          }); 
          this.loadingProvider.hide();
        }
        else if (snapshot.val() != 'join'){
          
          if(this.user.payload.val().gender == 'male'){
            this.dataProvider.getCandidate(this.lastContest.key, 'female').snapshotChanges().take(1).subscribe(snapshots => {
              this.candidates = snapshots;
              this.initializeCandidates(this.candidates);
            });
            
        
          }
          else {
            this.dataProvider.getCandidate(this.lastContest.key, 'male').snapshotChanges().take(1).subscribe(snapshots => {
              this.candidates = snapshots;
              this.initializeCandidates(this.candidates);
            });
          }

        }
        if(snapshot.val() =='final'){
          
          this.dataProvider.getChampions(this.lastContest.key).snapshotChanges().take(1).subscribe(snapshots => {
            this.champions = snapshots;
            this.initializeCandidates(this.champions);
            
          });
        }
      });
    });
  }

  initializeCandidates(candidates){
    candidates.forEach((candidate, i) => {
      let user;
      this.dataProvider.getUser(candidate.key).snapshotChanges().take(1).subscribe(account => {
        candidate.profileImg = account.payload.val().profileImg;
        candidate.username = account.payload.val().username;
        candidate.birth = account.payload.val().birth;
        candidate.gender = account.payload.val().gender;
        candidate.contest = account.payload.val().contest;
        candidate.index = i;
        firebase.database().ref('/contests/' + this.lastContest.key + '/candidate/' + candidate.key + '/score').on('value', snapshot => {
          
          candidate.round_1 = snapshot.val().round_1;
          candidate.total = candidate.round_1;
          if(snapshot.child('round_2').exists()) {
            console.log(snapshot.val().round_2)
            candidate.round_2 = snapshot.val().round_2;
            candidate.total += candidate.round_2;
          }
          if(snapshot.child('round_3').exists()) {
            candidate.round_3 = snapshot.val().round_3;
            candidate.total += candidate.round_3;
          }
          if(i == candidates.length-1) this.chunckCanditates(this.candidates);
        })
        
      })
      
    })
   
    
  }


  checkApplied(applicants){

    return applicants.filter(e => {
      return e.key === this.user.key;
    }).length;
  }

  chunckCanditates(candidates){
    var chunk_size = 2;
    var candidates_round2 = candidates.filter(e => {
      return e.round_2 > -1;
    });
    var candidates_round3 = candidates.filter(e => {
      return e.round_3 > -1;
    });
   
    this.chunckedCanditates = candidates.map( (e,i) => { 
     
        return i%chunk_size===0 ? candidates.slice(i,i+chunk_size) : null; 
    })
    .filter(e =>{ return e; });

    this.candidates_round2 = candidates_round2.map( (e,i) => { 
     
        return i%chunk_size===0 ? candidates_round2.slice(i,i+chunk_size) : null; 
    })
    .filter(e =>{ return e; });

    
    this.candidates_round3 = candidates_round3.map( (e,i) => { 
      
        return i%chunk_size===0 ? candidates_round3.slice(i,i+chunk_size) : null; 
    })
    .filter(e =>{ return e; });

    console.log(this.candidates_round2);

    this.loadingProvider.hide();
  }


  openProfile(candidate) {

    let profileModal = this.modalCtrl.create('ContestProfilePage', {candidate: candidate},this.opts);

    profileModal.present();
  }
  openVote(candidate, round) {

    let voteModal = this.modalCtrl.create('ContestVotePage',{user: this.user, candidate: candidate, lastContest:this.lastContest, round: round},this.opts);
    voteModal.present();
  }

  openApply(){
    let applyModal = this.modalCtrl.create('ContestApplyPage',{lastContest: this.lastContest, user: this.user},this.opts)
    applyModal.onDidDismiss(data => {
      if(data){
        if(this.user.payload.val().gender == 'male') {
          this.afDB.database.ref('/contests/' + this.lastContest.key).child('numOfMale').transaction(function(currentCount){
            return currentCount+1;
          })
        }
        else{
          this.afDB.database.ref('/contests/' + this.lastContest.key).child('numOfFemale').transaction(function(currentCount){
            return currentCount+1;
          })
        }
        let alert = this.alertCtrl.create({
          title: '지원 완료',
          subTitle: '참가 지원이 완료되었습니다!',
          buttons: ['확인']
        });
        alert.present();

      }
    })
    applyModal.present();
  }

  

  cancelApply(){
    let alert = this.alertCtrl.create({
      title: '지원 취소',
      message: '정말로 후보 지원을 취소하겠습니까?',
      buttons: [
        {
          text: '아니오',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: '예',
          handler: () => {
            this.afDB.database.ref('/contests/' + this.lastContest.key + '/applicant/' + this.user.key).remove()
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
      ]
    });
    alert.present();



    
  }
}