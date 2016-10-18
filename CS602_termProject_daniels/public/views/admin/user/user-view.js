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

		onInitialize: function () {
			this.userModel = new UserModel();
		},

		onRender: function () {
			var query = UTIL.QueryString();
			var userId = query.user_id;
			var title = userId ? 'Edit User' : 'Add User';
			var config = { courseId: query.course_id, title: title  };

			// no course id no access to edit course page, push the user to the add course page
			if (!userId && window.location.pathname.indexOf('/admin-edit_user') !== -1) {
				UTIL.navTo('/admin-add_course');
				return;
			}

			this.replaceUsingTemplate('template-adminUser', this.$el, config, {title: title });

			if (userId) {
				this.userModel.url = this.userModel.url + userId;
				this.userModel.fetch({
					success: this.handleSuccessfulRequest.bind(this),
					error: this.handleFailedRequest.bind(this)
				});
			} else {
				this.replaceUsingTemplate('template-adminUserForm', $('.container-form', this.$el), { roles: this.getRoles(), title: title });
			}
		},
		handleSuccessfulRequest: function (model, resp) {
			var data = model.toJSON();
			var query = UTIL.QueryString();
			var userId = query.user_id;
			var title = userId ? 'Edit User' : 'Add User';

			data.roles = this.getRoles(data.roles);
			data.title = title;

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
		}
	});
	return AdminUserView;
});
