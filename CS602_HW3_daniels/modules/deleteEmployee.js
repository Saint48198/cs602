'use strict';

const DB = require('../dbConnection');
const Employee = DB.getModel();

module.exports = function deleteEmployee(req, res, next) {
    let postData = req.body;
    let id = postData.id;

    Employee.findOneAndRemove({ _id: id }, (err) => {
        res.type('application/json');
        if (err) {
            console.log('Error: %s', err);
            res.send({ error: err });
        } else {
            res.send({ success: true });
        }
    });
};