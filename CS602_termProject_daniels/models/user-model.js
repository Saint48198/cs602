'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
	firstName: { type: String, required: true },
	lastName: { type: String, required: true },
    email: { type: String, required: true, index: { unique: true } },
    password: { type: String, required: true },
    loginAttempts: { type: Number, required: true, default: 0 },
    roles: [ String ],
	courses: [
		{
			number: String,
			grade: Number,
			assessments: [{ _id: String, grade: Number, attempts: [{ _id: String, submitted: Date, answers: [{ _id: String }] }] }],
			assignments: [{ _id: String, grade: Number, attempts: [{_id: String, submitted: Date }] }]
		}
	],
    numberLogins: { type: Number, required: true, default: 0 },
    lastLogin: { type: Date, default: null },
    lockUntil: { type: Date, default: 1 },
});

const SALT_WORK_FACTOR = 10;

// max of 5 attempts, resulting in a 2 hour lock
const MAX_LOGIN_ATTEMPTS = 5;
const LOCK_TIME = 2 * 60 * 60 * 1000;

UserSchema.virtual('isLocked').get(function () {
    // check for a future lockUntil timestamp
    return !!(this.lockUntil && this.lockUntil > Date.now());
});

// password hashing middleware
UserSchema.pre('save', function (next) {
    let user = this;
    // only hash the password if it has been modified or new
    if (user.password && !user.isModified('password')) {
        return next();
    }

    // generate salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function (error, salt) {
    	if (error) {
            return next(error);
        }

        // hash the password along with the salt
        bcrypt.hash(user.password, salt, function (error, hash) {
        	if (error) {
                return next(error);
            }
            // over write the nonencrpted password 
            user.password = hash;
            next();
        });
    });
});

// password verification
UserSchema.methods.comparePassword = function (user, password, callback) {
    bcrypt.compare(password, user.password, (error, isMatch) => {
        if (error) {
            return callback.call(user, error, isMatch);
        }
        callback.call(user, error, isMatch);
    });
};

UserSchema.methods.incorrectLoginAttempts = function (callback) {
    // if we have a previous lock that has expired, restart at 1
    if (this.lockUntil && this.lockUntil < Date.now()) {
        return this.update({
            $set: { loginAttempts: 1 },
            $unset: { lockUntil: 1 }
        }, callback);
    }

    // otherwise we're incrementing
    var updates = { $inc: { loginAttempts: 1 } };

    // lock the account if we've reached max attempts and it's not locked already
    if (this.loginAttempts + 1 >= MAX_LOGIN_ATTEMPTS && !this.isLocked) {
        updates.$set = { lockUntil: Date.now() + LOCK_TIME };
    }

    return this.update(updates, callback);
};

// expose enum on the model, and provide an internal convenience reference 
let failedLoginStatics = UserSchema.statics.failedLogin = {
    NOT_FOUND: 0,
    PASSWORD_INCORRECT: 0,
    MAX_ATTEMPTS: 0
};

UserSchema.statics.getAuthenticated = (user, password, callback) => {
    // make sure user exist
    if (!user) {
        failedLoginStatics.NOT_FOUND++;
        return callback('Incorrect email and/or password', user);
    }

    // check if the account is currentlt locked
    if (user.isLocked) {
        // just increment the login attempts  if the account is already locked
        return user.incorrectLoginAttempts((error) => {
            if (error) {
                return callback(error);
            }
            return callback('User account is locked!', null);
        });
    }

    // test for matching passowrd
    user.comparePassword(user, password, (error, isMatch) => {
        
        if (error) {
            return callback(error);
        }
        
        // check if the password was a matching
        if (isMatch) {
            // if there is no lock or maxed failed attempts, let user in
            if (user.loginAttempts < MAX_LOGIN_ATTEMPTS && !user.lockUntil) {
                return callback(null, user);
            }

            // reset attempts and lock info
            let updates = {
                $set: { loginAttempts: 0, lastLogin: Date.now(), numberLogins: user.numberLogins + 1 },
                $unset: { lockUntil: 1 }
            };

            return user.update(updates, (error) => {
            	if (error) {
                    return callback(error);
                }

                return callback(null, user);
            });
        }

        // password is incorrect 
        user.incorrectLoginAttempts((error) => {
            if (error) {
                return callback(error);
            }

            return callback('Incorrect email and/or password', null);
        });
    });
};

module.exports = mongoose.model('User', UserSchema);
