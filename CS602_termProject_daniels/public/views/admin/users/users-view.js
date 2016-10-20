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

		events: {
			'click .btn-delete-user': 'setItemToDelete'
		},

		onInitialize: function () {
			this.userCollection = new UserCollection();

			this.router.on('doDelete', function () {
				this.userCollection.deleteUser(this.selectedItemId.id).done(function (resp) {
					if (resp.error) {
						alert('error');
						return;
					}

					$('#theModal').modal('hide');
					this.onRender({});

				}.bind(this));

			}.bind(this));
		},

		onRender: function () {
			var query = UTIL.QueryString();
			var config = {
				studentsActive: false,
				teachersActive: false,
				allActive: true,
				roleLabel: 'User',
				courseId: query.course_id
			};
			var userApi = this.userCollection.url.split('?')[0];

			this.title = 'Users';

			// storehouse for the the delete item data for the taking action when the modal closes
			this.selectedItemId = null;


			if (query.role) {
				config.allActive = false;
				if (query.role === 'user') {
					this.title =  this.title + ' - Students';
					config.studentsActive = true;
					config.roleLabel = 'Student';
					config.role = 'user';
					userApi += '?role=' + config.role;
				} else if (query.role === 'admin') {
					this.title =  this.title + ' - Teachers';
					config.teachersActive = true;
					config.roleLabel = 'Teacher';
					config.role = 'admin';
					userApi += '?role=' + config.role;
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

			this.replaceUsingTemplate('template-adminUsersContent', $('.container-tableData', this.$el), { user: collection.toJSON(), courseId: UTIL.QueryString().course_id });
		},

		handleFailedRequest: function (requestObject, error, errorThrow) {
			this.replaceUsingTemplate('template-serviceError', $('.container-tableData', this.$el), { error: error });
		},

		setItemToDelete: function (e) {
			this.selectedItemId = {
				id: $(e.target).attr('data-Id'),
				type: 'user'
			};
		}
	});
	return AdminUsersView;
});
