import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BoardwritePage } from './boardwrite';
import { ImageUploadModule } from "../../components/image-upload/image-upload.module";

@NgModule({
  declarations: [
    BoardwritePage
  ],
  imports: [
    IonicPageModule.forChild(BoardwritePage),
    ImageUploadModule,
  ],
})
export class BoardwritePageModule {}
