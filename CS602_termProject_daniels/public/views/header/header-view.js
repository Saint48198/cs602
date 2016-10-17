// Page Section: Header
// Filename: header-view.js

define([
	'jquery',
	'underscore',
	'backbone',
	'util',
	'bootstrap',
	'base'

], function ($, _, Backbone, UTIL) {
	'use strict';
	var HeaderView = BaseView.fullExtend({

		el: $('header'),

		url: function () {
			return '/views/header/header-template.handlebars';
		},

		events: {
			'click #logout': 'handleLogout'
		},

		onInitialize: function () {
			this.requestedLogout = false;
		},

		onRender: function () {
			var session = this.router.session;
			var isLoggedIn = session ? session.logged_in : false;
			var name = '';

			if (isLoggedIn) {
				name = (session.user && session.user.firstName && session.user.lastName) ? session.user.firstName + ' ' + session.user.lastName : session.email.split('@')[0];
			}

			this.replaceUsingTemplate('template-header', this.$el, { isLoggedIn: isLoggedIn, name: name });
			$('.dropdown-toggle').dropdown();
		},

		handleLogout: function (e) {
			e.preventDefault();

			if (!this.requestedLogout) {
				this.requestedLogout = true;

				$.ajax({
					method: 'GET',
					url: '/api/logout',
					success:  function (resp) {
						if (resp.logged_out) {
							location.reload(true);
							return false;
						}

						this.handleLogoutError.call(this, resp);

					}.bind(this),
					error: this.handleLogoutError.bind(this)
				});
			}


		},

		handleLogoutError: function (resp) {
			alert('There was an issue logging you out.Please try again later');
			this.requestedLogout = false;
		}
	});
	return HeaderView;
});