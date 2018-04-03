import { Component } from '@angular/core';
import { IonicPage, NavController, ViewController } from 'ionic-angular';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import * as firebase from 'firebase';

import { Shake } from '@ionic-native/shake';
import { Vibration } from '@ionic-native/vibration';
import { timeInterval } from 'rxjs/operator/timeInterval';

@IonicPage()
@Component({
    selector: 'page-chat-shake',
    templateUrl: 'chat-shake.html',
})
export class ChatShakePage {
    
    private START_TIME : any;
    private CURRENT_USER_GENDER : string;
    private CURRENT_USER_KEY : string;

    private FIRST_MALE_USER_KEY : string;
    private FIRST_FEMALE_USER_KEY : string;

    private MALE_USER_COUNT : any;
    private FEMALE_USER_COUNT : any;

    private ROOM_KEY : string;

    private BTN_STATUS : string;

    constructor(
        public navCtrl: NavController,public viewCtrl: ViewController,public afDB: AngularFireDatabase,public shake: Shake,public vibration: Vibration) {
        this.afDB.object('/accounts/'+firebase.auth().currentUser.uid).snapshotChanges().take(1).subscribe(user => {
            this.CURRENT_USER_GENDER = user.payload.val().gender ? user.payload.val().gender : 'Anonymous';
        });
        this.CURRENT_USER_KEY = firebase.auth().currentUser.uid;
        this.BTN_STATUS='매칭시작';
        
    }

    ionViewDidLoad() {
        

    }       
        
    startShaking(){

        const watch = this.shake.startWatch(60).subscribe(() => {
            this.BTN_STATUS = '매칭중';
            this.vibration.vibrate(500);
            this.afDB.database.ref('/chat-shake/'+this.CURRENT_USER_GENDER+'/'+this.CURRENT_USER_KEY).update({
                status:'shaking'
            });

            this.getFirstMaleUser();
            this.getFirstFemaleUser();

            // 접속자가 남자일때 //
            if(this.CURRENT_USER_GENDER=='male'){
                // 여성 큐에 몇명 있는지 확인 //
                this.afDB.database.ref('/chat-shake/female').on('value',count=>{
                    this.FEMALE_USER_COUNT = count.numChildren();
                })
                // 접속자가 남자중 첫번째 큐이고, 여성큐에 1명이상 있을경우 //
                if(this.CURRENT_USER_KEY == this.FIRST_MALE_USER_KEY && this.FEMALE_USER_COUNT >=1 ){
                    // 남자 매칭중으로 변환 //
                    this.afDB.database.ref('/chat-shake/male/'+this.FIRST_MALE_USER_KEY).update({
                        status:'matched'
                    });
                    // 해당되는 여자도 매칭중으로 변환 //
                    this.afDB.database.ref('/chat-shake/female/'+this.FIRST_FEMALE_USER_KEY).update({
                        status:'matched'
                    });
                }

            // 접속자가 여자일때 //
            }else{
                // 내가 매칭이 되었는지만 감지한다 //
                this.afDB.database.ref('/chat-shake/female/'+this.CURRENT_USER_KEY).on('value',status=>{
                    if(status.child('status').val()=='matched'){
                        // 매칭이 되었다면 방을 만들고, 남자 여자 각각 룸키를 심는다.//
                        this.afDB.database.ref('/chat-room/').push({
                            roomtype : 'shake'
                        }).then(success =>{
                            this.afDB.database.ref('/chat-shake/male/'+this.FIRST_MALE_USER_KEY).update({
                                roomkey:success.key,
                                status:'roomCreating'
                            });
                            // 해당되는 여자도 매칭중으로 변환 //
                            this.afDB.database.ref('/chat-shake/female/'+this.FIRST_FEMALE_USER_KEY).update({
                                roomkey:success.key,
                                status:'roomCreating'
                            });
                        })
                    }
                });
            }

            // 큐 상태가 roomCreating일때 //
            this.afDB.database.ref('/chat-shake/'+this.CURRENT_USER_GENDER+'/'+this.CURRENT_USER_KEY).on('value',status=>{
                if(status.child('status').val()=='roomCreating'){

                    watch.unsubscribe();
                    this.viewCtrl.dismiss();

                    // 남자라면 SENDER //
                    if(this.CURRENT_USER_GENDER=='male'){
                        this.navCtrl.push('ChatProcessingPage',{roomkey:status.child('roomkey').val(),roomType:'shake',userType:'sender'});
                    }
                    // 여자라면 RECEIVER //
                    else{
                        this.navCtrl.push('ChatProcessingPage',{roomkey:status.child('roomkey').val(),roomType:'shake',userType:'receiver'});
                    }
                    
                }
            });
        });
        // 10초마다 제거함 //
        setInterval(()=>{
            this.afDB.database.ref('/chat-shake/'+this.CURRENT_USER_GENDER+'/'+this.CURRENT_USER_KEY).remove();
        },10000);
    }

    getFirstMaleUser(){
        this.afDB.list('/chat-shake/male',ref=>ref.limitToFirst(1)).snapshotChanges().subscribe(users =>{
            users.forEach(user =>{
                this.FIRST_MALE_USER_KEY = user.key
            });
        });
    }

    getFirstFemaleUser(){
        this.afDB.list('/chat-shake/female',ref=>ref.limitToFirst(1)).snapshotChanges().subscribe(users =>{
            users.forEach(user =>{
                this.FIRST_FEMALE_USER_KEY = user.key
            });
        });
    }
        
    ionViewWillLeave() {
       this.afDB.database.ref('/chat-shake/'+this.CURRENT_USER_GENDER+'/'+this.CURRENT_USER_KEY).remove();
    }

    


}