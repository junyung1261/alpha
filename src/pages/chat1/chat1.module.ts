import { NgModule, ErrorHandler } from '@angular/core';
import { IonicPageModule, Content, IonicErrorHandler } from 'ionic-angular';
import { Chat1Page } from './chat1';

@NgModule({
  declarations: [
    Chat1Page,
  ],
  imports: [
    IonicPageModule.forChild(Chat1Page),
  ],
  providers:[
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class Chat1PageModule {}
