import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ImageUploadContest } from './image-upload-contest';

@NgModule({
  declarations: [
    ImageUploadContest,
  ],
  imports: [
    IonicPageModule.forChild(ImageUploadContest),
  ],
  exports: [
    ImageUploadContest
  ]
})
export class ImageUploadContestModule {}
