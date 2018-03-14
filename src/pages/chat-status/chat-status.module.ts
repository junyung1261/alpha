import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChatStatusPage } from './chat-status';

@NgModule({
  declarations: [
    ChatStatusPage,
  ],
  imports: [
    IonicPageModule.forChild(ChatStatusPage),
  ],
})
export class ChatStatusPageModule {}
