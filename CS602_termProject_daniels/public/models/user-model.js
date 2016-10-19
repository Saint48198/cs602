// Model Name: User
// Filename: user-model.js

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

	var CourseModel = Backbone.Model.fullExtend({
		newUserUrl: '/api/user',
		existingUserUrl: '/api/user/',

		url: '/api/user/',

		parse: function (resp, options) {
			return resp.results && resp.results.length ? resp.results[0] : {};
		},

		resetPasswordRequest: function (email) {
			return $.ajax({
				method: 'post',
				url: '/api/forgot',
				data: 'email=' + encodeURIComponent(email)
			});
		},

		resetPassword: function (token, password) {
			return $.ajax({
				method: 'post',
				url: '/api/reset/' + token,
				data: 'password=' + encodeURIComponent(password)
			});
		}
	});
	return CourseModel;
});