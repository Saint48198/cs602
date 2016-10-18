// Page Section: Admin | Assignment
// Filename: course-view.js
// Used for both adding and editing assignment

define([
	"jquery",
	"underscore",
	"backbone",
	"base"

], function ($, _, Backbone, base) {
	"use strict";
	var AdminAssignmentView = BaseView.fullExtend({

		el: $("main"),

		url: function () {
			return "/views/admin/assignment/assignment-template.handlebars";
		},

		onInitialize: function () {

		},

		onRender: function () {
			this.replaceUsingTemplate("template-adminAssignment", this.$el, {}, { title: "Admin Assignment" });
		}
	});
	return AdminAssignmentView;
});
