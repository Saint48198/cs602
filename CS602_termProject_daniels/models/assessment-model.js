'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const QuestionSchema = mongoose.model('Question').schema;
const AssessmentSchema = new Schema({
	name: { type: String, required: true },
	questions: [QuestionSchema],
	points: { type: Number, default: 100, required: true },
	due: { type: Date, default: Date.now(), required: true },
	instructions: { type: String }
});

module.exports = mongoose.model('Assessment', AssessmentSchema);