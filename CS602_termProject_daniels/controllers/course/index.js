const mongoose = require('mongoose');
const utilities = require('../../lib/utilities');
const Course = mongoose.model('Course');
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
	postData.assessments = [];
	postData.assignments = [];
	postData.modules = [];
	postData.students = [];
	postData.teachers = [];

	let newCourse = new Course(postData);

	newCourse.save((error) => {
		if (error) {
			res.send(JSON.stringify({  success: false, error: error }));
			return;
		}

		res.send(JSON.stringify({ success: true }));

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

module.exports.addTeacher = (req, res, next) => {
	"use strict";

	res.setHeader('Content-Type', 'application/json');

	if (utilities.checkAccess(req, res, next) === false) {
		res.status(401);
		res.send(JSON.stringify({ status: 'Access Denied!', code: 401 }));
		return;
	}

	let postData = req.body;

	Course.findOneAndUpdate(
		{ number: req.params.course_id },
		{ $addToSet: { teachers: { _id: postData._id } }},
		{ safe: true, upsert: true, new: true },
		(error, course) => {
			if (error) {
				res.send(JSON.stringify({ error: error }));
				return;
			}

			res.send(JSON.stringify({ success: true, course: course }));
		});
};

module.exports.addStudent = (req, res, next) => {
	"use strict";

	res.setHeader('Content-Type', 'application/json');

	if (utilities.checkAccess(req, res, next) === false) {
		res.status(401);
		res.send(JSON.stringify({ status: 'Access Denied!', code: 401 }));
		return;
	}

	let postData = req.body;

	// find course and add student id to array
	Course.findOneAndUpdate(
		{ number: req.params.course_id },
		{ $addToSet: { students: { _id: postData._id } }},
		{ safe: true, upsert: true, new: true },
		(error, course) => {
			if (error) {
				res.send(JSON.stringify({ error: error }));
				return;
			}

			// find user and add course id array
			User.findOneAndUpdate(
				{ _id: postData._id },
				{
					$addToSet: {
						courses: {
							number: req.params.course_id,
							grade: null,
							assessments: [ ],
							assignments: [ ]
						}
					}
				},
				{ safe: true, upsert: true, new: true },
				(error, student) => {
					if (error) {
						res.send(JSON.stringify({error: error}));
						return;
					}

					res.send(JSON.stringify({ success: true, course: course, student: student }));
				}
			);
		});
};

module.exports.addAssignment = (req, res, next) => {
	"use strict";

	res.setHeader('Content-Type', 'application/json');

	if (utilities.checkAccess(req, res, next) === false) {
		res.status(401);
		res.send(JSON.stringify({ status: 'Access Denied!', code: 401 }));
		return;
	}

	let postData = req.body;

	// find course and add student id to array
	Course.findOneAndUpdate(
		{ number: req.params.course_id },
		{ $addToSet: { assignments: { _id: postData._id } }},
		{ safe: true, upsert: true, new: true },
		(error, course) => {
			if (error) {
				res.send(JSON.stringify({ error: error.message }));
				return;
			}

			res.send(JSON.stringify({ success: true, course: course }));
		});
};

module.exports.addModule = (req, res, next) => {
	"use strict";

	res.setHeader('Content-Type', 'application/json');

	if (utilities.checkAccess(req, res, next) === false) {
		res.status(401);
		res.send(JSON.stringify({ status: 'Access Denied!', code: 401 }));
		return;
	}

	let postData = req.body;

	// find course and add student id to array
	Course.findOneAndUpdate(
		{ number: req.params.course_id },
		{ $addToSet: { modules: { _id: postData._id } }},
		{ safe: true, upsert: true, new: true },
		(error, course) => {
			if (error) {
				res.send(JSON.stringify({ error: error.message }));
				return;
			}

			res.send(JSON.stringify({ success: true, course: course }));
		});
};

module.exports.addAssessment = (req, res, next) => {
	"use strict";

	res.setHeader('Content-Type', 'application/json');

	if (utilities.checkAccess(req, res, next) === false) {
		res.status(401);
		res.send(JSON.stringify({ status: 'Access Denied!', code: 401 }));
		return;
	}

	let postData = req.body;

	// find course and add student id to array
	Course.findOneAndUpdate(
		{ number: req.params.course_id },
		{ $addToSet: { assessments: { _id: postData._id } }},
		{ safe: true, upsert: true, new: true },
		(error, course) => {
			if (error) {
				res.send(JSON.stringify({ error: error.message }));
				return;
			}

			res.send(JSON.stringify({ success: true, course: course }));
		});
};

module.exports.list = (req, res, next) => {
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


module.exports.update = (req, res, next) => {
	"use strict";

	res.setHeader('Content-Type', 'application/json');

	if (utilities.checkAccess(req, res, next) === false) {
		res.status(401);
		res.send(JSON.stringify({ status: 'Access Denied!', code: 401 }));
		return;
	}

	let postData = req.body;
	let courseId = req.params.course_id;

	Course.findOne({ number: courseId }, (error, course) => {
		if (error) {
			console.log('Error: %s', error);
			res.send(JSON.stringify({ error: error }));
			return;
		}

		if (!course) {
			res.send(JSON.stringify({ error: 'Course does not exist!' }));
			return;
		}

		course.isNew = false;

		if (postData.number && (postData.number !== course.number)) {
			course.number = postData.number;
		}

		if (postData.name && (postData.name !== course.name)) {
			course.name = postData.name;
		}

		if (postData.startDate && (postData.startDate !== course.startDate)) {
			course.startDate = postData.startDate;
		}


		if (postData.endDate && (postData.endDate !== course.endDate)) {
			course.endDate = postData.endDate;
		}

		if (postData.desc && (postData.desc !== course.desc)) {
			course.desc = postData.desc;
		}


		course.save((error) => {
			if(error) {
				console.log('Error: %s', error);
				res.send(JSON.stringify({ error: error }));
				return;
			}
			res.send(JSON.stringify({ success: true, course: course }));
		});


	});
};