const mongoose = require('mongoose');
const utilities = require('../../lib/utilities');

const Course = mongoose.model('Course');
const Module = mongoose.model('Module');


module.exports.create = (req, res, next) => {
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

	let newModule = new Module(postData);

	newModule.save((error) => {
		if (error) {
			res.send(JSON.stringify({  success: false, error: error }));
			return;
		}

		res.send(JSON.stringify({ success: true }));

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

	if (queryData.courseId) {
		Course.find({ number: courseId}, (error, course) => {
			if (error) {
				console.log('Error: %s', error);
				res.send(JSON.stringify({ error: error }));
				return;
			}

			Module.find({ $or: course.modules }, (error, results) => {
				if (error) {
					console.log('Error: %s', error);
					res.send(JSON.stringify({ error: error }));
					return;
				}

				res.send(JSON.stringify({ module: results }));
			});



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

	Module.find({ number: req.params.module_id }, (error, module) => {
		if (error) {
			console.log('Error: %s', error);
			res.send(JSON.stringify({ error: error }));
			return;
		}

		let results = module.map((module) => {
			return module;
		});

		res.send(JSON.stringify({ module: results }));
	});
};