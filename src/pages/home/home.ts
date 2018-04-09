import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import { DataProvider } from '../../providers';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {

  menuType: string;
  postMenu: any[] = [];
  
  constructor(
    public navCtrl: NavController, public navParams: NavParams, public afDB: AngularFireDatabase, public dataProvider:DataProvider) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');
    this.dataProvider.getPostMenu().valueChanges().take(1).subscribe(menu=>{
      this.postMenu = menu;
      this.postMenu.forEach(menu=>{
        this.dataProvider.getLatestPosts(menu.name).snapshotChanges().take(1).subscribe(posts => {
          console.log(posts);
          menu.posts = posts.reverse();
          
        });
      });
    });
  }

  openCommunityPage(menu, index) {
    
    this.navCtrl.push('CommunityPage', { menu: menu, index: index});
  }

  openPost(category,key){
    this.navCtrl.push('CommunityPostPage',{ category:category, postKey : key });
  }

}