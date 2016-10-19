// Page Section: Admin | User Course
// Filename: userCourse-view.js
// for adding existing users to courses

define([
	'jquery',
	'underscore',
	'backbone',
	'util',
	'../../../collections/user-collection',
	'../../../collections/course-collection',
	'base'

], function ($, _, Backbone, UTIL, UserCollection, CourseCollection) {
	'use strict';
	var AdminUserCourseView = BaseView.fullExtend({

		el: $('main'),

		url: function () {
			return '/views/admin/user-course/userCourse-template.handlebars';
		},

		events: {
			'submit #form-addUserToCourse': 'handleAddUserToCourseRequest'
		},

		onInitialize: function () {
			this.userCollection = new UserCollection();
			this.courseCollection = new CourseCollection();
		},

		onRender: function () {
			var query = UTIL.QueryString();
			this.roleLabel = 'User';
			this.formDisabled = false;

			if (query.role) {
				if (query.role === 'user') {
					this.roleLabel = 'Student';
				} else if (query.role === 'admin') {
					this.roleLabel = 'Teacher';
				}

				this.userCollection.url = this.userCollection.url.split('?')[0] + '?role=' + query.role;
			}

			this.replaceUsingTemplate('template-adminUserCourse', this.$el, { roleLabel: this.roleLabel, courseId: query.course_id }, { title: 'Admin ~ Add User to Course' });


			Promise.all([this.courseCollection.fetch(), this.userCollection.fetch()]).then(function (fulfill, reject) {

				if (fulfill.length === 2) {

					this.courseCollection.each(function (course) {
						if (course.get('number') === query.course_id) {
							course.set('selected', true);
						} else {
							course.set('selected', false);
						}
					});

					var courses = this.courseCollection.toJSON();
					var users = this.userCollection.toJSON();
					this.displayForm({ user: users, course: courses });

				} else {
					this.replaceUsingTemplate('template-adminUserCourseForm', $('.container-form', this.$el), { error: 'There was a problem loading the content for this page. Please try again later.'});
				}

			}.bind(this));


		},

		displayForm: function (data) {
			data.roleLabel = this.roleLabel;
			data.disabled = this.formDisabled;

			this.replaceUsingTemplate('template-adminUserCourseForm', $('.container-form', this.$el), data);
		},

		handleAddUserToCourseRequest: function (e) {
			e.preventDefault();

			var query = UTIL.QueryString();
			var type = (query.role && query.role === 'user') ? 'add_student' : 'add_teacher';

			this.courseCollection.addUserToCourse(e.target.course_id.value, e.target.user_id.value, type).done(function (resp) {
				if (resp.error) {
					this.displayForm({ error: resp.error, course: this.courseCollection.toJSON(), user: this.userCollection.toJSON() });
					return;
				}

				UTIL.navTo('/admin-users?role=' + query.role + '&course_id=' + query.course_id);
			}.bind(this));

		}
	});
	return AdminUserCourseView;
});
