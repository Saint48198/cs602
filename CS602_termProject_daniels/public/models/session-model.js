// Model Name: Session
// Filename: session-model.js

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
		},

		SessionModel = Backbone.Model.fullExtend({
			url: '/api/session?referring_url=' + document.referrer,

			parse: function (resp, options) {
				return resp;
			},

			fetch: function (options) {
				options = options ? _.clone(options) : {};
				if (options.parse === void 0) {
					options.parse = true;
				}

				options.url = this.url
					+ (UTIL.QueryString().ip ? '&ip=' + UTIL.QueryString().ip : '')
					+ (UTIL.QueryString().accountid ? '&accountid=' + UTIL.QueryString().accountid : '')
					+ ((window.location.toString().indexOf('/embedded/') > -1) ? '&token=' + window.location.toString().substring(window.location.toString().indexOf('/embedded/') + '/embedded/'.length).split('?')[0] : '');

				var model = this,
					success = options.success;

				options.success = function (resp) {
					if (!model.set(model.parse(resp, options), options)) {
						return false;
					}
					if (success) {
						success(model, resp, options);
					}
					model.trigger('sync', model, resp, options);
				};
				wrapError(this, options);
				return this.sync('read', this, options);
			},

			checkSession: function (options) {
				options.error = function (xhr, status, error) {
				};

				options.url = options.url ? options.url : '/api/session?_norenew=true';

				_.extend(options, {
					url: options.url
				});

				return Backbone.Model.prototype.fetch.call(this, options);
			}
		});
	return SessionModel;
});
