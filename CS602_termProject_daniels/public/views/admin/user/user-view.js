// Page Section: Admin | User
// Filename: module-view.js
// Used for both adding and editing users

define([
	"jquery",
	"underscore",
	"backbone",
	"base"

], function ($, _, Backbone, base) {
	"use strict";
	var AdminUserView = BaseView.fullExtend({

		el: $("main"),

		url: function () {
			return "/views/admin/course/course-template.handlebars";
		},

		onInitialize: function () {

		},

		onRender: function () {
			this.replaceUsingTemplate("template-adminUser", this.$el, {}, { title: "User Admin" });
		}
	});
	return AdminUserView;
});
