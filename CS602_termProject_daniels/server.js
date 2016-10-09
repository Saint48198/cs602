'use strict';

const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const handlebars = require('express-handlebars');
const session = require('express-session');

// db & models
require('./models/db');

// declare app
const app = express();

// to parse request body
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// temmplate settings
app.engine('handlebars', handlebars({ defaultLayout:  __dirname + '/layouts/html' }));
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/views');

// static resources
app.use(express.static(__dirname + '/public'));
app.use('/bower_components', express.static(__dirname + '/bower_components'));

// session
app.use(cookieParser());
app.use(session({secret: '1234567890QWERTY', resave: false, saveUninitialized: true }));

// app routes [START]
const viewsRoutes = require('./routes/views');
const apiRoutes = require('./routes/apis');

app.use('/', viewsRoutes);
app.use('/api', apiRoutes);

app.use((req, res) => {
    res.status(404);
    res.render('html/404');
});
// app routes [END]

// server 
app.listen(3000, () => {
    console.log('http://localhost:3000');
});