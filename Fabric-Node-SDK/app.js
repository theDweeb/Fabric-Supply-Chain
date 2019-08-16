let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cors = require('cors');
let cookieParser = require('cookie-parser');
let morgan = require('morgan');
const winston = require('./fabric/winston').getLogger(module);
let app = express();

app.use(cors());

// Routes
let producerIndexRouter = require('./organizations/producer/client/index');
let producerUsersRouter = require('./organizations/producer/client/users');
let producerChannelRouter = require('./organizations/producer/client/channel')
let producerChaincodeRouter = require('./organizations/producer/client/chaincode')

// let consumerIndexRouter = require('./organizations/consumer/client/index');
// let consumerUsersRouter = require('./organizations/consumer/client/users');
// let consumerChannelRouter = require('./organizations/consumer/client/channel');
// let consumerChaincodeRouter = require('./organizations/consumer/client/chaincode');

// let shipperIndexRouter = require('./organizations/shipper/client/index');
// let shipperUsersRouter = require('./organizations/shipper/client/users');
// let shipperChannelRouter = require('./organizations/shipper/client/channel');
// let shipperChaincodeRouter = require('./organizations/shipper/client/chaincode');

// let transporterIndexRouter = require('./organizations/transporter/client/index');
// let transporterUsersRouter = require('./organizations/transporter/client/users');
// let transporterChannelRouter = require('./organizations/transporter/client/channel');
// let transporterChaincodeRouter = require('./organizations/transporter/client/chaincode');

// view engine setup.
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(morgan(':remote-addr - :remote-user ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"', { stream: winston.stream}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/producer/index', producerIndexRouter);
app.use('/producer/users', producerUsersRouter);
app.use('/producer/channel', producerChannelRouter);
app.use('/producer/chaincode', producerChaincodeRouter);

// app.use('/consumer/index', consumerIndexRouter);
// app.use('/consumer/users', consumerUsersRouter);
// app.use('/consumer/channel', consumerChannelRouter);
// app.use('/consumer/chaincode', consumerChaincodeRouter);

// app.use('/shipper/index', shipperIndexRouter);
// app.use('/shipper/users', shipperUsersRouter);
// app.use('/shipper/channel', shipperChannelRouter);
// app.use('/shipper/chaincode', shipperChaincodeRouter);

// app.use('/transporter/index', transporterIndexRouter);
// app.use('/transporter/users', transporterUsersRouter);
// app.use('/transporter/channel', transporterChannelRouter);
// app.use('/transporter/chaincode', transporterChaincodeRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

app.on('uncaughtException', (e) => {
  console.warn(e.stack)
})

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