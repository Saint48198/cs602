// Page Section: Reset Password
// Filename: reset-password-view.js
// Used for resetting user password

define([
	'jquery',
	'underscore',
	'backbone',
	'../../models/user-model',
	'base'

], function ($, _, Backbone, UserModel) {
	'use strict';
	var ForgotPasswordView = BaseView.fullExtend({

		el: $('main'),

		url: function () {
			return '/views/forgot-password/forgotPassword-template.handlebars';
		},

		events: {
			'submit #form-forgotPassword': 'handleForgotPasswordForm'
		},

		onInitialize: function () {
			this.userModel = new UserModel();
		},

		onRender: function () {
			var homeLinkLabel = this.router.sessionModel.get('logged_in') ? 'Home' : 'Login';

			this.disabled = false;

			this.replaceUsingTemplate('template-forgotPassword', this.$el, { home: homeLinkLabel }, { title: 'Forgot Password' });
			this.displayForm({ disabled: this.disabled });
		},

		displayForm: function (data) {
			this.replaceUsingTemplate('template-forgotPasswordForm', $('.container-form', this.$el), data);
		},

		handleForgotPasswordForm: function (e) {
			e.preventDefault();
			var email = e.target.email.value;

			this.disabled = true;
			this.displayForm({ disabled: this.disabled, email: email });

			this.userModel.resetPasswordRequest(email).done(this.handleServiceRequest.bind(this));

		},

		handleServiceRequest: function (resp) {
			console.log(resp);
			this.disabled = false;

			if (resp.error) {
				this.displayForm({ disabled: this.disabled, error: resp.error });
			} else {
				this.replaceUsingTemplate('template-forgotPasswordSuccess', $('.container-form', this.$el), resp);
			}
		}
	});
	return ForgotPasswordView;
});
