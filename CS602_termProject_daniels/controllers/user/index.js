const mongoose = require('mongoose');
const User = mongoose.model('User');

exports.prefix = '/api';

exports.create = (req, res, next) => {
	"use strict";

	res.setHeader('Content-Type', 'application/json');

	let sess = req.session;

	if (!sess.email) {
		res.send(JSON.stringify({ message: 'You need to be logged in to use this service!' }));
		return;
	}

	let postData = req.body;
	let fname = postData.fname;
	let lname = postData.lname;
	let email = postData.email;
	let password = postData.password;

	let newUser = new User({
		firstName:  fname,
		lastName: lname,
		email: email,
		password: password,
		type: 'user' // tmp
	});

	newUser.save((error) => {
		if (error) {
			res.send(JSON.stringify({  success: false, error: error }));
			return;
		}

		res.send(JSON.stringify({ success: true }));

	});
};

exports.auth = (req, res, next) => {
	"use strict";

	let postData = req.body;
	let email = postData.email;
	let password = postData.password;

	res.setHeader('Content-Type', 'application/json');

	if (!email && !password) {
		res.send(JSON.stringify({ success: false, info: false }));
		return ;
	}

	User.findOne({  email: email }, (error, user) => {
		if (error) {
			user.loginAttempts = user.loginAttempts + 1;
			res.send(JSON.stringify({ success: false, error: error }));
			return;
		}

		User.getAuthenticated(user, password, (error, data, reason) => {
			if (data) {
				req.session.regenerate(() => {
					req.session.email = email; // set email value is session
					req.session.logged_in =  true;
					req.session.success = 'Authentication was successful!';

					res.send(JSON.stringify({ success: true, user: { email: user.email, courses: user.courses, type: user.type }, sid: req.sessionID }));
				});
			} else {
				req.session.error = reason;

				user.loginAttempts = user.loginAttempts + 1;
				res.send(JSON.stringify({ success: false, error: error, reason: reason }));
			}
		});
	});
};
