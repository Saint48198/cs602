'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AnswerSchema = new Schema({
	text: { type: String, required: true },
	code: { type: String, required: true }
});

const QuestionSchema = new Schema({
	text: { type: String, required: true },
	options: [AnswerSchema],
	answer: { type: String, required: true },
	points: { type: Number, required: true }
});

module.exports = mongoose.model('Question', QuestionSchema);