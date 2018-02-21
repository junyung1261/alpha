import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-contest',
  templateUrl: 'contest.html',
})
export class ContestPage {
  private contestProgress : any;
  
  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MatchingPage');
    this.contestProgress = 'stage1';
  }

  openProfile() {
    let opts: any = {
      showBackdrop: true,
      enableBackdropDismiss: true
    }
    let profileModal = this.modalCtrl.create('ContestProfilePage', null,opts);
    profileModal.present();
  }
  openVote() {
    let voteModal = this.modalCtrl.create('ContestVotePage', { userId: 8675309 });
    voteModal.present();
  }
  openApply(){
    let opts: any = {
      showBackdrop: true,
      enableBackdropDismiss: true
    }
    let applyModal = this.modalCtrl.create('ContestApplyPage', null,opts);
    applyModal.present();
  }
}
