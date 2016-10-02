'use strict';

const mongoose = require('mongoose');
const dbUrl = 'mongodb://127.0.0.1:27017/cs602dblms';

let connection = null;

module.exports = {
    getModel: function getModel() {
        if (connection === null) {
            console.log('Creating connection and model...');
            connection =  mongoose.createConnection(dbUrl);
        }
    }
}