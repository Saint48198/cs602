'use strict';

const mongoose = require('mongoose');
const User = mongoose.model('User');

module.exports.addUser = (req, res, next) => {
	res.setHeader('Content-Type', 'application/json');

	let sess = req.session;

	if (!sess.email) {
		res.send(JSON.stringify({ message: 'You need to be logged in to use this service!' }));
		return;
	}

	let postData = req.body;
    let fname = postData.fname;
    let lname = postData.lname;
    let email = postData.email;
    let password = postData.password;

    let newUser = new User({
        firstName:  fname,
        lastName: lname,
        email: email,
        password: password,
        type: 'user' // tmp
    });

    newUser.save((error) => {
        if (error) {
            res.send(JSON.stringify({  success: false, error: error }));
            throw error;
        }

        res.send(JSON.stringify({ success: true }));
        
    });
};

module.exports.auth = (req, res, next) => {
    let postData = req.body;
    let email = postData.email;
    let password = postData.password;
    
    res.setHeader('Content-Type', 'application/json');
    
    if (!email && !password) {
        res.send(JSON.stringify({ success: false, info: false }));
        return ;
    }

    User.findOne({  email: email }, (error, user) => {
        if (error) {
            user.loginAttempts = user.loginAttempts + 1;
            res.send(JSON.stringify({ success: false, error: error }));
            return;
        }

        User.getAuthenticated(user, password, (error, data, reason) => {
            if (data) {
            	req.session.regenerate(() => {
					req.session.email = email; // set email value is session
					req.session.logged_in =  true;
					req.session.success = 'Authentication was successful!';
				});
                res.send(JSON.stringify({ success: true, user: user }));
            } else {
            	req.session.error = reason;

                user.loginAttempts = user.loginAttempts + 1;
                res.send(JSON.stringify({ success: false, error: error, reason: reason }));
            }
        });
    });
};

module.exports.logout = (req, res, next) => {

};