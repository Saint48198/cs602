// Page Section: User Register
// Filename: register-view.js
// Used for adding user when no auth

define([
	'jquery',
	'underscore',
	'backbone',
	'util',
	'../../../models/user-model',
	'base'

], function ($, _, Backbone, UTIL, UserModel) {
	'use strict';
	var RegisterView = BaseView.fullExtend({

		el: $('main'),

		url: function () {
			return '/views/register/register-template.handlebars';
		},

		events: {
			'submit #form-register': 'handleRegisterForm'
		},

		onInitialize: function () {
			this.userModel = new UserModel();
		},

		onRender: function () {
			var query = UTIL.QueryString();
			var title = 'Register';
			var config = { title: title  };

			this.formDisabled = false;

			this.replaceUsingTemplate('template-register', this.$el, config, {title: title });
			this.displayForm({ roles: this.getRoles(), title: title, formDisabled: this.formDisabled })
		},

		displayForm: function(data) {
			this.replaceUsingTemplate('template-registerForm', $('.container-form', this.$el), data);
		},

		handleSuccessfulRequest: function (model, resp) {
			var data = model.toJSON();
			var title = 'Register';

			this.formDisabled = false;

			data.roles = this.getRoles(data.roles);
			data.title = title;
			data.formDisabled = this.formDisabled;

			if (resp.error) {
				this.handleFailedRequest(resp, resp.error);
				return;
			}

			this.displayForm(data);
		},

		handleFailedRequest: function (requestObject, error, errorThrow) {
			this.replaceUsingTemplate('template-serviceError', $('.container-form', this.$el), { error: error });
		},

		getRoles: function (userRoles) {
			var roles = [{ value: 'user', label: 'Student'}, { value: 'admin', label: 'Teacher' }];

			roles.forEach(function (role) {
				role.selected = false;

				if (userRoles) {
					for (var i = 0, total = userRoles.length; i < total; i++) {
						if (role.value === userRoles[i]) {
							role.selected = true;
							break;
						}
					}
				}
			});

			return roles;
		},

		handleRegisterForm: function (e) {
			e.preventDefault();

			var formData = $(e.currentTarget).serializeArray();
			var formDataObject = {};
			if (this.formDisabled === false) {
				this.formDisabled = true;

				formData.forEach(function(input) {

					if (!formDataObject.roles && input.name === 'roles') {
						formDataObject[input.name] = input.value;
					} else if (formDataObject.roles && input.name === 'roles')  {
						formDataObject[input.name] = formDataObject[input.name] + ',' + input.value;
					} else {
						formDataObject[input.name] = input.value;
					}
				});

				var newUser = new UserModel();
				newUser.url = newUser.newUserUrl;

				if (formDataObject.password !== formDataObject.cpassword) {
					formDataObject.error = 'Password does not match confirm password.';
					this.displayUpdatedForm(formDataObject);
				} else {
					newUser.save(formDataObject, {
						success: function (model, resp) {
							if (resp.error) {
								var data = model.toJSON();
								data.error = resp.error.message || resp.error;

								this.displayUpdatedForm(data);
								return;
							}

							UTIL.navTo('/login');
						}.bind(this),
						error: function (resp, error) {
							formDataObject.error = error.message || error;
							this.displayUpdatedForm(formDataObject);
						}.bind(this)
					});
				}
			}
		},

		displayUpdatedForm: function (data) {
			var title = 'Register';

			this.formDisabled = false;

			data.title = title;
			data.roles = this.getRoles(data.roles.split(','));


			this.displayForm(data);
		}
	});
	return RegisterView;
});
