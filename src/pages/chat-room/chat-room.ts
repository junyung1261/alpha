import { Component, ViewChild, Input } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Content, Keyboard } from 'ionic-angular';
import { DataProvider } from '../../providers/data/data';
import { AngularFireDatabase } from 'angularfire2/database';
import { ImageProvider } from '../../providers/data/image';
import { Camera } from '@ionic-native/camera';
import { RequestProvider } from '../../providers/data/request';
import * as firebase from 'firebase';

/**
 * Generated class for the ChatRoomPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-chat-room',
  templateUrl: 'chat-room.html',
})
export class ChatRoomPage {
  @ViewChild('input') myInput ;
  @ViewChild(Content) content: Content;
  private userId: any;
  private title: any;
  private message: any;
  private messages: any;
  private alert: any;
  private messagesToShow: any;
  private startIndex: any = -1;
  private scrollDirection: any = 'bottom';
  private numberOfMessages = 10;
  private updateDateTime: any;
  private conversationId: any;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public requestProvider: RequestProvider,
    public imageProvider: ImageProvider,
    public afDB: AngularFireDatabase,
    public camera: Camera,
    public keyboard: Keyboard
    ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChatRoomPage');
    
    this.userId = this.navParams.get('userId');
    this.requestProvider.getUser(this.userId).subscribe((user) => {
      this.title = user.username;
    });
   // Get conversationInfo with friend.
   this.requestProvider.getChatMessages(this.userId).subscribe((conversation) => {
    if (conversation.$exists()) {
      // User already have conversation with this friend, get conversation
      this.conversationId = conversation.conversationId;

      // Get conversation
      this.requestProvider.getConversationMessages(this.conversationId).subscribe((messages) => {
        if (this.messages) {
          // Just append newly added messages to the bottom of the view.
          if (messages.length > this.messages.length) {
            let message = messages[messages.length - 1];
            this.requestProvider.getUser(message.sender).subscribe((user) => {
              message.avatar = user.profileImg;
            });
            this.messages.push(message);
            // Also append to messagesToShow.
            this.messagesToShow.push(message);
            // Reset scrollDirection to bottom.
            this.scrollDirection = 'bottom';
          }
        } else {
          // Get all messages, this will be used as reference object for messagesToShow.
          this.messages = [];
          messages.forEach((message) => {
            this.requestProvider.getUser(message.sender).subscribe((user) => {
              message.avatar = user.profileImg;
            });
            this.messages.push(message);
          });
          // Load messages in relation to numOfMessages.
          if (this.startIndex == -1) {
            // Get initial index for numberOfMessages to show.
            if ((this.messages.length - this.numberOfMessages) > 0) {
              this.startIndex = this.messages.length - this.numberOfMessages;
            } else {
              this.startIndex = 0;
            }
          }
          if (!this.messagesToShow) {
            this.messagesToShow = [];
          }
          // Set messagesToShow
          for (var i = this.startIndex; i < this.messages.length; i++) {
            this.messagesToShow.push(this.messages[i]);
          }
          //this.loadingProvider.hide();
        }
      });
    }
  });

  // Update messages' date time elapsed every minute based on Moment.js.
  var that = this;
  if (!that.updateDateTime) {
    that.updateDateTime = setInterval(function() {
      if (that.messages) {
        that.messages.forEach((message) => {
          let date = message.date;
          message.date = new Date(date);
        });
      }
    }, 60000);
  }
}

  send() {
    if (this.message) {
      // User entered a text on messagebox
      if (this.conversationId) {
        // Add Message to the existing conversation
        // Clone an instance of messages object so it will not directly be updated.
        // The messages object should be updated by our observer declared on ionViewDidLoad.
        let messages = JSON.parse(JSON.stringify(this.messages));
        messages.push({
          date: new Date().toString(),
          sender: firebase.auth().currentUser.uid,
          type: 'text',
          message: this.message
        });
        // Update conversation on database.
        this.requestProvider.getConversation(this.conversationId).update({
          messages: messages
        });
        // Clear messagebox.
        this.message = '';
      } else {
        // New Conversation with friend.
        var messages = [];
        messages.push({
          date: new Date().toString(),
          sender: firebase.auth().currentUser.uid,
          type: 'text',
          message: this.message
        });
        var users = [];
        users.push(firebase.auth().currentUser.uid);
        users.push(this.userId);
        // Add conversation.
        this.afDB.list('conversations').push({
          dateCreated: new Date().toString(),
          messages: messages,
          users: users
        }).then((success) => {
          let conversationId = success.key;
          this.message = '';
          // Add conversation reference to the users.
          this.afDB.object('/chat/' + firebase.auth().currentUser.uid + '/conversations/' + this.userId).update({
            conversationId: conversationId,
            messagesRead: 1
          });
          this.afDB.object('/chat/' + this.userId + '/conversations/' + firebase.auth().currentUser.uid).update({
            conversationId: conversationId,
            messagesRead: 0
          });
        });
      }
    }
    this.myInput.setFocus();
  }

  sendPhoto() {
    this.alert = this.alertCtrl.create({
      title: 'Send Photo Message',
      message: 'Do you want to take a photo or choose from your photo gallery?',
      buttons: [
        {
          text: 'Cancel',
          handler: data => { }
        },
        {
          text: 'Choose from Gallery',
          handler: () => {
            // Upload image then return the url.
            this.imageProvider.uploadPhotoMessage(this.conversationId, this.camera.PictureSourceType.PHOTOLIBRARY).then((url) => {
              // Process image message.
              this.sendPhotoMessage(url);
            });
          }
        },
        {
          text: 'Take Photo',
          handler: () => {
            // Upload image then return the url.
            this.imageProvider.uploadPhotoMessage(this.conversationId, this.camera.PictureSourceType.CAMERA).then((url) => {
              // Process image message.
              this.sendPhotoMessage(url);
            });
          }
        }
      ]
    }).present();
  }

  sendPhotoMessage(url) {
    if (this.conversationId) {
      // Add image message to existing conversation.
      let messages = JSON.parse(JSON.stringify(this.messages));
      messages.push({
        date: new Date().toString(),
        sender: firebase.auth().currentUser.uid,
        type: 'image',
        url: url
      });
      // Update conversation on database.
      this.requestProvider.getConversation(this.conversationId).update({
        messages: messages
      });
    } else {
      // Create new conversation.
      var messages = [];
      messages.push({
        date: new Date().toString(),
        sender: firebase.auth().currentUser.uid,
        type: 'image',
        url: url
      });
      var users = [];
      users.push(firebase.auth().currentUser.uid);
      users.push(this.userId);
      // Add conversation.
      this.afDB.list('conversations').push({
        dateCreated: new Date().toString(),
        messages: messages,
        users: users
      }).then((success) => {
        let conversationId = success.key;
        // Add conversation references to users.
        this.afDB.object('/chat/' + firebase.auth().currentUser.uid + '/conversations/' + this.userId).update({
          conversationId: conversationId,
          messagesRead: 1
        });
        this.afDB.object('/chat/' + this.userId + '/conversations/' + firebase.auth().currentUser.uid).update({
          conversationId: conversationId,
          messagesRead: 0
        });
      });
    }
  }

   // Check if the user is the sender of the message.
   isSender(message) {
    if (message.sender == firebase.auth().currentUser.uid) {
      return true;
    } else {
      return false;
    }
  }
   // Scroll depending on the direction.
   doScroll() {
    if (this.scrollDirection == 'bottom') {
      this.scrollBottom();
    } else if (this.scrollDirection == 'top') {
      this.scrollTop();
    }
  }

  // Scroll to bottom of page after a short delay.
  scrollBottom() {
    var that = this;
    setTimeout(function() {
      that.content.scrollToBottom();
    }, 300);
  }

  // Scroll to top of the page after a short delay.
  scrollTop() {
    var that = this;
    setTimeout(function() {
      that.content.scrollToTop();
    }, 300);
  }

  onType(keyCode) {
    if (keyCode == 13) {
      
      this.send();
    }
  }


}
