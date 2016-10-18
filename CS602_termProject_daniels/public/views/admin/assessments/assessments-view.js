// Page Section: Addmin | Assessments
// Filename: assessments-view.js

define([
	'jquery',
	'underscore',
	'backbone',
	'util',
	'../../../collections/assessment-collection',
	'base'

], function ($, _, Backbone, UTIL, AssessmentCollection) {
	'use strict';
	var AdminAssessmentsView = BaseView.fullExtend({

		el: $('main'),

		url: function () {
			return '/views/admin/assessments/assessments-template.handlebars';
		},

		onInitialize: function () {
			this.assessmentCollection = new AssessmentCollection();
		},

		onRender: function () {
			var query = UTIL.QueryString();
			var courseId = query.course_id;

			// view requires course id, if there is none redirect to admin home page
			if (!courseId) {
				UTIL.navTo('/admin');
				return;
			}

			this.replaceUsingTemplate('template-adminAssessments', this.$el, { courseId: courseId }, { title: 'Assessments' });

			this.assessmentCollection.url = this.assessmentCollection.url.split('?')[0] + '?course_id=' + courseId;

			this.assessmentCollection.fetch({
				success: this.handleSuccessfulRequest.bind(this),
				error: this.handleFailedRequest.bind(this)
			});
		},
		handleSuccessfulRequest: function (collection, resp) {
			if (resp.error) {
				this.handleFailedRequest(resp, resp.error);
				return;
			}

			this.replaceUsingTemplate('template-adminAssessmentsContent', $('.container-tableData', this.$el), { assessment: collection.toJSON(), courseId: UTIL.QueryString().course_id });
		},

		handleFailedRequest: function (requestObject, error, errorThrow) {
			this.replaceUsingTemplate('template-serviceError', $('.container-tableData', this.$el), { error: error });
		}
	});
	return AdminAssessmentsView;
});
