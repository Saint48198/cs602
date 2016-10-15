const mongoose = require('mongoose');
const utilities = require('../../lib/utilities');
const User = mongoose.model('User');

exports.prefix = '/api';

exports.create = (req, res, next) => {
	"use strict";

	res.setHeader('Content-Type', 'application/json');

	if (utilities.checkAccess(req, res, next) === false) {
		res.status(401);
		res.send(JSON.stringify({ status: 'Access Denied!', code: 401 }));
		return;
	}

	let postData = req.body;
	let fname = postData.fname;
	let lname = postData.lname;
	let email = postData.email;
	let password = postData.password;
	let role =  postData.role ? postData.role.split(',') : ['user'];

	let newUser = new User({
		firstName:  fname,
		lastName: lname,
		email: email,
		password: password,
	});

	newUser.roles.addToSet({ $each: role });

	newUser.save((error) => {
		if (error) {
			res.send(JSON.stringify({  success: false, error: error }));
			return;
		}

		res.send(JSON.stringify({ success: true }));

	});
};

exports.list = (req, res, next) => {
	"use strict";

	let queryData = req.query;
	let query = {};

	if (queryData.role) {
		query.role = queryData.role;
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

		res.send(JSON.stringify({ results: results }));
	});

};

exports.show =  (req, res, next) => {
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
		// system error with getting user
		if (error) {
			res.send(JSON.stringify({ success: false, error: error }));
			return;
		}

		User.getAuthenticated(user, password, (error, data) => {

			if (data) {
				req.session.regenerate(() => {
					req.session.email = email; // set email value is session
					req.session.logged_in =  true;
					req.session.type = user.type;
					req.session.success = 'Authentication was successful!';

					res.send(JSON.stringify({ success: true, user: { email: user.email, courses: user.courses, type: user.type }, sid: req.sessionID }));
				});
			} else {
				res.send(JSON.stringify({ success: false, error: error }));
			}
		});
	});
};
