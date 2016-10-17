// Page Section: Header
// Filename: header-view.js

define([
	'jquery',
	'underscore',
	'backbone',
	'util',
	'base'

], function ($, _, Backbone, UTIL) {
	'use strict';
	var HeaderView = BaseView.fullExtend({

		el: $('header'),

		url: function () {
			return '/views/header/header-template.handlebars';
		},

		onInitialize: function () {},

		onRender: function () {
			var session = this.router.session;
			var isLoggedIn = session ? session.logged_in : false;

			this.replaceUsingTemplate('template-header', this.$el, { isLoggedIn: isLoggedIn });
		}
	});
	return HeaderView;
});