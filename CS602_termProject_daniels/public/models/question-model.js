// Model Name: Question
// Filename: question-model.js

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

	var QuestionModel = Backbone.Model.fullExtend({
		newQuestionUrl: '/assessment/{{assessment_id}}/question',
		existingQuestionUrl: '/assessment/{{assessment_id}}/question/{{qeustion_id}}',

		url: '/assessment/{{assessment_id}}/add_question',

		parse: function (resp, options) {
			return resp.question || {};
		}
	});
	return QuestionModel;
});