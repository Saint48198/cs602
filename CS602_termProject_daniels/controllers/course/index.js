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
	let name = postData.name;
	let number = postData.number;

	let newCourse = new Course({
		name:  name,
		number: number,
		assessments: [],
		assignments: [],
		modules: [],
		students: [],
		teachers: []
	});

	newCourse.save((error) => {
		if (error) {
			res.send(JSON.stringify({  success: false, error: error }));
			return;
		}

		res.send(JSON.stringify({ success: true }));

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

	Course.find({ number: req.params.course_id }, (error, user) => {
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

exports.updateAddTeacher = (req, res, next) => {
	"use strict";

	res.setHeader('Content-Type', 'application/json');

	if (utilities.checkAccess(req, res, next) === false) {
		res.status(401);
		res.send(JSON.stringify({ status: 'Access Denied!', code: 401 }));
		return;
	}

	let postData = req.body;

	Course.findOne({ number: req.params.course_id }, {}, { sort: { date: -1}}, (error, course) => {
		if (error) {
			res.send(JSON.stringify({ error: error, course: course }));
			return;
		}

		if (!course) {
			res.status(401);
			res.send(JSON.stringify({ status: 'Record Not Found!', code: 404 }));
			return;
		}

		let teacherFound = false;

		course.teachers.forEach((teacher) => {
			if (teacher._id === postData.id) {
				teacherFound = true;
			}
		});

		if (teacherFound) {
			res.send(JSON.stringify({ error: 'Teacher already added to the course!', course: course }));
		} else {
			course.teachers.push(postData);
			course.markModified('teachers');
			course.save();

			res.send(JSON.stringify({ success: true, course: course }));
		}
	});
};

exports.list = (req, res, next) => {
	"use strict";

	let queryData = req.query;
	let query = {};

	if (queryData.userId) {
		query.userId = queryData.userId;
	}

	res.setHeader('Content-Type', 'application/json');

	if (utilities.checkAccess(req, res, next) === false) {
		res.status(401);
		res.send(JSON.stringify({ status: 'Access Denied!', code: 401 }));
		return;
	}

	Course.find(query, (error, course) => {
		if (error) {
			console.log('Error: %s', error);
			res.send(JSON.stringify({ error: error }));
			return;
		}

		let results = course.map((course) => {
			return course;
		});

		res.send(JSON.stringify({ results: results }));
	});

};
