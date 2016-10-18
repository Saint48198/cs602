'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const AssignmentSchema = new Schema({
	name: { type: String, required: true },
	file: [],
	points: { type: Number, default: 100, required: true },
	due: { type: Date, default: Date.now(), required: true },
	instructions: { type: String }
});

module.exports = mongoose.model('Assignment', AssignmentSchema);