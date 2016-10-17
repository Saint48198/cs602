// Filename: router.js
// loads the views
define([
	'jquery',
	'underscore',
	'backbone',
	'util',
	'../views/sample/sample-view',
	'../views/login/login-view',
	"../models/session-model",
	'base'
], function ($, _, Backbone, UTIL, SampleView, LoginView, SessionModel, base) {
	"use strict";

	var displayView = function (View, viewName, config) {
		var callback = function (actions) {
			var fwdVal = window.location.pathname + window.location.search;

			if (!this.sessionModel.get('logged_in') && config.needsAuth) {
				if (fwdVal === "/") {
					UTIL.navTo("/login");
				} else {
					UTIL.navTo("/login?fwd=" +  encodeURIComponent(fwdVal));
				}
				return false;
			}

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
			'/login(?:queryString)': displayView(LoginView, 'login', { needsAuth: false }),
			'*actions': displayView(SampleView, 'sample', { needsAuth: true })
		}
	});

	var sessionTimer = function (router, time) {
		router.totalTime = router.totalTime + time;

		var limit = 900;  // 900 seconds = 15 min
		var totalTimeInSec = router.totalTime / 1000;
		var timeLeft = limit - totalTimeInSec;
		var messageLimit = 150; // 150 seconds = ~2.5 min

		if (router.session && (timeLeft <= messageLimit)) {
			if (timeLeft <= 0) {
				router.sessionModel.trigger("resetApp");
				return false;
			}

			router.sessionModel.checkSession({
				success: function (view, resp) {
					timeLeft = resp.sessionExpirationInSeconds;
					if (timeLeft <= messageLimit) {
						router.sessionModel.trigger("showSessionMsg", timeLeft);
					}
				}
			});
		}

	};

	var startApp = function (router, sessionData) {
		Backbone.history.start();
	};

	var initialize = function () {
		var appRouter = new AppRouter();
		var interval = 60000; // 60 seconds timer

		appRouter.sessionModel = new SessionModel();
		this.sessionModel = appRouter.sessionModel;

		appRouter.history = [];
		appRouter.listenTo(appRouter, 'route', function (name, args) {
			appRouter.history.push({
				name : name,
				args : args,
				fragment : Backbone.history.fragment
			});
		});

		// set starting amount time used for the session
		appRouter.totalTime = 0;

		appRouter.sessionModel.checkSession({
			success: function (view, resp) {
				sessionTimer(appRouter, 0);
				appRouter.sessionInterval = setInterval(function () {
					sessionTimer(appRouter, interval);
				}, interval);  // every 60 seconds check the session
			}
		});

		appRouter.listenTo(appRouter.sessionModel, "resetSessionTimer", function () {
			window.clearInterval(appRouter.sessionInterval);
			appRouter.totalTime = 0;
			sessionTimer(appRouter, appRouter.totalTime);
			appRouter.sessionInterval = setInterval(function () {
				sessionTimer(appRouter, interval);
			}, interval); // every 60 seconds check the session

			appRouter.sessionModel.fetch({});
		});

		appRouter.sessionModel.fetch({
			success: function (model, sessionResp) {
				console.log(sessionResp);
				startApp(appRouter, sessionResp);
			},
			error: function (model, sessionResp) {
				console.log(sessionResp);
				startApp(appRouter, sessionResp);
			}
		});
	};

	return {
		initialize: initialize
	};
});
