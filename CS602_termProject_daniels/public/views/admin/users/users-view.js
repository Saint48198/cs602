// Page Section: Addmin | Modules
// Filename: modules-view.js

define([
	"jquery",
	"underscore",
	"backbone",
	"base"

], function ($, _, Backbone, base) {
	"use strict";
	var AdminUsersView = BaseView.fullExtend({

		el: $("main"),

		url: function () {
			return "/views/admin/users/users-template.handlebars";
		},

		onInitialize: function () {

		},

		onRender: function () {
			this.replaceUsingTemplate("template-adminUsers", this.$el, {}, { title: "Users" });
		}
	});
	return AdminUsersView;
});
