//Function to View the Data from Firebase - to be able to viewed on devices.
//Initialize Firebase
const firebase = require('firebase');
 
 var config = {
  apiKey: process.apiKey,
  authDomain: "remind-hackpu18.firebaseapp.com",
  databaseURL: "https://remind-hackpu18.firebaseio.com",
  projectId: "remind-hackpu18",
  storageBucket: "",
  messagingSenderId: "545307758301"
};
firebase.initializeApp(config);

module.exports = (context, callback) => {
 
    var value = firebase.database().ref();

    value.on("value",
    gotData = (data) => 
    { 
     var Schedule = data.val();
     var keys = Object.keys(Schedule);
     var daysRemaining;
     var viewSchedule = [];
     
     for(var i=0;i<keys.length;i++)
      {
        var k = keys[i];
        var date = Schedule[k].Date;
        var title = Schedule[k].Title;
        daysRemaining = calculateDaysRemaining(date);
        
        viewSchedule.push(date);
        viewSchedule.push(title);
        viewSchedule.push(daysRemaining);
      }

      //viewSchedule = JSON.stringify(viewSchedule);

      callback(null,viewSchedule);
    },

     errData = (err) => { callback(err);});
};

calculateDaysRemaining = (date) => 
{
  var today = new Date();  
  var mDate = date.substr(4,3);   
  var dDate = date.substr(8,8);
  var date = new Date("2018-"+mDate+"-"+dDate);
  //Calculate Days Difference
  var timeDiff = Math.abs(date.getTime() - today.getTime());
  var daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24)); 

  return daysRemaining;
}



