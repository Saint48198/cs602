exports.index = (req, res, next) => {
	sess = req.session;

	res.render('index');
};
