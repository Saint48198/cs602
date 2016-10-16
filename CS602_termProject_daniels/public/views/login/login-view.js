// Page Section: Login page
// Filename: login-view.js

define([
  "jquery",
  "underscore",
  "backbone",
  "base"

], function ($, _, Backbone, base) {
  "use strict";
  var LoginView = BaseView.fullExtend({

    el: $("main"),

    url: function () {
      return "/webapp/views/login/login-template.handlebars";
    },

    onInitialize: function () {

    },

    onRender: function () {
      console.log("hello");
      this.replaceUsingTemplate("template-sample", this.$el, {}, { title: "Hello World" });
    }
  });
  return LoginView;
});
