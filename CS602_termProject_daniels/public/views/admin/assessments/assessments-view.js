// Page Section: Addmin | Modules
// Filename: modules-view.js

define([
	"jquery",
	"underscore",
	"backbone",
	"base"

], function ($, _, Backbone, base) {
	"use strict";
	var AdminAssessmentsView = BaseView.fullExtend({

		el: $("main"),

		url: function () {
			return "/views/admin/assessments/assessments-template.handlebars";
		},

		onInitialize: function () {

		},

		onRender: function () {
			this.replaceUsingTemplate("template-adminAssessments", this.$el, {}, { title: "Assessments" });
		}
	});
	return AdminAssessmentsView;
});
