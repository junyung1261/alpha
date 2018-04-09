import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Content } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import { DataProvider, LoadingProvider } from '../../providers';
import * as firebase from 'firebase';
import { FirebaseListObservable } from 'angularfire2/database-deprecated';

@IonicPage()
@Component({
  selector: 'page-community-post',
  templateUrl: 'community-post.html',
})
export class CommunityPostPage {
  @ViewChild(Content) content: Content;

  private postKey : any;
  private category : any;
  private post;
  private writer;
  private comment = '';
  

  constructor(public navCtrl: NavController, 
              public navParams : NavParams, 
              public afDB : AngularFireDatabase, 
              public dataProvider : DataProvider,
              public loadingProvider: LoadingProvider) {
    
    
    //좋아요 상태 설정//
    
  }

  ionViewDidLoad() {

    this.postKey = this.navParams.get('postKey');
    this.category = this.navParams.get('category');
    
    this.afDB.database.ref('/community/' + this.category.name + '/' + this.postKey).child('views').transaction(function(currentCount){
      return currentCount+1;
    }).then(() => {
      this.dataProvider.getPost(this.category.name, this.postKey).valueChanges().take(1).subscribe(post => {
        this.post = post;
        this.dataProvider.getUser(this.post.writer).valueChanges().take(1).subscribe(user => {
          this.writer = user;
        });

       
          this.dataProvider.getComments(this.postKey).valueChanges().subscribe(comments => {
          
            comments.forEach((comment:any) => {
              this.dataProvider.getUser(comment.writer).valueChanges().take(1).subscribe((user:any) => {
                comment.username = user.username;
                comment.profileImg = user.profileImg;
              });
            })
            this.post.comment = comments;
          });

          this.dataProvider.getPostLikes(this.category.name, this.postKey).snapshotChanges().subscribe(likes => {
            this.post.likeList = likes;
          })
        
       
      });
    });

  }

  // 게시글 좋아요 누르기 //
  postLikeOn(){
    this.afDB.database.ref('/community/'+ this.category.name + '/' + this.postKey + '/likes').update({[firebase.auth().currentUser.uid] : firebase.database['ServerValue'].TIMESTAMP
    })
  }

  // 게시글 좋아요 취소 //
  postLikeOff(){
    this.afDB.database.ref('/community/' + this.category.name + '/'  + this.postKey + '/likes/' + firebase.auth().currentUser.uid).remove();
  }

  checkLiked(){
    if(this.post.likeList){
      return this.post.likeList.filter(e => {
        return e.key === firebase.auth().currentUser.uid
      }).length;
    }
    
  }


  //댓글 쓰기 //
  commentWrite(){
    this.loadingProvider.show();
    this.afDB.database.ref('/comments/' + this.postKey).push({
      writer : firebase.auth().currentUser.uid,
      description : this.comment,
      date : firebase.database['ServerValue'].TIMESTAMP
    }).then((success) => {
      
      this.afDB.database.ref('/accounts/'+firebase.auth().currentUser.uid+'/comments/').update({[success.key]: this.postKey }).then(() => {
        this.afDB.database.ref('/community/' + this.category.name + '/' + this.postKey).child('comments').transaction(function(currentCount){
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
      if(self.content._scroll) self.content.scrollToBottom();
    }, 300);
  }
  

}
