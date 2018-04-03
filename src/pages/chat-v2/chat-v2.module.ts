import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChatV2Page } from './chat-v2';

@NgModule({
  declarations: [
    ChatV2Page,
  ],
  imports: [
    IonicPageModule.forChild(ChatV2Page),
  ],
})
export class ChatPageV2Module {}
