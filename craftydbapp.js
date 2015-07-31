// http://blog.modulus.io/nodejs-and-express-create-rest-api
// http://stackoverflow.com/questions/10578249/hosting-nodejs-application-in-ec2
// http://www.html5rocks.com/en/tutorials/cors/#toc-adding-cors-support-to-the-server
// http://stackoverflow.com/questions/7067966/how-to-allow-cors-in-express-nodejs
// http://howtonode.org/node-js-and-mongodb-getting-started-with-mongoj

var express = require('express');
var bodyParser  = require('body-parser');
var mongojs = require('mongojs');
var app = express();


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



// connect to db
var databaseUrl = "test"; 
var collections = ["timers"]
var db = mongojs(databaseUrl, collections);


// log timers
db.timers.find(function(err, timers) {
  if( err || !timers) {
    console.log("No timers found");
  }else timers.forEach( function(timer) {
    console.log("Timers found:" + JSON.stringify(timer));
  } );
});


// set REST access permissions
console.log("app.all");
app.all('/*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    
    next();
 });
 

/**
 * @desc  get all documents
 * @return 
 */
// curl -H "Accept: application/json" -H "Content-type: application/json" -X GET http://localhost:8080/
app.get('/', function(req, res) {

    console.log("app.get");

   //http://cypressnorth.com/programming/cross-domain-ajax-request-with-json-response-for-iefirefoxchrome-safari-jquery/
   //http://stackoverflow.com/questions/10078173/spine-node-js-express-and-access-control-allow-origin
   //http://cypressnorth.com/programming/cross-domain-ajax-request-with-json-response-for-iefirefoxchrome-safari-jquery/
   //http://stackoverflow.com/questions/16661032/http-get-is-not-allowed-by-access-control-allow-origin-but-ajax-is
   
  res.header("Access-Control-Allow-Origin", "*");
  
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


/**
 * @desc  create document
 * @return 
 */
// curl -H "Accept: application/json" -H "Content-type: application/json" -X POST -d '{"tag":"noob","score":43,"date":"now"}' http://localhost:8080/accounts
app.post('/createtimer', function(req, res) {
    
  req.body.starttime = Math.floor(new Date() / 1000);
  req.body.remaining = req.body.duration;
  req.body.expired = false;
  console.log("/createtimer");
  console.log("body:" + JSON.stringify(req.body));
  
  req.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Origin", "*");

  db.timers.save(req.body, function(err, saved) {
      if( err || !saved ) { 
        console.log("Timer not saved");
        res.send(null);
      } else  {
        res.send(req.body);
      }
  });
});


/**
 * @desc  remove document by id
 * @return 
 */
app.get('/deletetimer', function(req, res) {

  console.log("/deletetimer");
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
        
    db.timers.find(function(err, timers) {
        if( err || !timers) {
        } else {
          timers.forEach( function( timer){
              var now = Math.floor(new Date() / 1000);
              timer.remaining = timer.duration - (now - timer.starttime);
              if ( now - timer.starttime > timer.duration) {
                if (timer.expired === false) { // flag timer expired to prevent multiple successive calls to .remove while it is still waiting for a response.
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

}, 1000);


console.log("app.listen");
app.listen(8080);




