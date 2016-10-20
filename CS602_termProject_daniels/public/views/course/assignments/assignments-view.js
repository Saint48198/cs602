// Page Section: Course | Home
// Filename: course-view.js

define([
	'jquery',
	'underscore',
	'backbone',
	'util',
	'../../../collections/assignment-collection',
	'../../../models/course-model',
	'../../../models/assignment-model',
	'base'

], function ($, _, Backbone, UTIL, AssignmentCollection, CourseModel, AssignmentModel) {
	'use strict';
	var CourseAssignmentsView = BaseView.fullExtend({

		el: $('main'),

		url: function () {
			return '/views/course/assignments/assignments-template.handlebars';
		},

		onInitialize: function () {
			this.assignmentCollection = new AssignmentCollection();
			this.courseModel = new CourseModel();
			this.assignmentModel = new AssignmentModel();
		},

		onRender: function (actions) {
			var courseId = actions.type;
			var query = UTIL.QueryString();
			var assignmentId = query.assignment_id;

			this.courseModel.url = this.courseModel.existingCourseUrl + courseId;
			this.replaceUsingTemplate('template-courseAssignmentsBase', this.$el, { courseId: courseId }, { title: 'Course - ' + courseId + 'Assignment' });



			if (assignmentId) {
				this.assignmentModel.url = this.assignmentModel.existingAssignmentUrl + assignmentId;
				Promise.all([this.assignmentModel.fetch(), this.courseModel.fetch()]).then(function (fullfill, reject) {
					if (fullfill.length) {
						this.displayContent({ courseId: courseId, assignment: this.assignmentModel.toJSON(), course: this.courseModel.toJSON() }, 'template-courseAssignment');
					} else {
						alert('error');
					}
				}.bind(this));
			} else {
				this.assignmentCollection.url = this.assignmentCollection.url.split('?')[0] + '?course_id=' + courseId;
				Promise.all([this.assignmentCollection.fetch(), this.courseModel.fetch()]).then(function (fullfill, reject) {
					if (fullfill.length) {
						this.displayContent({ courseId: courseId, assignment: this.assignmentCollection.toJSON(), course: this.courseModel.toJSON() }, 'template-courseAssignments');
					} else {
						alert('error');
					}
				}.bind(this));
			}


		},

		displayContent: function (data, templateId) {
			this.replaceUsingTemplate(templateId, $('#courseContent', this.$el), data);
		}
	});
	return CourseAssignmentsView;
});
