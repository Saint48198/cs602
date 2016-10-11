const mongoose = require('mongoose');
const utilities = require('../../lib/utilities');
const Course = mongoose.model('Course');

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
	let title = postData.title;
	let number = postData.number;

	let newCourse = new Course({
		title:  title,
		number: number
	});

	newCourse.save((error) => {
		if (error) {
			res.send(JSON.stringify({  success: false, error: error }));
			return;
		}

		res.send(JSON.stringify({ success: true }));

	});
};
