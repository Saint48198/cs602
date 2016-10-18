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
			var title = 'Add Course';

			// no course id no access to edit course page, push the user to the add course page
			if (!courseId && window.location.pathname.indexOf('/admin-add_course')) {
				UTIL.navTo('/admin-add_course');
				return;
			} else {
				title = 'Edit Course';
				this.courseModel.url = this.courseModel.url + courseId;
			}



			this.replaceUsingTemplate('template-adminCourse', this.$el, { courseId: courseId, title: title }, { title: title });

			if (courseId) {
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
			console.log(data);
			this.replaceUsingTemplate('template-adminCourseForm', $('.container-form', this.$el), data);
		},

		handleFailedRequest: function (requestObject, error, errorThrow) {
			this.replaceUsingTemplate('template-serviceError', $('.container-form', this.$el), { error: error });
		}
	});
	return AdminCourseView;
});
