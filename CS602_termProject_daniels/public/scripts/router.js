define([
	'jquery',
	'underscore',
	'backbone',
	'./views/sample/sample-view',
	'base'
], function ($, _, Backbone, SampleView, base) {
	"use strict";

	var displayView = function (View, viewName, config) {
		var callback = function (actions) {
			var application = document.getElementById('application');


			if (this.session.get('logged_in')) {

			}

			// check to see if view exists before creating it in order to prevent the events from being attached more then once
			if (this[viewName]) {
				this[viewName].close();
			}
			this[viewName] = new View(this);
			this[viewName].render(actions);

		};

		var AppRouter = Backbone.Router.extend({
			routes: {
				'/webapp/login(?:queryString)': viewFunc(LoginView, 'login', {needsAuth: false}),
				'/webapp/*actions(?:queryString)': viewFunc(null, 'default', {needsAuth: true})
			}
		});

		return callback;
	}
});
