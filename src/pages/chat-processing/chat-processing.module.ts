import { NgModule, ErrorHandler } from '@angular/core';
import { IonicPageModule, Content, IonicErrorHandler } from 'ionic-angular';
import { ChatProcessingPage } from './chat-processing';

@NgModule({
  declarations: [
    ChatProcessingPage,
  ],
  imports: [
    IonicPageModule.forChild(ChatProcessingPage),
  ],
  providers:[
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class ChatProcessingPageModule {}
