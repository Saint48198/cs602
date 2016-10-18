'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ModuleSchema = new Schema({
	name: { type: String, required: true },
	desc: { type: String, required: true },
	content: [{ content: String }]
});

module.exports = mongoose.model('Module', ModuleSchema);