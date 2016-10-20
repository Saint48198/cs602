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
	let courseId = postData.course_id;

	Course.findOne({ number: courseId}, (error, course) => {
		if (error) {
			console.log('Error: %s', error);
			res.send(JSON.stringify({ error:'Error on server getting the list of modules' }));
			return;
		}

		if (!course) {
			res.send(JSON.stringify({ error:'Course does not exists!' }));
			return;
		}

		let newModule = new Module(postData);

		newModule.save((error, module) => {
			if (error) {
				res.send(JSON.stringify({  success: false, error: error }));
				return;
			}

			course.modules.addToSet({ _id: module.id });
			course.save((error, course) => {
				if (error) {
					console.log('Error: %s', error);
					res.send(JSON.stringify({ error: 'Error finding course!' }));
					return;
				}

				res.send(JSON.stringify({ success: true, module: module, course: course }));
			});

		});

	});
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
		Course.findOne({ number: courseId}, (error, course) => {
			if (error) {
				console.log('Error: %s', error);
				res.send(JSON.stringify({ error:'Error on server getting the list of modules' }));
				return;
			}

			if (!course) {
				res.send(JSON.stringify({ error:'Course does not exist!' }));
				return;
			}

			if (course.modules && course.modules.length) {

				Module.find({ $or: course.modules }, (error, results) => {
					if (error) {
						console.log('Error: %s', error);
						res.send(JSON.stringify({ error: 'Error on server getting the list of modules' }));
						return;
					}

					res.send(JSON.stringify({ module: results }));
				});
			} else {
				res.send(JSON.stringify({ module: [] }));
			}

		});

		return;
	} else {
		res.send(JSON.stringify({ success: false, error: 'Request must include course number!' }));
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

	Module.findOne({ _id: req.params.module_id }, (error, module) => {
		if (error) {
			console.log('Error: %s', error);
			res.send(JSON.stringify({ error: error.message }));
			return;
		}

		if (!module) {
			res.send(JSON.stringify({ error: 'Module does not exist!' }));
			return;
		}

		res.send(JSON.stringify({ module: module }));
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

	Module.findOne({ _id: req.params.module_id }, (error, module) => {
		if (error) {
			console.log('Error: %s', error);
			res.send(JSON.stringify({ error: error.message }));
			return;
		}

		if (!module) {
			res.send(JSON.stringify({ error: 'Module does not exist!' }));
			return;
		}

		module.isNew = false;

		for (var prop in postData) {
			if (postData[prop] && (postData[prop] !== module[prop])) {
				module[prop] = postData[prop];
			}
		}

		module.save((error) => {
			if(error) {
				console.log('Error: %s', error);
				res.send(JSON.stringify({ error: error.message }));
				return;
			}
			res.send(JSON.stringify({ success: true, module: module }));
		});

	});

};