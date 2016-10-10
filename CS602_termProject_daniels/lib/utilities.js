module.exports.checkAccess = function (req, res, next) {
	"use strict";

	let sess = req.session;
console.log(sess);
	if (sess.email && sess.type === 'admin') {
		return true;
	} else {
		return false;
	}
};
