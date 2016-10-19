// Model Name: Assignment
// Filename: assignment-model.js

define([
	'jquery',
	'underscore',
	'backbone',
	'util',
	'base'
], function ($, _, Backbone, UTIL) {
	'use strict';
	var wrapError = function (model, options) {
		var error = options.error;
		options.error = function (resp) {
			if (error) error(model, resp, options);
			model.trigger('error', model, resp, options);
		};
	};

	var AssignmentModel = Backbone.Model.fullExtend({
		newAssignmentUrl: '/api/assignment',
		existingAssignmentUrl: '/api/assignment/',

		url: '/api/assignment/',

		parse: function (resp, options) {
			return resp.results && resp.results.length ? resp.results[0] : {};
		}
	});
	return AssignmentModel;
});