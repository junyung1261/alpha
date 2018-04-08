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
  menus: any[] = [];
  
  constructor(
    public navCtrl: NavController, public navParams: NavParams, public afDB: AngularFireDatabase, public dataProvider:DataProvider) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');
    this.dataProvider.getMenus().snapshotChanges().take(1).subscribe(menuItems=>{
      this.menus = menuItems;
      this.menus.forEach(menu=>{
        this.dataProvider.getLatestPosts(menu.payload.val().name).snapshotChanges().take(1).subscribe(postItems => {
          menu.posts = postItems.reverse();
          menu.posts.forEach(post=>{
            this.afDB.database.ref('/comments/'+post.payload.key).on('value', comments=>{
              post.comment_count = comments.numChildren();
            });
          });
        });
      });
    });
  }

  openCommunity(name) {
    this.menuType = name;
    this.navCtrl.push('BoardlistPage', { menuName: this.menuType, specificName: 'FREE' });
  }

  openLifeCommunity(name) {
    this.menuType = 'LIFE';
    this.navCtrl.push('BoardlistPage', { menuName: this.menuType, specificName: name });
  }

  boardView(category,key){
    this.navCtrl.push('BoardviewPage',{postCategory:category, postKey : key});
  }

}