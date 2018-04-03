//Function to read Data from firebase for computation - This function runs everyday.
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

//Initialize lib/ sms library
const lib = require('lib')({token:"--z3ysJ2xIFuwv6aABLSacgEkb34NwOFyWBmFMnY_SL4BLtBq0ALIy1yIloD1G-U"});
const sms = lib.messagebird.sms['@0.1.3'];

module.exports = (context, callback) => {
 
    var value = firebase.database().ref();

    value.on("value",
    gotData = (data) => 
    { 
     var Schedule = data.val();
     var flag = false;
     
     if(Schedule!=null)
     {
      var keys = Object.keys(Schedule);    

      for(var i = 0; i < keys.length; i++)
        {
          var k = keys[i];
          var delItems = [];
          var date = Schedule[k].Date;
          var time = Schedule[k].Title;
          var today = String(new Date).substr(0,10);

          if(today==date) 
            {            
              flag = true;
               
              //Sent Text Message
                sms.create({
                recipient: "16692039212",
                body: String(time + " due today!")
                }, function (err) {
                if(err) return callback(err);
                return callback(null,"Message Sent!");
              });
            } 
        }

      }

      if(!flag)
        callback(null); 
       
      },
      errData = (err) => {
        return  callback(err);
      });
};


