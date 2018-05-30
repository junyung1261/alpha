import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CommunitySearchPage } from './community-search';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    CommunitySearchPage,
  ],
  imports: [
    IonicPageModule.forChild(CommunitySearchPage),
    TranslateModule.forChild()
  ],
})
export class CommunitySearchPageModule {}
