'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;
const CourseSchema =  mongoose.model('Course').schema;

const UserSchema = new Schema({
	firstName: { type: String, required: false },
	lastName: { type: String, required: false },
    email: { type: String, required: true, index: { unique: true } },
    password: { type: String, required: true },
    loginAttempts: { type: Number, required: true, default: 0 },
    type: { type: String, required: true },
    numberLogins: { type: Number, required: true, default: 0 },
    lastLogin: { type: Date, default: null },
    courses: [CourseSchema]
});

const SALT_WORK_FACTOR = 10;

// max of 5 attempts, resulting in a 2 hour lock
const MAX_LOGIN_ATTEMPTS = 5;
const LOCK_TIME = 2 * 60 * 60 * 1000;

UserSchema.virtual('isLocked').get(() => {
    // check for a future lockUntil timestamp
    return !!(this.lockUntil && this.lockUntil > Date.now());
});

// password hashing middleware
UserSchema.pre('save', function (next) {
    let user = this;

    // only hash the password if it has been modified or new
    if (!user.isModified('password')) {
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
UserSchema.methods.comparePassword = (user, password, callback) => {
    bcrypt.compare(password, user.password, (error, isMatch) => {
        if (error) {
            return callback.call(user, error, isMatch);
        }
        callback.call(user, error, isMatch);
    });
};

UserSchema.methods.incorrectLoginAttempts = (callback) => {
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
        return callback(null, null, failedLoginStatics.NOT_FOUND);
    }

    // check if the account is currentlt locked
    if (user.isLocked) {
        // just increment the login attempts  if the account is already locked
        return user.incorrectLoginAttempts((error) => {
            if (error) {
                return callback(error);
            }

            return callback(null, null, failedLoginStatics.MAX_ATTEMPTS);
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
                $set: { loginAttempts: 0 },
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

            return callback(null, null, failedLoginStatics.PASSWORD_INCORRECT);
        });
    });
};

module.exports = mongoose.model('User', UserSchema);
