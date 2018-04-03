//Function to Write on Firebase Database.
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
 * @param {string} title
 * @param {string} date
*/

module.exports = (title = "", date = "", context, callback) => {
  
    writeUserData(title,date, 
    function(err) 
    {
      if (err) return callback(err);
      return callback(null, "posted");
    });

};

function writeUserData(title, date, callback) {
  firebase.database().ref().push  ({
    Title: title,
    Date: date,
  }, callback);
}
