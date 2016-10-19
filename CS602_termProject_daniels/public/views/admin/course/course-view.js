// Page Section: Admin | Course
// Filename: course-view.js
// Used for both adding and editing courses

define([
	'jquery',
	'underscore',
	'backbone',
	'util',
	'../../../models/course-model',
	'base'

], function ($, _, Backbone, UTIL, CourseModel) {
	'use strict';
	var AdminCourseView = BaseView.fullExtend({

		el: $('main'),

		url: function () {
			return '/views/admin/course/course-template.handlebars';
		},

		onInitialize: function () {
			this.courseModel = new CourseModel();
		},

		events: {
			'submit #form-AdminCourse': 'handleCourseForm'
		},

		onRender: function () {
			var query = UTIL.QueryString();
			var courseId = query.course_id;
			var title = courseId ? 'Edit Course' : 'Add Course' ;

			// no course id no access to edit course page, push the user to the add course page
			if (!courseId && window.location.pathname.indexOf('/admin-edit_course') !== -1) {
				UTIL.navTo('/admin-add_course');
				return;
			}

			this.formDisabled = false;

			this.replaceUsingTemplate('template-adminCourse', this.$el, { courseId: courseId, title: title }, { title: title });

			if (courseId) {
				this.courseModel.url = this.courseModel.existingCourseUrl + courseId;
				this.courseModel.fetch({
					success: this.handleSuccessfulRequest.bind(this),
					error: this.handleFailedRequest.bind(this)
				});
			} else {
				this.displayForm({});
			}
		},

		displayForm: function (data) {
			var query = UTIL.QueryString();
			var courseId = query.course_id;
			var title = courseId ? 'Edit Course' : 'Add Course' ;

			data.title = title;
			data.disabled = this.formDisabled

			this.replaceUsingTemplate('template-adminCourseForm', $('.container-form', this.$el), data);
		},

		handleSuccessfulRequest: function (model, resp) {
			var data = model.toJSON();

			this.formDisabled = false;

			if (resp.error) {
				this.handleFailedRequest(resp, resp.error);
				return;
			}

			this.displayForm(data);
		},

		handleFailedRequest: function (requestObject, error, errorThrow) {
			this.formDisabled = false;
			this.displayForm({ error: error })
		},

		handleCourseForm: function (e) {
			e.preventDefault();

			var query = UTIL.QueryString();
			var courseId = query.course_id;
			var formData = $(e.currentTarget).serializeArray();
			var formDataObject = {};

			formData.forEach(function(input) {
				formDataObject[input.name] = input.value;
			});

			if (this.formDisabled === false) {
				this.formDisabled = true;

				if (courseId) {
					this.courseModel.url = this.courseModel.existingCourseUrl + courseId;
				} else {
					this.courseModel = new CourseModel();
					this.courseModel.url = this.courseModel.newCourseUrl;
				}

				this.courseModel.save(formDataObject, {
					success: this.handleUpdateServiceRequest.bind(this),
					error: this.handleUpdateServiceRequest.bind(this)
				});
			}
		},

		handleUpdateServiceRequest: function (model, resp) {
			this.formDisabled = false;

			if (resp.error) {
				model.error = resp.error;
				this.displayForm(model);
			} else {
				UTIL.navTo('/admin');
			}
		}
	});
	return AdminCourseView;
});
