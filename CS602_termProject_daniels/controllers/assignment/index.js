const mongoose = require('mongoose');
const utilities = require('../../lib/utilities');

const Course = mongoose.model('Course');
const Assignment = mongoose.model('Assignment');

module.exports.create = (req, res, next) => {
	"use strict";

	res.setHeader('Content-Type', 'application/json');

	if (utilities.checkAccess(req, res, next) === false) {
		res.status(401);
		res.send(JSON.stringify({ status: 'Access Denied!', code: 401 }));
		return;
	}

	let postData = req.body;
	let courseId = postData.course_id;
	let assignmentData = {};
	console.log(postData.files);

	assignmentData.name =  postData.name;
	assignmentData.points  = postData.points;
	assignmentData.due = postData.due;
	assignmentData.instructions = postData.instructions;
	assignmentData.files = [];

	Course.findOne({ number: courseId }, (error, course) => {
		if (error) {
			console.log('Error: %s', error);
			res.send(JSON.stringify({ error: 'Error finding course!' }));
			return;
		}

		if (!course.name) {
			res.send(JSON.stringify({ error: 'Invalid course number!' }));
			return;
		}

		let newAssignment = new Assignment(assignmentData);

		newAssignment.save((error, assignment) => {
			if (error) {
				res.send(JSON.stringify({  success: false, error: error.message }));
				return;
			}

			course.assignments.addToSet({ _id: assignment.id });

			res.send(JSON.stringify({ success: true, assignment: assignment, course: course }));

		});
	});
};

module.exports.list = (req, res, next) => {
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

			if (!course.name) {
				res.send(JSON.stringify({ error: 'Invalid course number!' }));
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

module.exports.show =  (req, res, next) => {
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