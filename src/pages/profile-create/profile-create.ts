import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, ActionSheetController, Platform } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators, ValidatorFn } from '@angular/forms';
import { AuthProvider, TranslateProvider, DataProvider, LoadingProvider, NotificationProvider, ImageProvider } from '../../providers';
import { Keyboard } from '@ionic-native/keyboard';
import { Camera } from '@ionic-native/camera';

import firebase from 'firebase';


/**
 * Generated class for the ProfileCreatePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profile-create',
  templateUrl: 'profile-create.html',
})
export class ProfileCreatePage {
  private profileForm: FormGroup;
  private photo: string = 'assets/imgs/noavatar.png';
  private userId: string;
  private user : any;
  private hasError: boolean;
  private uniqueUsername: boolean;
  private nameValidator: ValidatorFn = Validators.compose([
    Validators.required
  ]);
  private usernameValidator: ValidatorFn = Validators.compose([
    Validators.required,
    Validators.pattern('^([a-zA-Z0-9\u4E00-\u9FA5\uF900-\uFA2D\u3131-\uD79D]{4,20})*$')
  ]);
  private requiredValidator: ValidatorFn = Validators.compose([
    Validators.required
  ])
  private emailValidator: ValidatorFn = Validators.compose([
    Validators.required,
    Validators.email
  ]);
  private bioValidator: ValidatorFn = Validators.compose([
    Validators.required
  ]);


  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public formBuilder: FormBuilder,
              public authProvider: AuthProvider,
              public dataProvider: DataProvider,
              public translate: TranslateProvider,
              public loadingProvider: LoadingProvider,
              public notificationProvider: NotificationProvider,
              public imageProvider: ImageProvider,
              public actionSheetCtrl: ActionSheetController,
              public camera: Camera,
            
            ) {
              this.profileForm = formBuilder.group({
                username: ['', this.usernameValidator],
                gender: ['', this.requiredValidator],
                birth: ['', this.requiredValidator],
                address: ['', this.requiredValidator],
                email:['',this.emailValidator],
                bio: ['', this.bioValidator]
              });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfileCreatePage');
    
      this.userId = firebase.auth().currentUser.uid;
      
     
      let username = '';
      
      
      this.profileForm.setValue({
        username: username,
        gender: null,
        birth: null,
        address: null,
        bio: null,
        email: firebase.auth().currentUser.email
      });

    
  }

  createProfile(): void {
    // Check if profileForm is valid and username is unique and proceed with creating the profile.
    if (!this.profileForm.valid) {
      this.hasError = true;
    } else {
      console.log(this.userId);
      this.loadingProvider.show();
      let username = this.profileForm.value['username'];
      let gender = this.profileForm.value['gender'];
      let birth = this.profileForm.value['birth'];
      let address = this.profileForm.value['address'];
      let bio = this.profileForm.value['bio'];
      this.dataProvider.getUser(this.userId).set({
        // Formatting the first and last names to capitalized.
        profileImg: this.photo,
        username: username,
        gender: gender,
        birth: birth,
        address: address,
        email: firebase.auth().currentUser.email,
        bio: bio,
        notifications: true
        
      }).then(()=>{
        this.notificationProvider.init();
        this.loadingProvider.hide();
        this.navCtrl.setRoot('LoaderPage');
      }).catch(() => { });
    }
    
  }

  private setPhoto(): void {
    // Allow user to upload and set their profile photo using their camera or photo gallery.
    if (true) {
      this.actionSheetCtrl.create({
        title: this.translate.get('auth.profile.photo.title'),
        buttons: [
          {
            text: this.translate.get('auth.profile.photo.take'),
            role: 'destructive',
            handler: () => {
              this.imageProvider.setProfilePhoto(this.userId, null, this.camera.PictureSourceType.CAMERA);
              
            }
          },
          {
            text: this.translate.get('auth.profile.photo.gallery'),
            handler: () => {
              this.imageProvider.setProfilePhoto(this.userId, null, this.camera.PictureSourceType.PHOTOLIBRARY);
            }
          },
          {
            text: this.translate.get('auth.profile.photo.cancel'),
            role: 'cancel',
            handler: () => { }
          }
        ]
      }).present();
    }
  }

}
