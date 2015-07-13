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
var collections = ["accounts"]
var db = mongojs(databaseUrl, collections);

/*
db.accounts.save({tag: "srirangan@gmail.com", moves: 100, date: Date()}, function(err, saved) {
  if( err || !saved ) console.log("User not saved");
  else console.log("User saved");
});
*/
console.log("find");

db.accounts.find(function(err, accounts) {
  if( err || !accounts) {
    console.log("No accounts found");
  }else accounts.forEach( function(account) {
    console.log("Accounts found:" + JSON.stringify(account));
  } );
});

var accounts = [
  { tag : 'Audrey Hepburn', moves : 750, date: Date(), gameLevel:0},
  { tag : 'Walt Disney', moves : 666, date: Date(), gameLevel:0},
  { tag : 'Unknown', moves : 490, date: Date(), gameLevel:0},
  { tag : 'Neale Donald Walsch', moves : 950, date: Date(), gameLevel:0}
];

console.log("app.all");
app.all('/*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    
    next();
 });
 

// curl -H "Accept: application/json" -H "Content-type: application/json" -X POST -d '{"tag":"noob","score":43,"date":"now"}' http://localhost:8080/accounts
console.log("app.post");
app.post('/accounts', function(req, res) {
    
  console.log("app.post");
  console.log("post account");
  console.log("body:" + req.body);
  console.log("req:" + req);
  
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

  console.log("new account");

    db.accounts.save(req.body, function(err, saved) {
        if( err || !saved ) console.log("Account not saved");
        else console.log("Account saved");
    });

  var newAccount = {
    body : req.body,
  };

  //scores.push(newScore);
  
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
  
    db.accounts.find(function(err, accounts) {
        if( err || !accounts) console.log("No accounts found");
        else {
            console.log("accounts found:" + accounts.length);
            res.json(accounts);
        };
    });
});


// curl -H "Accept: application/json" -H "Content-type: application/json" -X GET http://localhost:8080/removealldocuments
app.get('/removealldocuments', function(req, res) {

  console.log("/removealldocuments");

  db.accounts.remove(req.body, function(err, saved) {
      if( err || !saved ) console.log("Account not saved");
      else console.log("Account saved");
  });

  db.collection('accounts',function(err, collection) {
    collection.remove({},function(err, removed){
        console.log("removealldocuments err:" + removed);
        });
  });

});

/*
console.log("app.get");
app.get('/score/random', function(req, res) {
  var id = Math.floor(Math.random() * scores.length);
  var q = scores[id];
  res.header("Access-Control-Allow-Origin", "*");
  res.json(q);
});

console.log("app.get");
app.get('/score/:id', function(req, res) {
  if(scores.length <= req.params.id || req.params.id < 0) {
    res.statusCode = 404;
    return res.send('Error 404: No quote found');
  }

  var q = scores[req.params.id];
  res.header("Access-Control-Allow-Origin", "*");
  res.json(q);
});
*/



console.log("app.listen");
app.listen(8080);