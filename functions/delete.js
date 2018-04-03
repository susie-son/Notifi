//Function to Delete Selected Data from Firbase
//Initialize Firebase
var firebase = require('firebase');

 // Initialize Firebase
 var config = {
  apiKey: process.apiKey,
  authDomain: "remind-hackpu18.firebaseapp.com",
  databaseURL: "https://remind-hackpu18.firebaseio.com",
  projectId: "remind-hackpu18",
  storageBucket: "",
  messagingSenderId: "545307758301"
};
firebase.initializeApp(config);

/**
 *@param {string} key
 *@returns {string}
*/

module.exports = (key, context, callback) => {
  
  firebase.database().ref().child("/"+key).remove();
  
  callback(null,"Selected data Removed.");

};


