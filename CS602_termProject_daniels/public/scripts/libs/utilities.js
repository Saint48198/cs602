define(["jquery", "underscore"], function ($, _, UAParser) {
    "use strict";
    var UTIL = {};

    UTIL.guid = function () {
        var s4 = function () {
            return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
        };
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    };

    UTIL.namespace = function (ns_string) {
        var parts = ns_string.split("."),
            parent = UTIL,
            i;

        // strip redundant leading global
        if (parts[0] === "UTIL") {
            parts = parts.slice(1);
        }

        for (i = 0; i < parts.length; i += 1) {
            // create a property if it doesn't exist
            if (typeof parent[parts[i]] === "undefined") {
                parent[parts[i]] = {};
            }

            parent = parent[parts[i]];
        }

        return parent;
    };

    UTIL.getPathAsObj = function (val) {
        var t = Backbone.history.fragment.split("/"),
            r = {},
            x;

        for (x = t.length; x >= 0; x = x - 2) {
            r[t[x]] = t[x + 1];
        }

        return r;
    };

    UTIL.asArray = function (val) {
        if (typeof val === 'undefined') {
            return [];
        }
        if (val.length) {
            return val;
        }

        return [val];
    };

    /**
     * I've always been slightly amazed that JavaScript does not have built in query parsing.
     *
     * This turns query parameters into an object off of QueryString, ala:
     *
     * QueryString.my_thing
     *
     * Also handles turning things multiples into an array. Nice.
     */

    UTIL.QueryString = function (value) {
        var query_string = {},
            query = value,
            vars,
            pair;

        if (!query) {
            query = history.pushState ? location.search.substring(1) : UTIL.returnLocationPathName(location).split("?")[1];
        }

        vars = query ? query.split("&") : "";

        for (var i = 0; i < vars.length; i++) {
            pair = vars[i].split("=");
            pair[1] = decodeURIComponent(pair[1]);
            if (typeof query_string[pair[0]] === "undefined") { // If first entry with this name
                query_string[pair[0]] = pair[1];
            } else if (typeof query_string[pair[0]] === "string") { // If second entry with this name
                var arr = [query_string[pair[0]], pair[1]];
                query_string[pair[0]] = arr;
            } else { // If third or later entry with this name
                query_string[pair[0]].push(pair[1]);
            }
        }

        return query_string;
    };

    UTIL.updateQueryString = function (key, value, url) {
        var keyVal;

        if (key[0] === "/") {
            return key;
        }

        if (!url) {
            url = (location.pathname + location.search + location.hash);
        }

        if (!value && key && key[0] == "?") {
            url = location.pathname + key;
            return url;
        }
        if (!value && key && key[0] == "&") {
            key = key.substr(1).split("&");
            for (var x = 0, len = key.length; x < len; x++) {
                keyVal = key[x].split("=");
                url = this.updateQueryString(keyVal[0], keyVal[1], url);
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
                return location.pathname.substring(0, location.pathname.lastIndexOf("/") + 1) + key;
                //return url;
            }
        }
    };

    UTIL.preventDefault = function (e) {
        e.preventDefault();
    };

    UTIL.safeJSONParse = function (str) {
        try {
            return JSON.parse(str);
        } catch (e) {
            return null;
            
        }
    };

    /**
     * Gives back a JSON object from s linty JSON string value *safely*
     */
    UTIL.parseLintyJSON = function (str) {
        return str ? UTIL.safeJSONParse("{" + str + "}") : {};
    };

    UTIL.navTo = function (location, doTrigger) {
        doTrigger = _.isUndefined(doTrigger) ? true : doTrigger;

        var url = UTIL.updateQueryString(location, null),
            isCurrentPage = Backbone.history.navigate(url, { trigger: doTrigger });

        $(window).scrollTop(0);
        return isCurrentPage;
    };

    UTIL.nav = function (el, e) {
        e.preventDefault();
        e.stopPropagation();

        var navResult = UTIL.navTo(el.getAttribute("href"));

        if (!navResult) { // Backbone didn't actually navigate anywhere. This was a dupe event. (most likely) -- Bail out!
            return;
        }
    };

    UTIL.navHandler = function (e) {
        UTIL.nav(e.currentTarget, e);
    };

    UTIL.openNewWindow = function (e) {
        var target = e.target;

        if (target.tagName.toLowerCase() !== "a") {
            target = target.parentNode;
            if (target.tagName.toLowerCase() !== "a") {
                target = target.parentNode;
            }
        }

        e.preventDefault();
        window.open(target.href);

        UTIL.logEvent({ event: "ext_page_view", url: target.href });
    };

    UTIL.fetchXhr = [];

    UTIL.collectionRequest = function (collection, settings) {

        var callSettings = _.isObject(settings) ? settings : {},
            xhr;

        xhr = collection.fetch(callSettings);

        UTIL.fetchXhr.push(xhr);

        return xhr;
    };

    UTIL.sessionCheck = function (xhr) {
        if (xhr.status == 502) {
            sessionStorage.clear();
            this.window.location.reload();
            return false;
        }
    };

    // used for ie8 and the URL
    UTIL.returnLocationPathName = function (value) {
        var location = value.pathname;

        if (!history.pushState) {
            location = value.hash.substr(1);
        }

        return location;
    };

    UTIL.scrollToTop = function (container) {
        var $currentContainer = container || $("html, body");

        $currentContainer.animate({
            scrollTop: 0
        });
    };

    UTIL.getModuleInfoFromUrl = function (location) {
        var learningModuleInfo = location.split("/"),
            data = {};

        data.moduleId = parseFloat(learningModuleInfo[3]);
        data.objectiveId = parseFloat(learningModuleInfo[5]);
        data.featureId = parseFloat(learningModuleInfo[7]);

        return data;
    };

    UTIL.isJsonString = function (str) {
        try {
            var o = $.parseJSON(str);

            // Handle non-exception-throwing cases:
            // Neither JSON.parse(false) or JSON.parse(1234) throw errors, hence the type-checking,
            // but... JSON.parse(null) returns 'null', and typeof null === "object",
            // so we must check for that, too.
            if (o && typeof o === "object" && o !== null) {
                return o;
            }
        } catch (e) {
            return false;
        }
        return true;
    };

    UTIL.isEmail = function (email) {
        // this validation is based off RFC822 specification for email addresses
        return /^([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22))*\x40([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d))*$/.test(email);
    };

    UTIL.setStorage = function (data, type) {
        try {
            if (typeof(Storage) !== "undefined") {
                for (var key in data) {
                    if (data.hasOwnProperty(key)) {
                        if (type == "local") {
                            localStorage[key] = data[key];
                        } else {
                            sessionStorage[key] = data[key];
                        }
                    }
                }
            }
        } catch (err) {
            UTIL.logEvent({error: {data: err, type: "JS"}, event: "error"});
        }
    };

    UTIL.isStorageSupported = function () {
        var testKey = 'test',
            storage = window.sessionStorage;

        try {
            storage.setItem(testKey, "1");
            storage.removeItem(testKey);
            return true;
        } catch (error) {
            return false;
        }
    };

    UTIL.removeStorage = function (data, type) {
        if (typeof data === "string") {
            data = [data];
        }

        try {
            if (typeof(Storage) !== "undefined") {
                for (var i = 0, total = data.length; i < total; i++) {
                    if (type == "local") {
                        localStorage.removeItem(data[i]);
                    } else {
                        sessionStorage.removeItem(data[i]);
                    }
                }
            }
        } catch (err) {
            UTIL.logEvent({error: {data: err, type: "JS"}, event: "error"});
        }
    };

    UTIL.getStorage = function (name, type) {
        var storageValue = "";

        try {
            if (typeof(Storage) !== "undefined") {
                if (type == "local") {
                    storageValue = localStorage[name];
                } else {
                    storageValue = sessionStorage[name];
                }
            }
        } catch (err) {
            UTIL.logEvent({error: {data: err, type: "JS"}, event: "error"});
        }

        return storageValue;
    };

    UTIL.recurringTimer = function (callback, delay) {
        var timerId, start, remaining = delay;

        this.pause = function () {
            clearTimeout(timerId);
            remaining -= new Date() - start;
        };

        this.stop = function () {
            clearTimeout(timerId);
        };

        var resume = function () {
            start = new Date();
            timerId = setTimeout(function () {
                remaining = delay;
                resume();
                callback();
            }, remaining);
        };

        this.resume = resume;

        this.resume();
    };

    UTIL.areCookiesEnabled = function () {
        // navigator.cookieEnabled returns true in FF even if third party cookies are disabled which is an issue for the
        // embedded video page due to the fact that it lives on other sites
        var cookieEnabled = navigator.cookieEnabled ? true : false;

        UTIL.setCookie("testcookie", "test");
        cookieEnabled = UTIL.getCookie("testcookie") ? true : false;

        if (cookieEnabled) {
            UTIL.clearCookie("testcookie");
        }

        return cookieEnabled;
    };

    UTIL.setCookie = function (cname, cvalue, expireDays) {
        var d = new Date(),
            expires,
            safeName = encodeURIComponent(cname),
            safeValue = encodeURIComponent(cvalue),
            sCookie = safeName + "=" + safeValue + "; path=/";
            

        if (expireDays) {
            d.setTime(d.getTime() + (expireDays * 24 * 60 * 60 * 1000));
            expires = "; expires=" + d.toUTCString();
            sCookie = sCookie + ";" + expires;
        }

        document.cookie = sCookie;
    };

    UTIL.getCookie = function (cname) {
        cname = cname.toLowerCase();

        var theCookies = document.cookie.split(";"),
            cData,
            cKey,
            cValue;

        for (var i = 0; i < theCookies.length; i++) {
            cData = theCookies[i].split("=");
            cKey = decodeURIComponent(cData[0].trim().toLowerCase());
            cValue = cData.length > 1 ? cData[1] : "";

            if (cKey == cname) {
                return decodeURIComponent(cValue);
            }
        }
        return "";
    };

    UTIL.checkCookieExist = function (cName) {
        return (document.cookie.indexOf(cName) >= 0) ? true : false;
    };

    UTIL.clearCookie = function (cname) {
        UTIL.setCookie(cname, "");
    };

    UTIL.generateGUID = function (len) {
        var max = len || 9;
        // Math.random should be unique because of its seeding algorithm.
        // Convert it to base 36 (numbers + letters), and grab the first 9 characters by default
        // or use len passed to the func after the decimal.
        return "rc" + Math.random().toString(36).substr(2, max);
    };

    UTIL.shuffle = function (array) {
        var currentIndex = array.length,
            temporaryValue,
            randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    };

    UTIL.convert2Boolean = function (value) {
        var test,
            boolean = false;

        if (_.isBoolean(value)) {
            return value;
        }

        test = _.isString(value) ? value.toLowerCase() : "";

        switch (test) {
            case "true":
                boolean = true;
                break;
            default:
                boolean = false;
                break;
        }

        return boolean;
    };

    UTIL.supports_video = function () {
        return !!document.createElement('video').canPlayType;
    };

    UTIL.isJsonString = function (str) {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    };

    UTIL.resizeTextarea = function ($ele) {
        return $ele[0].style.height = "" + $ele[0].scrollHeight + "px";
    };

    UTIL.isValidUrl = function (string) {
        // url regex from https://gist.github.com/dperini/729294
        var p = new RegExp(
            "^" +
                // protocol identifier
            "(?:(?:https?|ftp)://)" +
                // user:pass authentication
            "(?:\\S+(?::\\S*)?@)?" +
            "(?:" +
                // IP address exclusion
                // private & local networks
            "(?!(?:10|127)(?:\\.\\d{1,3}){3})" +
            "(?!(?:169\\.254|192\\.168)(?:\\.\\d{1,3}){2})" +
            "(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})" +
                // IP address dotted notation octets
                // excludes loopback network 0.0.0.0
                // excludes reserved space >= 224.0.0.0
                // excludes network & broacast addresses
                // (first & last IP address of each class)
            "(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])" +
            "(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}" +
            "(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))" +
            "|" +
                // host name
            "(?:(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)" +
                // domain name
            "(?:\\.(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)*" +
                // TLD identifier
            "(?:\\.(?:[a-z\\u00a1-\\uffff]{2,}))" +
            ")" +
                // port number
            "(?::\\d{2,5})?" +
                // resource path
            "(?:/\\S*)?" +
            "$", "i"
        );


        if (p.test(string)) {
            return true;
        }

        return false;
    };

    UTIL.crossDomainAjax = function (url, callback) {
        var xhr;

        // IE8 & 9 only Cross domain JSON GET request
        if ("XDomainRequest" in window && window.XDomainRequest !== null) {
            xhr = new XDomainRequest(); // Use Microsoft XDR
            xhr.open("get", url);
            xhr.onload = function () {
                var dom = new ActiveXObject("Microsoft.XMLDOM"),
                    JSON = $.parseJSON(xdr.responseText);

                dom.async = false;
                if (JSON === null || typeof JSON === "undefined") {
                    JSON = $.parseJSON(data.firstChild.textContent);
                }
                callback(JSON);
            };
            xhr.onerror = function () {
                var result = false;
                return result;
            };
            xhr.send();
        } else {
            xhr = $.ajax({
                url: url,
                dataType: "jsonp",
                success: function (resp) {
                    if (_.isFunction(callback)) {
                        callback(resp);
                    }
                },
                error: function (xhr, status, error) {
                    if (_.isFunction(callback)) {
                        callback({xhr: xhr, status: status, error: error});
                    }
                }
            });
        }

        return xhr;
    };

    UTIL.hasClass =  function (el, className) {
        if (el.classList) {
            return el.classList.contains(className);
        } else {
            return !!el.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'));
        }
    };

    UTIL.addClass = function (el, className) {
        if (el.classList) {
            el.classList.add(className);
        } else if (!hasClass(el, className)) {
            el.className += " " + className;
        }
    };

    UTIL.removeClass =  function (el, className) {
        if (el.classList) {
            el.classList.remove(className);
        } else if (hasClass(el, className)) {
            var reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
            el.className=el.className.replace(reg, ' ');
        }
    };

    UTIL.isMacintosh = function () {
        return navigator.platform.indexOf('Mac') > -1
    };

    UTIL.isWindows = function () {
        return navigator.platform.indexOf('Win') > -1
    };

    // http://stackoverflow.com/questions/1634748/how-can-i-delete-a-query-string-parameter-in-javascript
    UTIL.removeURLParameter = function (url, parameter) {
        //prefer to use l.search if you have a location/link object
        var urlparts= url.split('?');
        if (urlparts.length>=2) {

            var prefix= encodeURIComponent(parameter) + '=';
            var pars= urlparts[1].split(/[&;]/g);

            //reverse iteration as may be destructive
            for (var i= pars.length; i-- > 0;) {
                //idiom for string.startsWith
                if (pars[i].lastIndexOf(prefix, 0) !== -1) {
                    pars.splice(i, 1);
                }
            }

            url= urlparts[0] + '?' + pars.join('&');
            return url;
        } else {
            return url;
        }
    };

    UTIL.returnRelativeUrl = function (url) {
        return url.replace(window.location.protocol + "//" + window.location.host, "");
    };

    UTIL.numberWithCommas = function (x) {
        var parts = x.toString().split(".");
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return parts.join(".");
    };

    UTIL.removeHash = function () {
        history.pushState("", document.title, window.location.pathname
            + window.location.search);
    };
    
    UTIL.hasProduct = function(products, code) {
        return products.indexOf(code) !== -1;
    };

    // function is used to check whether site is accessed via proxy for allowing the loading of google services
    UTIL.supportedDomain = function() {
        var domains = ["sirs.com", "localhost"];
        var isSupported = false;
        var currentDoamin = location.hostname;

        for(var i = 0, total = domains.length; i < total; i++) {
            if (currentDoamin.endsWith(domains[i])) {
                isSupported = true;
                break;
            }
        }

        return isSupported;
    };

    return UTIL;
});
