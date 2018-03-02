import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import { ImageUpload } from "../../components/image-upload/image-upload";
import * as firebase from 'firebase';
import { Observable } from 'rxjs/Rx';


@IonicPage()
@Component({
  selector: 'page-boardwrite',
  templateUrl: 'boardwrite.html',
})
export class BoardwritePage {
  @ViewChild(ImageUpload) imageUpload: ImageUpload;

  categoryType:string;
  menuName:string;

  boardRef: any;
  accountRef : any;

  title = '';
  text = '';
  tags = '';

  innerCategory : any;
  selectedInnerCategory ='none';

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public viewCtrl: ViewController,
    public afDB: AngularFireDatabase) { 

    // life, beauty, study
    this.menuName = navParams.get('menuName');
    //life - free, used, job, estate && beauty, study - free
    this.categoryType = navParams.get('categoryType');

    this.boardRef = this.afDB.list('/board/' + this.menuName);
    this.accountRef = this.afDB.object('/accounts/' +firebase.auth().currentUser.uid + '/board');

    this.afDB.list('/categories', ref => ref.orderByChild('type').equalTo(this.categoryType)).valueChanges().take(1).subscribe(items => {
      this.innerCategory = items;
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BoardwritePage');
  }

  addBoard(title: string, text: string, tags: string) {
    text = text.replace(/\n/g, '<br>');

    this.boardRef.push({
      wr_category: this.categoryType,
      wr_date: firebase.database['ServerValue'].TIMESTAMP,
      wr_description: text,
      wr_inner: this.selectedInnerCategory,
      wr_tags: tags,
      wr_title: title,
      wr_writer: firebase.auth().currentUser.uid,
      
      
    }).then((success) => {
      if (this.imageUpload.images.length > 0) {
        this.imageUpload.key = success.key;
        this.imageUpload.uploadImages('board/' + this.menuName);
      }
      this.accountRef.update({[success.key]: this.menuName });
      this.viewCtrl.dismiss({ data: true });
    })

  }

  checkTrim() {
    if ((this.title.trim() == null) || (this.title.trim() == "") ||  (this.categoryType != 'FREE' && this.selectedInnerCategory == null) ||
    ((this.imageUpload.images.length == 0) && (this.text.trim() == "") || (this.text.trim() == null))) return true;

    else return false;

  }

  boardwriteClose(){
    this.viewCtrl.dismiss({ data: true });
  }

}
