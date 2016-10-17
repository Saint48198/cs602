// Filename: router.js
// loads the views
define([
	'jquery',
	'underscore',
	'backbone',
	'../views/sample/sample-view',
	'base'
], function ($, _, Backbone, SampleView, base) {
	"use strict";

	var displayView = function (View, viewName, config) {
		var callback = function (actions) {
			var application = document.getElementById('application');


			//if (this.session.get('logged_in')) {

			//}

			// check to see if view exists before creating it in order to prevent the events from being attached more then once
			if (this[viewName]) {
				this[viewName].close();
			}
			this[viewName] = new View(this);
			this[viewName].render(actions);
		};

		return callback;
	};

	var AppRouter = Backbone.Router.extend({
		routes: {
			//'/login(?:queryString)': displayView(LoginView, 'login', { needsAuth: false }),
			'*actions': displayView(SampleView, 'sample', { needsAuth: true })
		}
	});

	var initialize = function () {
		var appRouter = new AppRouter();

		appRouter.history = [];
		appRouter.listenTo(appRouter, 'route', function (name, args) {
			console.log(name);
			appRouter.history.push({
				name : name,
				args : args,
				fragment : Backbone.history.fragment
			});
		});

		Backbone.history.start();
	};

	return {
		initialize: initialize
	};
});
