import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, AlertController, ActionSheetController, App, Platform } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators, ValidatorFn } from '@angular/forms';
import { AuthProvider, AlertProvider, TranslateProvider, LoadingProvider, ToastProvider, NotificationProvider, DataProvider, ImageProvider, LogoutProvider } from '../../providers';
// import { Keyboard } from '@ionic-native/keyboard'
import { Camera } from '@ionic-native/camera';
import { Subscription } from 'rxjs/Subscription';
import firebase from 'firebase';
import { AngularFireAuth } from 'angularfire2/auth';

@IonicPage()
@Component({
  selector: 'page-profile-settings',
  templateUrl: 'profile-settings.html',
})
export class ProfileSettingsPage {
  private android: boolean;
  private profileForm: FormGroup;
  private user: any;
  private userId: string;
  private hasError: boolean;
  private hasPassword: boolean;
  private hasPushToken: boolean;
  private subscription: Subscription;
  private uniqueUsername: boolean;
  private nameValidator: ValidatorFn = Validators.compose([
    Validators.required
  ]);
  private usernameValidator: ValidatorFn = Validators.compose([
    Validators.pattern('^[0-z.]{4,20}$'),
    Validators.required
  ]);
  private emailValidator: ValidatorFn = Validators.compose([
    Validators.required,
    Validators.email
  ]);
  private bioValidator: ValidatorFn = Validators.compose([
    Validators.required
  ]);

  constructor(private navCtrl: NavController,
    private app: App,
    private navParams: NavParams,
    private menuCtrl: MenuController,
    private alertCtrl: AlertController,
    private actionSheetCtrl: ActionSheetController,
    private formBuilder: FormBuilder,
    private afAuth: AngularFireAuth,
    private alert: AlertProvider,
    private translate: TranslateProvider,
    private dataProvider: DataProvider,
    private imageProvider: ImageProvider,
    private logoutProvider: LogoutProvider,
    private loading: LoadingProvider,
    private toast: ToastProvider,
    private notification: NotificationProvider,
    private camera: Camera,
    private platform: Platform) {
    this.profileForm = formBuilder.group({
     
      birth: ['', this.bioValidator],
      username: ['', this.usernameValidator],
      email: ['', this.emailValidator],
      bio: ['', this.bioValidator],
      gender: ['', this.bioValidator]
    });
  }

  keyDownFunction(event) {
    // User pressed return on keypad, proceed with updating profile.
    if (event.keyCode == 13) {
     
      this.updateProfile();
    }
  }

  onInput(username: string) {
    // Check if the username entered on the form is still available.
    // this.uniqueUsername = true;
    // if (this.profileForm.controls.username.valid && !this.profileForm.controls.username.hasError('required')) {
    //   this.firestore.getUserByUsername('@' + username.toLowerCase()).then((user: User) => {
    //     if (user && (this.userId != user.userId)) {
    //       this.uniqueUsername = false;
    //     }
    //   }).catch(() => { });
    // }
  }

  ionViewDidLoad() {
    // this.platform.ready().then(() => {
    //   // Check if device is running on android and adjust the scss accordingly.
    //   if (this.device.platform == 'Android') {
    //     this.android = true;
    //   } else {
    //     this.android = false;
    //   }
    // }).catch(() => { });
    // Set placeholder photo, while the user data is loading.
    

    
      // Check if user is logged in using email and password and show the change password button.
      this.userId = this.afAuth.auth.currentUser.uid;
    
      // Get userData from Firestore and update the form accordingly.
      this.dataProvider.getUser(this.userId).valueChanges().subscribe(user => {
        
          this.user = user;
          this.hasPushToken = this.user.notifications;
          this.profileForm.setValue({
            username: this.user.username,
            birth: this.user.birth,
            gender: this.user.gender,
            email: this.user.email,
            bio: 'sdf'
          });
          this.uniqueUsername = true;
        });
  }
 

  ionViewWillUnload() {
    // Unsubscribe to Subscription.
    if (this.subscription)
      this.subscription.unsubscribe();
    // Delete the photo uploaded from storage to preserve Firebase storage space since it's no longer going to be used.
    // if (this.auth.getUserData().photo != this.user.photo)
    //   this.storage.delete(this.user.userId, this.user.photo);
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
              this.imageProvider.setProfilePhoto(this.user, this.camera.PictureSourceType.CAMERA);
              
            }
          },
          {
            text: this.translate.get('auth.profile.photo.gallery'),
            handler: () => {
              this.imageProvider.setProfilePhoto(this.user, this.camera.PictureSourceType.PHOTOLIBRARY);
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

  private updateProfile(): void {
    // Check if profileForm is valid and username is unique and proceed with updating the profile.
    if (!this.profileForm.valid || !this.uniqueUsername) {
      this.hasError = true;
    } else {
      if (this.uniqueUsername) {
        this.loading.show();
       
       
        
        let username =  '@' + this.profileForm.value['username'].toLowerCase();
        let bio = this.profileForm.value['bio'];
            
      
        this.dataProvider.getUser(this.userId).update({
          
        
          username: username,
          bio: bio,
          notifications: this.hasPushToken

        }).then(success => {
          // Formatting the first and last names to capitalized.
            // Initialize pushToken to receive push notifications if the user enabled them, otherwise clear pushToken.
            if (this.hasPushToken) {
              this.notification.init();
            } else {
              this.notification.destroy();
            }
            this.loading.hide();
            this.toast.show(this.translate.get('auth.profile.updated'));
          }).catch(() => { });
       
      }
    }
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
            this.notification.destroy();
          }
        }
      ]
    });
    alert.present();
  }
}
