const mongoose = require('mongoose');
const utilities = require('../../lib/utilities');

const Course = mongoose.model('Course');
const Assessment = mongoose.model('Assessment');
const Question = mongoose.model('Question');

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
	let courseId = postData.course_id;
	let question = { text: postData.question_text, options: [] };
	let totalOptions = postData.question_option_text.length;

	for(let i = 0; i < totalOptions; i++) {
		question.options.push({
			text: postData.question_option_text[i],
			code: postData.question_option_code[i],
			correct: postData.question_option_correct[i]
		});
	}

	let assessmentData = {};
	assessmentData.due = Date.now();
	assessmentData.name = postData.name;
	assessmentData.instructions = postData.instructions;
	assessmentData.questions = [question];

	let newAssessment = new Assessment(assessmentData);



	if(courseId) {
		newAssessment.save((error, assessment) => {
			if (error) {
				res.send(JSON.stringify({  success: false, error: error }));
				return;
			}
console.log(assessment);
			Course.findOneAndUpdate({ number: courseId }, { $addToSet: { assessments: { _id: assessment._id } } }, (error, course) => {
				if (error) {
					res.send(JSON.stringify({  success: false, error: error }));
					return;
				}

				res.send(JSON.stringify({ success: true, course: course, assessment: assessment }));
			});
		});


	} else {
		res.send(JSON.stringify({ success: false, error: 'Request must include course number!' }));
	}


};

exports.addQuestion = (req, res, next) => {
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

exports.list = (req, res, next) => {
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

exports.show =  (req, res, next) => {
	"use strict";

	res.setHeader('Content-Type', 'application/json');

	if (utilities.checkAccess(req, res, next) === false) {
		res.status(401);
		res.send(JSON.stringify({ status: 'Access Denied!', code: 401 }));
		return;
	}

	Assessment.find({ number: req.params.assessment_id }, (error, assessment) => {
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