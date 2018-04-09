import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CommunityPostPage } from './community-post';
import { PipeModule } from '../../pipes/pipe.module';

@NgModule({
  declarations: [
    CommunityPostPage
    
  ],
  imports: [
    IonicPageModule.forChild(CommunityPostPage),
    PipeModule
  ],
  exports: [
    CommunityPostPage
  ]
})
export class BoardviewPageModule {}
