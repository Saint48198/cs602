'use strict';

const DB = require('../dbConnection');
const Employee = DB.getModel();
const title = 'Edit Employee';

module.exports = function deleteEmployee(req, res, next) {
    let paramsData = req.params;
    let id = parseInt(paramsData.id);

    
};