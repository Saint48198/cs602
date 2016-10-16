// Page Section: Sample
// Filename: sample-view.js

define([
  "jquery",
  "underscore",
  "backbone",
  "framework"

], function ($, _, Backbone) {
  "use strict";
  var SampleView = BaseView.fullExtend({

    el: $("main"),

    url: function () {
      return "/webapp/views/sample/sample-template.handlebars";
    },

    onInitialize: function () {

    },

    onRender: function () {
      console.log("hello");
      this.replaceUsingTemplate("template-sample", this.$el, {}, { title: "Hello World" });
    }
  });
  return SampleView;
});
