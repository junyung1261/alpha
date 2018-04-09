import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import { DataProvider } from '../../providers';

@IonicPage()
@Component({
  selector: 'page-boardlist',
  templateUrl: 'boardlist.html',
})
export class BoardlistPage {
  
  private menu;
  private category;
  private categoryItem;
  private segment_category;
  private segment_type;
  private posts: Map<string, any>;

  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl:ModalController, public afDB: AngularFireDatabase, public dataProvider : DataProvider) {
    
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad BoardlistPage');
  
     // 대분류 //
     //중분류 //
    this.posts = new Map<string, any>();
    this.menu = this.navParams.get('menu');
    this.category = this.navParams.get('category');
    console.log(this.menu.submenu.indexOf(this.category))
    this.segment_category = this.category.name
       
    
  
    this.afDB.list('/categories', ref => ref).valueChanges().take(1).subscribe(categoryItems => {
      this.categoryItem = categoryItems;
    });

    this.getPost();
    
  }

  test(){
    console.log(this.segment_category);
    
  }

  getPost(){
    
    this.menu.submenu.forEach(category => {
      
      this.dataProvider.getPosts(this.menu.name, category.name).snapshotChanges().take(1).subscribe(post => {
        console.log(post);
        this.posts.set(category.name, post.reverse());
        
      });
    });
    
    
  }

  boardlistClose(){
    this.navCtrl.pop();
  }

  boardView(category,key){
    this.navCtrl.push('BoardviewPage',{postCategory:category, postKey : key});
  }

  

  boardWrite(){
    console.log(this.segment_category);
    console.log(this.menu.name)
    let modalCtrl = this.modalCtrl.create('BoardwritePage',{ menuName: this.menu.name, categoryType: this.segment_category });
    modalCtrl.onDidDismiss(data => {
      if(data){
        
        this.getPost();
        
      }
    })
    modalCtrl.present();
  }
  

}