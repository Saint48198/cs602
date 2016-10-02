'use strict';

const mongoose = require('mongoose');
const dbUrl = 'mongodb://127.0.0.1:27017/cs602db';
const Schema = mongoose.Schema;
const userSchema = new Schema({
	firstName: String,
	lastName: String,
    email: String,
    password: String
});

let connection = null;
let model = null;

// custom schema method


module.exports = {
    getModel: function getModel() {
        if (connection === null) {
            console.log('Creating connection and model...');
            connection =  mongoose.createConnection(dbUrl);
            model = connection.model("UserModel", userSchema);
        }
        return model;
    }
}