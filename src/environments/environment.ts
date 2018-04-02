
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
    export const gcmKey = 'AAAAQpdJr1M:APA91bHc1yQRkZ5cYP0s5o0KpJS1MlsouTtPsR2jMSu0uc29MZIKmAYrtVWeNyyRbK-QgAZ9XhLyt4wudzi127qeseJgl2CiIuQIOr_cVf9ZrnZV7dmZRacSaFpUZkgKyhHPRLuTShtY';
    // Set to your Firebase app, you can find your credentials on Firebase app console -> Add Web App.
    export const firebase = {
        apiKey: "AIzaSyCj9s5Z1ZKrff_4BxF1ZSryzjY8KzTmbtI",
        authDomain: "tianya-6d56d.firebaseapp.com",
        databaseURL: "https://tianya-6d56d.firebaseio.com",
        projectId: "tianya-6d56d",
        storageBucket: "tianya-6d56d.appspot.com",
        messagingSenderId: "286006030163"
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
    export const toastDuration = 5000; // Duration (in milliseconds) of how long toast messages should show before they are hidden.
  }
  

