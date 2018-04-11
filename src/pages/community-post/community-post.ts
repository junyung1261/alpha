import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Content } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import { DataProvider, LoadingProvider } from '../../providers';
import * as firebase from 'firebase';
import { FirebaseListObservable } from 'angularfire2/database-deprecated';
import { Keyboard } from '@ionic-native/keyboard';
import { Subscription } from 'rxjs';
import { ModalController } from 'ionic-angular';
import { GalleryModal } from 'ionic-gallery-modal';

@IonicPage()
@Component({
  selector: 'page-community-post',
  templateUrl: 'community-post.html',
})
export class CommunityPostPage {
  @ViewChild("content") contentHandle: Content;

  private userId: any;
  private contentBox;
  private tabBarHeight;
  private postId : any;
  private category : any;
  private post;
  private writer;
  private comment = '';
  private subscriptions: Subscription[];

  constructor(public navCtrl: NavController, 
              public navParams : NavParams, 
              public afDB : AngularFireDatabase, 
              public dataProvider : DataProvider,
              public loadingProvider: LoadingProvider,
              public modalCtrl: ModalController,
              public keyboard: Keyboard) {
    
    
    
  }

  ionViewDidLoad() {
    this.contentBox=document.querySelector(".post .scroll-content")['style'];
    this.tabBarHeight = this.contentBox.marginBottom;
    this.userId = firebase.auth().currentUser.uid;
    this.postId = this.navParams.get('postId');
    this.category = this.navParams.get('category');
   
    this.subscriptions = [];
    
    this.afDB.database.ref('/community/' + this.category.name + '/' + this.postId).child('views').transaction(function(currentCount){
      return currentCount+1;
    }).then(() => {
      this.dataProvider.getPost(this.category.name, this.postId).valueChanges().take(1).subscribe(post => {
        this.post = post;
        this.dataProvider.getUser(this.post.writer).valueChanges().take(1).subscribe(user => {
          this.writer = user;
        });

       
         let subscription = this.dataProvider.getComments(this.postId).valueChanges().subscribe(comments => {

            comments.forEach((comment:any) => {
              this.dataProvider.getUser(comment.writer).valueChanges().take(1).subscribe((user:any) => {
                
                comment.username = user.username;
                comment.profileImg = user.profileImg;
              });
              
            })
            this.post.comment = comments;
            this.subscriptions.push(subscription);
          });

          let subscription_ = this.dataProvider.getPostLikes(this.category.name, this.postId).snapshotChanges().subscribe(likes => {
            this.post.likes = likes;
            this.subscriptions.push(subscription_);
          })
        
       
      });
    });

  }



  openGalleryModal(photos, index){
    
    let modal = this.modalCtrl.create(GalleryModal, {
      photos: photos,
      initialSlide: index
    });
    modal.present();
  }

  
  ionViewDidEnter(){
    this.subscriptions = [];

    let subscription = this.keyboard.onKeyboardShow().subscribe(() => {
      
    document.querySelector(".tabbar")['style'].display = 'none';
    this.contentBox.marginBottom = 0;
    this.contentHandle.resize();
    })

    let subscription_ = this.keyboard.onKeyboardHide().subscribe(() => {
     
    document.querySelector(".tabbar")['style'].display = 'flex';
    this.contentBox.marginBottom = this.tabBarHeight;
    this.contentHandle.resize();
    })

    this.subscriptions.push(subscription);
    this.subscriptions.push(subscription_)
  }
 
  ionViewWillLeave() {
    // Unsubscribe to Subscription.
    if (this.subscriptions){
        this.subscriptions.forEach(subscription => {
          subscription.unsubscribe();
        })
    }
      
  }
  
  // 게시글 좋아요 누르기 //
  likePost(key){
    this.afDB.database.ref('/community/'+ this.category.name + '/' + key + '/likes').push({
      uid: this.userId,
      date: firebase.database['ServerValue'].TIMESTAMP
    });
  }

  // likeComment(key){
  //   this.afDB.database.ref('/comments/' + this.postId + '/' + key + '/likes').push({
  //     uid: this.userId,
  //     date: firebase.database['ServerValue'].TIMESTAMP
  //   });
  // }

  // 게시글 좋아요 취소 //
  dislikePost(key, target){

    let likeKey;
    if(target.likes){
      likeKey =  target.likes.filter(e => {
        return e.payload.val().uid == this.userId
      });
    }

    this.afDB.database.ref('/community/' + this.category.name + '/'  + key + '/likes/' + likeKey[0].key).remove();
  }

  // dislikeComment(key, target){
  //   let likeKey;
  //   if(target.likes){
  //     likeKey =  target.likes.filter(e => {
  //       return e.payload.val().uid == this.userId
  //     });
  //   }
  //   this.afDB.database.ref('/community/' + this.postId + '/' + key + '/likes/' + likeKey[0].key).remove();
  // }

  checkPostLiked(){
    if(this.post.likes && this.post.likes.length > 0){
      return this.post.likes.filter(e => {
        return e.payload.val().uid == this.userId
      }).length;
    }
    return 0;
  }

  // checkCommentsLiked(comment){
  //   if(comment.likes && comment.likes.length > 0){
  //     return comment.likes.filter(e => {
  //       return e.uid === this.userId
  //     }).length;
  //   }
  //   else return 0;
  // }


  //댓글 쓰기 //
  commentWrite(){
    this.loadingProvider.show();
    let commentRef = this.afDB.database.ref('/comments/' + this.postId)
    commentRef.push({
      writer : this.userId,
      description : this.comment,
      date : firebase.database['ServerValue'].TIMESTAMP
    }).then((success) => {
      commentRef.child(success.key).update({key: success.key});
      this.afDB.database.ref('/accounts/'+this.userId+'/comments/').update({[success.key]: this.postId }).then(() => {
        this.afDB.database.ref('/community/' + this.category.name + '/' + this.postId).child('comments').transaction(function(currentCount){
          return currentCount+1;
        })
      })
      this.comment = '';
      this.loadingProvider.hide();
      this.scrollBottom();
    });
  }
  
  scrollBottom(): void {
    let self = this;
    setTimeout(function() {
      if(self.contentHandle._scroll) self.contentHandle.scrollToBottom();
    }, 300);
  }
  

}
