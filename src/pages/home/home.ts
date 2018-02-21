import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';


@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {

  menuType: string;
  menu: any[] = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public afDB: AngularFireDatabase) {

    this.afDB.list('/menu', ref => ref).valueChanges().take(1).subscribe(menuItems => {
      this.menu = menuItems;
    });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');
    console.log("이게 메뉴다 :", this.menu)
  }


  openCommunity(name) {
    this.menuType = name;
    this.navCtrl.push('BoardlistPage', { menuName: this.menuType, specificName: 'FREE' });


  }

  openLifeCommunity(name) {
    this.menuType = 'LIFE';
    this.navCtrl.push('BoardlistPage', { menuName: this.menuType, specificName: name });
  }

}