module.exports.checkAccess = function (req, res, next) {
	"use strict";

	let sess = req.session;
console.log(sess);
	if (sess.email && sess.role.indexOf('admin') !== -1) {
		return true;
	} else {
		return false;
	}
};
