// Page Section: Login page
// Filename: login-view.js

define([
	'jquery',
	'underscore',
	'backbone',
	'../../models/login-model',
	'base'

], function ($, _, Backbone, LoginModel, base) {
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
					this.doRedirect('/webapp/');
				}

			}, this));
		},

		onRender: function () {
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

				formDataObject.user = formDataObject.user.trim();

				this.disabled = true;
				this.updateView({user: formDataObject.user, disabled: this.disabled});

				this.loginModel.save(formDataObject, {success: this.submitSuccess, error: this.submitError});
			}
		}
	});
	return LoginView;
});
