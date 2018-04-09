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
        
          menu.posts = posts.reverse();
          menu.posts.forEach(post=>{
           
            this.afDB.database.ref('/comments/' + post.key).on('value', comments=>{
              post.comment_count = comments.numChildren();
            });
          });
        });
      });
    });
  }

  openPostListPage(menu, category) {

    this.navCtrl.push('BoardlistPage', { menu: menu, category: category});
  }

  openPostPage(category,key){
    this.navCtrl.push('BoardviewPage',{ postCategory:category, postKey : key });
  }

}