import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import { DataProvider, LoadingProvider, AlertProvider } from '../../providers';
import { validateCallback } from '@firebase/util';
import { InAppPurchase2, IAPProduct } from '@ionic-native/in-app-purchase-2';
import { DecimalPipe } from '@angular/common';

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
export class PurchasePage implements OnInit{

  private productsToShow = [];
  private productIds = [];
  private products = [];
  private user: any;


  constructor(private navCtrl: NavController, 
              private navParams: NavParams,
              private platform: Platform,
              private dataProvider: DataProvider,
              private loadingProvider: LoadingProvider,
              private alertProvider: AlertProvider,
              private store: InAppPurchase2
              
            
            ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PurchasePage');

    this.dataProvider.getCurrentUser().snapshotChanges().subscribe(user => {
      this.user = user;
    })
    

  }

  
  ngOnInit() {
    this.dataProvider.getProducts().valueChanges().take(1).subscribe((products :any) => {
      this.productsToShow = products;
      this.productsToShow.forEach(product => {
        this.configurePurchasing(product);
      })
      // this.configureProducts(products);
    })
    
  }

  configurePurchasing(product) {
    if (!this.platform.is('cordova')) { return; }
    let productId;
    try {
      if (this.platform.is('ios')) {
        productId = product.productId;
      } else if (this.platform.is('android')) {
        productId = product.productId;
      }
      
      
      // Register Product
      // Set Debug High
      this.store.verbosity = this.store.DEBUG;
      // Register the product with the store
      this.store.register({
        id: productId,
        alias: product.name,
        type: this.store.CONSUMABLE
      });

      this.registerHandlers(product);

      this.store.ready().then((status) => {
        console.log(JSON.stringify(this.store.get(productId)));
        console.log('Store is Ready: ' + JSON.stringify(status));
        console.log('Products: ' + JSON.stringify(this.store.products));
      });

      // Errors On The Specific Product
      this.store.when(productId).error( (error) => {
        alert('An Error Occured' + JSON.stringify(error));
      });
      // Refresh Always
      console.log('Refresh Store');
      this.store.refresh();
    } catch (err) {
      console.log('Error On Store Issues' + JSON.stringify(err));
    }
  }

  registerHandlers(selectedProduct) {
    // Handlers
    this.store.when(selectedProduct.productId).approved( (product: IAPProduct) => {
      // Purchase was approved
      this.dataProvider.getCurrentUser().update({
        heart: this.user.heart + selectedProduct.ammount
      }).then(()=>{
        product.finish();
      })
      
    });

    this.store.when(selectedProduct.productId).registered( (product: IAPProduct) => {
      console.log('Registered: ' + JSON.stringify(product));
    });

    this.store.when(selectedProduct.productId).updated( (product: IAPProduct) => {
      console.log('Loaded' + JSON.stringify(product));
    });

    this.store.when(selectedProduct.productId).cancelled( (product) => {
      console.log('Purchase was Cancelled');
    });

    // Overall Store Error
    this.store.error( (err) => {
      alert('Store Error ' + JSON.stringify(err));
    });
  }

  async purchase(selectedProduct) {
    /* Only configuring purchase when you want to buy, because when you configure a purchase
    It prompts the user to input their apple id info on config which is annoying */
    if (!this.platform.is('cordova')) { return };

    let productId;

    if (this.platform.is('ios')) {
      productId = selectedProduct.productId;
    } else if (this.platform.is('android')) {
      productId = selectedProduct.productId;
    }

    console.log('Products: ' + JSON.stringify(this.store.products));
    console.log('Ordering From Store: ' + productId);
    try {
      let product = this.store.get(productId);
      console.log('Product Info: ' + JSON.stringify(product));
      let order = await this.store.order(productId);
      console.log('Finished Purchase');
    } catch (err) {
      console.log('Error Ordering ' + JSON.stringify(err));
    }
  }

  numToMoney(number : number){
    return '￦ ' + number.toFixed().replace(/(\d)(?=(\d{3})+(,|$))/g, '$1,');
  }

}
