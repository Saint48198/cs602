// Page Section: Admin | Assignment
// Filename: course-view.js
// Used for both adding and editing assignment

define([
	'jquery',
	'underscore',
	'backbone',
	'util',
	'../../../models/assignment-model',
	'base'

], function ($, _, Backbone, UTIL, AssignmentModel) {
	'use strict';
	var AdminAssignmentView = BaseView.fullExtend({

		el: $('main'),

		url: function () {
			return '/views/admin/assignment/assignment-template.handlebars';
		},

		events: {
			'submit #form-AdminAssignment': 'handleAdminAssessmentForm'
		},

		onInitialize: function () {
			this.assignmentModel = new AssignmentModel();
		},

		onRender: function () {
			var query = UTIL.QueryString();
			var courseId = query.course_id;
			var assessmentId = query.assessment_id;

			this.formDisabled = false;

			this.title = assessmentId ? 'Edit Assignment' : 'Add Assignment';

			// view must have a course
			if (!courseId) {
				UTIL.navTo('/admin');
				return;
			}

			this.replaceUsingTemplate('template-adminAssignment', this.$el, { title: this.title, courseId: courseId }, { title: 'Admin ~ ' + this.title });
			this.displayForm({});
		},

		displayForm: function (data) {
			data.disabled = this.formDisabled;
			data.title =  this.title;

			this.replaceUsingTemplate('template-adminAssignmentForm', $('.container-form', this.$el), data);
		},

		handleAdminAssessmentForm: function (e) {
			e.preventDefault();

			var formData = $(e.target).serializeArray();
			var formDataObject = {};
			var query = UTIL.QueryString();
			var courseId = query.course_id;
			var assessmentId = query.assessment_id;

			formData.courseId = courseId;

			if (this.formDisabled === false) {
				formData.forEach(function (input) {
					formDataObject[input.name] = input.value;
				});

				this.formDisabled = true;
				this.displayForm({});

				console.log(formDataObject);
			}
			if (assessmentId) {
				this.assignmentModel.url = this.existingUserUrl + assessmentId;
			} else {
				this.assignmentModel.url = this.assignmentModel.newAssignmentUrl;
			}

			this.assignmentModel.save(formData, {
				success: this.handleAssignmentServiceResponse.bind(this),
				error: this.handleAssignmentServiceResponse.bind(this)
			});
		},

		handleAssignmentServiceResponse : function (model, resp) {
			var data = model.toJSON();

			this.formDisabled = false;

			if (resp.error) {
				data.error = error;
				this.displayForm(data);
				return;
			}

			UTIL.navTo('admin/assessments?course_id=' + data.courseId);
		}
	});
	return AdminAssignmentView;
});
