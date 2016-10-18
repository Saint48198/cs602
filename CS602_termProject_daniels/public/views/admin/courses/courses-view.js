// Page Section: Admin | Courses
// Filename: course-view.js

define([
	'jquery',
	'underscore',
	'backbone',
	'../../../collections/course-collection',
	'base'

], function ($, _, Backbone, CourseCollection) {
	'use strict';
	var AdminCoursesView = BaseView.fullExtend({

		el: $('main'),

		url: function () {
			return '/views/admin/courses/courses-template.handlebars';
		},

		onInitialize: function () {
			this.courseCollection = new CourseCollection();
		},

		onRender: function () {
			this.replaceUsingTemplate('template-adminCourses', this.$el, {}, { title: 'Admin ~ Courses' });
			this.courseCollection.fetch({
				success: this.handleSuccessfulRequest.bind(this),
				error: this.handleFailedRequest.bind(this)
			});
		},

		handleSuccessfulRequest: function (collection, resp) {
			console.log(resp, collection);
			this.replaceUsingTemplate('template-adminCoursesContent', $('.container-tableData', this.$el), { course: collection.toJSON() });
		},

		handleFailedRequest: function (requestObject, error, errorThrow) {
			this.replaceUsingTemplate('template-serviceError', $('.container-tableData', this.$el), { error: error });
		}
	});
	return AdminCoursesView;
});
