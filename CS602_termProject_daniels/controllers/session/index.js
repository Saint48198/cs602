const mongoose = require('mongoose');

exports.prefix = '/api';

exports.session = (req, res, next) => {
	'use strict';

	let session = req.session;
	session.sid = req.sessionID

	res.setHeader('Content-Type', 'application/json');
	res.send(JSON.stringify(session));
};

exports.logout = (req, res, next) => {
	req.session.destroy((error) => {
		res.setHeader('Content-Type', 'application/json');

		if (error) {
			res.send(JSON.stringify({ logged_out: false, error: error }));
			return;
		}

		res.send(JSON.stringify({ logged_out: true }));

		this.session.messages = [];
	})
};
