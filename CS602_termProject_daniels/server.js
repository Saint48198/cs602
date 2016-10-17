'use strict';

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const handlebars = require('express-handlebars');
const session = require('express-session');
const helmet = require('helmet');
const uuid = require('uuid');
const logger = require('morgan');
const methodOverride = require('method-override');

// db & models
require('./models/db');

// routes
const routesApi = require('./routes/api_routes');

// declare app
const app = express();

// helmet helps protect the app from well-known web vulnerabilities by setting HTTP headers appropriately.
app.use(helmet());

// temmplate settings
app.engine('handlebars', handlebars({defaultLayout: __dirname + '/layouts/html'}));
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/views');

// define a custom res.message() method
// which stores messages in the session
app.response.message = function (msg) {
	// reference `req.session` via the `this.req` reference
	let sess = this.req.session;
	// simply add the msg to an array for later
	sess.messages = sess.messages || [];
	sess.messages.push(msg);
	return this;
};

// log every request to the console
if (!module.parent) {
	app.use(logger('dev'));
}

// static resources
app.use(express.static(__dirname + '/public'));
app.use('/bower_components', express.static(__dirname + '/bower_components'));


// session
const expiryDate = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
let sess = {
	secret: '1234567890QWERTY',
	resave: true,
	saveUninitialized: false,
	name: 'sessionId',
	genid: function (req) {
		return uuid.v1(); // use UUIDs for session IDs
	},
	cookie: {
		expires: expiryDate
	}
};

if (app.get('env') === 'production') {
	app.set('trust proxy', 1) // trust first proxy
	sess.cookie.secure = true // serve secure cookies
}

app.use(cookieParser());
app.use(session(sess));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));

// parse application/json
app.use(bodyParser.json());

// parse application/vnd.api+json as json
app.use(bodyParser.json({type: 'application/vnd.api+json'}));

// allow overriding methods in query (?_method=put)
app.use(methodOverride('_method'));

// expose the "messages" local variable when views are rendered
app.use((req, res, next) => {
	let msgs = req.session.messages || [];

	// expose "messages" local variable
	res.locals.messages = msgs;

	// expose "hasMessages"
	res.locals.hasMessages = !!msgs.length;

	/* This is equivalent:
	 res.locals({
	 messages: msgs,
	 hasMessages: !! msgs.length
	 });
	 */

	next();
	// empty or "flush" the messages so they
	// don't build up
	// is inside a try because can't set property on destroyed session
	try {
		req.session.messages = [];
	} catch (err) {
	}

});

// use routes
app.use('/api', routesApi);

app.use(function(req, res) {
	res.sendFile(path.join(__dirname, 'app_client', 'index.html'));
});


// catch 500 errors
app.use((err, req, res, next) => {
	// log it
	if (!module.parent) console.error(err.stack);

	// error page
	res.status(500);
	res.render('html/5xx');
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// server
if (!module.parent) {
	app.listen(3000, () => {
		console.log('http://localhost:3000');
	});
}
