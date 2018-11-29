var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var registerRouter = require('./routes/register')
var registerProcessRouter = require('./routes/register-process')
var loginProcessRouter = require('./routes/login-process')
var login = require('./routes/login')
var logoutRouter = require('./routes/logout')
var dashboardAdminRouter = require('./routes/dashboard-admin')
var createObatRouter = require('./routes/create-obat')
var deleteObatRouter = require('./routes/delete-obat')
var updateObatRouter = require('./routes/update-obat')
var updateProcessObatRouter = require('./routes/update-process')
var homeUserRouter = require('./routes/homepage-user')
var addKeranjangUserRouter = require('./routes/add-keranjang')
var keranjangUserRouter = require('./routes/keranjang')
var buyObatUserRouter = require('./routes/buy-obat')
var daftarTrAdminRouter = require('./routes/daftar-order')
var verifTrAdminRouter = require('./routes/verification-process')
var penjualanTrAdminRouter = require('./routes/daftar-penjualan')
var historiTrUserRouter = require('./routes/histori-transaksi')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  key: 'user_sid',
  secret: 'somerandonstuffs',
  resave: false,
  saveUninitialized: false,
  cookie: {
      expires: 600000
  }
}));

app.use('/', login);
app.use('/users', usersRouter);
app.use('/register', registerRouter);
app.use('/register', registerProcessRouter);
app.use('/login', login);
app.use('/login', loginProcessRouter);
app.use('/logout', logoutRouter);
app.use('/admin', dashboardAdminRouter);
app.use('/create-obat', createObatRouter);
app.use('/delete-obat', deleteObatRouter);
app.use('/update-obat/', updateObatRouter);
app.use('/update-process/', updateProcessObatRouter);
app.use('/home', homeUserRouter);
app.use('/add-keranjang', addKeranjangUserRouter);
app.use('/keranjang', keranjangUserRouter);
app.use('/buy-obat', buyObatUserRouter);
app.use('/daftar-order', daftarTrAdminRouter);
app.use('/verification', verifTrAdminRouter);
app.use('/daftar-penjualan', penjualanTrAdminRouter);
app.use('/histori', historiTrUserRouter);
app.use('/forbidden-access', indexRouter);

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
