'use strict';

const mongoose = require('mongoose');
const User = mongoose.model('User');

module.exports.addUser = (req, res, next) => {
	if(req.session.lastPage) {
		res.write('Last page was: ' + req.session.lastPage + '. ');
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

    res.setHeader('Content-Type', 'application/json');

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
                res.send(JSON.stringify({ success: true, user: data }));
                return;
            } else {
                user.loginAttempts = user.loginAttempts + 1;
                res.send(JSON.stringify({ success: false, error: error, reason: reason }));
            }
        });
    });
};