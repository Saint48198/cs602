// Page Section: Addmin | Modules
// Filename: modules-view.js

define([
	"jquery",
	"underscore",
	"backbone",
	"base"

], function ($, _, Backbone, base) {
	"use strict";
	var AdminAssignmentsView = BaseView.fullExtend({

		el: $("main"),

		url: function () {
			return "/views/admin/assignments/assignments-template.handlebars";
		},

		onInitialize: function () {

		},

		onRender: function () {
			this.replaceUsingTemplate("template-adminAssignments", this.$el, {}, { title: "Assignments" });
		}
	});
	return AdminAssignmentsView;
});
