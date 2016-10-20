// Page Section: Course | Assessments
// Filename: course-view.js

define([
	'jquery',
	'underscore',
	'backbone',
	'util',
	'../../../collections/assessment-collection',
	'../../../models/course-model',
	'base'

], function ($, _, Backbone, UTIL, AssessmentCollection, CourseModel) {
	'use strict';
	var CourseAssessmentsView = BaseView.fullExtend({

		el: $('main'),

		url: function () {
			return '/views/course/assessments/assessments-template.handlebars';
		},

		onInitialize: function () {
			this.assessmentCollection = new AssessmentCollection();
			this.courseModel = new CourseModel();
		},

		onRender: function (actions) {
			var courseId = actions.type;

			this.assessmentCollection.url = this.assessmentCollection.url.split('?')[0] + '?course_id=' + courseId;
			this.courseModel.url = this.courseModel.existingCourseUrl + courseId;

			Promise.all([this.assessmentCollection.fetch(), this.courseModel.fetch()]).then(function (fullfill, reject) {
				if (fullfill.length) {
					this.replaceUsingTemplate('template-courseAssessments', this.$el, { courseId: courseId, assessment: this.assessmentCollection.toJSON(), course: this.courseModel.toJSON() }, { title: 'Course - ' + courseId + ' Assessments' });
				} else {
					alert('error');
				}
			}.bind(this));
		}
	});
	return CourseAssessmentsView;
});
