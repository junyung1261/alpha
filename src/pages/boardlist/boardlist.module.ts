import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BoardlistPage } from './boardlist';
@NgModule({
  declarations: [
    BoardlistPage,
  ],
  imports: [
    IonicPageModule.forChild(BoardlistPage),
  ],
})
export class BoardlistPageModule {}
