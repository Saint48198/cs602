// Page Section: Sample
// Filename: sample-view.js

define([
	'jquery',
	'underscore',
	'backbone',
	'util',
	'base'

], function ($, _, Backbone, UTIL) {
	'use strict';
	var SampleView = BaseView.fullExtend({

		el: $('main'),

		url: function () {
			return '/views/sample/sample-template.handlebars';
		},

		onInitialize: function () {

		},

		onRender: function () {
			this.replaceUsingTemplate('template-sample', this.$el, {}, { title: 'Hello World' });
		}
	});
	return SampleView;
});
