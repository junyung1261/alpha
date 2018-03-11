import { Component } from '@angular/core';
import { IonicPage, NavController, ViewController, ModalController } from 'ionic-angular';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import * as firebase from 'firebase';
import { Vibration } from '@ionic-native/vibration';


@IonicPage()
@Component({
    selector: 'page-chat-location',
    templateUrl: 'chat-location.html',
})
export class ChatLocationPage {

    chat_location_ref: AngularFireList<any>;
    explain : string;
    searchState : any;
    gender: any;
    latitude: any;
    longitude: any;

    nearbyUserGender: any;
    nearbyUserKey: any;
    nearbyUserLatitude: any;
    nearbyUserLongitude: any;

    nearestDistance: any;

    flag: boolean = true;



    constructor(public navCtrl: NavController, public viewCtrl: ViewController, public modalCtrl: ModalController,
        public afDB: AngularFireDatabase, public vibration:Vibration) {

        this.chat_location_ref = this.afDB.list('/chat-location');

        afDB.object('/accounts/' + firebase.auth().currentUser.uid).snapshotChanges().take(1).subscribe(user => {
            this.gender = user.payload.val().gender ? user.payload.val().gender : 'Anonymous';
        });

        this.afDB.list('/accounts/' + firebase.auth().currentUser.uid).snapshotChanges().take(1).subscribe(users => {
            users.forEach(user => {
                // this.latitude = user.payload.val().lat ? user.payload.val().lat : 'Somewhere';
                if(user.payload.val().lat != undefined) this.latitude = user.payload.val().lat;
                console.log("위도 : ", user.payload.val().lat)
                // this.longitude = user.payload.val().lng ? user.payload.val().lng : 'Somewhere';
                if(user.payload.val().lng != undefined) this.longitude = user.payload.val().lng;
                console.log("경도 : ", user.payload.val().lng)
                
            })
        });
    }

    ionViewDidLoad() {
       this.explain='검색시작 버튼을 눌러주세요.';
       this.searchState=1;
    }
    startSearching() {
        this.explain='검색중입니다. 잠시만 기다려주세요!';
        setTimeout(() => {
            console.log("1. 내 성별  : ", this.gender);
            console.log("2. 내 lat  : ", this.latitude);
            console.log("3. 내 lng : ", this.longitude);
            this.watchLocation(true);
        }, 1000);
        this.searchState=0;
    }
    stopSearching() {
        this.viewCtrl.dismiss();
    }

    ionViewWillLeave() {
        //   페이지 나가면 쳐다보는거 그만해! DB에서도 빼!
        this.flag = false;
        this.removeUser(firebase.auth().currentUser.uid);
    }

    watchLocation(flag: boolean) {
        console.log("4. 검색 시작")
        if (flag == true) {
            this.getNearbyUser();
            console.log("5. 검색 끝");
            console.log("6. 상대 성별 :", this.nearbyUserGender);
            //사람이 없으면 큐에 넣는다
            if (this.nearbyUserGender == undefined) {
                this.updateUser(firebase.auth().currentUser.uid);
                // if 사용자가 없으면, 첫번째 유저 검색부터 1초뒤에 다시 시작
                setTimeout(() => {
                    this.watchLocation(this.flag);
                }, 5000);
            }
            //성별이 다르면 firstUser를 큐에서 뽑아내서 둘이 짝짝꿍 맞춰준다.
            else {
                this.vibration.vibrate(1000);
                this.removeUser(this.nearbyUserKey);
                this.removeUser(firebase.auth().currentUser.uid);
                //그만 본다
                this.flag = false;
                //채팅페이지로 매칭된 유저들의 키값을 넘겨준다. (TODO)
                this.vibration.vibrate(1000);
                    this.viewCtrl.dismiss();
                    this.navCtrl.push('ChatProcessingPage',{sender:this.nearbyUserKey,roomtype:'location'});
                    //this.modalCtrl.create('ChatRoomPage', {userId: this.nearbyUserKey}).present();
            }
        } else if (flag == false) {
            this.viewCtrl.dismiss();
        }
    }

    getNearbyUser() {

        var tempFlag = 0;
        var tempDistance = 0;
        var gender: string;

        this.afDB.list('/chat-location').snapshotChanges().take(1).subscribe(snapshots => {
            let users = [];
            snapshots.forEach(snap => {
                users.unshift({
                    key: snap.payload.key,
                    latitude: snap.payload.val().lat,
                    longitude: snap.payload.val().lng,
                    gender: snap.payload.val().gender,
                })
                gender = snap.payload.val().gender;
                
                if (this.gender != gender) {

                    tempDistance = Math.pow((this.latitude - snap.payload.val().lat), 2) + Math.pow((this.longitude - snap.payload.val().lng), 2);
                    if (tempFlag == 0) {
                        this.nearestDistance = tempDistance;
                        this.nearbyUserGender = gender;
                        this.nearbyUserKey = snap.payload.key;
                        tempFlag++;
                    }
                    else {
                        if (this.nearestDistance > tempDistance) {
                            this.nearestDistance = tempDistance;
                            this.nearbyUserGender = gender;
                            this.nearbyUserKey = snap.payload.key;
                        }

                    }
                }
            })
        });
    }

    updateUser(key: string) {
        this.chat_location_ref.update(key, { gender: this.gender, lat: this.latitude, lng: this.longitude });
    }
    removeUser(key: string) {
        this.chat_location_ref.remove(key);
    }

}