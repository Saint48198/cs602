// Collection Name: Modules
// Filename: module-collection.js

define([
	'jquery',
	'underscore',
	'backbone',
	'base'
], function ($, _, Backbone) {
	'use strict';

	var ModuleCollection = Backbone.Collection.extend({
		url: '/api/modules',

		initialize: function () {},

		parse: function (resp) {
			return resp.module || [];
		},

		deleteModule: function (courseId) {
			return $.ajax({
				url: '/api/module/' + courseId + '/delete',
				method: 'post'
			});
		}
	});

	return ModuleCollection;
});