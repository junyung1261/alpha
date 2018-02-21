import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChatLocationPage } from './chat-location';

@NgModule({
  declarations: [
    ChatLocationPage,
  ],
  imports: [
    IonicPageModule.forChild(ChatLocationPage),
  ],
})
export class ChatLocationPageModule {}