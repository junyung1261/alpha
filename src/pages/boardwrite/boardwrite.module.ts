import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BoardwritePage } from './boardwrite';

@NgModule({
  declarations: [
    BoardwritePage
  ],
  imports: [
    IonicPageModule.forChild(BoardwritePage),
  ],
})
export class BoardwritePageModule {}
