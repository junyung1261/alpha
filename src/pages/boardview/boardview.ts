import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import { DataProvider } from '../../providers/data/data';
import * as firebase from 'firebase';
import { FirebaseListObservable } from 'angularfire2/database-deprecated';

@IonicPage()
@Component({
  selector: 'page-boardview',
  templateUrl: 'boardview.html',
})
export class BoardviewPage {
  postKey : any;
  postCategory : any;

  wr_category : string;
  wr_date : string;
  wr_tags : string;
  wr_title : string;
  wr_writer : string;
  wr_description : string;
  wr_views : any;

  wr_user : any;
  wr_likes : any;
  wr_likes_count : any;   //총 좋아요 개수
  wr_like_state : any;    //내가 좋아요를 눌렀는가.

  wr_comments : any;
  wr_comments_count : any;  //총 댓글 개수
  wr_comment_user : any;    //HTML에서 사용되는 댓글 사용자 정보

  wr_comment_input = '';
  

  constructor(public navCtrl: NavController, public navParams : NavParams, public afDB : AngularFireDatabase, public dataProvider : DataProvider) {
    this.postKey = navParams.get('postKey');
    this.postCategory = navParams.get('postCategory');
    //좋아요 상태 설정//
    this.afDB.database.ref('/like/'+this.postKey).on('value', snap=>{
      if(snap.child(firebase.auth().currentUser.uid).hasChildren()){
        this.wr_like_state = 1;
      }else{
        this.wr_like_state = 0;
      }
    });
    this.wr_comment_user = new Array();
  }

  ionViewDidLoad() {
    // 조회수 추가 //
    // 게시글 정보 불러오기 //
    this.afDB.database.ref('/board/'+this.postCategory+'/'+this.postKey).once('value', post=>{
      this.wr_category = post.child('wr_category').val();
      this.wr_date = post.child('wr_date').val();
      this.wr_tags = post.child('wr_tags').val();
      this.wr_title = post.child('wr_title').val();
      this.wr_writer = post.child('wr_writer').val();
      this.wr_description = post.child('wr_description').val();
      this.wr_views = post.child('wr_views').val()+1;

    }).then(()=>{
      // 게시글 작성자 정보 불러오기 //
      this.dataProvider.getUser(this.wr_writer).snapshotChanges().take(1).subscribe(user => {
        this.wr_user = user;
      });
      this.afDB.database.ref('/board/'+this.postCategory+'/'+this.postKey).update({
        wr_views : this.wr_views
      })
    });
    // 게시글 좋아요 개수 불러오기 //
    this.afDB.database.ref('/like/'+this.postKey).on('value', likes=>{
      this.wr_likes_count = likes.numChildren();
    });
    // 게시글 댓글 개수 불러오기 //
    this.afDB.database.ref('/comments/'+this.postKey).on('value', comments=>{
      this.wr_comments_count = comments.numChildren();
    });

    // 게시글 댓글 불러오기 //
    this.dataProvider.getComments(this.postKey).snapshotChanges().subscribe(comments => {
      this.wr_comments = comments;
      this.wr_comments.forEach(comment=>{
        // 닉네임, 프로필사진 받아오기 //
        this.dataProvider.getUser(comment.payload.val().wr_writer).snapshotChanges().subscribe(userInfo => {
          comment.username = userInfo.payload.val().username;
          comment.profileImg = userInfo.payload.val().profileImg;
          console.log(comment.user);
        });
      });

    })
  }

  // 게시글 좋아요 누르기 //
  postLikeOn(){
    this.afDB.database.ref('/like/'+this.postKey+"/"+firebase.auth().currentUser.uid).set({
      date : firebase.database['ServerValue'].TIMESTAMP
    });
  }

  // 게시글 좋아요 취소 //
  postLikeOff(){
    this.afDB.database.ref('/like/'+this.postKey+"/"+firebase.auth().currentUser.uid).remove();
  }

  //댓글 쓰기 //
  commentWrite(){
    this.afDB.database.ref('/comments/'+this.postKey).push({
      wr_writer : firebase.auth().currentUser.uid,
      wr_description : this.wr_comment_input,
      wr_date : firebase.database['ServerValue'].TIMESTAMP
    }).then((success) => {
      this.afDB.database.ref('/accounts/'+firebase.auth().currentUser.uid+'/comments/').update({[success.key]: this.postKey });
    });
  }

  boardviewClose(){
    this.navCtrl.pop();
  }

}
