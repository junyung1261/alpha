import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LoginViewPage } from './login-view';

@NgModule({
  declarations: [
    LoginViewPage,
  ],
  imports: [
    IonicPageModule.forChild(LoginViewPage),
  ],
})
export class LoginViewPageModule {}
