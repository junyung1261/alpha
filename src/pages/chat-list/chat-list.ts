import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ModalController } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase';
import { DataProvider } from '../../providers/data/data';
import { Observable } from 'rxjs/Observable';
import { RequestProvider } from '../../providers/data/request';

/**
 * Generated class for the ChatListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-chat-list',
  templateUrl: 'chat-list.html',
})
export class ChatListPage {
  chatId;
  user;
  myChat: any;
  myChatList: any;
  chatList= [];
  requestsList: any;
  requestsSent: any;
  alert: any;
  friends: any;
  constructor(
    public alertCtrl: AlertController,
    public navCtrl: NavController, 
    public modalCtrl: ModalController,
    public navParams: NavParams,
    public afDB: AngularFireDatabase,
    public dataProvider: DataProvider,
    public requestProvider: RequestProvider
  ) {
  }
  
  presentAlert(req, chatId) {
    /* 쪽지 전송 시작 req=0 */
    if(req==0){
      let alert = this.alertCtrl.create({
        title: '쪽지 전송',
        subTitle: '상대방에게 쪽지를 전송합니다. 전송 시 90p가 차감됩니다. (최대 100자)',
        inputs: [
          {
            name: 'msg',
            placeholder: '전송할 내용을 작성하세요.',
            type: 'text',
          }
        ],
        buttons: [
          {
            text: '취소',
            role: 'cancel',
            handler: data => {
              console.log('Cancel clicked');
            }
          },
          {
            text: '전송',
            handler: data => {
              
            }
          }
        ]
      });
      alert.present();
    }
    /* 쪽지 전송 끝 req=0 */
    /* 대화 요청 시작 req=1 */
    if(req==1){
      let alert = this.alertCtrl.create({
        title: '대화 참가',
        subTitle: '상대방에게 대화를 신청합니다',
        buttons: [
          {
            text:'취소',
            role:'cancel',
            handler:() => {
              console.log('Cancel clicked');
            }
          },
          {
            text:'신청',
            handler:() => {
              this.requestProvider.sendFriendRequest(chatId);
              // this.afDB.object('/chat/'+ chatId + '/request').update({})
              // this.navCtrl.push('ChatRoomPage',{chatId: this.chatId, user:this.user});
            }
          }
        ]
      });
      alert.present();
    }
    /* 대화 요청 끝 req=1 */
  }

  closeChatList(){
    this.navCtrl.pop();
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad ChatListPage');
    //this.chatId = this.navParams.get('chatId');
    this.user = this.navParams.get('user');
    this.dataProvider.getChatList().snapshotChanges().take(1).subscribe(chats => {
      this.chatList = chats.reverse();
    });
   
    this.requestProvider.getUserChat(this.user.uid).subscribe(myChat => {
      this.myChat = myChat;
      if(myChat.friends) {
        if (myChat.friends) {
          for (var i = 0; i < myChat.friends.length; i++) {
            this.requestProvider.getUser(myChat.friends[i]).subscribe((friend) => {
              this.addOrUpdateFriend(friend);
            });
          }
        } else {
          this.myChatList = [];
        }
      }

      this.requestProvider.getRequestList(this.user.uid).subscribe((requests) => {
        
        // chatRequests.
        if (requests.chatRequests) {
          this.requestsList = [];
          requests.chatRequests.forEach((userId) => {
            this.requestProvider.getUser(userId).subscribe((sender) => {
              this.addOrUpdateChatRequest(sender);
            });
          });
        } else {
          this.requestsList = [];
        }
        // requestsSent.
        if (requests.requestsSent) {
          this.requestsSent = [];
          requests.requestsSent.forEach((userId) => {
            this.requestProvider.getUser(userId).subscribe((receiver) => {
              this.addOrUpdateRequestSent(receiver);
            });
          });
        } else {
          this.requestsSent = [];
        }
        
        console.log(this.requestsSent);
        console.log(this.requestsList);
      });
    });
    
    
    

  }

  ionViewWillUnload(){
    //this.afDB.object('/chat/' + this.chatId).remove();
  }

  

  addOrUpdateChatRequest(sender) {
  if (!this.requestsList) {
    this.requestsList = [sender];
  } else {
    var index = -1;
    for (var i = 0; i < this.requestsList.length; i++) {
      if (this.requestsList[i].$key == sender.$key) {
        index = i;
      }
    }
    if (index > -1) {
      if (!this.isFriends(sender.$key))
        this.requestsList[index] = sender;
    } else {
      if (!this.isFriends(sender.$key))
        this.requestsList.push(sender);
    }
  }
}

// Add or update requests sent only if the user is not yet a friend.
addOrUpdateRequestSent(receiver) {
  if (!this.requestsSent) {
    this.requestsSent = [receiver];
  } else {
    var index = -1;
    for (var i = 0; i < this.requestsSent.length; i++) {
      if (this.requestsSent[i].$key == receiver.$key) {
        index = i;
      }
    }
    if (index > -1) {
      if (!this.isFriends(receiver.$key))
        this.requestsSent[index] = receiver;
    } else {
      if (!this.isFriends(receiver.$key))
        this.requestsSent.push(receiver);
    }
  }
}

addOrUpdateFriend(friend) {
  if (!this.myChatList) {
    this.myChatList = [friend];
  } else {
    var index = -1;
    for (var i = 0; i < this.myChatList.length; i++) {
      if (this.myChatList[i].$key == friend.$key) {
        index = i;
      }
    }
    if (index > -1) {
      this.myChatList[index] = friend;
    } else {
      this.myChatList.push(friend);
    }
  }
}

// Accept Friend Request.
acceptFriendRequest(user) {
  this.alert = this.alertCtrl.create({
    title: 'Confirm Friend Request',
    message: 'Do you want to accept <b>' + user.name + '</b> as your friend?',
    buttons: [
      {
        text: 'Cancel',
        handler: data => { }
      },
      {
        text: 'Reject Request',
        handler: () => {
          this.requestProvider.deleteFriendRequest(user.$key);
        }
      },
      {
        text: 'Accept Request',
        handler: () => {
          this.requestProvider.acceptFriendRequest(user.$key);
        }
      }
    ]
  }).present();
}

// Cancel Friend Request sent.
cancelFriendRequest(user) {
  this.alert = this.alertCtrl.create({
    title: 'Friend Request Pending',
    message: 'Do you want to delete your friend request to <b>' + user.username + '</b>?',
    buttons: [
      {
        text: 'Cancel',
        handler: data => { }
      },
      {
        text: 'Delete',
        handler: () => {
          this.requestProvider.cancelFriendRequest(user.$key);
        }
      }
    ]
  }).present();
}


isFriends(userId) {
  
  if (this.myChat.friends) {
    if (this.myChat.friends.indexOf(userId) == -1) {
      return false;
    } else {
      return true;
    }
  } else {
    return false;
  }
}

message(user) {
  this.modalCtrl.create('ChatRoomPage', {userId: user.$key}).present();
  
}

}
