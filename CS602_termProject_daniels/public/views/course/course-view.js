// Page Section: Sample
// Filename: sample-view.js

define([
	'jquery',
	'underscore',
	'backbone',
	'base'

], function ($, _, Backbone, base) {
	'use strict';
	var CourseView = BaseView.fullExtend({

		el: $('main'),

		url: function () {
			return '/views/course/course-template.handlebars';
		},

		onInitialize: function () {

		},

		onRender: function () {
			this.replaceUsingTemplate('template-course', this.$el, {}, { title: 'Course' });
		}
	});
	return CourseView;
});
