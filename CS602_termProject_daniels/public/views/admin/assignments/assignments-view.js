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

		events: {
			'click .btn-delete-assignment': 'setItemToDelete'
		},

		onInitialize: function () {
			this.assignmentCollection = new AssignmentCollection();

			this.router.on('doDelete', function () {
				this.assignmentCollection.deleteAssignment(this.selectedItemId.id).done(function (resp) {
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
			var query = UTIL.QueryString();
			var courseId = query.course_id;

			// view requires course id, if there is none redirect to admin home page
			if (!courseId) {
				UTIL.navTo('/admin');
				return;
			}

			// storehouse for the the delete item data for the taking action when the modal closes
			this.selectedItemId = null;

			this.replaceUsingTemplate('template-adminAssignments', this.$el, { courseId: courseId }, {title: 'Assignments'});

			this.assignmentCollection.url = this.assignmentCollection.url.split('?')[0] + '?course_id=' + courseId;

			this.assignmentCollection.fetch({
				success: this.handleSuccessfulRequest.bind(this),
				error: this.handleFailedRequest.bind(this)
			});
		},
		handleSuccessfulRequest: function (collection, resp) {
			if (resp.error) {
				this.handleFailedRequest(resp, resp.error);
				return;
			}

			this.replaceUsingTemplate('template-adminAssignmentsContent', $('.container-tableData', this.$el), { assignment: collection.toJSON(), courseId: UTIL.QueryString().course_id });
		},

		handleFailedRequest: function (requestObject, error, errorThrow) {
			this.replaceUsingTemplate('template-serviceError', $('.container-tableData', this.$el), { error: error });
		},

		setItemToDelete: function (e) {
			this.selectedItemId = {
				id: $(e.target).attr('data-Id'),
				type: 'user'
			};
			$('#theModal').modal('show');
		}
	});
	return AdminAssignmentsView;
});
