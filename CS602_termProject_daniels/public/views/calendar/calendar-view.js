// Page Section: Calendar
// Filename: calendar-view.js

define([
	'jquery',
	'underscore',
	'backbone',
	'util',
	'base'

], function ($, _, Backbone, UTIL) {
	'use strict';
	var CalendarView = BaseView.fullExtend({

		el: $('main'),

		url: function () {
			return '/views/calendar/calendar-template.handlebars';
		},

		onInitialize: function () {

		},

		onRender: function () {
			this.replaceUsingTemplate('template-calendar', this.$el, {}, { title: 'Calendar' });
		}
	});
	return CalendarView;
});
