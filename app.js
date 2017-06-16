var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var stylus = require('stylus');

var index = require('./routes/index');
var users = require('./routes/users');
const mongoose = require('mongoose');

var app = express();
// var url = "mongodb://siripartnerdemo:siridemo@siriventurepartnerdemo-shard-00-00-otgwt.mongodb.net:27017,siriventurepartnerdemo-shard-00-01-otgwt.mongodb.net:27017,siriventurepartnerdemo-shard-00-02-otgwt.mongodb.net:27017/siridemo?ssl=true&replicaSet=SiriventurePartnerDemo-shard-0&authSource=admin";
// var url = "mongodb://siripartnerdemo:siridemo@siriventurepartnerdemo-shard-00-00-otgwt.mongodb.net:27017";
var uri = "siripartnerdemo:siridemo@siriventurepartnerdemo-shard-00-02-otgwt.mongodb.net:27017/siridemo?ssl=true&replicaSet=SiriventurePartnerDemo-shard-0&authSource=admin";
var partnerObj = [{
	"name": "Apartmentary",
	"motto": "ระบบจัดการอพาร์ทเม้นท์ หอพัก ใช้งานฟรี",
	"categories": "Property Tech",
	"website": "https://apartmentery.com",
	"slide": "https://drive.google.com/open?id=0B5cXDg47WUAjTUxVZ3dVelpmWkk",
	"cover": "http://mixliveent.com/wp-content/uploads/2017/01/beautiful-apartment-17-as-inspiration.jpg",
	"intro": "Apartment intro",
	"comment": "Apartment comment",
	"result": "Apartment result"
}];
mongoose.Promise = global.Promise;
var db = mongoose.connect(uri, function(err, res) {
  if(err) {
    console.log('ERROR connecting to: ' + uri + '. ' + err);
  } else {
    console.log('Succeed connected to MongoDB');
  }
});
todb = require('./siri-db-mongo.js');
todb.initDatabase(mongoose);
/* NOTE: to refetch database from json file comment this out
	todb.reFetchDatabaseFromJSON();
*/

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(stylus.middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
