import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';


@IonicPage()
@Component({
  selector: 'page-profile-modify',
  templateUrl: 'profile-modify.html',
})
export class ProfileModifyPage {

  private currentUserId;
  private currentUserPhoto;
  private currentUserEmail;
  private currentUserNickname;
  
  private currentUserBirth;
  private currentUserGender;

  constructor(public navCtrl: NavController, public navParams: NavParams, public afAuth:AngularFireAuth) {
    this.currentUserId = this.afAuth.auth.currentUser.uid;
    this.currentUserPhoto = this.afAuth.auth.currentUser.photoURL;
    this.currentUserEmail = this.afAuth.auth.currentUser.email;
    this.currentUserNickname = this.afAuth.auth.currentUser.displayName;

    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfileModifyPage');
  }

}
