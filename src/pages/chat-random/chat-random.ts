import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase';
import { AngularFireDatabase } from 'angularfire2/database';
import { Vibration } from '@ionic-native/vibration';

@IonicPage()
@Component({
    selector: 'page-chat-random',
    templateUrl: 'chat-random.html'
})
export class ChatRandomPage {
    user: any;
    flag: boolean = true;
    chat_random_ref: any;
    gender: any;

    firstUserGender: any;
    firstUserKey: any;
    
    numOfWaiting = 0;

    constructor(public afAuth: AngularFireAuth, public viewCtrl: ViewController, public afDB: AngularFireDatabase,public vibration: Vibration) {
        this.afAuth.authState.subscribe(user => {
            if (!user) { }
            else {
                if (true) {
                    this.chat_random_ref = this.afDB.list('/chat-random');

                    afDB.object('/accounts/' + firebase.auth().currentUser.uid).snapshotChanges().take(1).subscribe(user => {
                        this.gender = user.payload.val().gender ? user.payload.val().gender : 'Anonymous';
                    });

                } else { }
            }
        });

        this.afDB.list('/chat-random').snapshotChanges().subscribe(users => {
            this.numOfWaiting = users.length;
        });

        this.startRandom();
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad ChatRandomPage');
    }

    ionViewWillLeave() {
        //   페이지 나가면 쳐다보는거 그만해! DB에서도 빼!
        this.flag = false;
        this.removeUser(firebase.auth().currentUser.uid);
    }

    searchCancel() {
        this.viewCtrl.dismiss();
    }

    startRandom(){
        setTimeout(() => {
            this.watchRandom(this.flag);
        }, 1000);
    }

    watchRandom(flag: boolean) {

        if (flag == true) {
            this.getFirstUser();

            //성별이 같으면 큐에 넣는다
            if (this.firstUserGender == this.gender || this.firstUserGender == undefined) {

                this.updateUser(firebase.auth().currentUser.uid);

                // if 사용자가 없거나 성별이 같으면, 첫번째 유저 검색부터 1초뒤에 다시 시작
                setTimeout(() => {
                    this.watchRandom(this.flag);
                }, 1000);
            }
            //성별이 다르면 firstUser를 큐에서 뽑아내서 둘이 짝짝꿍 맞춰준다.
            else if (this.firstUserGender != this.gender && this.firstUserGender != undefined) {
                this.vibration.vibrate(1000);
                this.removeUser(this.firstUserKey);
                this.removeUser(firebase.auth().currentUser.uid);
                //그만 본다
                this.flag = false;

                //(TODO)채팅페이지로 매칭된 유저들의 키값을 넘겨준다.
            }

        } else if(flag == false){
            this.viewCtrl.dismiss();
        }
    }

    getFirstUser() {
        this.afDB.list('/chat-random', ref => ref.orderByChild('date').limitToFirst(1)).snapshotChanges().take(1).subscribe(users => {
            users.forEach(user => {
                this.firstUserGender = user.payload.val().gender ? user.payload.val().gender : 'Anonymous';
                this.firstUserKey = user.key;
            })
        });
    }

    updateUser(key: string) {
        this.chat_random_ref.update(key, { gender: this.gender, date: firebase.database['ServerValue'].TIMESTAMP });
    }
    removeUser(key: string) {
        this.chat_random_ref.remove(key);
    }

}