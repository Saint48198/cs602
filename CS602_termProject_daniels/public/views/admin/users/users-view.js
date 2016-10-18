// Page Section: Addmin | Users
// Filename: users-view.js

define([
	'jquery',
	'underscore',
	'backbone',
	'util',
	'../../../collections/user-collection',
	'base'

], function ($, _, Backbone, UTIL, UserCollection) {
	'use strict';
	var AdminUsersView = BaseView.fullExtend({

		el: $('main'),

		url: function () {
			return '/views/admin/users/users-template.handlebars';
		},

		onInitialize: function () {
			this.userCollection = new UserCollection();
		},

		onRender: function () {
			var query = UTIL.QueryString();
			var config = {
				studentsActive: false,
				teachersActive: false,
				allActive: true
			};
			var userApi = this.userCollection.url.split('?')[0];

			this.title = 'Users';


			if (query.role) {
				config.allActive = false;
				if (query.role === 'user') {
					this.title =  this.title + ' - Students';
					config.studentsActive = true;
					userApi += '?role=user';
				} else if (query.role === 'admin') {
					this.title =  this.title + ' - Teachers';
					config.teachersActive = true;
					userApi += '?role=admin';
				}
			}

			if (query.course_id) {
				userApi = (query.role) ? userApi + '&' : userApi + '?'; // determine if there is already a parameter to the api url
				userApi = userApi + 'course_id=' + query.course_id;
			}

			config.title = this.title;

			
			this.replaceUsingTemplate('template-adminUsers', this.$el, config, { title: 'Admin ~ ' + this.title });

			this.userCollection.url = userApi
			this.userCollection.fetch({
				success: this.handleSuccessfulRequest.bind(this),
				error: this.handleFailedRequest.bind(this)
			});
		},

		handleSuccessfulRequest: function (collection, resp) {
			if (resp.error) {
				this.handleFailedRequest(resp, resp.error);
				return;
			}

			this.replaceUsingTemplate('template-adminUsersContent', $('.container-tableData', this.$el), { user: collection.toJSON() });
		},

		handleFailedRequest: function (requestObject, error, errorThrow) {
			this.replaceUsingTemplate('template-serviceError', $('.container-tableData', this.$el), { error: error });
		}
	});
	return AdminUsersView;
});
