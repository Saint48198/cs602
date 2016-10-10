'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const CourseSchema = new Schema({
	name: { type: String, required: true },
	number: { type: String, required: true, index: { unique: true } },
	assessments: [],
	assignments: []
});

module.exports = mongoose.model('Course', CourseSchema);