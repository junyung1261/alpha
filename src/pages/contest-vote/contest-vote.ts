import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { ViewController } from 'ionic-angular/navigation/view-controller';


@IonicPage()
@Component({
  selector: 'page-contest-vote',
  templateUrl: 'contest-vote.html',
})
export class ContestVotePage {

  constructor(public viewCtrl: ViewController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ContestVotePage');
  }
  closeVote() {
    this.viewCtrl.dismiss();
  }

}
