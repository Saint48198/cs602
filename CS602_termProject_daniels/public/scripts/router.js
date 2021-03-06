// Filename: router.js
// loads the views
define([
	'jquery',
	'underscore',
	'backbone',
	'util',
	'../views/header/header-view',
	'../views/footer/footer-view',
	'../views/landing/landing-view',
	/* admin views */
	'../views/admin/courses/courses-view',
	'../views/admin/course/course-view',
	'../views/admin/modules/modules-view',
	'../views/admin/assignments/assignments-view',
	'../views/admin/assessments/assessments-view',
	'../views/admin/module/module-view',
	'../views/admin/users/users-view',
	'../views/admin/user/user-view',
	'../views/admin/assignment/assignment-view',
	'../views/admin/assessment/assessment-view',
	'../views/admin/questions/questions-view',
	'../views/admin/question/question-view',
	'../views/admin/user-course/userCourse-view',

	/* course views */
	'../views/course/home/home-view',
	'../views/course/assessments/assessments-view',
	'../views/course/assignments/assignments-view',
	'../views/course/modules/modules-view',
	'../views/grades/grades-view',
	'../views/messages/messages-view',
	'../views/calendar/calendar-view',

	/* user auth views */
	'../views/register/register-view',
	'../views/reset-password/resetPassword-view',
	'../views/forgot-password/forgotPassword-view',
	'../views/login/login-view',
	"../models/session-model",
	'base'
], function ($, _, Backbone, UTIL,
			 HeaderView,
			 FooterView,
			 LandingView,
			 AdminCoursesView,
			 AdminCourseView,
			 AdminModulesView,
			 AdminAssignmentsView,
			 AdminAssessmentsView,
			 AdminModuleView,
			 AdminUsersView,
			 AdminUserView,
			 AdminAssignmentView,
			 AdminAssessmentView,
			 AdminQuestionsView,
			 AdminQuestionView,
			 AdminUserCourseView,
			 CourseHomeView,
			 CourseAssessmentsView,
			 CourseAssignmentsView,
			 CourseModulesView,
			 GradesView,
			 MessagesView,
			 CalendarView,
			 RegisterView,
			 ResetPasswordView,
			 ForgotPasswordView,
			 LoginView,
			 SessionModel, base) {
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

			// if the page requires user to be admin, checks if they are and if not redirects user to home page
			if (config.needsToBeAdmin && this.sessionModel.get('roles') && this.sessionModel.get('roles').indexOf('admin') === -1) {
				UTIL.navTo("/");
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

	var handleBodyClickEvents = function (e) {
		var target = e.target;

		if (target.tagName.toLowerCase() !== "a") {
			target = target.parentNode;
			if (target.tagName.toLowerCase() !== "a") {
				target = target.parentNode;
			}
		}

		if (target && target.hasAttribute("data-bb-link") === true) {
			if (target.href) {
				UTIL.nav(target, e);
			}
		} else if (target && target.hasAttribute("data-nw-link") === true) {
			if (target.href) {
				UTIL.openNewWindow(e);
			}
		}

		if (this.sessionModel.get("logged_in")) {
			this.sessionModel.trigger("resetSessionTimer");
			this.sessionModel.trigger("resetSessionMessage");
		}
	};

	var AppRouter = Backbone.Router.extend({
		routes: {
			'login(?:queryString)': 			 		displayView(LoginView, 				'login', 			  { needsAuth: false }),
			'forgot_password(?:queryString)': 	 		displayView(ForgotPasswordView, 	'forgotPassword', 	  { needsAuth: false }),
			'reset(?:token)': 	 						displayView(ResetPasswordView, 	    'resetPassword', 	  { needsAuth: false }),
			'register': 	 						    displayView(RegisterView, 	        'register', 	      { needsAuth: false }),

			// admin views
			'admin/add_course(?:queryString)':  		displayView(AdminCourseView, 		'adminAddCourse', 	  { needsAuth: true, needsToBeAdmin: true }),
			'admin/edit_course(?:queryString)': 		displayView(AdminCourseView, 		'adminEditCourse', 	  { needsAuth: true, needsToBeAdmin: true }),
			'admin/modules': 					 		displayView(AdminModulesView, 		'adminModules', 	  { needsAuth: true, needsToBeAdmin: true }),
			'admin/assignments': 				 		displayView(AdminAssignmentsView,   'adminAssignments',   { needsAuth: true, needsToBeAdmin: true }),
			'admin/add_assignment(?:queryString)': 	    displayView(AdminAssignmentView,    'adminAddAssignment', { needsAuth: true, needsToBeAdmin: true }),
			'admin/edit_assignment(?:queryString)':	    displayView(AdminAssignmentView,    'adminEditAssignment',{ needsAuth: true, needsToBeAdmin: true }),
			'admin/assessments': 				 		displayView(AdminAssessmentsView,   'adminAssessments',   { needsAuth: true, needsToBeAdmin: true }),
			'admin/add_module(?:queryString)':  		displayView(AdminModuleView, 		'adminAddModule', 	  { needsAuth: true, needsToBeAdmin: true }),
			'admin/edit_module(?:queryString)': 		displayView(AdminModuleView, 		'adminEditModule', 	  { needsAuth: true, needsToBeAdmin: true }),
			'admin/users(?:queryString)': 		 		displayView(AdminUsersView, 		'adminUsers', 		  { needsAuth: true, needsToBeAdmin: true }),
			'admin/add_user(?:queryString)':    		displayView(AdminUserView, 			'adminAddUser', 	  { needsAuth: true, needsToBeAdmin: true }),
			'admin/edit_user(?:queryString)':   		displayView(AdminUserView, 			'adminEditUser', 	  { needsAuth: true, needsToBeAdmin: true }),
			'admin/edit_assessment(?:queryString)':	    displayView(AdminAssessmentView,    'adminEditAssessment',{ needsAuth: true, needsToBeAdmin: true }),
			'admin/add_assessment(?:queryString)': 	    displayView(AdminAssessmentView,    'adminAddAssessment', { needsAuth: true, needsToBeAdmin: true }),
			'admin/questions(?:queryString)':   		displayView(AdminQuestionsView,     'adminQuestions', 	  { needsAuth: true, needsToBeAdmin: true }),
			'admin/edit_question(?:queryString)':  	    displayView(AdminQuestionView,      'adminEditQuestion',  { needsAuth: true, needsToBeAdmin: true }),
			'admin/add_question(?:queryString)':   	    displayView(AdminQuestionView,      'adminAddQuestion',   { needsAuth: true, needsToBeAdmin: true }),
			'admin/add_user_to_course(?:queryString)':  displayView(AdminUserCourseView,    'adminUserCourse',    { needsAuth: true, needsToBeAdmin: true }),
			'admin': 							 		displayView(AdminCoursesView, 		'adminCourses', 	  { needsAuth: true, needsToBeAdmin: true }),

			'course/:courseId/assessments':				displayView(CourseAssessmentsView,	'courseAssessments',  { needsAuth: true }),
			'course/:courseId/assignments':				displayView(CourseAssignmentsView,	'courseAssignments',  { needsAuth: true }),
			'course/:courseId/modules':				    displayView(CourseModulesView,	    'courseModules',      { needsAuth: true }),
			'course/:courseId':							displayView(CourseHomeView,			'courseHome',		  { needsAuth: true }),

			'grades(/:courseId)':					    displayView(GradesView,				'grades',			  { needsAuth: true }),
			'messages(/:courseId)':						displayView(MessagesView,			'messages',			  { needsAuth: true }),
			'calendar(/:courseId)(?:queryString)':		displayView(CalendarView,		    'calendar',			  { needsAuth: true }),

			// default view
			'*actions': 						 		displayView(LandingView, 			'default', 			  { needsAuth: true })
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


		router.session = sessionData;

		var footerView = new FooterView(router);
		var headerView =  new HeaderView(router);

		headerView.render();


		// attach click to the body to handle clicking on links within the whole app
		document.getElementsByTagName("body")[0].addEventListener("click", handleBodyClickEvents.bind(router));

		Backbone.history.start({ pushState: true });
	};

	var initialize = function (options) {
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
				startApp(appRouter, sessionResp);
			},
			error: function (model, sessionResp) {
				startApp(appRouter, sessionResp);
			}
		});

		// sete events for the delete modal message
		$('#theModal').on('show.bs.modal', function (event) {
			var modal = $(this)
			modal.find('.modal-title').text('Delete Item')
			modal.find('.modal-body').val('Are you sure becuase this can not be undone?')
		});

		$('#modal-delete-btn').click(function (e) {
			appRouter.trigger('doDelete');
		}.bind(this));
	};

	return {
		initialize: initialize
	};
});
