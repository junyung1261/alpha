const functions = require('firebase-functions');
const admin = require('firebase-admin');
const firebase = require('firebase');
admin.initializeApp(functions.config().firebase);

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

exports.participation = functions.https.onRequest((req, res)=> {
    console.log('test Cron');

    var db = admin.database();
    var ref = db.ref(`/contests/`).push({
        date: firebase.database['ServerValue'].TIMESTAMP,
        numOfMale: 0,
        numOfFemale: 0
    }).then((success)=>{
        db.ref(`/contests/`).update({lastContest: success.key, stage: 'join'});
        return res.status(200).json('new Contest!');
    }).catch(err => {
        console.error(err);
    })
})

exports.roundOne = functions.https.onRequest((req,res)=> {

})

exports.roundTwo = functions.https.onRequest((req,res)=> {
    
})

exports.roundThree = functions.https.onRequest((req,res)=> {
    
})


