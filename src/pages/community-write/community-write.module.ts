import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CommunityWritePage } from './community-write';
import { ImageUploadModule } from "../../components/image-upload/image-upload.module";
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [
    CommunityWritePage
  ],
  imports: [
    IonicPageModule.forChild(CommunityWritePage),
    TranslateModule.forChild(),
    ImageUploadModule,
  ],
})
export class BoardwritePageModule {}
