// Page Section: Addmin | Modules
// Filename: modules-view.js

define([
	"jquery",
	"underscore",
	"backbone",
	"base"

], function ($, _, Backbone, base) {
	"use strict";
	var AdminModulesView = BaseView.fullExtend({

		el: $("main"),

		url: function () {
			return "/views/admin/modules/modules-template.handlebars";
		},

		onInitialize: function () {

		},

		onRender: function () {
			this.replaceUsingTemplate("template-adminModules", this.$el, {}, { title: "Modules" });
		}
	});
	return AdminModulesView;
});
