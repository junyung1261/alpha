import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ContestPage } from './contest';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [
    ContestPage,
  ],
  imports: [
    IonicPageModule.forChild(ContestPage),
    TranslateModule.forChild(),
  ],
})
export class ContestPageModule {}
