import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CommunityPage } from './community';
import { PipeModule } from '../../pipes/pipe.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    CommunityPage,
  ],
  imports: [
    IonicPageModule.forChild(CommunityPage),
    TranslateModule.forChild(),
    PipeModule
  ],
})
export class CommunityPageModule {}
