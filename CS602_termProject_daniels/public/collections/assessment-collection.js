// Collection Name: Assessments
// Filename: assessment-collection.js

define([
	'jquery',
	'underscore',
	'backbone',
	'base'
], function ($, _, Backbone) {
	'use strict';

	var AssessmentCollection = Backbone.Collection.extend({
		url: '/api/assessments',

		initialize: function () {},

		parse: function (resp) {
			return resp.assessment || [];
		},

		deleteAssessment: function (id) {
			return $.ajax({
				method: 'post',
				url: '/api/assessment/' + id + '/delete'
			});
		}
	});

	return AssessmentCollection;
});