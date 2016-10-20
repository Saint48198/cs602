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
			var assessmentId = query.assignment_id;

			this.formDisabled = false;

			this.title = assessmentId ? 'Edit Assignment' : 'Add Assignment';

			// view must have a course
			if (!courseId) {
				UTIL.navTo('/admin');
				return;
			}

			this.replaceUsingTemplate('template-adminAssignment', this.$el, { title: this.title, courseId: courseId }, { title: 'Admin ~ ' + this.title });

			if (assessmentId) {
				this.assignmentModel.url = this.assignmentModel.existingAssignmentUrl + assessmentId;
				this.assignmentModel.fetch({
					success: this.handleRequestAssignment.bind(this),
					error: this.handleRequestAssignment.bind(this)
				});
			} else {
				this.displayForm({});
			}
		},

		displayForm: function (data) {
			data.disabled = this.formDisabled;
			data.title =  this.title;

			this.replaceUsingTemplate('template-adminAssignmentForm', $('.container-form', this.$el), data);
		},

		handleRequestAssignment: function (model, resp) {
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
			var assessmentId = query.assignment_id;

			formDataObject.course_id = courseId;
			// data needs to be an object for backbone model to store it with the right keys
			if (this.formDisabled === false) {
				formData.forEach(function (input) {
					formDataObject[input.name] = input.value;
				});

				this.formDisabled = true;
				this.displayForm({});

			}
			if (assessmentId) {
				this.assignmentModel.url = this.assignmentModel.existingAssignmentUrl + assessmentId;
			} else {
				this.assignmentModel.url = this.assignmentModel.newAssignmentUrl;
			}

			this.assignmentModel.save(formDataObject, {
				success: this.handleAssignmentServiceResponse.bind(this),
				error: this.handleAssignmentServiceResponse.bind(this)
			});
		},

		handleAssignmentServiceResponse : function (model, resp) {
			var data = model.toJSON();

			this.formDisabled = false;

			if (resp.error) {
				data.error = resp.error;
				this.displayForm(data);
				return;
			}

			UTIL.navTo('/admin/assignments?course_id=' + data.course_id);
		}
	});
	return AdminAssignmentView;
});
