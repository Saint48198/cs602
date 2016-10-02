'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;
const userSchema = new Schema({
	firstName: { type: String, required: false },
	lastName: { type: String, required: false },
    email: { type: String, required: true, index: { unique: true } },
    password: { type: String, required: true },
    type: { type: String, required: true }
});

const SALT_WORK_FACTOR = 10;

// password hashing middleware
userSchema.pre('save', function (next) {
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
userSchema.methods.comparePassword = (password, callback) => {
    bcrypt.compare(password, this.password, (error, isMatch) => {
        if (error) {
            return callback.call(this, error);
        }

        callback.call(this, isMatch);
    });
};

module.exports = mongoose.model('UserModal', userSchema);
