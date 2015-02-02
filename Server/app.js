var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var favicon = require('serve-favicon');
var stylus = require('stylus');
var nib = require('nib');
var util = require('util');

// Database
var mongo = require('mongoskin');
var db = mongo.db("mongodb://localhost:27017/chatservice", {native_parser:true});

var routes = require('./routes/index');
var messages = require('./routes/messages');
var groups = require('./routes/groups');
var user = require('./routes/user');
var login = require('./routes/login');
var files = require('./routes/files');

var app = express();

function compile(str,path){
  return stylus(str).set('filename', path).use(nib());
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(stylus.middleware(
  { src: __dirname + '/public'
  , compile: compile
  }
))
app.use(logger('dev'));
app.use(bodyParser.json({ extended: false }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public','images','favicon.ico')));


// Make db accessible to our router
app.use(function(req,res,next){
    req.db = db;
    next();
});

app.use('/', routes);
app.use('/messages', messages);
app.use('/groups', groups);
app.use('/user', user);
app.use('/login',login);
app.use('/files', files);


/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
