// Page Section: Admin | User Course
// Filename: userCourse-view.js
// for adding existing users to courses

define([
	"jquery",
	"underscore",
	"backbone",
	"base"

], function ($, _, Backbone, base) {
	"use strict";
	var AdminUserCourseView = BaseView.fullExtend({

		el: $("main"),

		url: function () {
			return "/views/admin/user-course/userCourse-template.handlebars";
		},

		onInitialize: function () {

		},

		onRender: function () {
			this.replaceUsingTemplate("template-adminUserCourse", this.$el, {}, { title: "Hello World" });
		}
	});
	return AdminUserCourseView;
});
