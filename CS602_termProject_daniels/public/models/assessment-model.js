// Model Name: Assessment
// Filename: assessment-model.js

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

	var AssessmentModel = Backbone.Model.fullExtend({
		newAssessmentUrl: '/api/assessment',
		existingAssessmentUrl: '/api/assessment/',

		url: '/api/assessment/',

		parse: function (resp, options) {
			return resp.assessment || {};
		}
	});
	return AssessmentModel;
});