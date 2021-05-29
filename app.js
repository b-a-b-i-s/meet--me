const express = require('express')
const app = express()
const exphbs = require('express-handlebars');
app.use(express.static('public'))

//Διαδρομές - Routse
const routes = require('./routes/task-list-routes');
app.use('/', routes);

//Χρήση των views - Using 'views'
//Σημ.: η engine πρέπει να έχει ίδιο όνομα με το extname, αλλιώς δεν θα αναγνωριστεί το extname (αλλιώς τα αρχεία θα πρέπει να τελειώνουν με .handlebars)
//Note: engine name must be the same as extname (hbs) otherwise the handlebars template engine will look for files ending in '.handlebars'
app.engine('hbs', exphbs({
    extname: '.hbs'
}));

app.set('view engine', 'hbs');

module.exports = app;
