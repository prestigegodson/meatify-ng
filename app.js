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
var ordersRouter = require('./routes/orders');
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


app.use('/api/v1/',         indexRouter);
app.use('/api/v1/auth',     tokenRouter);
app.use('/api/v1/users',    usersRouter);
app.use('/api/v1/admin',    adminRouter);
app.use('/api/v1/animals',  animalRouter);
app.use('/api/v1/orders',   ordersRouter);
app.use('/api/v1/platoons', platoonRouter);
app.use('/api/v1/butchers', butcherRouter);
app.use('/api/v1/addressbooks', addressBooksRouter);
app.use('/api/v1/stations', pickUpStationRouter);
app.use('/api/v1/states',   statesRouter);
app.use('/api/v1/transactions', transactionsRouter);

module.exports = app;
