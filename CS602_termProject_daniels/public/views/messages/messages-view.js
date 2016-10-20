// Page Section: Messages
// Filename: messages-view.js

define([
	'jquery',
	'underscore',
	'backbone',
	'util',
	'base'

], function ($, _, Backbone, UTIL) {
	'use strict';
	var MessagesView = BaseView.fullExtend({

		el: $('main'),

		url: function () {
			return '/views/messages/messages-template.handlebars';
		},

		onInitialize: function () {

		},

		onRender: function () {
			this.replaceUsingTemplate('template-messages', this.$el, {}, { title: 'Messages' });
		}
	});
	return MessagesView;
});
