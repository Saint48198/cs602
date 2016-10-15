const mongoose = require('mongoose');
const utilities = require('../../lib/utilities');

const Course = mongoose.model('Course');
const Assessment = mongoose.model('Assessment');

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

	let newAssessment = new Assessment(postData);

	newAssessment.save((error) => {
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

	if (queryData.courseId) {
		Course.find({ number: courseId}, (error, course) => {
			if (error) {
				console.log('Error: %s', error);
				res.send(JSON.stringify({ error: error }));
				return;
			}

			Assessment.find({ $or: course.assessments }, (error, results) => {
				if (error) {
					console.log('Error: %s', error);
					res.send(JSON.stringify({ error: error }));
					return;
				}

				res.send(JSON.stringify({ assessment: results }));
			});



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

	Assessment.find({ number: req.params.assignment_id }, (error, assessment) => {
		if (error) {
			console.log('Error: %s', error);
			res.send(JSON.stringify({ error: error }));
			return;
		}

		let results = assessment.map((assessment) => {
			return assessment;
		});

		res.send(JSON.stringify({ assessment: results }));
	});
};