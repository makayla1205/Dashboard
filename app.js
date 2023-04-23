var createError = require('http-errors');
var express = require('express');
const sessions = require('express-session');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var indexRouter = require('./routes/index');
var apiRouter = require('./routes/api');
//var usersRouter = require('./routes/users');

var app = express();
const cors = require('cors');
app.use(cors());

// creating 24 hours from milliseconds
const oneDay = 1000 * 60 * 60 * 24;

//session middleware
app.use(sessions({
    year: (new Date().getFullYear).toString(),
    month: '0' + (new Date().getMonth() + 1).toString(),
    data: undefined,
    secret: (process.env.SECRET || "thisismysecrctekeyfhrgfgrfrty84fwir767"),
    saveUninitialized:true,
    cookie: { maxAge: oneDay },
    resave: false
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
/*
(async function() {
  app.set("dataOnStartup", await loadData());
})();

 */

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api', apiRouter);
//app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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
