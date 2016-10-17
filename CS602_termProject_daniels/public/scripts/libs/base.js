(function () {
	"use strict";
	define(["backbone", "jquery", "underscore", "handlebars", "util"],
		function (Backbone, $, _, Handlebars, UTIL) {
			var root = window,
				DateFormats = {
					short: "DD MMM - YYYY",
					long: "dddd DD.MM.YYYY HH:mm",
					recent: "ddd DD h:mm:ssa"
				},
				BaseView;

			root.DateFormats = DateFormats;


			function updateQueryString(key, value, url) {
				var keyVal;

				if (key[0] == "/") {
					return key;
				}

				if (!url) {
					url = (root.location.pathname + root.location.search + root.location.hash);
				}

				if (!value && key && key[0] == "?") {
					url = root.location.pathname + key;
					return url;
				}
				if (!value && key && key[0] == "&") {
					key = key.substr(1).split("&");
					for (var x = 0, len = key.length; x < len; x++) {
						keyVal = key[x].split("=");
						url = updateQueryString(keyVal[0], keyVal[1], url);
					}
					return url;
				}

				var re = new RegExp("([?|&])" + key + "=.*?(&|#|$)(.*)", "gi");
				if (re.test(url)) {

					if (typeof value !== 'undefined' && value !== null)
						return url.replace(re, '$1' + key + "=" + value + '$2$3');
					else {
						return url.replace(re, '$1$3').replace(/(&|\?)$/, '');
					}
				}
				else {
					if (typeof value !== 'undefined' && value !== null) {
						var separator = url.indexOf('?') !== -1 ? '&' : '?',
							hash = url.split('#');
						url = hash[0] + separator + key + '=' + value;
						if (hash[1]) url += '#' + hash[1];
						return url;
					}
					else {
						return root.location.pathname.substring(0, root.location.pathname.lastIndexOf("/") + 1) + key;
						//return url;
					}
				}
			}

			// Additional extension layer for Views
			Backbone.View.fullExtend = function (protoProps, staticProps) {
				var k,
					extended = Backbone.View.extend.call(this, protoProps, staticProps); // Call default extend method
				// Add a usable super method for better inheritance
				extended._super = this.prototype;
				// Apply new or different events on top of the original
				if (protoProps.events) {
					for (k in this.prototype.events) {
						if (!extended.prototype.events[k]) {
							extended.prototype.events[k] = this.prototype.events[k];
						}
					}
				}

				if (protoProps.initialize) {
					$.extend(protoProps.initialize, this.prototype.initialize);
				}

				return extended;
			};

			// Additional extension layer for Models
			Backbone.Model.fullExtend = function (protoProps, staticProps) {
				var k,
					extended = Backbone.Model.extend.call(this, protoProps, staticProps); // Call default extend method
				// Add a usable super method for better inheritance
				extended._super = this.prototype;
				// Apply new or different defaults on top of the original
				if (protoProps.defaults) {
					for (k in this.prototype.defaults) {
						if (!extended.prototype.defaults[k]) {
							extended.prototype.defaults[k] = this.prototype.defaults[k];
						}
					}
				}

				return extended;
			};

			Backbone.ILRouter = Backbone.Router.extend({
				_routeToRegExp: function (route) {
					var t,
						regEx;

					if (route[0] === "/") {
						regEx = new RegExp(route.substr(1, route.length - 2));
						return regEx;
					}

					t = Backbone.Router.prototype._routeToRegExp.call(this, "/" + route);

					return t;
				},
				// Execute a route handler with the provided parameters.  This is an
				// excellent place to do pre-route setup or post-route cleanup.
				execute: function (callback, args) {
					if (callback) {
						callback.apply(this, args);
					}
				}
			});

			/**
			 * This makes backward and foward navigation work with query parameters.
			 *
			 * By default, Backbone.js does not trigger router events reliably with forward and backward buttons because
			 * it ignores the query parameters when grabbing fragments. Adding parameters to the query helps some,
			 * but only so much. This solution seems to work cleaner without requiring changing routing syntax.
			 *
			 * I tried what was given in the following:
			 *  http://stackoverflow.com/questions/11671400/navigate-route-with-querystring
			 *
			 * But I believe the problem is more related to this, which has been open a while, possibly because
			 * of complications due to the standard hash routing
			 *  https://github.com/documentcloud/backbone/issues/891
			 *
			 *  these guys writing a framework on top of backbone have the same issue
			 *  https://github.com/chaplinjs/chaplin/issues/577
			 *
			 * I've also seen the following, but wasn't sure if we wanted to go this route, because I think
			 * this requires a more strict syntax? Again, not sure.
			 *  https://github.com/jhudson8/backbone-query-parameters
			 *
			 */
			Backbone.history.getFragment = function (fragment, forcePushState) {
				if (fragment === null || fragment === undefined) {
					if (this._hasPushState || !this._wantsHashChange || forcePushState) {
						fragment = this.location.pathname + window.location.search;
					} else {
						fragment = this.getHash();
					}
				}
				return fragment.replace(Backbone.history.routeStripper, '');
			};

			Backbone.history.navigate = function (fragment, options) {
				if (!Backbone.History.started) {
					return false;
				}
				if (!options || options === true) {
					options = {trigger: options};
				}
				fragment = this.getFragment(fragment || '');
				if (this.fragment === fragment) {
					return false;
				}

				this.fragment = fragment;

				var url;

				// THE CHANGE WE WANT -- backbone by default always added in the root. we're not going to do that when the "fragment" specified has a root at the front already (absolute navigate)
				if (fragment.substring(0, 1) === "/") {
					url = fragment;
				} else {

					// a new problem arises: since backbone wasn't designed to handle full relative pathing, we need to add in some capability to do so
					url = updateQueryString(fragment, null);
				}

				// If pushState is available, we use it to set the fragment as a real URL.
				if (this._hasPushState) {
					this.history[options.replace ? 'replaceState' : 'pushState']({}, document.title, url);

					// If hash changes haven't been explicitly disabled, update the hash
					// fragment to store history.
				} else if (this._wantsHashChange) {
					this._updateHash(this.location, fragment, options.replace);
					if (this.iframe && (fragment !== this.getFragment(this.getHash(this.iframe)))) {
						// Opening and closing the iframe tricks IE7 and earlier to push a
						// history entry on hash-tag change.  When replace is true, we don't
						// want this.
						if (!options.replace) {
							this.iframe.document.open().close();
						}
						this._updateHash(this.iframe.location, fragment, options.replace);
					}

					// If you've told us that you explicitly don't want fallback hashchange-
					// based history, then `navigate` becomes a page refresh.
				} else {
					return this.location.assign(url);
				}
				if (options.trigger) {
					this.loadUrl(fragment);
				}
				return true;
			};

			BaseView = Backbone.View.fullExtend({
				el: $("main"),

				// this property is used for loading external html template and will need to be overwritten on every view
				url: function () {
					return "";
				},

				initialize: function (router) {
					this.router = router;

					if (_.isFunction(this.onInitialize)) {
						this.onInitialize.call(this, router);
					}
				},

				render: function (settings) {

					if (_.isString(settings)) {
						settings = {type: settings};
					}

					if (this.url() !== "") {
						if (!window.templateStore[this.url()]) {
							this.getTemplate(settings);
							return false;
						}
					}

					if (_.isFunction(this.onRender)) {
						this.onRender.call(this, settings);
					}

					this.afterRender()
				},

				getTemplate: function (settings) {
					if (this.url()) {
						$.ajax({
							url: this.url(),
							dataType: "html",
							success: _.bind(function (resp) {
								this.success(resp, settings);
							}, this),
							error: _.bind(function (xhr, status, error) {
								this.error(xhr, status, error, settings);
							}, this)
						});
					}
				},

				success: function (resp, settings) {
					window.templateStore[this.url()] = resp;
					$("body").append(resp);
					this.render(settings);
				},

				error: function (xhr, status, error, settings) {
					if (xhr.status === 200 && xhr.readyState === 4) {
						if (window.templateStore) {
							window.templateStore[this.url()] = xhr.responseText;
							$("body").append(xhr.responseText);
						}
						this.render(settings);
					} else {
						this.replaceUsingTemplate("template-serviceErrorAlert", this.$el);
					}
				},

				compileTemplate: function (templateId) {
					var template = document.getElementById(templateId),
						problemHTML = "<div class=\"alert\"><h4><strong>We're Sorry</strong></h4>" +
							"<p>There was an issue loading the content for this page</p>" +
							"</div>";

					if (template) {
						return Handlebars.compile(document.getElementById(templateId).innerHTML);
					}

					return Handlebars.compile(problemHTML);
				},

				prependUsingTemplate: function (templateId, targetElement, data, options) {
					if (options && (typeof options.title !== "undefined")) {
						document.title = options.title;
					}
					var compiledTemplate = this.compileTemplate(templateId),
						html = compiledTemplate(data),
						$target = $(targetElement);

					if (html && $target.length) {
						$target.prepend(html);
					}
				},

				appendUsingTemplate: function (templateId, targetElement, data, options) {
					if (options && (typeof options.title !== "undefined")) {
						document.title = options.title;
					}
					var compiledTemplate = this.compileTemplate(templateId),
						html = compiledTemplate(data),
						$target = $(targetElement);

					if (html && $target.length) {
						$target.append(html);
					}
				},

				replaceUsingTemplate: function (templateId, targetElement, data, options) {
					if (options && (typeof options.title !== "undefined")) {
						document.title = options.title + " :: LMS";
					}
					var compiledTemplate = this.compileTemplate(templateId);
					var html = compiledTemplate(data);
					var $target = $(targetElement);

					if (html && $target.length) {
						$target.html(html);

						var links = $target[0].querySelectorAll('[data-nw-link]');
						for (var i = 0; i < links.length; i++) {
							links[i].title = "This link will open a new window.";
						}
					}

					if (options && (typeof options.callback === "function")) {
						options.callback();
					}
				},

				// replaces matching elements with the template's HTML
				replaceWithUsingTemplate: function (templateId, targetElement, data, options) {
					if (options && (typeof options.title !== "undefined")) {
						document.title = options.title + " - SKS";
					}
					var compiledTemplate = this.compileTemplate(templateId),
						html = compiledTemplate(data),
						$target = $(targetElement);

					if (html && $target.length) {
						$target.replaceWith(html);
					}

					if (options && (typeof options.callback === "function")) {
						options.callback();
					}
				},

				toggleMenu: function(btn, container, callback) {
					var $menuContainer = $(container);

					// close any open menus
					$(".open").each(function (index, ele) {
						var btn = $(ele).find("button[type=button]")[0];
						this.closeMenu(btn, ele);
					}.bind(this));

					// open selected menu
					btn.setAttribute("aria-expanded", "true");
					$menuContainer.addClass("open");


					// bind html with event to close menus
					$("html").unbind("click").bind("click", function (e) {
						this.closeMenu(btn, container);
						if (typeof callback === "function") {
							callback(container);
						}
					}.bind(this));
				},

				closeMenu: function (btn, ele) {
					btn.setAttribute("aria-expanded", "false");
					$(ele).removeClass("open");
				},

				stopPropagation: function(e) {
					e.stopPropagation();
				},

				afterRender: function () {

				},

				close: function () {
					this.undelegateEvents();
				}

			});

			root.BaseView = BaseView;

			// {{formatDate pubDate "short"}}
			Handlebars.registerHelper("formatDate", function (datetime, format) {
				var f;
				if (moment) {
					f = DateFormats[format];
					return moment(datetime).format(f);
				}
				return datetime;
			});

			Handlebars.registerHelper('select', function (value, options) {
				var $el = $('<select />').html(options.fn(this));
				$el.find('[value="' + value + '"]').attr({'selected': 'selected'});
				return $el.html();
			});

			Handlebars.registerHelper('ifCond', function (v1, operator, v2, options) {
				switch (operator) {
					case '==':
						return (v1 == v2) ? options.fn(this) : options.inverse(this);
					case '===':
						return (v1 === v2) ? options.fn(this) : options.inverse(this);
					case '<':
						return (v1 < v2) ? options.fn(this) : options.inverse(this);
					case '<=':
						return (v1 <= v2) ? options.fn(this) : options.inverse(this);
					case '>':
						return (v1 > v2) ? options.fn(this) : options.inverse(this);
					case '>=':
						return (v1 >= v2) ? options.fn(this) : options.inverse(this);
					case '!=':
						return (v1 != v2) ? options.fn(this) : options.inverse(this);
					default:
						return options.inverse(this);
				}
			});

			$.fn.bindDelay = function (eventType, eventData, handler, timer) {
				if ($.isFunction(eventData)) {
					timer = handler;
					handler = eventData;
				}
				timer = (typeof timer === "number") ? timer : 300;
				var timeouts;
				$(this).bind(eventType, function (event) {
					var that = this;
					clearTimeout(timeouts);
					timeouts = setTimeout(function () {
						handler.call(that, event);
					}, timer);
				});
			};
		});

	if (!window.String.prototype.endsWith) {
		window.String.prototype.endsWith = function(searchString, position) {
			var subjectString = this.toString();
			if (typeof position !== 'number' || !isFinite(position) || Math.floor(position) !== position || position > subjectString.length) {
				position = subjectString.length;
			}
			position -= searchString.length;
			var lastIndex = subjectString.indexOf(searchString, position);
			return lastIndex !== -1 && lastIndex === position;
		};
	}
	if (!window.String.prototype.encodeAsXML) {

		window.String.prototype.encodeAsXML = function () {
			return this.replace(/\&/g, '&amp;')
				.replace(/\>/g, '&gt;')
				.replace(/\</g, '&lt;')
				.replace(/\"/g, '&quot;');
		};
		window.String.prototype.xmlwrap = function (tag, rawMode) {
			if (rawMode) {
				return "<" + tag + ">" + this + "</" + tag + ">";
			}
			return "<" + tag + ">" + this.encodeAsXML() + "</" + tag + ">";
		};
	}
	if (!window.Element.prototype.remove) {
		Element.prototype.remove = function() {
			this.parentElement.removeChild(this);
		}
		NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
			for(var i = this.length - 1; i >= 0; i--) {
				if(this[i] && this[i].parentElement) {
					this[i].parentElement.removeChild(this[i]);
				}
			}
		}
	}

	if (typeof(window.DOMParser) === "undefined") {
		window.DOMParser = function () {
		};

		window.DOMParser.prototype.parseFromString = function (str, contentType) {
			var doc = null;

			if (document.DOMImplementation && document.DOMImplementation.createDocument) {
				doc = document.DOMImplementation.createDocument();
				doc.loadXML(str);
			} else if (typeof(XMLHttpRequest) !== "undefined") {
				doc = new XMLHttpRequest();

				contentType = contentType || "application/xml";
				doc.open("GET", "data:" + contentType + ";charset=utf-8," + encodeURIComponent(str), false);
				if (doc.overrideMimeType) {
					doc.overrideMimeType(contentType);
				}
				doc.send(null);
				doc = doc.responseXML;
			}
			return doc;
		};
	}

}.bind(this)());
