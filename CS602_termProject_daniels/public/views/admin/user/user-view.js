// Page Section: Admin | User
// Filename: module-view.js
// Used for both adding and editing users

define([
	'jquery',
	'underscore',
	'backbone',
	'util',
	'../../../models/user-model',
	'base'

], function ($, _, Backbone, UTIL, UserModel) {
	'use strict';
	var AdminUserView = BaseView.fullExtend({

		el: $('main'),

		url: function () {
			return '/views/admin/user/user-template.handlebars';
		},

		events: {
			'submit #form-AdminUser': 'handleUserForm'
		},

		onInitialize: function () {
			this.userModel = new UserModel();
		},

		onRender: function () {
			var query = UTIL.QueryString();
			var userId = query.user_id;
			var title = userId ? 'Edit User' : 'Add User';
			var config = { courseId: query.course_id, title: title  };

			// no course id no access to edit course page, push the user to the add course page
			if (!userId && window.location.pathname.indexOf('admin/edit_user') !== -1) {
				UTIL.navTo('/admin/add_course');
				return;
			}

			this.formDisabled = false;

			this.replaceUsingTemplate('template-adminUser', this.$el, config, {title: title });

			if (userId) {
				this.userModel.url = this.userModel.existingUserUrl + userId;
				this.userModel.fetch({
					success: this.handleSuccessfulRequest.bind(this),
					error: this.handleFailedRequest.bind(this)
				});
			} else {
				this.replaceUsingTemplate('template-adminUserForm', $('.container-form', this.$el), { roles: this.getRoles(), title: title, formDisabled: this.formDisabled });
			}
		},
		handleSuccessfulRequest: function (model, resp) {
			var data = model.toJSON();
			var query = UTIL.QueryString();
			var userId = query.user_id;
			var title = userId ? 'Edit User' : 'Add User';

			this.formDisabled = false;

			data.roles = this.getRoles(data.roles);
			data.title = title;
			data.formDisabled = this.formDisabled;



			if (resp.error) {
				this.handleFailedRequest(resp, resp.error);
				return;
			}

			this.replaceUsingTemplate('template-adminUserForm', $('.container-form', this.$el), data);
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

		handleUserForm: function (e) {
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

				if (formDataObject._id) {
					newUser.url = newUser.existingUserUrl + formDataObject._id;
				} else {
					newUser.url = newUser.newUserUrl;
				}

				newUser.save(formDataObject, {
					success: function (model, resp) {
						if (resp.error) {
							var data = model.toJSON();
							data.error = resp.error.message || resp.error;

							this.displayUpdatedForm(data);
							return;
						}

						UTIL.navTo('/admin/users');
					}.bind(this),
					error: function (resp, error) {
						formDataObject.error = error.message || error;
						this.displayUpdatedForm(formDataObject);
					}.bind(this)
				});
			}
		},

		displayUpdatedForm: function (data) {
			var query = UTIL.QueryString();
			var userId = query.user_id;
			var title = userId ? 'Edit User' : 'Add User';

			this.formDisabled = false;

			data.title = title;
			data.roles = this.getRoles(data.roles.split(','));


			this.replaceUsingTemplate('template-adminUserForm', $('.container-form', this.$el), data);
		}
	});
	return AdminUserView;
});
