// Collection Name: Courses
// Filename: courses-collection.js

define([
	'jquery',
	'underscore',
	'backbone',
	'base'
], function ($, _, Backbone) {
	'use strict';

	var CourseCollection = Backbone.Collection.extend({
		url: '/api/courses',

		initialize: function () {},

		parse: function (resp) {
			return resp.results || [];
		},

		addUserToCourse: function (courseId, userId, type) {
			return $.ajax({
				method: 'post',
				url: '/api/course/' + courseId + '/' + type,
				data: '_id=' + userId
			});
		}
	});

	return CourseCollection;
});
