const express = require('express')
const exphbs = require('express-handlebars');
const path = require('path');
const logger = require('morgan');
const createError = require('http-errors');
// const favicon = require('serve-favicon')

const app = express()


app.use(express.static(path.join(__dirname, 'public')));

// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))

app.use(logger('dev'));
app.engine('hbs', exphbs({extname: '.hbs'}));
app.set('view engine', 'hbs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Διαδρομές - Routse
const routes = require('./routes/meet--me-routes');
app.use('/', routes);




app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  // res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.locals.errorstatus = err.status || 500;
  res.locals.errorstack = req.app.get('env') === 'development' ? err.stack : '';

  // render the error page
  res.status(err.status || 500);
  res.render('error', {layout:'404.hbs'});
});
  

module.exports = app;
