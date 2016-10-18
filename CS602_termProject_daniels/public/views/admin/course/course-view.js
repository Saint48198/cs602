// Page Section: Admin | Course
// Filename: course-view.js
// Used for both adding and editing courses

define([
	"jquery",
	"underscore",
	"backbone",
	"base"

], function ($, _, Backbone, base) {
	"use strict";
	var AdminCourseView = BaseView.fullExtend({

		el: $("main"),

		url: function () {
			return "/views/admin/course/course-template.handlebars";
		},

		onInitialize: function () {

		},

		onRender: function () {
			this.replaceUsingTemplate("template-adminCourse", this.$el, {}, { title: "Course" });
		}
	});
	return AdminCourseView;
});
