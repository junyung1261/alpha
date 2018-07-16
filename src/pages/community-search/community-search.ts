import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DataProvider } from '../../providers';

/**
 * Generated class for the CommunitySearchPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-community-search',
  templateUrl: 'community-search.html',
})
export class CommunitySearchPage {

  private menu;
  private searchBy;
  private index;
  private category;
  private posts = [];
  private searchIndex = '';

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public dataProvider: DataProvider) {
                this.searchBy = this.navParams.get('option');
                this.index = this.navParams.get('index');
                this.category =  this.navParams.get('category');
                this.menu =  this.navParams.get('menu');
  }

  ionViewDidLoad() {
   
    
    console.log('ionViewDidLoad CommunitySearchPage');
    this.getPost(this.index);
  }


  getPost(index){
   
    this.dataProvider.getPostsBySearched(this.category.parent, this.category.name, this.searchBy, index).snapshotChanges().take(1).subscribe(posts => {
      
      this.posts = posts;
      
    });
    
  }

  openPost(menu, post){
    new Promise((resolve, reject)=> {
      this.navCtrl.push('CommunityPostPage',{menu: menu, category: post.payload.val().category, postId : post.key});

    })

  }

  search(){
    this.dataProvider.getPostsBySearched(this.category.parent, this.category.name, this.searchBy, this.searchIndex).snapshotChanges().take(1).subscribe(posts => {
      
      this.posts = posts;
      
    });
  }
  
  setCategoryOption(category, option){
    if(category){
      
      category.selectedOption = option;
    }
  }
}
