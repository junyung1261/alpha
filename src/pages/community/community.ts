import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import { DataProvider } from '../../providers';

@IonicPage()
@Component({
  selector: 'page-community',
  templateUrl: 'community.html',
})
export class CommunityPage {
  
  private menu;
  private index;
  private category;
  private segmentsPerRow: number;
  private posts: Map<string, any>;

  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl:ModalController, public afDB: AngularFireDatabase, public dataProvider : DataProvider) {
    
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad CommunityPage');
  
    
    this.posts = new Map<string, any>();
    this.menu = this.navParams.get('menu');
    this.index = this.navParams.get('index');
    
    this.getCategory(this.index)
    this.getPost();
    
  }

  getCategory(index){
    
    if(this.menu){
      this.category = this.menu.category[index];
      if(this.category.option){
        
        this.segmentsPerRow = 3;
        this.category.rows = Array.from(Array(Math.ceil(this.category.option.length / this.segmentsPerRow)).keys());
      }
    
    }
  }

  getPost(){
    this.menu.category.forEach(category => {
      
      this.dataProvider.getPosts(this.menu.name, category.name).snapshotChanges().take(1).subscribe(post => {
          
        this.posts.set(category.name, post.reverse());
        
      });
    });
  }

  openPost(category, key){
    this.navCtrl.push('CommunityPostPage',{category: category, postKey : key});
  }

  writePost(){
    
    let modalCtrl = this.modalCtrl.create('CommunityWritePage',{ category: this.category });
    modalCtrl.onDidDismiss(data => {
      if(data){
        
        this.getPost();
        
      }
    })
    modalCtrl.present();
  }
  

}