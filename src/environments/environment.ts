
export namespace Environment {
    // Set your app configurations here.
    // For the list of config options, please refer to https://ionicframework.com/docs/api/config/Config/
    export const config = {
      mode: 'ios', //Firestarter's style is custom-designed based on iOS style, removing or changing this WILL MAKE THE APP LOOK BAD.
      menuType: 'overlay'
    };
    // Set language to use.
    export const language = 'en';
    // Firebase Cloud Messaging Server Key.
    // Get your gcmKey on https://console.firebase.google.com, under Overview -> Project Settings -> Cloud Messaging.
    // This is needed to send push notifications.
    export const gcmKey = 'AAAA-1_2Tc0:APA91bEucYEU_LWTb9cNFvdtyx1tER0ohWSa7SpJEkQhhJhO0HMffLyVXR4wcu7jflTpT6UwPbf-3ynS9-iHKXfgYTp-mbftOhyfmzq_3wJUQ5_eb3_-pRq6WWuTlKI6FtAg2SiFmNSHGkMb1FthvBpQZnZ1QtBFdw';
    // Set to your Firebase app, you can find your credentials on Firebase app console -> Add Web App.
    export const firebase = {
      apiKey: "AIzaSyABxBy_86Quogyl0yViQKpUGa738qK5Mdw",
      authDomain: "xianghanguo-832c7.firebaseapp.com",
      databaseURL: "https://xianghanguo-832c7.firebaseio.com",
      projectId: "xianghanguo-832c7",
      storageBucket: "xianghanguo-832c7.appspot.com",
      messagingSenderId: "1079646768589"
    };
    // You can find your googleWebClientId on your Firebase app console -> Authentication -> Sign-in Method -> Google -> Web client ID
    export const googleWebClientId: string = '579230665805-qbcjf6jips1e8v4siv7bgfd5dqbde2v7.apps.googleusercontent.com';
    // Loading Configuration.
    // Please refer to the official Loading documentation here: https://ionicframework.com/docs/api/components/loading/LoadingController/
    export const loading = {
      spinner: 'circles'
    };
    // Toast Configuration.
    // Please refer to the official Toast documentation here: https://ionicframework.com/docs/api/components/toast/ToastController/
    export const toast = {
      position: 'bottom' // Position of Toast, top, middle, or bottom.
    };
    export const toastDuration = 3000; // Duration (in milliseconds) of how long toast messages should show before they are hidden.
  }
  

