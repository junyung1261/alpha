import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ModalController, AlertController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase';
import { LogoutProvider } from '../../providers/auth/logout';

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  category: any[];
  user;
  private opts_edit: any = {
    showBackdrop: true,
    enableBackdropDismiss: true,
    cssClass:'x-edit-profile-view'
  }
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public viewCtrl: ViewController,
    private afAuth: AngularFireAuth, 
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private logoutProvider: LogoutProvider

  ) {
    this.afAuth.authState.subscribe(user => {
      if (!user) {      }
      // page for auth. users
      else {
        if (true) {
          this.user = firebase.auth().currentUser;
        } else {  }
      }
    });
  };

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
    this.user = firebase.auth().currentUser;
  }

  editProfile(){
    let editModal = this.modalCtrl.create('ProfileModifyPage',{},this.opts_edit);
    editModal.present();
  }
  presentModal(modalName) {
    let createModal = this.modalCtrl.create(modalName, { userId: 8675309 }, {
      enterAnimation: 'modal-slide-in',
      leaveAnimation: 'modal-slide-out'
    });
    createModal.onDidDismiss(data => {
      //console.log(data);
    });
    createModal.present();
  }
  
  
  locateCustomerServiceEmail(){ 
    //this email(wangting5@naver.com) is for test.
    //And test is done. So, Don't send any mail.
    window.location.href = "mailto:support@xianghanguo.com";
  }

  logout(){
    let alert = this.alertCtrl.create({
      title: '로그아웃',
      message: '정말로 로그아웃 하시겠습니까?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
          }
        },
        {
          text: 'Logout',
          handler: () => {
            this.logoutProvider.logout();
          }
        }
      ]
    });
    alert.present();
  }

  openPage(pagename){
    this.navCtrl.push(pagename);
  }
}