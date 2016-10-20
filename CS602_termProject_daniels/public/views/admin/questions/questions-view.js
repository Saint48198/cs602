// Page Section: Addmin | Assessment Questions
// Filename: questions-view.js

define([
	'jquery',
	'underscore',
	'backbone',
	'util',
	'../../../collections/question-collection',
	'base'

], function ($, _, Backbone, UTIL, QuestionCollection) {
	'use strict';
	var AdminQuestionsView = BaseView.fullExtend({

		el: $('main'),

		url: function () {
			return '/views/admin/questions/questions-template.handlebars';
		},

		onInitialize: function () {
			this.questionCollection = new QuestionCollection();
		},

		onRender: function () {
			var query = UTIL.QueryString();
			var courseId = query.course_id;
			var assessmentId = query.assessment_id;

			// view requires course id and assessment id, if there is none redirect to admin home page
			if (!courseId && !assessmentId) {
				UTIL.navTo('/admin');
				return;
			}

			this.replaceUsingTemplate('template-adminQuestions', this.$el, { courseId: courseId, assessmentId: assessmentId }, { title: 'Questions' });

			this.questionCollection.url = this.questionCollection.baseUrl.replace('{{assessment_id}}', assessmentId);

			this.questionCollection.fetch({
				success: this.handleSuccessfulRequest.bind(this),
				error: this.handleFailedRequest.bind(this)
			});
		},
		handleSuccessfulRequest: function (collection, resp) {
			if (resp.error) {
				var error = typeof resp.error === 'string' ? resp.error : 'There was an issue with getting the questions';

				this.handleFailedRequest(resp, error);
				return;
			}

			this.replaceUsingTemplate('template-adminQuestionsContent', $('.container-tableData', this.$el), { question: collection.toJSON(), courseId: UTIL.QueryString().course_id });
		},

		handleFailedRequest: function (requestObject, error, errorThrow) {
			var error = typeof error === 'string' ? error : 'There was an issue with getting the questions';
			this.replaceUsingTemplate('template-serviceError', $('.container-tableData', this.$el), { error: error });
		}
	});
	return AdminQuestionsView;
});
