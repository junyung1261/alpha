import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,Platform, ViewController } from 'ionic-angular';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LoginProvider } from '../../providers';
import { Validator } from '../../validator';
import { LoadingProvider } from '../../providers/loading/loading';
import { AlertProvider } from '../../providers/alert/alert';


@IonicPage()
@Component({
  selector: 'page-login-view',
  templateUrl: 'login-view.html',
})
export class LoginViewPage {

  private viewType : any;
  private emailPasswordForm: FormGroup;
  private emailPasswordNicknameForm: FormGroup;
  private explain_login : string;
  private explain_join : string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public loginProvider: LoginProvider, public formBuilder: FormBuilder, public viewCtrl:ViewController, 
    public loadingProvider: LoadingProvider, public alertProvider: AlertProvider) {
    this.viewType = this.navParams.get('type');

    this.emailPasswordForm = formBuilder.group({
      email: Validator.emailValidator,
      password: Validator.passwordValidator
    });
    this.emailPasswordNicknameForm = formBuilder.group({
      email: Validator.emailValidator,
      password: Validator.passwordValidator,
      nickname: Validator.nicknameValidator
    });
    this.explain_login= '이메일 주소와 비밀번호를 입력해주세요.';
    this.explain_join ='이메일 주소, 닉네임, 비밀번호를 입력해주세요.';
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginViewPage');
  }


  login() {
    this.loadingProvider.show();
    this.loginProvider.emailLogin(this.emailPasswordForm.value["email"], this.emailPasswordForm.value["password"])
    .then((success) => {
      this.loadingProvider.hide();
      this.viewCtrl.dismiss();
    })
    .catch((error) => {
      this.loadingProvider.hide();
      // let code = error["code"];
      // this.alertProvider.showErrorMessage(code);
      this.explain_login='아이디 혹은 비밀번호가 잘못되었습니다.';
      this.emailPasswordForm.reset();
    });
    
  }

  join() {
    this.loadingProvider.show();
    this.loginProvider.register(this.emailPasswordNicknameForm.value["email"], this.emailPasswordNicknameForm.value["password"], this.emailPasswordNicknameForm.value["nickname"])
      .then((success) => {
        success.updateProfile({
          displayName: this.emailPasswordNicknameForm.value["nickname"]
        }).then((success) => {
          this.loadingProvider.hide();
          this.navCtrl.setRoot('VerificationPage');
        });
      })
      .catch((error) => {
        this.loadingProvider.hide();
        this.explain_join='회원가입에 실패하였습니다.';
        // let code = error["code"];
        // this.alertProvider.showErrorMessage(code);
      });
  }

  // // Call loginProvider and send a password reset email.
  // forgotPassword() {
  //   this.loginProvider.sendPasswordReset(this.emailForm.value["email"]);
  //   this.clearForms();
  // }

  // // Clear the forms.
  // clearForms() {
  //   this.emailPasswordForm.reset();
  //   this.emailForm.reset();
  // }


}
