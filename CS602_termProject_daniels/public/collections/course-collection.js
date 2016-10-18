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
		}
	});

	return CourseCollection;
});
