import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ContestApplyPage } from './contest-apply';
import { ImageUploadContestModule } from '../../components/image-upload-contest/image-upload-contest.module';



@NgModule({
  declarations: [
    ContestApplyPage,
  ],
  imports: [
    IonicPageModule.forChild(ContestApplyPage),
    ImageUploadContestModule
  ]
  
})
export class ContestApplyPageModule {}
