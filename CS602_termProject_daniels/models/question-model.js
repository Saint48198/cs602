'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AnswerSchema = new Schema({
	text: 	 { type: String, required: true },
	code: 	 { type: String, required: true },
	correct: { type: Boolean }
});

const QuestionSchema = new Schema({
	text: { type: String, required: true },
	options: [AnswerSchema]
});

module.exports = mongoose.model('Question', QuestionSchema);