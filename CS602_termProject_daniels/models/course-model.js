'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CourseSchema = new Schema({
	name: { type: String, required: true },
	number: { type: String, required: true, index: { unique: true } },
	assessments: [{_id: String }],
	assignments: [{_id: String }],
	modules: [{_id: String }],
	students: [{_id: String }],
	teachers: [{_id: String }]
});

module.exports = mongoose.model('Course', CourseSchema);