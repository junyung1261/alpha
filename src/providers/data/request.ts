import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database-deprecated';
import { LoadingProvider } from '../loading/loading';
import { AlertProvider } from '../alert/alert';
import { DataProvider } from './data';
import * as firebase from 'firebase';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/take';

@Injectable()
export class RequestProvider {
  // Firebase Provider
  // This is the provider class for most of the Firebase updates in the app.

  constructor(
      public angularfireDatabase: AngularFireDatabase, 
      public loadingProvider: LoadingProvider, 
      public alertProvider: AlertProvider,
      public dataProvider: DataProvider) {
    console.log("Initializing Request Provider");
  }


  

  
  
  getChatMessages(userId){
    return this.angularfireDatabase.object('/chat/' + firebase.auth().currentUser.uid + '/conversations/' + userId );
  }

  getRequestList(userId){
    return this.angularfireDatabase.object('/chat/' + userId + '/requests');
  }

  getUserChat(userId){
    return this.angularfireDatabase.object('/chat/' + userId);
  }
  
  getUser(userId) {
    return this.angularfireDatabase.object('/accounts/' + userId);
  }
   // Get conversation given the conversationId.
   getConversation(conversationId) {
    return this.angularfireDatabase.object('/conversations/' + conversationId);
  }

  // Get conversations of the current logged in user.
  getConversations() {
    return this.angularfireDatabase.list('/accounts/' + firebase.auth().currentUser.uid + '/conversations');
  }

  // Get messages of the conversation given the Id.
  getConversationMessages(conversationId) {
    return this.angularfireDatabase.object('/conversations/' + conversationId + '/messages');
  }


  // Send friend request to userId.
  sendFriendRequest(userId) {
    let loggedInUserId = firebase.auth().currentUser.uid;
    //this.loadingProvider.show();

    var requestsSent;
    // Use take(1) so that subscription will only trigger once.
    this.getRequestList(loggedInUserId).take(1).subscribe((requests) => {
        
    requestsSent = requests.requestsSent;
      
      if (!requestsSent) {
        requestsSent = [userId];
      } else {
        
        if (requestsSent.indexOf(userId) == -1)
          requestsSent.push(userId);
      }
      // Add requestsSent information.
      this.angularfireDatabase.object('/chat/' + loggedInUserId + '/requests').update({
        requestsSent: requestsSent
      }).then((success) => {
        var chatRequests;
        this.getRequestList(userId).take(1).subscribe((requests) => {
            chatRequests = requests.chatRequests;
          if (!chatRequests) {
            chatRequests = [loggedInUserId];
          } else {
          
            if (chatRequests.indexOf(loggedInUserId) == -1)
            chatRequests.push(loggedInUserId);
          }
          // Add chatRequests information.
          this.angularfireDatabase.object('/chat/' + userId + '/requests').update({
            chatRequests: chatRequests
          }).then((success) => {
            this.loadingProvider.hide();
            this.alertProvider.showFriendRequestSent();
          }).catch((error) => {
            this.loadingProvider.hide();
          });
        });
      }).catch((error) => {
        this.loadingProvider.hide();
      });
    });
  }

  // Cancel friend request sent to userId.
  cancelFriendRequest(userId) {
    let loggedInUserId = firebase.auth().currentUser.uid;
    this.loadingProvider.show();

    var requestsSent;
    this.getRequestList(loggedInUserId).take(1).subscribe((requests) => {
      requestsSent = requests.requestsSent;
      requestsSent.splice(requestsSent.indexOf(userId), 1);
      // Update requestSent information.
      this.angularfireDatabase.object('/chat/' + loggedInUserId + '/requests').update({
        requestsSent: requestsSent
      }).then((success) => {
        var chatRequests;
        this.getRequestList(userId).take(1).subscribe((requests) => {
            chatRequests = requests.chatRequests;
            chatRequests.splice(chatRequests.indexOf(loggedInUserId), 1);
          // Update chatRequests information.
          this.angularfireDatabase.object('/chat/' + userId + '/requests').update({
            chatRequests: chatRequests
          }).then((success) => {
            this.loadingProvider.hide();
            this.alertProvider.showFriendRequestRemoved();
          }).catch((error) => {
            this.loadingProvider.hide();
          });
        });
      }).catch((error) => {
        this.loadingProvider.hide();
      });
    });
  }

  // Delete friend request.
  deleteFriendRequest(userId) {
    let loggedInUserId = firebase.auth().currentUser.uid;
    this.loadingProvider.show();

    var chatRequests;
    this.getRequestList(loggedInUserId).take(1).subscribe((requests) => {
        chatRequests = requests.chatRequests;
        chatRequests.splice(chatRequests.indexOf(userId), 1);
      // Update chatRequests information.
      this.angularfireDatabase.object('/chat/' + loggedInUserId + '/requests').update({
        chatRequests: chatRequests
      }).then((success) => {
        var requestsSent;
        this.getRequestList(userId).take(1).subscribe((requests) => {
          requestsSent = requests.requestsSent;
          requestsSent.splice(requestsSent.indexOf(loggedInUserId), 1);
          // Update requestsSent information.
          this.angularfireDatabase.object('/chat/' + userId + '/requests').update({
            requestsSent: requestsSent
          }).then((success) => {
            this.loadingProvider.hide();

          }).catch((error) => {
            this.loadingProvider.hide();
          });
        });
      }).catch((error) => {
        this.loadingProvider.hide();
        //TODO ERROR
      });
    });
  }

  // Accept friend request.
  acceptFriendRequest(userId) {
    let loggedInUserId = firebase.auth().currentUser.uid;
    // Delete friend request.
    this.deleteFriendRequest(userId);

    this.loadingProvider.show();
    this.getUserChat(loggedInUserId).take(1).subscribe((account) => {
      var friends = account.friends;
      if (!friends) {
        friends = [userId];
      } else {
        friends.push(userId);
      }
      // Add both users as friends.
      this.getUserChat(loggedInUserId).update({
        friends: friends
      }).then((success) => {
        this.getUserChat(userId).take(1).subscribe((account) => {
          var friends = account.friends;
          if (!friends) {
            friends = [loggedInUserId];
          } else {
            friends.push(loggedInUserId);
          }
          this.getUserChat(userId).update({
            friends: friends
          }).then((success) => {
            this.loadingProvider.hide();
          }).catch((error) => {
            this.loadingProvider.hide();
          });
        });
      }).catch((error) => {
        this.loadingProvider.hide();
      });
    });
  }
}
