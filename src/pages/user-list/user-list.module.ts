import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserListPage } from './user-list';
import { TranslateModule } from '@ngx-translate/core';
import { PipeModule } from '../../pipes/pipe.module';

import { IonicImageLoader } from 'ionic-image-loader';

@NgModule({
  declarations: [
    UserListPage,
  ],
  imports: [
    IonicPageModule.forChild(UserListPage),
    TranslateModule.forChild(),
    IonicImageLoader,
    PipeModule
  ],
  
})
export class UserListPageModule {}
