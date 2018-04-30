import { Injectable } from '@angular/core';
import { AlertProvider } from '../alert/alert';
import { LoadingProvider  } from '../';
import { Camera, CameraOptions } from '@ionic-native/camera';
import firebase from 'firebase';
import { AngularFireDatabase } from 'angularfire2/database';
import { File, Entry } from '@ionic-native/file';

@Injectable()
export class ImageProvider {
  // Image Provider
  // This is the provider class for most of the image processing including uploading images to Firebase.
  // Take note that the default function here uploads the file in .jpg. If you plan to use other encoding types, make sure to
  // set the encodingType before uploading the image on Firebase.
  // Example for .png:
  // data:image/jpeg;base64 -> data:image/png;base64
  // generateFilename to return .png
  private profilePhotoOptions: CameraOptions;
  private photoMessageOptions: CameraOptions;
  private groupPhotoOptions: CameraOptions;
  // All files to be uploaded on Firebase must have DATA_URL as the destination type.
  // This will return the imageURI which can then be processed and uploaded to Firebase.
  // For the list of cameraOptions, please refer to: https://github.com/apache/cordova-plugin-camera#module_camera.CameraOptions

  constructor(public angularfireDatabase: AngularFireDatabase, 
             
              public loadingProvider: LoadingProvider, 
              
              
              public camera: Camera,
              public file: File
            ) {
    console.log("Initializing Image Provider");
    this.profilePhotoOptions = {
      quality: 50,
      targetWidth: 384,
      targetHeight: 384,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      correctOrientation: true,
      allowEdit: true
    };

    this.photoMessageOptions = {
      quality: 50,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      correctOrientation: true
    };

    this.groupPhotoOptions = {
      quality: 50,
      targetWidth: 384,
      targetHeight: 384,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      correctOrientation: true
    };
  }


  // Convert fileURI to Blob.
  private uriToBlob(fileURI): Promise<Blob> {
    return new Promise((resolve, reject) => {
      this.file.resolveLocalFilesystemUrl(fileURI).then((fileEntry: Entry) => {
        fileEntry.getParent((directoryEntry: Entry) => {
          this.file.readAsArrayBuffer(directoryEntry.nativeURL, fileEntry.name).then((data: ArrayBuffer) => {
            var uint8Array = new Uint8Array(data);
            var buffer = uint8Array.buffer;
            let blob = new Blob([buffer]);
            resolve(blob);
          }).catch(err => {
            reject(err);
          });
        });
      }).catch(err => {
        reject(err);
      });
    });
  }

  appendDateString(fileName: string): string {
    let name = fileName.substr(0, fileName.lastIndexOf('.')) + '_' + Date.now();
    let extension = fileName.substr(fileName.lastIndexOf('.'), fileName.length);
    return name + '' + extension;
  }



  // Set ProfilePhoto given the user and the cameraSourceType.
  // This function processes the imageURI returned and uploads the file on Firebase,
  // Finally the user data on the database is updated.
  imageUpload(key, sourceType): Promise<string> {

    this.profilePhotoOptions.sourceType = sourceType;

    return new Promise((resolve, reject)=> {
      this.camera.getPicture(this.profilePhotoOptions).then((fileUri) => {
        this.loadingProvider.show()
        let fileName = JSON.stringify(fileUri).substr(JSON.stringify(fileUri).lastIndexOf('/') + 1);
        fileName = fileName.substr(0, fileName.length - 1);
        // Append the date string to the file name to make each upload unique.
        fileName = this.appendDateString(fileName);
        // Convert URI to Blob.
        console.log("File: " + fileName);
        console.log("FileURI: " + fileUri);
        this.uriToBlob(fileUri).then(blob => {
          let metadata = {
            'contentType' : blob.type
          }
          firebase.storage().ref().child('images/' + key + '/' + fileName).put(blob, metadata).then((snapshot) => {
            let url = snapshot.metadata.downloadURLs[0];
            this.loadingProvider.hide();
            resolve(url);
          }).catch(err => {
            console.log("ERROR STORAGE: " + JSON.stringify(err));
              this.loadingProvider.hide();
              reject();
              // this.toastProvider.show(this.translate.get('storage.upload.error'));
          });
        }).catch(err => {
          console.log("ERROR STORAGE: " + JSON.stringify(err));
          this.loadingProvider.hide();
          reject();
          // this.toastProvider.show(this.translate.get('storage.upload.error'));
        });
      }).catch(err => {
        console.log("ERROR STORAGE: " + JSON.stringify(err));
        this.loadingProvider.hide();
        reject();
        // this.toastProvider.show(this.translate.get('storage.upload.error'));
      });
    });
}

  // Delete the uploaded file by the user, given the userId and URL of the file.
  delete(userId: string, url: string): void {
    // Get the fileName from the URL.
    let fileName = url.substring(url.lastIndexOf('%2F') + 3, url.lastIndexOf('?'));
    // Check if file really exists on Firebase storage.
    firebase.storage().ref().child('images/' + userId + '/' + fileName).getDownloadURL().then(res => {
      // Delete file from storage.
      firebase.storage().ref().child('images/' + userId + '/' + fileName).delete();
    }).catch(err => { });
  }


  // //Delete the image given the url.
  // deleteImageFile(path) {
  //   var fileName = path.substring(path.lastIndexOf('%2F') + 3, path.lastIndexOf('?'));
  //   firebase.storage().ref().child('images/' + firebase.auth().currentUser.uid + '/' + fileName).delete().then(() => { }).catch((error) => { });
  // }

  // //Delete the user.img given the user.
  // deleteUserImageFile(user) {
  //   var fileName = user.img.substring(user.img.lastIndexOf('%2F') + 3, user.img.lastIndexOf('?'));
  //   firebase.storage().ref().child('images/' + user.userId + '/' + fileName).delete().then(() => { }).catch((error) => { });
  // }

  // // Delete group image file on group storage reference.
  // deleteGroupImageFile(groupId, path) {
  //   var fileName = path.substring(path.lastIndexOf('%2F') + 3, path.lastIndexOf('?'));
  //   firebase.storage().ref().child('images/' + groupId + '/' + fileName).delete().then(() => { }).catch((error) => { });
  // }

  // deletePostImageFile(postId, photos){
  //   photos.forEach(photo => {
  //     let userId = firebase.auth().currentUser.uid;
  //     let fileName = photo.url.substring(photo.url.lastIndexOf('%2F') + 3, photo.url.lastIndexOf('?'));
  //     firebase.storage().ref().child('images/' + postId + '/' + fileName ).delete().then(() => {}).catch((error)=> { });
  //   })
  // }



  //   sendFeedPhoto(feedId, imageURL) {

  //     this.angularfireDatabase.object('/feed/' + feedId ).update({ images: imageURL
  //     }).then((success) => {
  //       this.loadingProvider.hide();
  //       //this.alertProvider.showProfileUpdatedMessage();
  //     }).catch((error) => {
  //       this.loadingProvider.hide();
  //       this.alertProvider.showErrorMessage('profile/error-change-photo');
  //     });
  //   }

  //   sendContestPhoto(imageURL) {

  //       this.angularfireDatabase.object('/accounts/' + firebase.auth().currentUser.uid + '/contest' ).update({ contestImages: imageURL
  //       }).then((success) => {
  //         this.loadingProvider.hide();
  //         this.alertProvider.showProfileUpdatedMessage();
  //       }).catch((error) => {
  //         this.loadingProvider.hide();
  //         this.alertProvider.showErrorMessage('profile/error-change-photo');
  //       });
  //     }

  //   sendCommunityPhoto(communityId, imageURL, location) {

  //     this.angularfireDatabase.object('/'+location+ '/' + communityId ).update({ images: imageURL
  //     }).then((success) => {
  //       this.loadingProvider.hide();
  //       //this.alertProvider.showProfileUpdatedMessage();
  //     }).catch((error) => {
  //       this.loadingProvider.hide();
  //       this.alertProvider.showErrorMessage('profile/error-change-photo');
  //     });
  //   }

    updatePostUrl(postId, imageURL, category): Promise<any> {

      return new Promise((resolve, reject) => {
        this.angularfireDatabase.object('/community/' + category + '/' + postId ).update({ images: imageURL
        }).then((success) => {
          resolve();
          this.loadingProvider.hide();
          //this.alertProvider.showProfileUpdatedMessage();
        }).catch((error) => {
          this.loadingProvider.hide();
          reject();
        });
     })
    }
  

}