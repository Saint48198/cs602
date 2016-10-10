'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const AssessmentSchema = mongoose.model('Assessment').schema;
const AssignmentSchema =  mongoose.model('Assignment').schema;


const CourseSchema = new Schema({
	name: { type: String, required: true },
	number: { type: String, required: true, index: { unique: true } },
	assessments: [AssessmentSchema],
	assignments: [AssignmentSchema],
	modules: []
});

module.exports = mongoose.model('Course', CourseSchema);