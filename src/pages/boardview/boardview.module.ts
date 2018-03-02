import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BoardviewPage } from './boardview';


@NgModule({
  declarations: [
    BoardviewPage
    
  ],
  imports: [
    IonicPageModule.forChild(BoardviewPage),
  ],
  exports: [
    BoardviewPage
  ]
})
export class BoardviewPageModule {}
