import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChatWaitingPage } from './chat-waiting';

@NgModule({
  declarations: [
    ChatWaitingPage,
  ],
  imports: [
    IonicPageModule.forChild(ChatWaitingPage),
  ],
})
export class ChatWaitingPageModule {}
