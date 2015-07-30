// http://blog.modulus.io/nodejs-and-express-create-rest-api
// http://stackoverflow.com/questions/10578249/hosting-nodejs-application-in-ec2
// http://www.html5rocks.com/en/tutorials/cors/#toc-adding-cors-support-to-the-server
// http://stackoverflow.com/questions/7067966/how-to-allow-cors-in-express-nodejs

var express = require('express');
var bodyParser  = require('body-parser');
var mongojs = require('mongojs');

//var ScoreTable = require('./scoretable').ScoreTable;


var app = express();

console.log("use bodyParser...");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(function(req, res, next) {
    var oneof = false;
    if(req.headers.origin) {
        res.header('Access-Control-Allow-Origin', req.headers.origin);
        oneof = true;
    }
    if(req.headers['access-control-request-method']) {
        res.header('Access-Control-Allow-Methods', req.headers['access-control-request-method']);
        oneof = true;
    }
    if(req.headers['access-control-request-headers']) {
        res.header('Access-Control-Allow-Headers', req.headers['access-control-request-headers']);
        oneof = true;
    }
    if(oneof) {
        res.header('Access-Control-Max-Age', 60 * 60 * 24 * 365);
    }

    // intercept OPTIONS method
    if (oneof && req.method == 'OPTIONS') {
        res.send(200);
    }
    else {
        next();
    }
});


console.log("running");

//@http://howtonode.org/node-js-and-mongodb-getting-started-with-mongoj
var databaseUrl = "test"; // "username:password@example.com/mydb"
var collections = ["timers"]
var db = mongojs(databaseUrl, collections);

/*
db.accounts.save({tag: "srirangan@gmail.com", moves: 100, date: Date()}, function(err, saved) {
  if( err || !saved ) console.log("User not saved");
  else console.log("User saved");
});
*/
console.log("find");

db.timers.find(function(err, timers) {
  if( err || !timers) {
    console.log("No timers found");
  }else timers.forEach( function(timer) {
    console.log("Timers found:" + JSON.stringify(timer));
  } );
});



console.log("app.all");
app.all('/*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    
    next();
 });
 

// curl -H "Accept: application/json" -H "Content-type: application/json" -X POST -d '{"tag":"noob","score":43,"date":"now"}' http://localhost:8080/accounts
console.log("app.post");
app.post('/createtimer', function(req, res) {
    
  req.body.starttime = Math.floor(new Date() / 1000);
  req.body.remaining = req.body.duration;
  req.body.expired = false;
  console.log("app.post");
  console.log("post timer");
  console.log("body:" + JSON.stringify(req.body));
  //console.log("req:" + JSON.stringify(req));
  
  req.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Origin", "*");
    
    /*
  if(!req.body.hasOwnProperty('tag') ||
     !req.body.hasOwnProperty('moves') ||
     !req.body.hasOwnProperty('gameLevel') ||
     !req.body.hasOwnProperty('date')) {
    res.statusCode = 400;
    return res.send('Error 400: Post syntax incorrect.');
  }*/

  console.log("new timer");

    db.timers.save(req.body, function(err, saved) {
        if( err || !saved ) console.log("Timer not saved");
        else console.log("Timer saved");
    });

  
  res.header("Access-Control-Allow-Origin", "*");
  res.json(true);
});


// curl -H "Accept: application/json" -H "Content-type: application/json" -X GET http://localhost:8080/
console.log("app.get");
app.get('/', function(req, res) {

  console.log("app.get");

   //http://cypressnorth.com/programming/cross-domain-ajax-request-with-json-response-for-iefirefoxchrome-safari-jquery/
   //http://stackoverflow.com/questions/10078173/spine-node-js-express-and-access-control-allow-origin
   //http://cypressnorth.com/programming/cross-domain-ajax-request-with-json-response-for-iefirefoxchrome-safari-jquery/
   //http://stackoverflow.com/questions/16661032/http-get-is-not-allowed-by-access-control-allow-origin-but-ajax-is
   
  res.header("Access-Control-Allow-Origin", "*");
  //res.json(scores);
  
    db.timers.find(function(err, timers) {
        if( err || !timers) console.log("No timers found");
        else {
            console.log("timers found:" + timers.length);

            var now = Math.floor( new Date() / 1000);
            timers.forEach( function( timer ) {
              timer.remaining = timer.duration - (now - timer.starttime);
            });


            res.json(timers);
        };
    });
});



// curl -H "Accept: application/json" -H "Content-type: application/json" -X GET http://localhost:8080/removealldocuments
app.get('/deletealltimers', function(req, res) {

  console.log("/deletealltimers");

  db.timers.remove(req.body, function(err, saved) {
      if( err || !saved ) console.log("Timer not saved");
      else console.log("Timer saved");
  });

  db.collection('timers',function(err, collection) {
    collection.remove({},function(err, removed){
        console.log("deletealltimers err:" + removed);
      });
  });

  res.send('success');

});

//
app.get('/deletetimer', function(req, res) {

  console.log("/deletetimer");
  //console.log("res:" + JSON.stringify(res));
  console.log("res:" + res);
  console.log("req:" + req);




  console.log("req.query.timerId:", req.query.timerId);


  db.timers.remove( {'_id': mongojs.ObjectId(req.query.timerId)},  function(err, result) {
      if( err ) { 
        console.log("remove timer failed:" + err);
      } 
      console.log(result);
  } );

  res.send('success');
  
});


 /**
 * @desc  poll for expired timers. remove identified expired timers from db.
 * @return 
 */
setInterval(function() {
        
    var now = Math.floor(new Date() / 1000);
    var pendingExpired = [];

    db.timers.find(function(err, timers) {
        if( err || !timers) {

        } else {
          timers.forEach( function( timer){
               //console.log(now - timer.starttime + " ... " + timer.duration);
              timer.remaining = timer.duration - (now - timer.starttime);
              if ( now - timer.starttime > timer.duration) {


                if (timer.expired === false) {
                  console.log('calling remove on' + timer._id);
                  db.timers.remove( {'_id': mongojs.ObjectId(timer._id)},  
                    function(err, result) {
                      console.log('Removing expired timer...')
                      if( err ) { 
                        console.log("remove timer failed:" + err);
                      } 
                      console.log(result);
                  });
                }
                timer.expired = true;


              }
          });
        }
    });

    //console.log(pendingExpired.length);

    // remove expired timers
    pendingExpired.forEach( function( thisTimer) {

        db.timers.remove( {'_id': mongojs.ObjectId(thisTimer._id)},  
          function(err, result) {
            console.log('Removing expired timer...')
            if( err ) { 
              console.log("remove timer failed:" + err);
            } 
            console.log(result);

          });

    });

  }, 1000);


console.log("app.listen");
app.listen(8080);


//db.timers.remove( {"_id": ObjectId("55ba4e39a72d351604c9a0a6")});


