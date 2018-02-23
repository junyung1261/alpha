import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChatShakePage } from './chat-shake';
import { Shake } from '@ionic-native/shake';
import { Vibration } from '@ionic-native/vibration';

@NgModule({
  declarations: [
    ChatShakePage,
  ],
  imports: [
    IonicPageModule.forChild(ChatShakePage),
  ],
  providers: [
    Shake,
    Vibration,
  ]
})
export class ChatShakePageModule {}