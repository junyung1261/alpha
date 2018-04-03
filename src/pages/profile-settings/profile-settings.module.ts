import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { ProfileSettingsPage } from './profile-settings';


@NgModule({
  declarations: [
    ProfileSettingsPage,
  ],
  imports: [
    IonicPageModule.forChild(ProfileSettingsPage),
    TranslateModule.forChild(),
    
  ],
})
export class ProfileSettingsPageModule { }
