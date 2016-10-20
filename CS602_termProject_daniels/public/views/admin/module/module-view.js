// Page Section: Admin | Module
// Filename: module-view.js
// Used for both adding and editing modules

define([
	'jquery',
	'underscore',
	'backbone',
	'util',
	'../../../models/module-model',
	'base'

], function ($, _, Backbone, UTIL, ModuleModel) {
	'use strict';
	var AdminModuleView = BaseView.fullExtend({

		el: $('main'),

		url: function () {
			return '/views/admin/module/module-template.handlebars';
		},

		events: {
			'submit #form-AdminModule': 'handleAdminModuleForm',
			'click #btn-addModulePageContent': 'addContentArea'
		},

		onInitialize: function () {
			this.defaultNumberContentPages = 1;
			this.moduleModel = new ModuleModel();
		},

		onRender: function () {
			var query = UTIL.QueryString();
			var courseId = query.course_id;
			var moduleId = query.module_id;

			this.formDisabled = false;

			this.title = moduleId ? 'Edit Module' : 'Add Module';

			// view must have a course
			if (!courseId) {
				UTIL.navTo('/admin');
				return;
			}

			this.replaceUsingTemplate('template-adminModule', this.$el, { title: this.title, courseId: courseId }, { title: 'Admin ~ ' + this.title });
			this.moduleContentPage = [];

			if (moduleId) {
				this.moduleModel.url = this.moduleModel.existingModuleUrl + moduleId;
				this.moduleModel.fetch({
					success: this.handleRequestModule.bind(this),
					error: this.handleRequestModule.bind(this)
				});
			} else {
				var pageNumber = 1;
				for(var i = 0; i < this.defaultNumberContentPages; i++) {
					this.moduleContentPage.push({ label: 'Module Page ' + pageNumber + ' (HTML)'});
					pageNumber++;
				}

				this.displayForm({ moduleContentPage: this.moduleContentPage });
			}
		},

		displayForm: function (data) {
			data.disabled = this.formDisabled;
			data.title =  this.title;
			data.moduleContentPage = this.moduleContentPage;

			this.replaceUsingTemplate('template-adminModuleForm', $('.container-form', this.$el), data);
		},

		handleRequestModule: function (model, resp) {
			var data = model.toJSON();

			if (resp.error) {
				data.error = resp.error;
			}

			var pageNumber = 1;
			for(var i = 0; i < data.content.length; i++) {
				this.moduleContentPage.push({ label: 'Module Page ' + pageNumber + ' (HTML)', content: data.content[i] });
				pageNumber++;
			}

			this.displayForm(data);
		},

		handleAdminModuleForm: function (e) {
			e.preventDefault();

			var formData = $(e.target).serializeArray();
			var formDataObject = {};
			var query = UTIL.QueryString();
			var courseId = query.course_id;
			var moduleId = query.module_id;

			formDataObject.course_id = courseId;
			// data needs to be an object for backbone model to store it with the right keys
			if (this.formDisabled === false) {
				formData.forEach(function (input) {

					if (input.name === 'content') {
						if (!formDataObject[input.name]) {
							formDataObject[input.name] = [];
						}

						formDataObject[input.name].push(input.value);
					} else {
						formDataObject[input.name] = input.value;
					}
				});

				this.formDisabled = true;
				this.displayForm({});

			}

			if (moduleId) {
				this.moduleModel.url = this.moduleModel.existingModuleUrl + moduleId;
			} else {
				this.moduleModel.url = this.moduleModel.newModuleUrl;
			}

			console.log(formDataObject);

			this.moduleModel.save(formDataObject, {
				success: this.handleModuleServiceResponse.bind(this),
				error: this.handleModuleServiceResponse.bind(this)
			});
		},

		handleModuleServiceResponse : function (model, resp) {
			var data = model.toJSON();

			this.formDisabled = false;

			if (resp.error) {
				data.error = typeof resp.error === 'string' ? resp.error : 'There was a problem try again later.';
				this.displayForm(data);
				return;
			}

			UTIL.navTo('/admin/modules?course_id=' + data.course_id);
		},

		addContentArea: function (e) {
			var container = document.getElementById("container-contentPages");
			var index = document.getElementsByName('content').length + 1;
			var label = 'Module Page ' + index + ' (HTML)';

			this.moduleContentPage.push({ label: label });

			this.appendUsingTemplate('template-adminModuleContentInput', container, { index: index, label: label });
		}
	});
	return AdminModuleView;
});
