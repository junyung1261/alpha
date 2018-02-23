import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';

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

  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MatchingPage');
    this.contestProgress = 'stage1';
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
