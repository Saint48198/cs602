// Page Section: Landing
// Filename: landing-view.js

define([
	'jquery',
	'underscore',
	'backbone',
	'util',
	'../../collections/course-collection',
	'base'

], function ($, _, Backbone, UTIL, CourseCollection) {
	'use strict';
	var LandingView = BaseView.fullExtend({

		el: $('main'),

		url: function () {
			return '/views/landing/landing-template.handlebars';
		},

		onInitialize: function () {
			this.studentCourseCollection = new CourseCollection();
			this.teacherCourseCollection = new CourseCollection();
		},

		onRender: function () {
			var userId = this.router.sessionModel.get('user')._id;

			this.studentCourseCollection.url = this.studentCourseCollection.url.split('?')[0] + '?user_id=' + userId + '&role=student';
			this.teacherCourseCollection.url  = this.teacherCourseCollection.url.split('?')[0]  + '?user_id=' + userId + '&role=teacher';

			Promise.all([this.studentCourseCollection.fetch(), this.teacherCourseCollection.fetch()]).then(function(fullfill, reject) {
				this.replaceUsingTemplate('template-landing', this.$el,
					{
						studentCourses: this.studentCourseCollection.toJSON(),
						teacherCourses: this.teacherCourseCollection.toJSON()
					}, { title: 'Landing' });
			}.bind(this));
		}
	});
	return LandingView;
});
