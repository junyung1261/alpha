import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { InAppPurchase2, IAPProduct } from '@ionic-native/in-app-purchase-2';
import { AngularFireDatabase } from 'angularfire2/database';
import { DataProvider } from '../../providers';

/**
 * Generated class for the PurchasePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-purchase',
  templateUrl: 'purchase.html',
})
export class PurchasePage {

  private products = [];
  private user;

  public product: any = {
    name: 'xianghanguo',
    appleProductId: '1234',
    googleProductId: 'alpha.xinhan.tianya'
  };

  constructor(private navCtrl: NavController, 
              private navParams: NavParams,
              private platform: Platform,
              private inAppPurchase2: InAppPurchase2,
              private dataProvider: DataProvider
              
            
            ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PurchasePage');

    this.dataProvider.getCurrentUser().snapshotChanges().subscribe(user => {
      this.user = user;
    })
    this.dataProvider.getProducts().valueChanges().take(1).subscribe(products => {
      this.products = products;
      
      this.products.forEach(product =>{
        console.log(product);
        this.configurePurchase(product.productId);
      })
   
    })

  }


  async configurePurchase(productId){
    console.log(productId);
    
    try{
    //   if(this.platform.is('ios')){
    //     productId = this.product.appleProductId;
    //   }
    //   else if(this.platform.is('andorid')){
    //     productId = this.product.googleProductId;
    //   }
      this.inAppPurchase2.verbosity = this.inAppPurchase2.DEBUG;

      
     

      this.inAppPurchase2.register({
        id: productId,
        alias: productId,
        type: this.inAppPurchase2.CONSUMABLE
      });
      this.registerHandlers(productId);

      this.inAppPurchase2.ready().then((status) => {
        console.log(JSON.stringify(this.inAppPurchase2.get(productId)));
        console.log('Store is Ready: ' + JSON.stringify(status));
        console.log('Products: ' + JSON.stringify(this.inAppPurchase2.products));
      });

      this.inAppPurchase2.when(productId).error((error)=> {
        alert('An Error Occured' + JSON.stringify(error));
      });

      console.log('refresh purchase');
      this.inAppPurchase2.refresh();

    }catch(err) {
      console.log('Error on Store Issues' + JSON.stringify(err));
    }
  }

  registerHandlers(productId) {
    // Handlers
    //
      this.inAppPurchase2.when(productId).owned( (product: IAPProduct) => {
    //Place code to activate what happens when your user already owns the product here
        product.finish();
      });
  
      this.inAppPurchase2.when(productId).registered( (product: IAPProduct) => {
        console.log('Registered: ' + JSON.stringify(product));
      });
  
      this.inAppPurchase2.when(productId).updated( (product: IAPProduct) => {
        console.log('Loaded' + JSON.stringify(product));
      });
  
      this.inAppPurchase2.when(productId).cancelled( (product) => {
        alert('Purchase was Cancelled');
      });

    
  
      // Overall Store Error
      this.inAppPurchase2.error( (err) => {
        alert('Store Error ' + JSON.stringify(err));
      });
    }

    // async restorepurchase() {
    //   // if (!this.platform.is('cordova')) { return };
    //   this.configurePurchase();
  
    //   let productId;
  
    //   if (this.platform.is('ios')) {
    //     productId = this.product.appleProductId;
    //   } else if (this.platform.is('android')) {
    //     productId = this.product.googleProductId;
    //   }
  
    //   console.log('Products: ' + JSON.stringify(this.inAppPurchase2.products));
    //   console.log('Refreshing Store: ' + productId);
    //   try {
    //     let product = this.inAppPurchase2.get(productId);
    //     console.log('Product Info: ' + JSON.stringify(product));
    //     this.inAppPurchase2.refresh();
    //     alert('Finished Restore');
    //   } catch (err) {
    //     console.log('Error Ordering ' + JSON.stringify(err));
    //   }
    // }


    async purchase(productId) {
      /* Only configuring purchase when you want to buy, because when you configure a purchase
      It prompts the user to input their apple id info on config which is annoying */
      // if (!this.platform.is('cordova')) { return };
  
  
      // if (this.platform.is('ios')) {
      //   productId = this.product.appleProductId;
      // } else if (this.platform.is('android')) {
      //   productId = this.product.googleProductId;
      // }
  
      console.log('Products: ' + JSON.stringify(this.inAppPurchase2.products));
      console.log('Ordering From Store: ' + productId);
      try {
        let product = this.inAppPurchase2.get(productId);
        console.log('Product Info: ' + JSON.stringify(product));
        let order = await this.inAppPurchase2.order(productId);
        alert('Finished Purchase');
      } catch (err) {
        console.log('Error Ordering ' + JSON.stringify(err));
      }
    }
}
