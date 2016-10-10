'use strict';

const mongoose = require('mongoose');
const dbUrl = 'mongodb://127.0.0.1:27017/cs602dblms';

let gracefulShutdown;

mongoose.connect(dbUrl);

// CONNECTION EVENTS
mongoose.connection.on('connected', function() {
    console.log('Mongoose connected to ' + dbUrl);
});
mongoose.connection.on('error', function(err) {
    console.log('Mongoose connection error: ' + err);
});
mongoose.connection.on('disconnected', function() {
    console.log('Mongoose disconnected');
});

// CAPTURE APP TERMINATION / RESTART EVENTS
// To be called when process is restarted or terminated
gracefulShutdown = (msg, callback) => {
    mongoose.connection.close(() => {
        console.log('Mongoose disconnected through ' + msg);
        callback();
    });
};

// BRING IN YOUR SCHEMAS & MODELS
const Course = require('./course-model');
const User = require('./user-model');
