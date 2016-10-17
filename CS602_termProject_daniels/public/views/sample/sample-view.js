// Page Section: Sample
// Filename: sample-view.js

define([
	"jquery",
	"underscore",
	"backbone",
	"base"

], function ($, _, Backbone, base) {
	"use strict";
	var SampleView = BaseView.fullExtend({

		el: $("main"),

		url: function () {
			return "/views/sample/sample-template.handlebars";
		},

		onInitialize: function () {

		},

		onRender: function () {
			console.log("sample");
			console.log(this.$el);
			this.replaceUsingTemplate("template-sample", this.$el, {}, { title: "Hello World" });
		}
	});
	return SampleView;
});
