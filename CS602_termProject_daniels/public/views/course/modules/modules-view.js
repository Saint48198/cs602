// Page Section: Course | Module
// Filename: module-view.js

define([
	'jquery',
	'underscore',
	'backbone',
	'util',
	'../../../collections/module-collection',
	'../../../models/course-model',
	'../../../models/module-model',
	'base'

], function ($, _, Backbone, UTIL, ModuleCollection, CourseModel, ModuleModel) {
	'use strict';
	var CourseModulesView = BaseView.fullExtend({

		el: $('main'),

		url: function () {
			return '/views/course/modules/modules-template.handlebars';
		},

		onInitialize: function () {
			this.moduleCollection = new ModuleCollection();
			this.courseModel = new CourseModel();
			this.moduleModel = new ModuleModel();
		},

		onRender: function (actions) {
			var courseId = actions.type;
			var query = UTIL.QueryString();
			var moduleId = query.module_id;


			this.courseModel.url = this.courseModel.existingCourseUrl + courseId;

			this.replaceUsingTemplate('template-courseModulesBase', this.$el, { courseId: courseId }, { title: 'Course - ' + courseId });

			if (moduleId) {
				this.moduleModel.url = this.moduleModel.existingModuleUrl + moduleId;

				Promise.all([this.moduleModel.fetch(), this.courseModel.fetch()]).then(function (fullfill, reject) {
					if (fullfill.length) {
						var module = this.moduleModel.toJSON();
						var page = query.page ? parseInt(query.page) : 1;
						var prevPage = page === 1 ? null : page - 1;
						var nextPage = module.content.length === page ? null : page + 1;

						this.displayContent({ courseId: courseId, module: module, course: this.courseModel.toJSON(), page: page, prevPage: prevPage, nextPage, content: module.content[page - 1] }, 'template-courseModule');
					} else {
						alert('error');
					}
				}.bind(this));
			} else {
				this.moduleCollection.url = this.moduleCollection.url.split('?')[0] + '?course_id=' + courseId;
				Promise.all([this.moduleCollection.fetch(), this.courseModel.fetch()]).then(function (fullfill, reject) {
					if (fullfill.length) {
						this.displayContent({ courseId: courseId, module: this.moduleCollection.toJSON(), course: this.courseModel.toJSON() }, 'template-courseModules');
					} else {
						alert('error');
					}
				}.bind(this));
			}
		},

		displayContent: function (data, templateId) {
			this.replaceUsingTemplate(templateId, $('#courseContent', this.$el), data);
		}
	});
	return CourseModulesView;
});
