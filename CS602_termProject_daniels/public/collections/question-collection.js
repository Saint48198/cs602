// Collection Name: Questions
// Filename: question-collection.js

define([
	'jquery',
	'underscore',
	'backbone',
	'base'
], function ($, _, Backbone) {
	'use strict';

	var QuestionCollection = Backbone.Collection.extend({
		baseUrl: '/api/assessment/{{assessment_id}}/get_questions',

		url: '/api/assessment/{{assessment_id}}/get_questions',

		initialize: function () {},

		parse: function (resp) {
			return resp.question || [];
		}
	});

	return QuestionCollection;
});