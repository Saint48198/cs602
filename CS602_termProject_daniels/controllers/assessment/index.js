const mongoose = require('mongoose');
const utilities = require('../../lib/utilities');

const Course = mongoose.model('Course');
const Assessment = mongoose.model('Assessment');
const Question = mongoose.model('Question');

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
	let assessmentData = {};

	assessmentData.due = Date.now();
	assessmentData.name = postData.name;
	assessmentData.instructions = postData.instructions;
	assessmentData.questions = [];

	let newAssessment = new Assessment(assessmentData);

	if(courseId) {
		Course.findOne({ number: courseId }, (error, course) => {
			if (error) {
				res.send(JSON.stringify({  success: false, error: error.message }));
				return;
			}

			if (!course) {
				res.send(JSON.stringify({  success: false, error: 'Course does not exists' }));
				return;
			}

			newAssessment.save((error, assessment) => {
				if (error) {
					res.send(JSON.stringify({  success: false, error: error }));
					return;
				}

				course.assessments.addToSet({ _id: assessment.id });
				course.save((error, course) => {
					if (error) {
						console.log('Error: %s', error);
						res.send(JSON.stringify({ error: 'Error finding course!' }));
						return;
					}

					res.send(JSON.stringify({ success: true, course: course, assessment: assessment }));
				});
			});
		});
	} else {
		res.send(JSON.stringify({ success: false, error: 'Request must include course number!' }));
	}


};

module.exports.addQuestion = (req, res, next) => {
	"use strict";

	res.setHeader('Content-Type', 'application/json');

	if (utilities.checkAccess(req, res, next) === false) {
		res.status(401);
		res.send(JSON.stringify({ status: 'Access Denied!', code: 401 }));
		return;
	}

	let postData = req.body;
	let assessmentId = req.params.assessment_id;
	let question = { text: postData.question_text, options: [] };
	let totalOptions = postData.question_option_text.length;

	for(let i = 0; i < totalOptions; i++) {
		question.options.push({
			text: postData.question_option_text[i],
			code: postData.question_option_code[i],
			correct: postData.question_option_correct[i]
		});
	}


	if (assessmentId) {

		Assessment.findOneAndUpdate({ _id: assessmentId }, { $addToSet: { questions: question } }, (error, assessment) => {
			if (error) {
				res.send(JSON.stringify({ success: false, error: error }));
				return;
			}

			res.send(JSON.stringify({ success: true, assessment: assessment }));
		});

	} else {
		res.send(JSON.stringify({ success: false,  error: 'Request must include assessment id!' }));
	}
};

module.exports.list = (req, res, next) => {
	"use strict";

	let queryData = req.query;
	let courseId = queryData.course_id;

	res.setHeader('Content-Type', 'application/json');

	if (utilities.checkAccess(req, res, next) === false) {
		res.status(401);
		res.send(JSON.stringify({ status: 'Access Denied!', code: 401 }));
		return;
	}

	if (courseId) {
		Course.findOne({ number: courseId }, (error, course) => {
			if (error) {
				console.log('Error: %s', error);
				res.send(JSON.stringify({ error: error }));
				return;
			}

			if (!course.name) {
				res.send(JSON.stringify({ error: 'Invalid course number!' }));
				return;
			}

			if (course.assessments.length) {
				Assessment.find({ $or: course.assessments }, (error, results) => {
					if (error) {
						console.log('Error: %s', error);
						res.send(JSON.stringify({ error: error }));
						return;
					}

					res.send(JSON.stringify({ assessment: results }));
				});
			} else {
				res.send(JSON.stringify({ assessment: course.assessments }));
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

	Assessment.findOne({ _id: req.params.assessment_id }, (error, assessment) => {
		if (error) {
			console.log('Error: %s', error);
			res.send(JSON.stringify({ error: error.message }));
			return;
		}

		if (!assessment) {
			res.send(JSON.stringify({ error: 'Assesment does not exist!' }));
			return;
		}

		res.send(JSON.stringify({ assessment: assessment }));
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

	Assessment.findOne({ _id: req.params.assessment_id }, (error, assessment) => {
		if (error) {
			console.log('Error: %s', error);
			res.send(JSON.stringify({ error: error.message }));
			return;
		}

		if (!assessment) {
			res.send(JSON.stringify({ error: 'Assesment does not exist!' }));
			return;
		}

		assessment.isNew = false;

		for (var prop in postData) {
			if (postData[prop] && (postData[prop] !== assessment[prop])) {
				assessment[prop] = postData[prop];
			}
		}

		assessment.save((error) => {
			if(error) {
				console.log('Error: %s', error);
				res.send(JSON.stringify({ error: error }));
				return;
			}
			res.send(JSON.stringify({ success: true, assessment: assessment }));
		});

	});
};