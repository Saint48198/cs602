// Page Section: Admin | Courses
// Filename: course-view.js

define([
	'jquery',
	'underscore',
	'backbone',
	'../../../collections/course-collection',
	'base'

], function ($, _, Backbone, CourseCollection) {
	'use strict';
	var AdminCoursesView = BaseView.fullExtend({

		el: $('main'),

		url: function () {
			return '/views/admin/courses/courses-template.handlebars';
		},

		events: {
			'click .btn-delete-course': 'setItemToDelete'
		},

		onInitialize: function () {
			this.courseCollection = new CourseCollection();

			this.router.on('doDelete', function () {
				this.courseCollection.deleteCourse(this.selectedItemId.id).done(function (resp) {
					if (resp.error) {
						alert('error');
						return;
					}

					$('#theModal').modal('hide');
					this.onRender({});

				}.bind(this));

			}.bind(this));
		},

		onRender: function () {
			// storehouse for the the delete item data for the taking action when the modal closes
			this.selectedItemId = null;
			this.replaceUsingTemplate('template-adminCourses', this.$el, {}, { title: 'Admin ~ Courses' });
			this.courseCollection.fetch({
				success: this.handleSuccessfulRequest.bind(this),
				error: this.handleFailedRequest.bind(this)
			});
		},

		handleSuccessfulRequest: function (collection, resp) {
			if (resp.error) {
				this.handleFailedRequest(resp, resp.error);
				return;
			}

			this.replaceUsingTemplate('template-adminCoursesContent', $('.container-tableData', this.$el), { course: collection.toJSON() });
		},

		handleFailedRequest: function (requestObject, error, errorThrow) {
			this.replaceUsingTemplate('template-serviceError', $('.container-tableData', this.$el), { error: error });
		},

		setItemToDelete: function (e) {
			this.selectedItemId = {
				id: $(e.target).attr('data-courseId'),
				type: 'course'
			};

			$('#theModal').modal('show');
		}
	});
	return AdminCoursesView;
});
