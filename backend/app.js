var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
const mysql = require("mysql");

let db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "fyp",
});

// connect to database
db.connect();


var adminRouter = require('./routes/admin/admin');
var usersAdminRouter = require('./routes/admin/users');
var serviceProvidersAdminRouter = require('./routes/admin/serviceProviders');
var servicesAdminRouter = require('./routes/admin/services');

var serviceProviderRouter = require('./routes/serviceProvider/serviceProvider');
var servicesServiceProviderRouter = require('./routes/serviceProvider/services');
var userServiceProviderRouter = require('./routes/serviceProvider/user');
var chatServiceProviderRouter = require('./routes/serviceProvider/chat');

var userRouter = require('./routes/user/user');
var servicesUserRouter = require('./routes/user/services');
var serviceProviderUserRouter = require('./routes/user/serviceProvider');
var chatUserRouter = require('./routes/user/chat');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', async (req, res) => {
   var sql = `select 
    (select count(*) from users) as users,
    (select count(*) from service_providers) as serviceProviders,
    (select count(*) from services) as services`;  
      await db.query(sql, function (err, result) {
      if (err) throw err;
      res.status(201).json({ result: result });
    });
});

app.use('/admin', adminRouter);
app.use('/admin/users', usersAdminRouter);
app.use('/admin/service-providers', serviceProvidersAdminRouter);
app.use('/admin/services', servicesAdminRouter);

app.use('/service-provider', serviceProviderRouter);
app.use('/service-provider/services', servicesServiceProviderRouter);
app.use('/service-provider/users/profile/', userServiceProviderRouter);
app.use('/service-provider/chat/', chatServiceProviderRouter);


app.use('/user', userRouter);
app.use('/user/services', servicesUserRouter);
app.use('/user/service-providers/profile/', serviceProviderUserRouter);
app.use('/user/chat/', chatUserRouter);



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
