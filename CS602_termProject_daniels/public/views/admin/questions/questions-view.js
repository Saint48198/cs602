// Page Section: Addmin | Modules
// Filename: modules-view.js

define([
	"jquery",
	"underscore",
	"backbone",
	"base"

], function ($, _, Backbone, base) {
	"use strict";
	var AdminQuestionsView = BaseView.fullExtend({

		el: $("main"),

		url: function () {
			return "/views/admin/questions/questions-template.handlebars";
		},

		onInitialize: function () {

		},

		onRender: function () {
			this.replaceUsingTemplate("template-adminQuestions", this.$el, {}, { title: "Questions" });
		}
	});
	return AdminQuestionsView;
});
