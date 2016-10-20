// Page Section: Course | Assessments
// Filename: course-view.js

define([
	'jquery',
	'underscore',
	'backbone',
	'util',
	'../../../collections/assessment-collection',
	'../../../models/course-model',
	'../../../models/assessment-model',
	'base'

], function ($, _, Backbone, UTIL, AssessmentCollection, CourseModel, AssessmentModel) {
	'use strict';
	var CourseAssessmentsView = BaseView.fullExtend({

		el: $('main'),

		url: function () {
			return '/views/course/assessments/assessments-template.handlebars';
		},

		onInitialize: function () {
			this.assessmentCollection = new AssessmentCollection();
			this.courseModel = new CourseModel();
			this.assessmentModel = new AssessmentModel();
		},

		onRender: function (actions) {
			var courseId = actions.type;
			var query = UTIL.QueryString();
			var assessmentId = query.assessment_id;


			this.replaceUsingTemplate('template-courseAssessmentsBase', this.$el, { courseId: courseId }, { title: 'Course - ' + courseId + ' Assessments' });
			this.courseModel.url = this.courseModel.existingCourseUrl + courseId;

			if (assessmentId) {
				this.assessmentModel.url = this.assessmentModel.existingAssessmentUrl + assessmentId;
				Promise.all([this.courseModel.fetch(), this.assessmentModel.fetch()]).then(function (fullfill, reject) {
					if (fullfill.length) {
						this.displayContent({ courseId: courseId, assessment: this.assessmentModel.toJSON(), course: this.courseModel.toJSON() }, 'template-courseAssessment')

					} else {
						alert('error');
					}
				}.bind(this));
			} else {
				this.assessmentCollection.url = this.assessmentCollection.url.split('?')[0] + '?course_id=' + courseId;
				Promise.all([this.assessmentCollection.fetch(), this.courseModel.fetch()]).then(function (fullfill, reject) {
					if (fullfill.length) {
						this.displayContent({ courseId: courseId, assessment: this.assessmentCollection.toJSON(), course: this.courseModel.toJSON() }, 'template-courseAssessments')

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
	return CourseAssessmentsView;
});
