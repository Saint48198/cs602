// Model Name: Module
// Filename: module-model.js

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

	var ModuleModel = Backbone.Model.fullExtend({
		newModuleUrl: '/api/module',
		existingModuleUrl: '/api/module/',

		url: '/api/module/',

		parse: function (resp, options) {
			return resp.module || {};
		}
	});
	return ModuleModel;
});