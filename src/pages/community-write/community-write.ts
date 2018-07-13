import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import { ImageUpload } from "../../components/image-upload/image-upload";
import * as firebase from 'firebase';
import { Observable } from 'rxjs/Rx';
import { ImageProvider, DataProvider } from '../../providers';


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
  private post_modify;
  private nav_title;
  private user;

  public navTitle;
  public submit;

  communityRef: any;
  accountRef : any;
  communityLatestRef: any;

  title = '';
  text = '';
  tags = '';

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public viewCtrl: ViewController,
    public afDB: AngularFireDatabase,
    public dataProvider: DataProvider,
    public imageProvider: ImageProvider) { 

    // life, beauty, study
  
    //life - free, used, job, estate && beauty, study - free
    


   
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CommunityWritePage');
    this.segmentsPerRow = 3;
    this.selectedOption = null;
 
    this.category = this.navParams.get('category');
    this.post_modify = this.navParams.get('post');
    this.navTitle = 'community.title.write';
    
    
    this.dataProvider.getCurrentUser().valueChanges().take(1).subscribe((user : any)=>{
      this.user = user;
    })
    
    if(this.category.option) this.options = this.category.option.slice(1,this.category.option.length);

    if(this.post_modify) {
      this.navTitle = 'community.title.modify';
      this.imageUpload.key = this.post_modify.key;
      this.title = this.post_modify.title,
      this.text = this.post_modify.description,
      this.tags = this.post_modify.tags,
      this.selectedOption = this.post_modify.option
      if(this.post_modify.images) {
       
       this.imageUpload.imageURL = this.post_modify.images.slice();
       
      }
      
    }

    
    this.communityRef = this.afDB.database.ref('/community/' + this.category.parent + '/' + this.category.name);
    this.accountRef = this.afDB.database.ref('/accounts/' +firebase.auth().currentUser.uid + '/post');
    this.communityLatestRef = this.afDB.database.ref('/community_Latest/' + this.category.parent);
  }

  write(title: string, text: string, tags: string) {
    text = text.replace(/\n/g, '<br>');
    let date =  new Date().getTime();

    this.communityRef.push({
      
      date: date,
      description: text,
      option: this.selectedOption,
      menu: this.category.parent,
      tags: tags,
      title: title,
      views:0,
      writer: firebase.auth().currentUser.uid,
      writerName: this.user.username,
      category_date: this.category.name + '_' + date,
      comments: 0
      
      
      
    }).then((success) => {
      success.update({
      
      })
      if (this.imageUpload.images.length > 0) {
        this.imageUpload.key = success.key;
        this.imageUpload.uploadPostImages(this.category.parent , this.category.name);
      }
      this.communityLatestRef.update({[success.key]: this.category.name});
      this.accountRef.update({[success.key]: this.category.parent });
      this.viewCtrl.dismiss({ data: true});
    })

  }

  modify(title: string, text: string, tags: string){

    

    this.communityRef.child(this.post_modify.key).update({
      writerName: this.user.username,
      title: title,
      description: text,
      tags: tags,
      modified_data: firebase.database['ServerValue'].TIMESTAMP
    }).then((success) => {
      if (this.imageUpload.images.length > 0) {

        if(this.imageUpload.removeImages.length > 0){
          this.imageProvider.deletePostImageFile(this.post_modify.key, this.imageUpload.removeImages);
        }
        
        this.imageUpload.uploadPostImages(this.category.parent, this.category.name).then(() => {
          this.viewCtrl.dismiss({ data: true});
        });
      }

      else if(this.imageUpload.removeImages.length > 0 && this.imageUpload.images.length == 0){
       
        this.imageProvider.deletePostImageFile(this.post_modify.key, this.imageUpload.removeImages);
        this.imageProvider.updatePostUrl(this.post_modify.key, this.imageUpload.imageURL, this.category.parent, this.category.name).then(() => {
          this.viewCtrl.dismiss({ data: true});
        });

       
      }
      
      
    });
   
  }

  checkTrim() {
    if ((this.title.trim() == null) || (this.title.trim() == "") ||  (this.category.name != 'freeboard' && this.selectedOption == null) ||
    (this.imageUpload.images.length == 0) && (this.text.trim() == "") || (this.text.trim() == null) || (this.category.name != 'freeboard' && this.imageUpload.images.length == 0)) return true;

    else return false;

  }


}
