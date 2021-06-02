const express = require('express')
const exphbs = require('express-handlebars');
const path = require('path');
const logger = require('morgan');
const createError = require('http-errors');

const app = express()

app.use(express.static(path.join(__dirname, 'public')));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.engine('hbs', exphbs({extname: '.hbs'}));
app.set('view engine', 'hbs');

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
    res.locals.errorstack = req.app.get('env') === 'development' ? err.stack : {}
  
    // render the error page
    res.status(err.status || 500);
    res.render('error',);
  });
  
//Χρήση των views - Using 'views'
//Σημ.: η engine πρέπει να έχει ίδιο όνομα με το extname, αλλιώς δεν θα αναγνωριστεί το extname (αλλιώς τα αρχεία θα πρέπει να τελειώνουν με .handlebars)
//Note: engine name must be the same as extname (hbs) otherwise the handlebars template engine will look for files ending in '.handlebars'

module.exports = app;
