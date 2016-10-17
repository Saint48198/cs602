// Page Section: Admin | Courses
// Filename: course-view.js

define([
	"jquery",
	"underscore",
	"backbone",
	"base"

], function ($, _, Backbone, base) {
	"use strict";
	var AdminCoursesView = BaseView.fullExtend({

		el: $("main"),

		url: function () {
			return "/views/admin/courses/courses-template.handlebars";
		},

		onInitialize: function () {

		},

		onRender: function () {
			this.replaceUsingTemplate("template-adminCourses", this.$el, {}, { title: "Courses" });
		}
	});
	return AdminCoursesView;
});
