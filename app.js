var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');

const auth = require('./auth/auth');
const utility = require('./lib/Utility');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var tokenRouter = require('./routes/token');
var adminRouter = require('./routes/admin');
var ordersRouter = require('./routes/');
var platoonRouter = require('./routes/platoons');
var butcherRouter = require('./routes/butchers');
var addressBooksRouter = require('./routes/addressBooks');
var transactionsRouter = require('./routes/transaction');
var animalRouter = require('./routes/animals');
var pickUpStationRouter = require('./routes/pickupstations');
var statesRouter = require('./routes/states');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(auth.initialize());
app.use(cors());


app.use('/v1/api/', indexRouter);
app.use('/v1/api/auth', tokenRouter);
app.use('/v1/api/users', usersRouter);
app.use('/v1/api/admin', adminRouter);
app.use('/v1/api/meatify', animalRouter);
// app.use('/v1/api/orders', ordersRouter);
app.use('/v1/api/platoons', platoonRouter);
app.use('/v1/api/butchers', butcherRouter);
app.use('/v1/api/addressbooks', addressBooksRouter);
app.use('/v1/api/stations', pickUpStationRouter);
app.use('/v1/api/states', statesRouter);
// app.use('/v1/api/transactions', transactionsRouter);

module.exports = app;
