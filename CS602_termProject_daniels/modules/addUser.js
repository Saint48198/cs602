'use strict';

const mongoose =  require('mongoose');

const DB = require('../dbConnection');
const User = require('../modals/user-modal');

module.exports = function addUser(req, res, next) {
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
        console.log(error);
        if (error) {
            res.send(JSON.stringify({  success: false, error: error }));
        } else {
            res.send(JSON.stringify({ success: true }));
        }
        
    });
};