'use strict';

const mongoose = require('mongoose');

const dbUrl = 'mongodb://127.0.0.1:27017/cs602db';
const connection = mongoose.createConnection(dbUrl);

const EmployeeDb = require('./employeesDb.js');
const Employee = EmployeeDb.getModel(connection);

connection.on("open", () => {
	const starterData = [
        { firstName: 'John',     lastName: 'Smith'  },
        { firstName: 'Jane',     lastName: 'Smith'  },
        { firstName: 'John',     lastName: 'Doe'    }
    ];


    starterData.forEach((entry, index) => {
        // create and save document objects
        let employee;

        employee = new Employee(entry); 

        if (index === starterData.length - 1) {
            employee.save((err) => {
                connection.close();
                if (err) throw err;
                console.log("Success!");
            });
        } else {
            employee.save();
        }
    });
});
