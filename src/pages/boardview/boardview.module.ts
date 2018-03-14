import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BoardviewPage } from './boardview';
import { PipeModule } from '../../pipes/pipe.module';

@NgModule({
  declarations: [
    BoardviewPage
    
  ],
  imports: [
    IonicPageModule.forChild(BoardviewPage),
    PipeModule
  ],
  exports: [
    BoardviewPage
  ]
})
export class BoardviewPageModule {}
