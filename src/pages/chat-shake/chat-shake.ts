import { Component } from '@angular/core';
import { IonicPage, NavController, ViewController, ModalController } from 'ionic-angular';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import * as firebase from 'firebase';

import { Shake } from '@ionic-native/shake';
import { Vibration } from '@ionic-native/vibration';


@IonicPage()
@Component({
    selector: 'page-chat-shake',
    templateUrl: 'chat-shake.html',
})
export class ChatShakePage {

    chat_shake_ref: AngularFireList<any>;
    gender: any;
    firstUserGender: any;
    firstUserKey: any;
    flag: boolean = true;



    constructor(public navCtrl: NavController, public viewCtrl: ViewController, public modalCtrl: ModalController,
        public afDB: AngularFireDatabase, public shake: Shake, public vibration: Vibration) {

        this.chat_shake_ref = this.afDB.list('/chat-shake');

        afDB.object('/accounts/' + firebase.auth().currentUser.uid).snapshotChanges().take(1).subscribe(user => {
            this.gender = user.payload.val().gender ? user.payload.val().gender : 'Anonymous';
        });
    }

    ionViewDidLoad() {
        
    }

    startShaking(){
        setTimeout(() => {
            this.watchShaking(this.flag);
        }, 1000);
    }

    ionViewWillLeave() {
        //   페이지 나가면 쳐다보는거 그만해! DB에서도 빼!
        this.flag = false;
        this.removeUser(firebase.auth().currentUser.uid);
    }

    watchShaking(flag: boolean) {
        if (flag == true) {
            this.getFirstUser();

            const watch = this.shake.startWatch(60).subscribe(() => {
                //성별이 같으면 큐에 넣는다
                if (this.firstUserGender == this.gender || this.firstUserGender == undefined) {

                    // 흔드는걸 멈추면 date 업데이트가 안되서 결국 후순위 큐로 밀리게 됩니다.
                    this.updateUser(firebase.auth().currentUser.uid);

                    // if 사용자가 없거나 성별이 같으면, 첫번째 유저 검색부터 1초뒤에 다시 시작
                    setTimeout(() => {
                        this.watchShaking(this.flag);
                    }, 1000);
                }
                //성별이 다르면 firstUser를 큐에서 뽑아내서 둘이 짝짝꿍 맞춰준다.
                else if (this.firstUserGender != this.gender && this.firstUserGender != undefined) {
                    this.removeUser(this.firstUserKey);
                    //그만 본다
                    this.flag = false;
                    watch.unsubscribe();

                    //(TODO)채팅페이지로 매칭된 유저들의 키값을 넘겨준다.
                    this.vibration.vibrate(1000);
                }

            });
        } else if(flag == false){
            this.viewCtrl.dismiss();
            
        }
    }

    getFirstUser() {
        this.afDB.list('/chat-shake', ref => ref.orderByChild('date').limitToFirst(1)).snapshotChanges().take(1).subscribe(users => {
            users.forEach(user => {
                this.firstUserGender = user.payload.val().gender ? user.payload.val().gender : 'Anonymous';
                this.firstUserKey = user.key;
            })
        });
    }

    updateUser(key: string) {
        this.chat_shake_ref.update(key, { gender: this.gender, date: firebase.database['ServerValue'].TIMESTAMP });
    }
    removeUser(key: string) {
        this.chat_shake_ref.remove(key);
    }

}