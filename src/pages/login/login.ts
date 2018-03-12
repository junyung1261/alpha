import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Platform  } from 'ionic-angular';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LoginProvider } from '../../providers/auth/login';
import { Validator } from '../../validator';


@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  private mode: string;
  private emailPasswordForm: FormGroup;
  private emailPasswordNicknameForm: FormGroup;
  private emailForm: FormGroup;
  public text: any;
  private status: any;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public loginProvider: LoginProvider, 
    public formBuilder: FormBuilder,
    public modalCtrl: ModalController) {

    this.status = 0;
    this.mode = this.navParams.get('mode'); 
    
    this.loginProvider.setNavController(this.navCtrl);
    // Create our forms and their validators based on validators set on validator.ts.
    this.emailPasswordForm = formBuilder.group({
      email: Validator.emailValidator,
      password: Validator.passwordValidator
    });
    this.emailPasswordNicknameForm = formBuilder.group({
      email: Validator.emailValidator,
      password: Validator.passwordValidator,
      nickname: Validator.nicknameValidator
    });
  }


  viewLogin(){
    this.status = 1;
  }
  viewRegister(){
    this.status = 2;
  }

  ionViewDidLoad() {
   
    console.log('ionViewDidLoad LoginPage');
    this.mode = 'main';
  }

  login() {
    this.loginProvider.emailLogin(this.emailPasswordForm.value["email"], this.emailPasswordForm.value["password"]);
  }

  register() {
    this.loginProvider.register(this.emailPasswordNicknameForm.value["email"], this.emailPasswordNicknameForm.value["password"], this.emailPasswordNicknameForm.value["nickname"]);
  }

  // Call loginProvider and send a password reset email.
  forgotPassword() {
    this.loginProvider.sendPasswordReset(this.emailForm.value["email"]);
    this.clearForms();
  }

  // Clear the forms.
  clearForms() {
    this.emailPasswordForm.reset();
    this.emailForm.reset();
  }
}
