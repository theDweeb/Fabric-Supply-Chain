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