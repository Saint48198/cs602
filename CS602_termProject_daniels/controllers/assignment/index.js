const mongoose = require('mongoose');
const utilities = require('../../lib/utilities');

const Course = mongoose.model('Course');
const Assignment = mongoose.model('Assignment');

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
	postData.due = new Date();
	postData.files = [];

	let newAssignment = new Assignment(postData);

	newAssignment.save((error) => {
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

	res.setHeader('Content-Type', 'application/json');

	if (utilities.checkAccess(req, res, next) === false) {
		res.status(401);
		res.send(JSON.stringify({ status: 'Access Denied!', code: 401 }));
		return;
	}

	if (queryData.course_id) {
		Course.findOne({ number: queryData.course_id }, (error, course) => {
			if (error) {
				console.log('Error: %s', error);
				res.send(JSON.stringify({ error: 'Error finding course!' }));
				return;
			}

			if (course.assignments.length) {
				Assignment.find({ $or: course.assignments }, (error, results) => {
					if (error) {
						console.log('Error: %s', error);
						res.send(JSON.stringify({ error: 'Error finding assignments!' }));
						return;
					}

					res.send(JSON.stringify({ assignment: results }));
				});
			} else {
				res.send(JSON.stringify({ assignment: course.assessments }));
			}
		});

		return;
	} else {
		res.send(JSON.stringify({ error: 'Request must include course number!' }));
	}
};

exports.show =  (req, res, next) => {
	"use strict";

	res.setHeader('Content-Type', 'application/json');

	if (utilities.checkAccess(req, res, next) === false) {
		res.status(401);
		res.send(JSON.stringify({ status: 'Access Denied!', code: 401 }));
		return;
	}

	Assignment.find({ number: req.params.assignment_id }, (error, assignment) => {
		if (error) {
			console.log('Error: %s', error);
			res.send(JSON.stringify({ error: error }));
			return;
		}

		let results = assignment.map((assignment) => {
			return assignment;
		});

		res.send(JSON.stringify({ assignment: results }));
	});
};