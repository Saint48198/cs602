// Page Section: Admin | Course
// Filename: course-view.js
// Used for both adding and editing courses

define([
	'jquery',
	'underscore',
	'backbone',
	'util',
	'../../../models/course-model',
	'base'

], function ($, _, Backbone, UTIL, CourseModel) {
	'use strict';
	var AdminCourseView = BaseView.fullExtend({

		el: $('main'),

		url: function () {
			return '/views/admin/course/course-template.handlebars';
		},

		onInitialize: function () {
			this.courseModel = new CourseModel();
		},

		onRender: function () {
			var query = UTIL.QueryString();
			var courseId = query.course_id;
			var title = courseId ? 'Add Course' : 'Edit Course';

			// no course id no access to edit course page, push the user to the add course page
			if (!courseId && window.location.pathname.indexOf('/admin-edit_course') !== -1) {
				UTIL.navTo('/admin-add_course');
				return;
			}

			this.replaceUsingTemplate('template-adminCourse', this.$el, { courseId: courseId, title: title }, { title: title });

			if (courseId) {
				this.courseModel.url = this.courseModel.url + courseId;
				this.courseModel.fetch({
					success: this.handleSuccessfulRequest.bind(this),
					error: this.handleFailedRequest.bind(this)
				});
			} else {
				this.replaceUsingTemplate('template-adminCourseForm', $('.container-form', this.$el), {});
			}
		},
		handleSuccessfulRequest: function (model, resp) {
			var data = model.toJSON();

			if (resp.error) {
				this.handleFailedRequest(resp, resp.error);
				return;
			}

			this.replaceUsingTemplate('template-adminCourseForm', $('.container-form', this.$el), data);
		},

		handleFailedRequest: function (requestObject, error, errorThrow) {
			this.replaceUsingTemplate('template-serviceError', $('.container-form', this.$el), { error: error });
		}
	});
	return AdminCourseView;
});
