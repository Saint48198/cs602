'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const AssessmentSchema = new Schema({
	name: { type: String, required: true },
	questions: [],
	attempts: { type: Number, default: 0 },
	points: { type: Number, default: 100, required: true },
	grade: { type: Number, default: 0 },
	due: { type: Date, default: Date.now(), required: true },
	submitted: { type: Date, default: null },
	instructions: { type: String }
});

module.exports = mongoose.model('Assessment', AssessmentSchema);