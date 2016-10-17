// Page Section: Landing
// Filename: landing-view.js

define([
	'jquery',
	'underscore',
	'backbone',
	'base'

], function ($, _, Backbone, base) {
	'use strict';
	var LandingView = BaseView.fullExtend({

		el: $('main'),

		url: function () {
			return '/views/landing/landing-template.handlebars';
		},

		onInitialize: function () {

		},

		onRender: function () {
			this.replaceUsingTemplate('template-landing', this.$el, {}, { title: 'Landing' });
		}
	});
	return LandingView;
});
