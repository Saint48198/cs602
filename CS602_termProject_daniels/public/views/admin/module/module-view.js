// Page Section: Admin | Module
// Filename: module-view.js
// Used for both adding and editing modules

define([
	"jquery",
	"underscore",
	"backbone",
	"base"

], function ($, _, Backbone, base) {
	"use strict";
	var AdminModuleView = BaseView.fullExtend({

		el: $("main"),

		url: function () {
			return "/views/admin/module/module-template.handlebars";
		},

		onInitialize: function () {
			this.defaultNumberContentPages = 1;
		},

		onRender: function () {
			this.replaceUsingTemplate("template-adminModule", this.$el, {}, { title: "Module" });
		}
	});
	return AdminModuleView;
});
