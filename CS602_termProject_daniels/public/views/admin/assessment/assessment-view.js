// Page Section: Admin | Assessment
// Filename: course-view.js
// Used for both adding and editing assessment

define([
	'jquery',
	'underscore',
	'backbone',
	'util',
	'../../../models/assessment-model',
	'base'

], function ($, _, Backbone, UTIL, AssessmentModel) {
	'use strict';
	var AdminAssessmentView = BaseView.fullExtend({

		el: $('main'),

		url: function () {
			return '/views/admin/assessment/assessment-template.handlebars';
		},

		events: {
			'submit #form-AdminAssessment': 'handleAdminAssessmentForm'
		},


		onInitialize: function () {
			this.assessmentModel = new AssessmentModel();
		},

		onRender: function () {
			var query = UTIL.QueryString();
			var courseId = query.course_id;
			var assessmentId = query.assessment_id;

			this.formDisabled = false;

			this.title = assessmentId ? 'Edit Assessment' : 'Add Assessment';

			// view must have a course
			if (!courseId) {
				UTIL.navTo('/admin');
				return;
			}
			this.replaceUsingTemplate('template-adminAssessment', this.$el, { title: this.title, courseId: courseId }, { title: 'Admin ~ ' + this.title });

			if (assessmentId) {
				this.assessmentModel.url = this.assessmentModel.existingAssessmentUrl + assessmentId;
				this.assessmentModel.fetch({
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

			this.replaceUsingTemplate('template-adminAssessmentForm', $('.container-form', this.$el), data);
		},

		handleRequestAssessment: function (model, resp) {
			var data = model.toJSON();

			if (resp.error) {
				data.error = resp.error;
			}

			this.displayForm(data);
		},

		handleAdminAssessmentForm: function (e) {
			e.preventDefault();

			var formData = $(e.target).serializeArray();
			var formDataObject = {};
			var query = UTIL.QueryString();
			var courseId = query.course_id;
			var assessmentId = query.assessment_id;

			formDataObject.course_id = courseId;
			// data needs to be an object for backbone model to store it with the right keys
			if (this.formDisabled === false) {
				formData.forEach(function (input) {
					formDataObject[input.name] = input.value;
				});

				this.formDisabled = true;
				this.displayForm({});

			}
			console.log(formDataObject);
			if (assessmentId) {
				this.assessmentModel.url = this.assessmentModel.existingAssessmentUrl + assessmentId;
			} else {
				this.assessmentModel.url = this.assessmentModel.newAssessmentUrl;
			}

			this.assessmentModel.save(formDataObject, {
				success: this.handleAssessmentServiceResponse.bind(this),
				error: this.handleAssessmentServiceResponse.bind(this)
			});
		},

		handleAssessmentServiceResponse : function (model, resp) {
			var data = model.toJSON();

			this.formDisabled = false;

			if (resp.error) {
				data.error = typeof resp.error === 'string' ? resp.error : 'There was a problem try again later.';
				this.displayForm(data);
				return;
			}

			UTIL.navTo('/admin/assessments?course_id=' + data.course_id);
		}
	});
	return AdminAssessmentView;
});
