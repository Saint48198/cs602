// Page Section: Course | Home
// Filename: course-view.js

define([
	'jquery',
	'underscore',
	'backbone',
	'util',
	'../../../collections/assignment-collection',
	'../../../models/course-model',
	'base'

], function ($, _, Backbone, UTIL, AssignmentCollection, CourseModel) {
	'use strict';
	var CourseAssignmentsView = BaseView.fullExtend({

		el: $('main'),

		url: function () {
			return '/views/course/assignments/assignments-template.handlebars';
		},

		onInitialize: function () {
			this.assignmentCollection = new AssignmentCollection();
			this.courseModel = new CourseModel();
		},

		onRender: function (actions) {
			var courseId = actions.type;

			this.assignmentCollection.url = this.assignmentCollection.url.split('?')[0] + '?course_id=' + courseId;
			this.courseModel.url = this.courseModel.existingCourseUrl + courseId;


			Promise.all([this.assignmentCollection.fetch(), this.courseModel.fetch()]).then(function (fullfill, reject) {
				if (fullfill.length) {
					this.replaceUsingTemplate('template-courseAssignments', this.$el, { courseId: courseId, assignment: this.assignmentCollection.toJSON(), course: this.courseModel.toJSON() }, { title: 'Course - ' + courseId + 'Assignment' });
				} else {

				}
			}.bind(this));
		}
	});
	return CourseAssignmentsView;
});
