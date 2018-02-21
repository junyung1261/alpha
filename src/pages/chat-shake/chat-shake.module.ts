import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChatShakePage } from './chat-shake';
import { Shake } from '@ionic-native/shake';

@NgModule({
  declarations: [
    ChatShakePage,
  ],
  imports: [
    IonicPageModule.forChild(ChatShakePage),
  ],
  providers: [
    Shake,
  ]
})
export class ChatShakePageModule {}