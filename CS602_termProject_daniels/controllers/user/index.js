const mongoose = require('mongoose');
const async = require('async');
const crypto = require('crypto')
const nodemailer = require('nodemailer');
const sgTransport = require('nodemailer-sendgrid-transport');

const utilities = require('../../lib/utilities');
const User = mongoose.model('User');

module.exports.create = (req, res, next) => {
	"use strict";

	res.setHeader('Content-Type', 'application/json');

	if (utilities.checkAccess(req, res, next) === false) {
		res.status(401);
		res.send(JSON.stringify({ status: 'Access Denied!', code: 401 }));
		return;
	}

	let postData = req.body;
	let fname = postData.firstName;
	let lname = postData.lastName;
	let email = postData.email;
	let password = postData.password;
	let role =  postData.roles ? postData.roles.split(',') : ['user'];

	let newUser = new User({
		firstName:  fname,
		lastName: lname,
		email: email,
		password: password,
	});

	newUser.roles = role;

	if (role.join(',').indexOf('user') !== -1) {
		newUser.course = [];
	}

	newUser.save((error) => {
		if (error) {
			res.send(JSON.stringify({  success: false, error: error }));
			return;
		}

		res.send(JSON.stringify({ success: true }));

	});
};

module.exports.list = (req, res, next) => {
	"use strict";

	let queryData = req.query;
	let query = {};

	if (queryData.role) {
		query.roles = queryData.role;
	}

	if (queryData.course_id) {
		query['courses.number'] = queryData.course_id;
	}

	res.setHeader('Content-Type', 'application/json');

	if (utilities.checkAccess(req, res, next) === false) {
		res.status(401);
		res.send(JSON.stringify({ status: 'Access Denied!', code: 401 }));
		return;
	}

	User.find(query, (error, user) => {
		if (error) {
			console.log('Error: %s', error);
			res.send(JSON.stringify({ error: error }));
			return;
		}

		let results = user.map((user) => {
			return user;
		});

		res.send(JSON.stringify({ user: results }));
	});

};

module.exports.show =  (req, res, next) => {
	"use strict";

	res.setHeader('Content-Type', 'application/json');

	if (utilities.checkAccess(req, res, next) === false) {
		res.status(401);
		res.send(JSON.stringify({ status: 'Access Denied!', code: 401 }));
		return;
	}

	User.find({ _id: req.params.user_id }, (error, user) => {
		if (error) {
			console.log('Error: %s', error);
			res.send(JSON.stringify({ error: error }));
			return;
		}

		let results = user.map((user) => {
			return user;
		});

		res.send(JSON.stringify({ results: results }));
	});
};

module.exports.update = (req, res, next) => {
	"use strict";
	res.setHeader('Content-Type', 'application/json');

	if (utilities.checkAccess(req, res, next) === false) {
		res.status(401);
		res.send(JSON.stringify({ status: 'Access Denied!', code: 401 }));
		return;
	}

	let postData = req.body;
	let userId = req.params.user_id || postData._id;


	User.findOne({ _id: userId }, (error, user) => {
		if (error) {
			console.log('Error: %s', error);
			res.send(JSON.stringify({ error: error }));
			return;
		}

		if (!user) {
			res.send(JSON.stringify({ error: 'User does not exist!' }));
			return;
		}

		user.isNew = false;

		if (postData.firstName && (postData.firstName !== user.firstName)) {
			user.firstName = postData.firstName;
		}

		if (postData.lastName && (postData.lastName !== user.lastName)) {
			user.lastName = postData.lastName;
		}

		if (postData.email && (postData.email !== user.email)) {
			user.email = postData.email;
		}

		if (postData.password) {
			user.password = postData.password;
		}

		if (postData.roles && (postData.roles !== user.roles.join(','))) {
			user.roles = postData.roles.split(',');
		}

		user.save((error) => {
			if(error) {
				console.log('Error: %s', error);
				res.send(JSON.stringify({ error: error }));
				return;
			}
			res.send(JSON.stringify({ success: true, user: user }));
		});


	});
};

module.exports.getPasswordResetToken = (req, res, next) => {
	"use strict";

	let postData = req.body;
	let email = postData.email;

	res.setHeader('Content-Type', 'application/json');

	if (!email) {
		res.send(JSON.stringify({ success: false, error: 'Must provide email address!' }));
		return ;
	}

	async.waterfall([
		function (done) {
			crypto.randomBytes(20, function(error, buf) {
				var token = buf.toString('hex');
				done(error, token);
			});
		},
		function(token, done) {
			User.findOne({  email: email }, (error, user) => {
				// system error with getting user
				if (error) {
					res.send(JSON.stringify({success: false, error: error}));
					return;
				}

				if (!user) {
					res.send(JSON.stringify({success: false, error: 'No User found with this email address!'} ));
					return;
				}

				user.resetPasswordToken = token;
				user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

				user.save((error)=> {
					done(error, token, user);
				});
			});
		},
		function(token, user, done) {
			const options = {
				auth: {
					api_user: 'Saint48198',
					api_key: 'b2zneGVSsQ8DQ47'
				}
			};
			const client = nodemailer.createTransport(sgTransport(options));
			const email = {
				to: user.email,
				from: 'passwordreset@lms.com',
				subject: 'LMS Password Reset',
				text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
				'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
				'http://' + req.headers.host + '/reset?_t=' + token + '\n\n' +
				'If you did not request this, please ignore this email and your password will remain unchanged.\n'
			};

			client.sendMail(email, (error, info) => {
				if (error) {
					done(error, 'done');
					return;
				}
				res.send(JSON.stringify({ success: true, message: 'An e-mail has been sent to ' + user.email + ' with further instructions.' }));
			});
		}
	], function(error) {
		if (error) {
			res.send(JSON.stringify({success: false, error: 'There was an issue sending the email! Please try again later' }));
			return next(error);
		}
	});
};

module.exports.resetTokenCheck = (req, res, next) => {
	"use strict";

	res.setHeader('Content-Type', 'application/json');

	User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, (error, user) => {
		if (!user) {
			res.send(JSON.stringify({success: false, error: 'Password reset token is invalid or has expired.' }));
			return;
		}

		res.send(JSON.stringify({ success: true }));
	});
};

module.exports.resetPassword = (req, res, next) => {
	"use strict";

	res.setHeader('Content-Type', 'application/json');

	async.waterfall([
		function(done) {
			User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, (error, user) => {
				if (!user) {
					res.send(JSON.stringify({success: false, error: 'Password reset token is invalid or has expired.' }));
					return;
				}

				user.password = req.body.password;
				user.resetPasswordToken = undefined;
				user.resetPasswordExpires = undefined;

				user.save(function(error) {
					done(error, user);
				});
			});
		},
		function(user, done) {
			const options = {
				auth: {
					api_user: 'Saint48198',
					api_key: 'b2zneGVSsQ8DQ47'
				}
			};
			const client = nodemailer.createTransport(sgTransport(options));
			const email = {
				to: user.email,
				from: 'passwordreset@lms.com',
				subject: 'Your password has been changed',
				text: 'Hello,\n\n' +
				'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
			};

			client.sendMail(email, (error, info) => {
				if (error) {
					done(error, 'done');
					return;
				}
				res.send(JSON.stringify({ success: true, message: 'Success! Your password has been changed.' }));
			});
		}
	], function (error) {
		if (error) {
			res.send(JSON.stringify({success: false, error: 'There was an issue sending the email! Please try again later' }));
			return next(error);
		}
	});

};

module.exports.auth = (req, res, next) => {
	"use strict";

	let postData = req.body;
	let email = postData.email;
	let password = postData.password;

	res.setHeader('Content-Type', 'application/json');

	if (!email && !password) {
		res.send(JSON.stringify({ success: false, info: false, error: 'Must provide email and password!' }));
		return ;
	}

	User.findOne({  email: email }, (error, user) => {
		// system error with getting user
		if (error) {
			res.send(JSON.stringify({ success: false, error: error }));
			return;
		}

		if (user.resetPasswordToken) {
			res.send(JSON.stringify({ success: false, error: 'Password has been reset' }));
			return;
		}

		User.getAuthenticated(user, password, (error, data) => {

			if (data) {
				req.session.regenerate(() => {
					req.session.email = email; // set email value is session
					req.session.logged_in =  true;
					req.session.roles = user.roles.join(',');
					req.session.success = 'Authentication was successful!';
					req.session.user = user;

					res.send(JSON.stringify({ success: true, user: { email: user.email, courses: user.courses, type: user.type }, sid: req.sessionID }));
				});
			} else {
				res.send(JSON.stringify({ success: false, error: error }));
			}
		});
	});
};
