// Page Section: Footer
// Filename: footer-view.js

define([
	'jquery',
	'underscore',
	'backbone',
	'util',
	'base'

], function ($, _, Backbone, UTIL) {
	'use strict';
	var FooterView = BaseView.fullExtend({

		el: $('footer'),

		url: function () {
			return '/views/footer/footer-template.handlebars';
		},

		onInitialize: function () {
			this.render();
		},

		onRender: function () {
			var displayDate = new Date().getFullYear();

			this.replaceUsingTemplate('template-footer', this.$el, {
				displayDate: displayDate
			});
		}
	});
	return FooterView;
});
