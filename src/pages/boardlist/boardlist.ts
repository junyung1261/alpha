import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';

@IonicPage()
@Component({
  selector: 'page-boardlist',
  templateUrl: 'boardlist.html',
})
export class BoardlistPage {
  menuName : string;
  specificName : string;
  categoryType : string;
  categoryItem : any[] = [];
  lifeMenu : any[] = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public afDB: AngularFireDatabase) {

    this.menuName = navParams.get('menuName');
    this.specificName = navParams.get('specificName');
    // this.categoryType = navParams.get('categoryType');
    console.log(this.menuName);

    this.afDB.list('/categories', ref => ref).valueChanges().take(1).subscribe(categoryItems => {
      this.categoryItem = categoryItems;
    });
    if(this.menuName=='LIFE'){
      this.specificName = navParams.get('specificName');
      console.log(this.specificName)
      this.afDB.list('/menu/0/submenu', ref => ref).valueChanges().take(1).subscribe(menuItems => {
        this.lifeMenu = menuItems;
      });
    }
    

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BoardlistPage');
  }

  selectedSegment(name){
    this.specificName = name;
    console.log("show me : ",name)
  }

  boardWrite(number){
    // this.categoryType = number;
    // this.navCtrl.push('BoardwritePage',{ categoryName: '生活故事', categoryType:this.categoryType });
  }

}