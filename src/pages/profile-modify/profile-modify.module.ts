import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProfileModifyPage } from './profile-modify';

@NgModule({
  declarations: [
    ProfileModifyPage,
  ],
  imports: [
    IonicPageModule.forChild(ProfileModifyPage),
  ],
})
export class ProfileModifyPageModule {}
