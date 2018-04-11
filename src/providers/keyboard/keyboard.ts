import { Injectable, ViewChild } from '@angular/core';

import { Keyboard } from '@ionic-native/keyboard';
import { Content } from 'ionic-angular';


@Injectable()
export class KeyboardProvider {
  @ViewChild("content") contentHandle: Content;

  private contentBox;
  private tabBarHeight;
  private subscriptions;
  
  constructor(
      public keyboard: Keyboard) {
    console.log("Initializing Keyboard Provider");
  }

  keyboardInit(page){

    let query = "." + page + " .scroll-content";
    console.log(query);
    this.subscriptions = [];

    this.contentBox=document.querySelector(query)['style'];
    this.tabBarHeight = this.contentBox.marginBottom;
    let subscription = this.keyboard.onKeyboardShow().subscribe(() => {
      
    document.querySelector(".tabbar")['style'].display = 'none';
    this.contentBox.marginBottom = 0;
    this.contentHandle.resize();
    })

    let subscription_ = this.keyboard.onKeyboardHide().subscribe(() => {
     
    document.querySelector(".tabbar")['style'].display = 'flex';
    this.contentBox.marginBottom = this.tabBarHeight;
    this.contentHandle.resize();
    })

    this.subscriptions.push(subscription);
    this.subscriptions.push(subscription_)

  }

  keyboardTerminate(){
      if(this.subscriptions)
      this.subscriptions.forEach(subscription => {
          subscription.unsubscribe();
      })
  }
}