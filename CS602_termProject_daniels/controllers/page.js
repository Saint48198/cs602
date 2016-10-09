"use strict";

let sess;

module.exports = function page(req, res, next) {
	sess = req.session;

	res.render('html/page');
}
