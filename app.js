const express = require('express')
const exphbs = require('express-handlebars');
const path = require('path');
const logger = require('morgan');
const createError = require('http-errors');
const session = require('express-session');
const compression = require('compression');
const helmet = require('helmet');

const app = express()
const MemoryStore = require('memorystore')(session)


app.use(helmet())

app.use(express.static(path.join(__dirname, 'public')));

app.use(logger('dev'));

app.engine('hbs', exphbs({extname: '.hbs'}));
app.set('view engine', 'hbs');

sess = {
  name: 'meetme-session',
  secret: process.env.SESSION_SECRET || 'enterasecrethere', // κλειδί για κρυπτογράφηση του cookie
  resave: false,
  saveUninitialized: false,
  proxy:true,
  // secureProxy: true,
  cookie: {
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: true,
      // secure: true // NODE_ENV === 'production'
  },
  store: new MemoryStore({ checkPeriod: 86400000 })
};

if (app.get('env') === 'production') {
  // app.set('trust proxy', 1) // trust first proxy
  sess.cookie.secure = true // serve secure cookies
}

app.use(session(sess));

// app.use((req, res, next) => {
//   res.locals.userId = req.session.loggedUserId;
//   next();
// })

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//Διαδρομές - Routse
const routes = require('./routes/meet--me-routes');
app.use(compression()); //Compress all routes
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
