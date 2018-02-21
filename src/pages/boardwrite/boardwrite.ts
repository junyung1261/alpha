import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
/**
 * Generated class for the BoardwritePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-boardwrite',
  templateUrl: 'boardwrite.html',
})
export class BoardwritePage {

  categoryType:string;

  constructor(public navCtrl: NavController, public navParams: NavParams) { 
    this.categoryType = navParams.get('categoryType');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BoardwritePage');
  }


}
