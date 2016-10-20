// Page Section: Course | Home
// Filename: course-view.js

define([
	'jquery',
	'underscore',
	'backbone',
	'util',
	'../../../collections/module-collection',
	'../../../models/course-model',
	'base'

], function ($, _, Backbone, UTIL, ModuleCollection, CourseModel) {
	'use strict';
	var CourseAssignmentsView = BaseView.fullExtend({

		el: $('main'),

		url: function () {
			return '/views/course/assignments/assignments-template.handlebars';
		},

		onInitialize: function () {
			this.moduleCollection = new ModuleCollection();
			this.courseModel = new CourseModel();
		},

		onRender: function (actions) {
			var courseId = actions.type;

			this.moduleCollection.url = this.moduleCollection.url.split('?')[0] + '?course_id=' + courseId;
			this.courseModel.url = this.courseModel.existingCourseUrl + courseId;


			Promise.all([this.moduleCollection.fetch(), this.courseModel.fetch()]).then(function (fullfill, reject) {
				if (fullfill.length) {
					this.replaceUsingTemplate('template-courseAssignments', this.$el, { courseId: courseId, module: this.moduleCollection.toJSON(), course: this.courseModel.toJSON() }, { title: 'Course - ' + courseId });
				} else {

				}
			}.bind(this));
		}
	});
	return CourseAssignmentsView;
});
