'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CourseSchema = new Schema({
	name: { type: String, required: true },
	number: { type: String, required: true, index: { unique: true } },
	assessments: [{_id: String, index: { unique: true } }],
	assignments: [{_id: String, index: { unique: true } }],
	modules: [{_id: String, index: { unique: true } }],
	students: [{_id: String, index: { unique: true } }],
	teachers: [{_id: String, index: { unique: true } }]
});

module.exports = mongoose.model('Course', CourseSchema);