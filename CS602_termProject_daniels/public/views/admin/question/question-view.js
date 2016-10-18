// Page Section: Admin | Question
// Filename: question-view.js
// Used for both adding and editing questions

define([
	"jquery",
	"underscore",
	"backbone",
	"base"

], function ($, _, Backbone, base) {
	"use strict";
	var AdminQuestionView = BaseView.fullExtend({

		el: $("main"),

		url: function () {
			return "/views/admin/question/question-template.handlebars";
		},

		onInitialize: function () {
			this.defaultNumberOptions = 3;
		},

		onRender: function () {
			this.replaceUsingTemplate("template-adminQuestion", this.$el, {}, { title: "Question" });
		}
	});
	return AdminQuestionView;
});
