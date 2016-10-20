// Page Section: Grades
// Filename: grades-view.js

define([
	'jquery',
	'underscore',
	'backbone',
	'util',
	'base'

], function ($, _, Backbone, UTIL) {
	'use strict';
	var GradesView = BaseView.fullExtend({

		el: $('main'),

		url: function () {
			return '/views/grades/grades-template.handlebars';
		},

		onInitialize: function () {

		},

		onRender: function () {
			this.replaceUsingTemplate('template-grades', this.$el, {}, { title: 'My Grades' });
		}
	});
	return GradesView;
});
