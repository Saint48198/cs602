// Page Section: Reset Password
// Filename: resetPassword-view.js

define([
	'jquery',
	'underscore',
	'backbone',
	'util',
	'../../models/user-model',
	'base'

], function ($, _, Backbone, UTIL, UserModel) {
	'use strict';
	var ResetPasswordView = BaseView.fullExtend({

		el: $('main'),

		url: function () {
			return '/views/reset-password/resetPassword-template.handlebars';
		},

		events: {
			'submit #form-resetPassword': 'handleResetPasswordForm'
		},

		onInitialize: function () {
			this.userModel = new UserModel();
		},

		onRender: function () {
			this.disabled =  false;

			this.replaceUsingTemplate('template-resetPassword', this.$el, {}, { title: 'Reset Password' });
			this.displayForm({ disabled: this.disabled });
		},

		displayForm: function (data) {
			this.replaceUsingTemplate('template-resetPasswordForm', $('.container-form', this.$el), data);
		},

		handleResetPasswordForm: function (e) {
			e.preventDefault();

			var token = UTIL.QueryString()._t;
			var password =  e.target.password.value;
			var cpassword = e.target.confirmPassword.value;

			this.disabled = true;
			this.displayForm({ disabled: this.disabled });

			if (password === cpassword) {
				this.userModel.resetPassword(token, password).done(this.handleServiceRequest.bind(this));
			} else {
				this.handleServiceRequest({ error: 'Password and confirm password do not match!'});
			}
		},

		handleServiceRequest: function (resp) {
			this.disabled = false;

			if (resp.error) {
				this.displayForm({ disabled: this.disabled, error: resp.error });
			} else {
				this.replaceUsingTemplate('template-resetPasswordSuccess', $('.container-form', this.$el), resp);
			}
		}
	});
	return ResetPasswordView;
});
