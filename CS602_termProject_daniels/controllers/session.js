const mongoose = require('mongoose');

module.exports.status = (req, res, next) => {
	'use strict';
	res.setHeader('Content-Type', 'application/json');
	res.send(JSON.stringify(req.session));
};
