module.exports.checkAccess = function (req, res, next) {
	"use strict";

	let sess = req.session;

	if (sess.email && sess.roles.indexOf('admin') !== -1) {
		return true;
	} else {
		return false;
	}
};
