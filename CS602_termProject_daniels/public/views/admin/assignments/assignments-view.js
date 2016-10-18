// Page Section: Addmin | Assignments
// Filename: assignments-view.js

define([
	'jquery',
	'underscore',
	'backbone',
	'util',
	'../../../collections/assignment-collection',
	'base'

], function ($, _, Backbone, UTIL, AssignmentCollection) {
	'use strict';
	var AdminAssignmentsView = BaseView.fullExtend({

		el: $('main'),

		url: function () {
			return '/views/admin/assignments/assignments-template.handlebars';
		},

		onInitialize: function () {
			this.assignmentCollection = new AssignmentCollection();
		},

		onRender: function () {
			var query = UTIL.QueryString();
			var courseId = query.course_id;

			// view requires course id, if there is none redirect to admin home page
			if (!courseId) {
				UTIL.navTo('/admin');
				return;
			}

			this.replaceUsingTemplate('template-adminAssignments', this.$el, { courseId: courseId }, {title: 'Assignments'});

			this.assignmentCollection.url = this.assignmentCollection.url.split('?')[0] + '?course_id=' + courseId;

			this.assignmentCollection.fetch({
				success: this.handleSuccessfulRequest.bind(this),
				error: this.handleFailedRequest.bind(this)
			});
		},
		handleSuccessfulRequest: function (collection, resp) {
			this.replaceUsingTemplate('template-adminAssignmentsContent', $('.container-tableData', this.$el), { assignment: collection.toJSON() });
		},

		handleFailedRequest: function (requestObject, error, errorThrow) {
			this.replaceUsingTemplate('template-serviceError', $('.container-tableData', this.$el), { error: error });
		}
	});
	return AdminAssignmentsView;
});
