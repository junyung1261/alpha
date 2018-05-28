import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PurchasePage } from './purchase';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    PurchasePage,
  ],
  imports: [
    IonicPageModule.forChild(PurchasePage),
    TranslateModule.forChild()
  ],
})
export class PurchasePageModule {}
