// Page Section: Admin | Assessment
// Filename: course-view.js
// Used for both adding and editing assessment

define([
	"jquery",
	"underscore",
	"backbone",
	"base"

], function ($, _, Backbone, base) {
	"use strict";
	var AdminAssessmentView = BaseView.fullExtend({

		el: $("main"),

		url: function () {
			return "/views/admin/assessment/assessment-template.handlebars";
		},

		onInitialize: function () {

		},

		onRender: function () {
			this.replaceUsingTemplate("template-adminAssessment", this.$el, {}, { title: "Admin Assessment" });
		}
	});
	return AdminAssessmentView;
});
