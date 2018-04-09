import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import { ImageUpload } from "../../components/image-upload/image-upload";
import * as firebase from 'firebase';
import { Observable } from 'rxjs/Rx';


@IonicPage()
@Component({
  selector: 'page-community-write',
  templateUrl: 'community-write.html',
})
export class CommunityWritePage {
  @ViewChild(ImageUpload) imageUpload: ImageUpload;

  private category;
  private selectedOption;
  private segmentsPerRow: number;
  private options;
  

  communityRef: any;
  accountRef : any;

  title = '';
  text = '';
  tags = '';

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public viewCtrl: ViewController,
    public afDB: AngularFireDatabase) { 

    // life, beauty, study
  
    //life - free, used, job, estate && beauty, study - free
    


   
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CommunityWritePage');

 
    this.category = this.navParams.get('category');
    console.log(this.category);
    this.segmentsPerRow = 3;
    this.selectedOption = null;
    if(this.category.option) this.options = this.category.option.slice(1,this.category.option.length);

    
    this.communityRef = this.afDB.list('/community/' + this.category.parent);
    this.accountRef = this.afDB.object('/accounts/' +firebase.auth().currentUser.uid + '/post');
    
  }

  write(title: string, text: string, tags: string) {
    text = text.replace(/\n/g, '<br>');
    
    this.communityRef.push({
      
      category: this.category.name,
      date: firebase.database['ServerValue'].TIMESTAMP,
      description: text,
      option: this.selectedOption,
      menu: this.category.parent,
      tags: tags,
      title: title,
      views:0,
      writer: firebase.auth().currentUser.uid,
      category_date: this.category.name + '_' + new Date().getTime(),
      likes: 0,
      comments: 0
      
      
      
    }).then((success) => {
      success.update({
      
      })
      if (this.imageUpload.images.length > 0) {
        this.imageUpload.key = success.key;
        this.imageUpload.uploadImages('community/' + this.category.parent);
      }
      this.accountRef.update({[success.key]: this.category.parent });
      this.viewCtrl.dismiss({ data: true});
    })

  }

  checkTrim() {
    if ((this.title.trim() == null) || (this.title.trim() == "") ||  (this.category.name != 'FREE' && this.selectedOption == null) ||
    ((this.imageUpload.images.length == 0) && (this.text.trim() == "") || (this.text.trim() == null))) return true;

    else return false;

  }


}
