import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import { DataProvider } from '../../providers/data/data';

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

  
  posts : any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl:ModalController, public afDB: AngularFireDatabase, public dataProvider : DataProvider) {

    

  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad BoardlistPage');
    
    this.menuName = this.navParams.get('menuName'); // 대분류 //
    this.specificName = this.navParams.get('specificName'); //중분류 //

    this.afDB.list('/categories', ref => ref).valueChanges().take(1).subscribe(categoryItems => {
      this.categoryItem = categoryItems;
    });

    if(this.menuName=='LIFE'){
      this.specificName = this.navParams.get('specificName');
      this.afDB.list('/menu/0/submenu', ref => ref).valueChanges().take(1).subscribe(menuItems => {
        this.lifeMenu = menuItems;
      });
    }
    this.dataProvider.getPosts(this.menuName).snapshotChanges().take(1).subscribe(post => {
      this.posts = post;
      this.posts.forEach(post =>{
        this.afDB.database.ref('/comments/'+post.payload.key).on('value', comments=>{
          post.comment_count = comments.numChildren();
        });
      })
    });

    
  }

  boardlistClose(){
    this.navCtrl.pop();
  }

  boardView(category,key){
    this.navCtrl.push('BoardviewPage',{postCategory:category, postKey : key});
  }

  selectedSegment(name){
    this.specificName = name;
    console.log("show me : ",name)
  }

  boardWrite(type){
    this.categoryType = type;
    let modalCtrl = this.modalCtrl.create('BoardwritePage',{ menuName: this.menuName, categoryType:this.categoryType });
    modalCtrl.onDidDismiss(data => {
      if(data){this.ionViewDidLoad()};
    })
    modalCtrl.present();
  }
  

}