import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChatIntroPage } from './chat-intro';

@NgModule({
  declarations: [
    ChatIntroPage,
  ],
  imports: [
    IonicPageModule.forChild(ChatIntroPage),
  ],
})
export class ChatIntroPageModule {}
