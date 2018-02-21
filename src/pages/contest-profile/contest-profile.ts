import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { ViewController } from 'ionic-angular/navigation/view-controller';


@IonicPage()
@Component({
  selector: 'page-contest-profile',
  templateUrl: 'contest-profile.html',
})
export class ContestProfilePage {

  constructor(public viewCtrl: ViewController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ContestProfilePage');
  }
  closeProfile() {
    this.viewCtrl.dismiss();
  }

}
