// Page Section: Admin
// Filename: admin-view.js

define([
	"jquery",
	"underscore",
	"backbone",
	"base"

], function ($, _, Backbone, base) {
	"use strict";
	var AdminView = BaseView.fullExtend({

		el: $("main"),

		url: function () {
			return "/views/admin/admin-template.handlebars";
		},

		onInitialize: function () {

		},

		onRender: function () {
			this.replaceUsingTemplate("template-admin", this.$el, {}, { title: "Admin Home" });
		}
	});
	return AdminView;
});
