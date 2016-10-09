'use strict';

const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const handlebars = require('express-handlebars');
const session = require('express-session');
const helmet = require('helmet');
const uuid = require('uuid');
const logger = require('morgan');

// db & models
require('./models/db');

// declare app
const app = express();

// helmet helps protect the app from well-known web vulnerabilities by setting HTTP headers appropriately.
app.use(helmet());

// temmplate settings
app.engine('handlebars', handlebars({ defaultLayout:  __dirname + '/layouts/html' }));
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/views');

// define a custom res.message() method
// which stores messages in the session
app.response.message = (msg) => {
	// reference `req.session` via the `this.req` reference
	let sess = this.req.session;
	// simply add the msg to an array for later
	sess.messages = sess.messages || [];
	sess.messages.push(msg);
	return this;
};

// log
if (!module.parent) {
	app.use(logger('dev'));
}

// static resources
app.use(express.static(__dirname + '/public'));
app.use('/bower_components', express.static(__dirname + '/bower_components'));


// session
const expiryDate = new Date( Date.now() + 60 * 60 * 1000 ); // 1 hour
let  sess = {
	secret: '1234567890QWERTY',
	resave: false,
	saveUninitialized: false,
	name: 'sessionId',
	genid: function(req) {
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


// to parse request body
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// expose the "messages" local variable when views are rendered
app.use((req, res, next) => {
	let msgs = req.session.messages || [];

	// expose "messages" local variable
	res.locals.messages = msgs;

	// expose "hasMessages"
	res.locals.hasMessages = !! msgs.length;

	/* This is equivalent:
	 res.locals({
	 messages: msgs,
	 hasMessages: !! msgs.length
	 });
	 */

	next();
	// empty or "flush" the messages so they
	// don't build up
	req.session.messages = [];
});

// load controllers
require('./lib/boot')(app, { verbose: !module.parent });

app.use((err, req, res, next) => {
	// log it
	if (!module.parent) console.error(err.stack);

	// error page
	res.status(500);
	res.render('html/5xx');
});

// assume 404 since no middleware responded
app.use((req, res) => {
    res.status(404);
    res.render('html/404');
});


// server
if (!module.parent) {
	app.listen(3000, () => {
		console.log('http://localhost:3000');
	});
}
