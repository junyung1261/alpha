import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Content } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import { DataProvider } from '../../providers';
import { Subscription } from 'rxjs';
import { Keyboard } from '@ionic-native/keyboard';

@IonicPage()
@Component({
  selector: 'page-community',
  templateUrl: 'community.html',
})
export class CommunityPage {
  @ViewChild("content") contentHandle: Content;

  private contentBox;
  private tabBarHeight;
  private menu;
  private index;
  private category;
  private segmentsPerRow: number;
  private posts: Map<string, any>;
  private subscriptions: Subscription[];
  private lastPostId : any;
  private selectedSearchBy = "title"
  private searchIndex = "";
  private numToLoad = 15;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              public modalCtrl:ModalController, 
              public afDB: AngularFireDatabase, 
              public dataProvider : DataProvider,
              public keyboard: Keyboard) {
    
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad CommunityPage');
  
    // this.contentBox=document.querySelector(".community .scroll-content")['style'];
    // this.tabBarHeight = this.contentBox.marginBottom;
  
    this.posts = new Map<string, any>();
    this.menu = this.navParams.get('menu');
    this.index = this.navParams.get('index');
    
    this.getCategory(this.index)
    this.getPost();
    
  }

  
  ionViewDidEnter(){
    this.subscriptions = [];

    // let subscription = this.keyboard.onKeyboardShow().subscribe(() => {
      
    // document.querySelector(".tabbar")['style'].display = 'none';
    // this.contentBox.marginBottom = 0;
    // this.contentHandle.resize();
    // })

    // let subscription_ = this.keyboard.onKeyboardHide().subscribe(() => {
     
    // document.querySelector(".tabbar")['style'].display = 'flex';
    // this.contentBox.marginBottom = this.tabBarHeight;
    // this.contentHandle.resize();
    // })

    // this.subscriptions.push(subscription);
    // this.subscriptions.push(subscription_)
  }
 
  ionViewWillLeave() {
    // Unsubscribe to Subscription.
    if (this.subscriptions){
        this.subscriptions.forEach(subscription => {
          subscription.unsubscribe();
        })
    }
      
  }

  getCategory(index){
    
    if(this.menu){
      this.category = this.menu.category[index];
      if(this.category.option){
        if(!this.category.selectedOption) this.category.selectedOption = 'total';
        this.segmentsPerRow = 3;
        this.category.rows = Array.from(Array(Math.ceil(this.category.option.length / this.segmentsPerRow)).keys());
        
      }
    
    }
  }

  setCategoryOption(category, option){
    if(category){
      
      category.selectedOption = option;
    }
  }

  getPost(){
    this.menu.category.forEach(category => {
      
      this.dataProvider.getPosts(this.menu.name, category.name, this.numToLoad).snapshotChanges().take(1).subscribe(posts => {
          
        this.posts.set(category.name, posts.reverse());
        this.lastPostId = posts[14].key;
      });
    });
  }

  openPost(menu, post){
    new Promise((resolve, reject)=> {
      this.navCtrl.push('CommunityPostPage',{menu: menu, category: post.payload.val().category, postId : post.key, resolve: resolve});

    }).then(data => {
      if(data){
        this.getPost();
      }
    })

  }

  openSearchPage(option, index, category, menu){
    this.navCtrl.push('CommunitySearchPage', {option: option, index: index, category: category, menu: menu});
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
  
  


doRefresh(refresher) {
  console.log('Begin async operation', refresher);

  setTimeout(() => {
    this.getPost();
    console.log('Async operation has ended');
    refresher.complete();
  }, 2000);
}


doInfinite(infiniteScroll) {
  console.log('Begin async operation');
    setTimeout(() => {
    this.numToLoad +=20;
     
    this.dataProvider.getPosts(this.menu.name, this.category.name, this.numToLoad).snapshotChanges().take(1).subscribe(posts => {
      
      this.posts.set(this.category.name, posts.reverse());
      
    });
    
    console.log('Async operation has ended');
    infiniteScroll.complete();
  }, 500);
}


}