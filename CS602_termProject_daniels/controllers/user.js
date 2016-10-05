'use strict';

const mongoose = require('mongoose');
const User = mongoose.model('User');

module.exports.addUser = (req, res, next) => {
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

module.exports.auth = (email, password) => {
    res.setHeader('Content-Type', 'application/json');

    User.getAuthenticated(email, password, (error, user, reason) => {
        if (error) {
            throw error;
        }

        // login successful 
        if (user) {
            res.send(JSON.stringify({ success: true }));
            return;
        }

        // failed and determin why
        let reasons = User.failedLogin;
        switch (reasons) {
            case reasons.NOT_FOUND:
            case reasons.PASSWORD_INCORRECT:
                // treated the same but don't  inform the user of this
                res.send(JSON.stringify({ success: false, accountLocked: false }));
                break;
            case reasons.MAX_ATTEMPTS: 
                // send email to inform the user of the account lock
                res.send(JSON.stringify({ success: false, accountLocked: true  }));
                break;
        }
    });
};