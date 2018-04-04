import { NgModule } from '@angular/core';
import { ChatsPipe } from './chats'
import { DateFormatPipe } from './date';

@NgModule({
    declarations: [
        DateFormatPipe,
        ChatsPipe
    ],
    imports: [

    ],
    exports: [
        DateFormatPipe,
        ChatsPipe
    ]
    
})
export class PipeModule {}