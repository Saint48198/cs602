'use strict';

const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const handlebars = require('express-handlebars');
const session = require('express-session');
const helmet = require('helmet');
const uuid = require('uuid');

// db & models
require('./models/db');

// declare app
const app = express();

// helmet helps protect the app from well-known web vulnerabilities by setting HTTP headers appropriately.
app.use(helmet());

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
const expiryDate = new Date( Date.now() + 60 * 60 * 1000 ); // 1 hour
app.set('trust proxy', 1) // trust first proxy
app.use(cookieParser());
app.use(session({
	secret: '1234567890QWERTY',
	resave: false,
	saveUninitialized: true,
	name: 'sessionId',
	genid: function(req) {
		return uuid.v1(); // use UUIDs for session IDs
	},
	cookie: {
		expires: expiryDate
	}
}));

// Session-persisted message middleware
app.use((req, res, next) => {
	let sess = req.session;
	let error = sess.error;
	let message = sess.success;

	delete req.session.error;
	delete req.session.success;

	res.locals.message = '';

	if (error) {
		res.locals.message = error;
	}

	if (message) {
		res.locals.message = message;
	}
	next();
});

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