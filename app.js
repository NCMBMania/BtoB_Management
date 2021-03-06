var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
let session = require('express-session')
let NedbStore = require('connect-nedb-session')(session);
let config = require('./config');

const fileUpload = require('express-fileupload');

var routes = require('./routes/index');
var users = require('./routes/users');
var sessions = require('./routes/sessions');
var configs = require('./routes/configs');
var masters = require('./routes/masters');
var files   = require('./routes/files');
var pushes  = require('./routes/pushes');

var methodOverride    = require('method-override');

var app = express();

app.use(session({
  secret: config.secret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    path: '/',
    httpOnly: true,
    maxAge: 365 * 24 * 3600 * 1000
  },
  store: new NedbStore({
    filename: 'session.db'
  })
}));
                   

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use( methodOverride( (req, res) => {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    var method = req.body._method;
    delete req.body._method;
    return method;
  }
}));        

app.use('/', routes);
app.use('/users', users);
app.use('/sessions', sessions);
app.use('/configs', configs);
app.use('/masters', masters);
app.use('/pushes', pushes);

app.use(fileUpload());
app.use('/files',  files);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

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
