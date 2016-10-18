// Collection Name: Users
// Filename: user-collection.js

define([
	'jquery',
	'underscore',
	'backbone',
	'base'
], function ($, _, Backbone) {
	'use strict';

	var UserCollection = Backbone.Collection.extend({
		url: '/api/users',

		initialize: function () {},

		parse: function (resp) {
			return resp.user || [];
		}
	});

	return UserCollection;
});
