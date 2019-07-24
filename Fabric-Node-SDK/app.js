let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cors = require('cors');
let cookieParser = require('cookie-parser');
let morgan = require('morgan');
const winston = require('./fabric/winston').getLogger(module);
let app = express();

// Routes
let producerIndexRouter = require('./organizations/producer/client/index');
let producerQueryRouter = require('./organizations/producer/client/query');
let producerUsersRouter = require('./organizations/producer/client/users');
let producerInvokeRouter = require('./organizations/producer/client/invoke');

let consumerIndexRouter = require('./organizations/consumer/client/index');
let consumerQueryRouter = require('./organizations/consumer/client/query');
let consumerUsersRouter = require('./organizations/consumer/client/users');
let consumerInvokeRouter = require('./organizations/consumer/client/invoke');

let shipperIndexRouter = require('./organizations/shipper/client/index');
let shipperQueryRouter = require('./organizations/shipper/client/query');
let shipperUsersRouter = require('./organizations/shipper/client/users');
let shipperInvokeRouter = require('./organizations/shipper/client/invoke');

let transporterIndexRouter = require('./organizations/transporter/client/index');
let transporterQueryRouter = require('./organizations/transporter/client/query');
let transporterUsersRouter = require('./organizations/transporter/client/users');
let transporterInvokeRouter = require('./organizations/transporter/client/invoke');

// view engine setup.
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(morgan(':remote-addr - :remote-user ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"', { stream: winston.stream}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/producer/index', producerIndexRouter);
app.use('/producer/query', producerQueryRouter);
app.use('/producer/users', producerUsersRouter);
app.use('/producer/invoke', producerInvokeRouter);

app.use('/consumer/index', consumerIndexRouter);
app.use('/consumer/query', consumerQueryRouter);
app.use('/consumer/users', consumerUsersRouter);
app.use('/consumer/invoke', consumerInvokeRouter);

app.use('/shipper/index', shipperIndexRouter);
app.use('/shipper/query', shipperQueryRouter);
app.use('/shipper/users', shipperUsersRouter);
app.use('/shipper/invoke', shipperInvokeRouter);

app.use('/transporter/index', transporterIndexRouter);
app.use('/transporter/query', transporterQueryRouter);
app.use('/transporter/users', transporterUsersRouter);
app.use('/transporter/invoke', transporterInvokeRouter);

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
app.use('*', cors());

module.exports = app;