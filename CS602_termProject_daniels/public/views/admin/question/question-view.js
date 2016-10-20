// Page Section: Admin | Question
// Filename: question-view.js
// Used for both adding and editing questions

define([
	'jquery',
	'underscore',
	'backbone',
	'util',
	'../../../models/question-model',
	'base'

], function ($, _, Backbone, UTIL, QuestionModel) {
	'use strict';
	var AdminQuestionView = BaseView.fullExtend({

		el: $('main'),

		url: function () {
			return '/views/admin/question/question-template.handlebars';
		},
		events: {
			'submit #form-AdminAssessment': 'handleAdminAssessmentForm'
		},

		onInitialize: function () {
			this.questionModel = new QuestionModel();
			this.defaultNumberOptions = 3;
		},

		onRender: function () {
			var query = UTIL.QueryString();
			var courseId = query.course_id;
			var assessmentId = query.assessment_id;
			var questionId = query.question_id;

			this.formDisabled = false;

			this.title = questionId ? 'Edit Question' : 'Add Question';

			// view must have a course
			if (!courseId && !assessmentId) {
				UTIL.navTo('/admin');
				return;
			}

			this.replaceUsingTemplate('template-adminQuestion', this.$el, { title: this.title, courseId: courseId, assessmentId: assessmentId }, { title: 'Admin ~ ' + this.title });

			if (questionId) {
				this.questionModel.url = this.questionModel.existingQuestionUrl.replace('{{assessment_id}}', assessmentId).replace('{{qeustion_id}}', questionId);
				this.questionModel.fetch({
					success: this.handleRequestAssessment.bind(this),
					error: this.handleRequestAssessment.bind(this)
				});
			} else {
				this.displayForm({});
			}
		},

		displayForm: function (data) {
			data.disabled = this.formDisabled;
			data.title =  this.title;

			this.replaceUsingTemplate('template-adminQuestionForm', $('.container-form', this.$el), data);
		},

		handleRequestAssessment: function (model, resp) {
			var data = model.toJSON();

			if (resp.error) {
				data.error = resp.error;
			}

			this.displayForm(data);
		},

		handleAdminQuestionForm: function (e) {
			e.preventDefault();

			var formData = $(e.target).serializeArray();
			var formDataObject = {};
			var query = UTIL.QueryString();
			var courseId = query.course_id;
			var assessmentId = query.assessment_id;
			var questionId = query.question_id;

			formDataObject.course_id = courseId;
			// data needs to be an object for backbone model to store it with the right keys
			if (this.formDisabled === false) {
				formData.forEach(function (input) {
					formDataObject[input.name] = input.value;
				});

				this.formDisabled = true;
				this.displayForm({});

			}

			if (questionId) {
				this.questionModel.url = this.questionModel.existingQuestionUrl.replace('{{assessment_id}}', assessmentId).replace('{{qeustion_id}}', questionId);
			} else {
				this.questionModel.url = this.questionModel.existingQuestionUrl.replace('{{assessment_id}}', assessmentId);
			}

			this.assessmentModel.save(formDataObject, {
				success: this.handleQuestionServiceResponse.bind(this),
				error: this.handleQuestionServiceResponse.bind(this)
			});
		},

		handleQuestionServiceResponse : function (model, resp) {
			var data = model.toJSON();

			this.formDisabled = false;

			if (resp.error) {
				data.error = typeof resp.error === 'string' ? resp.error : 'There was a problem try again later.';
				this.displayForm(data);
				return;
			}

			UTIL.navTo('/admin/questions?course_id=' + data.course_id + '&assessment_id=' + data.assessment_id);
		}
	});
	return AdminQuestionView;
});
