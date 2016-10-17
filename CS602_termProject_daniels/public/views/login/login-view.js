// Page Section: Login page
// Filename: login-view.js

define([
	'jquery',
	'underscore',
	'backbone',
	'util',
	'../../models/login-model',
	'base'

], function ($, _, Backbone, UTIL, LoginModel, base) {
	'use strict';
	var LoginView = BaseView.fullExtend({

		el: $('main'),

		url: function () {
			return '/views/login/login-template.handlebars';
		},
    	
		events: {
			'submit #form-login': 'handleLoginSubmit'
		},

		onInitialize: function () {
			this.loginModel = new LoginModel();
			this.disabled = false;

			this.on('successfulLogin', _.bind(function () {
				var q = UTIL.QueryString();

				if (typeof q.fwd != 'undefined') {
					this.doRedirect(decodeURIComponent(q.fwd));
				} else {
					this.doRedirect('/');
				}

			}, this));
		},

		onRender: function () {
			var session = this.router.session;
			var isLoggedIn = session ? session.logged_in : false;

			if (isLoggedIn) {
				this.doRedirect('/');
				return false;
			}
			
			this.updateView({});
		},

		updateView: function (data) {
			this.replaceUsingTemplate('template-login', this.$el, data, { title: 'Login' });
		},

		handleLoginSubmit: function (e) {
			e.preventDefault();

			if (this.disabled === false) {
				var formData = $(e.currentTarget).serializeArray(),
					formDataObject = {},
					total = formData.length;

				while (total) {
					total--;
					formDataObject[formData[total].name] = formData[total].value;
				}

				formDataObject.email = formDataObject.email.trim();

				this.disabled = true;
				this.updateView({ email: formDataObject.email, disabled: this.disabled });

				this.loginModel.save(formDataObject, { success: this.submitSuccess.bind(this), error: this.submitError.bind(this) });
			}
		},

		submitSuccess: function (resp) {
			if (resp.toJSON().success) {
				this.trigger('successfulLogin');
			} else {
				this.submitError(this.loginModel, resp.toJSON().error);
			}
		},

		submitError: function (model, error) {
			this.updateView({ error: error });
		},

		doRedirect: function (url) {
			window.location.replace(url);
		}
	});
	return LoginView;
});
