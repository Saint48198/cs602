// Collection Name: Assignments
// Filename: assignment-collection.js

define([
	'jquery',
	'underscore',
	'backbone',
	'base'
], function ($, _, Backbone) {
	'use strict';

	var AssignmentCollection = Backbone.Collection.extend({
		url: '/api/assignments',

		initialize: function () {},

		parse: function (resp) {
			return resp.assignment || [];
		}
	});

	return AssignmentCollection;
});