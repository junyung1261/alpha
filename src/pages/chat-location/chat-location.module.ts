import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChatLocationPage } from './chat-location';
import { Vibration } from '@ionic-native/vibration';
@NgModule({
  declarations: [
    ChatLocationPage,
  ],
  imports: [
    IonicPageModule.forChild(ChatLocationPage),
  ],
  providers:[
    Vibration
  ]
})
export class ChatLocationPageModule {}