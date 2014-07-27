var express = require('express'),
	logger = require('morgan'),
	bodyParser = require('body-parser'),
	mongo = require('mongodb');
 
// Base de données
var Server = mongo.Server,
    Db = mongo.Db;
 
var server = new Server("dbhost", 27017, {auto_reconnect: true});

var db = new Db(process.env.DB_NAME, server);
 
db.open(function(err, db) {
    if(!err) {
        console.log("Connecté à la base de données", process.env.DB_NAME);
    } else {
    	console.error(err);
    }
});



var naf = require('./routes/naf.js');
var meta = require('./naf-meta');

var app = express();

app.enable('trust proxy');
 
app.use(logger('dev'));     /* 'default', 'short', 'tiny', 'dev' */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());



// Rend la base de données (db) et les méta-infos (meta) accessible aux routers
app.use(function(req,res,next){
    req.db = db;
    req.meta = meta;
    next();
});

app.use(naf);


app.listen(80);
console.log('Listening on port 80...');
