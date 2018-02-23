import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChatRandomPage } from './chat-random';
import { Vibration } from '@ionic-native/vibration';
@NgModule({
  declarations: [
    ChatRandomPage,
  ],
  imports: [
    IonicPageModule.forChild(ChatRandomPage),
  ],
  providers: [
    Vibration
  ]
})
export class ChatRandomPageModule {}
