'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const AssessmentSchema = mongoose.model('Assessment').schema;
const AssignmentSchema =  mongoose.model('Assignment').schema;
const ModuleSchema = mongoose.model('Module').schema;
const UserSchema = mongoose.model('User').schema;


const CourseSchema = new Schema({
	name: { type: String, required: true },
	number: { type: String, required: true, index: { unique: true } },
	assessments: [AssessmentSchema],
	assignments: [AssignmentSchema],
	modules: [ModuleSchema],
	students: [UserSchema],
	teachers: [UserSchema]
});

module.exports = mongoose.model('Course', CourseSchema);