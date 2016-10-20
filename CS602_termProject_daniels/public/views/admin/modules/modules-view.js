// Page Section: Addmin | Modules
// Filename: modules-view.js

define([
	'jquery',
	'underscore',
	'backbone',
	'util',
	'../../../collections/module-collection',
	'base'

], function ($, _, Backbone, UTIL, ModuleCollection) {
	'use strict';
	var AdminModulesView = BaseView.fullExtend({

		el: $('main'),

		url: function () {
			return '/views/admin/modules/modules-template.handlebars';
		},

		events: {
			'click .btn-delete-module': 'setItemToDelete'
		},

		onInitialize: function () {
			this.moduleCollection = new ModuleCollection();

			this.router.on('doDelete', function () {
				this.moduleCollection.deleteModule(this.selectedItemId.id).done(function (resp) {
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

			this.replaceUsingTemplate('template-adminModules', this.$el, { courseId: courseId }, {title: 'Admin Modules'});

			this.moduleCollection.url = this.moduleCollection.url.split('?')[0] + '?course_id=' + courseId;

			this.moduleCollection.fetch({
				success: this.handleSuccessfulRequest.bind(this),
				error: this.handleFailedRequest.bind(this)
			});
		},
		handleSuccessfulRequest: function (collection, resp) {
			var query = UTIL.QueryString();
			var courseId = query.course_id;

			if (resp.error) {
				this.handleFailedRequest(resp, resp.error);
				return;
			}
			this.replaceUsingTemplate('template-adminModulesContent', $('.container-tableData', this.$el), { module: collection.toJSON(), courseId: courseId });
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
	return AdminModulesView;
});
