# jQuery之extend函数源码分析

## 函数源码
```
jQuery.extend = jQuery.fn.extend = function () {
			// i指示开始合并的对象在arguments中的位置
			var options, name, src, copy, copyIsArray, clone,
				target = arguments[0] || {},
				i = 1,
				length = arguments.length,
				deep = false;

			// Handle a deep copy situation
			if (typeof target === "boolean") {
				deep = target;
				target = arguments[1] || {};
				// skip the boolean and the target
				i = 2;
			}

			// Handle case when target is a string or something (possible in deep copy)
			if (typeof target !== "object" && !jQuery.isFunction(target)) {
				target = {};
			}

			// extend jQuery itself if only one argument is passed
			// 此处--i表示target没有传递，使用jQuery来代替
			// 同时，i指示要开始合并的第一个元素开始位置
			if (length === i) {
				target = this;
				--i;
			}

			for (; i < length; i++) {
				// Only deal with non-null/undefined values
				if ((options = arguments[i]) != null) {
					// Extend the base object
					for (name in options) {
						src = target[name];
						copy = options[name];

						// Prevent never-ending loop
						// ???
						if (target === copy) {
							continue;
						}

						// Recurse if we're merging plain objects or arrays
						// 只有纯对象，或者数组才会递归拷贝
						// 纯对象不包括DOM对象和window对象，以及继承而来的对象
						if (deep && copy && (jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)))) {
							// copy是数组,[1,2,3,...]
							if (copyIsArray) {
								copyIsArray = false;
								// 如果src不是数组，则clone为[]
								clone = src && jQuery.isArray(src) ? src : [];

							} else {
								// 如果copy不是数组，则是一个纯对象{}
								// 如果src不是一个纯对象，则clone为一个空对象
								clone = src && jQuery.isPlainObject(src) ? src : {};
							}

							// Never move original objects, clone them
							target[name] = jQuery.extend(deep, clone, copy);

							// Don't bring in undefined values
						} else if (copy !== undefined) {
							target[name] = copy;
						}
					}
				}
			}

			// Return the modified object
			return target;
		};
```

### extend中流程分析

### extend中所使用到的函数分析

## jQuery中extend函数应用实例
```
jQuery.extend({
			noConflict: function (deep) {
				if (window.$ === jQuery) {
					window.$ = _$;
				}

				if (deep && window.jQuery === jQuery) {
					window.jQuery = _jQuery;
				}

				return jQuery;
			},

			// Is the DOM ready to be used? Set to true once it occurs.
			isReady: false,

			// A counter to track how many items to wait for before
			// the ready event fires. See #6781
			readyWait: 1,

			// Hold (or release) the ready event
			holdReady: function (hold) {
				if (hold) {
					jQuery.readyWait++;
				} else {
					jQuery.ready(true);
				}
			},

			// Handle when the DOM is ready
			ready: function (wait) {
				// Either a released hold or an DOMready/load event and not yet ready
				if ((wait === true && !--jQuery.readyWait) || (wait !== true && !jQuery.isReady)) {
					// Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
					if (!document.body) {
						return setTimeout(jQuery.ready, 1);
					}

					// Remember that the DOM is ready
					jQuery.isReady = true;

					// If a normal DOM Ready event fired, decrement, and wait if need be
					if (wait !== true && --jQuery.readyWait > 0) {
						return;
					}

					// If there are functions bound, to execute
					readyList.fireWith(document, [jQuery]);

					// Trigger any bound ready events
					if (jQuery.fn.trigger) {
						jQuery(document).trigger("ready").off("ready");
					}
				}
			},

			bindReady: function () {
				if (readyList) {
					return;
				}

				readyList = jQuery.Callbacks("once memory");

				// Catch cases where $(document).ready() is called after the
				// browser event has already occurred.
				if (document.readyState === "complete") {
					// Handle it asynchronously to allow scripts the opportunity to delay ready
					return setTimeout(jQuery.ready, 1);
				}

				// Mozilla, Opera and webkit nightlies currently support this event
				if (document.addEventListener) {
					// Use the handy event callback
					document.addEventListener("DOMContentLoaded", DOMContentLoaded, false);

					// A fallback to window.onload, that will always work
					window.addEventListener("load", jQuery.ready, false);

					// If IE event model is used
				} else if (document.attachEvent) {
					// ensure firing before onload,
					// maybe late but safe also for iframes
					document.attachEvent("onreadystatechange", DOMContentLoaded);

					// A fallback to window.onload, that will always work
					window.attachEvent("onload", jQuery.ready);

					// If IE and not a frame
					// continually check to see if the document is ready
					var toplevel = false;

					try {
						toplevel = window.frameElement == null;
					} catch (e) {}

					if (document.documentElement.doScroll && toplevel) {
						doScrollCheck();
					}
				}
			},

			// See test/unit/core.js for details concerning isFunction.
			// Since version 1.3, DOM methods and functions like alert
			// aren't supported. They return false on IE (#2968).
			isFunction: function (obj) {
				return jQuery.type(obj) === "function";
			},

			isArray: Array.isArray || function (obj) {
				return jQuery.type(obj) === "array";
			},

			// A crude way of determining if an object is a window
			// window对象中有setInterval属性
			isWindow: function (obj) {
				return obj && typeof obj === "object" && "setInterval" in obj;
			},

			isNumeric: function (obj) {
				return !isNaN(parseFloat(obj)) && isFinite(obj);
			},

			type: function (obj) {
				return obj == null ?
					String(obj) :
					class2type[toString.call(obj)] || "object";
			},

			isPlainObject: function (obj) {
				// Must be an Object.
				// Because of IE, we also have to check the presence of the constructor property.
				// Make sure that DOM nodes and window objects don't pass through, as well
				// 所有的属性都是自己的，从hasOwnProperty函数中可以看出
				// 不能是DOM对象或者window对象
				// 针对IE进行专门适配
				if (!obj || jQuery.type(obj) !== "object" || obj.nodeType || jQuery.isWindow(obj)) {
					return false;
				}

				try {
					// Not own constructor property must be Object
					// 没有自己的构造函数属性的一定是对象
					if (obj.constructor &&
						!hasOwn.call(obj, "constructor") &&
						!hasOwn.call(obj.constructor.prototype, "isPrototypeOf")) {
						return false;
					}
				} catch (e) {
					// IE8,9 Will throw exceptions on certain host objects #9897
					return false;
				}

				// Own properties are enumerated firstly, so to speed up,
				// if last one is own, then all properties are own.

				var key;
				for (key in obj) {}

				return key === undefined || hasOwn.call(obj, key);
			},

			isEmptyObject: function (obj) {
				for (var name in obj) {
					return false;
				}
				return true;
			},

			error: function (msg) {
				throw new Error(msg);
			},

			parseJSON: function (data) {
				if (typeof data !== "string" || !data) {
					return null;
				}

				// Make sure leading/trailing whitespace is removed (IE can't handle it)
				data = jQuery.trim(data);

				// Attempt to parse using the native JSON parser first
				if (window.JSON && window.JSON.parse) {
					return window.JSON.parse(data);
				}

				// Make sure the incoming data is actual JSON
				// Logic borrowed from http://json.org/json2.js
				if (rvalidchars.test(data.replace(rvalidescape, "@")
						.replace(rvalidtokens, "]")
						.replace(rvalidbraces, ""))) {

					return (new Function("return " + data))();

				}
				jQuery.error("Invalid JSON: " + data);
			},

			// Cross-browser xml parsing
			parseXML: function (data) {
				var xml, tmp;
				try {
					if (window.DOMParser) { // Standard
						tmp = new DOMParser();
						xml = tmp.parseFromString(data, "text/xml");
					} else { // IE
						xml = new ActiveXObject("Microsoft.XMLDOM");
						xml.async = "false";
						xml.loadXML(data);
					}
				} catch (e) {
					xml = undefined;
				}
				if (!xml || !xml.documentElement || xml.getElementsByTagName("parsererror").length) {
					jQuery.error("Invalid XML: " + data);
				}
				return xml;
			},

			noop: function () {},

			// Evaluates a script in a global context
			// Workarounds based on findings by Jim Driscoll
			// http://weblogs.java.net/blog/driscoll/archive/2009/09/08/eval-javascript-global-context
			globalEval: function (data) {
				if (data && rnotwhite.test(data)) {
					// We use execScript on Internet Explorer
					// We use an anonymous function so that context is window
					// rather than jQuery in Firefox
					(window.execScript || function (data) {
						window["eval"].call(window, data);
					})(data);
				}
			},

			// Convert dashed to camelCase; used by the css and data modules
			// Microsoft forgot to hump their vendor prefix (#9572)
			camelCase: function (string) {
				return string.replace(rmsPrefix, "ms-").replace(rdashAlpha, fcamelCase);
			},

			nodeName: function (elem, name) {
				return elem.nodeName && elem.nodeName.toUpperCase() === name.toUpperCase();
			},

			// args is for internal usage only
			each: function (object, callback, args) {
				var name, i = 0,
					length = object.length,
					isObj = length === undefined || jQuery.isFunction(object);

				if (args) {
					if (isObj) {
						for (name in object) {
							if (callback.apply(object[name], args) === false) {
								break;
							}
						}
					} else {
						for (; i < length;) {
							if (callback.apply(object[i++], args) === false) {
								break;
							}
						}
					}

					// A special, fast, case for the most common use of each
				} else {
					if (isObj) {
						for (name in object) {
							if (callback.call(object[name], name, object[name]) === false) {
								break;
							}
						}
					} else {
						for (; i < length;) {
							if (callback.call(object[i], i, object[i++]) === false) {
								break;
							}
						}
					}
				}

				return object;
			},

			// Use native String.trim function wherever possible
			trim: trim ?
				function (text) {
					return text == null ?
						"" :
						trim.call(text);
				} :

				// Otherwise use our own trimming functionality
				function (text) {
					return text == null ?
						"" :
						text.toString().replace(trimLeft, "").replace(trimRight, "");
				},

			// results is for internal usage only
			makeArray: function (array, results) {
				var ret = results || [];

				if (array != null) {
					// The window, strings (and functions) also have 'length'
					// Tweaked logic slightly to handle Blackberry 4.7 RegExp issues #6930
					var type = jQuery.type(array);

					if (array.length == null || type === "string" || type === "function" || type === "regexp" || jQuery.isWindow(array)) {
						push.call(ret, array);
					} else {
						jQuery.merge(ret, array);
					}
				}

				return ret;
			},

			inArray: function (elem, array, i) {
				var len;

				if (array) {
					if (indexOf) {
						return indexOf.call(array, elem, i);
					}

					len = array.length;
					i = i ? i < 0 ? Math.max(0, len + i) : i : 0;

					for (; i < len; i++) {
						// Skip accessing in sparse arrays
						if (i in array && array[i] === elem) {
							return i;
						}
					}
				}

				return -1;
			},

			merge: function (first, second) {
				var i = first.length,
					j = 0;

				if (typeof second.length === "number") {
					for (var l = second.length; j < l; j++) {
						first[i++] = second[j];
					}

				} else {
					while (second[j] !== undefined) {
						first[i++] = second[j++];
					}
				}

				first.length = i;

				return first;
			},

			grep: function (elems, callback, inv) {
				var ret = [],
					retVal;
				inv = !!inv;

				// Go through the array, only saving the items
				// that pass the validator function
				for (var i = 0, length = elems.length; i < length; i++) {
					retVal = !!callback(elems[i], i);
					if (inv !== retVal) {
						ret.push(elems[i]);
					}
				}

				return ret;
			},

			// arg is for internal usage only
			map: function (elems, callback, arg) {
				var value, key, ret = [],
					i = 0,
					length = elems.length,
					// jquery objects are treated as arrays
					isArray = elems instanceof jQuery || length !== undefined && typeof length === "number" && ((length > 0 && elems[0] && elems[length - 1]) || length === 0 || jQuery.isArray(elems));

				// Go through the array, translating each of the items to their
				if (isArray) {
					for (; i < length; i++) {
						value = callback(elems[i], i, arg);

						if (value != null) {
							ret[ret.length] = value;
						}
					}

					// Go through every key on the object,
				} else {
					for (key in elems) {
						value = callback(elems[key], key, arg);

						if (value != null) {
							ret[ret.length] = value;
						}
					}
				}

				// Flatten any nested arrays
				return ret.concat.apply([], ret);
			},

			// A global GUID counter for objects
			guid: 1,

			// Bind a function to a context, optionally partially applying any
			// arguments.
			proxy: function (fn, context) {
				if (typeof context === "string") {
					var tmp = fn[context];
					context = fn;
					fn = tmp;
				}

				// Quick check to determine if target is callable, in the spec
				// this throws a TypeError, but we will just return undefined.
				if (!jQuery.isFunction(fn)) {
					return undefined;
				}

				// Simulated bind
				var args = slice.call(arguments, 2),
					proxy = function () {
						return fn.apply(context, args.concat(slice.call(arguments)));
					};

				// Set the guid of unique handler to the same of original handler, so it can be removed
				proxy.guid = fn.guid = fn.guid || proxy.guid || jQuery.guid++;

				return proxy;
			},

			// Mutifunctional method to get and set values to a collection
			// The value/s can optionally be executed if it's a function
			access: function (elems, key, value, exec, fn, pass) {
				var length = elems.length;

				// Setting many attributes
				if (typeof key === "object") {
					for (var k in key) {
						jQuery.access(elems, k, key[k], exec, fn, value);
					}
					return elems;
				}

				// Setting one attribute
				if (value !== undefined) {
					// Optionally, function values get executed if exec is true
					exec = !pass && exec && jQuery.isFunction(value);

					for (var i = 0; i < length; i++) {
						fn(elems[i], key, exec ? value.call(elems[i], i, fn(elems[i], key)) : value, pass);
					}

					return elems;
				}

				// Getting an attribute
				return length ? fn(elems[0], key) : undefined;
			},

			now: function () {
				return (new Date()).getTime();
			},

			// Use of jQuery.browser is frowned upon.
			// More details: http://docs.jquery.com/Utilities/jQuery.browser
			uaMatch: function (ua) {
				ua = ua.toLowerCase();

				var match = rwebkit.exec(ua) ||
					ropera.exec(ua) ||
					rmsie.exec(ua) ||
					ua.indexOf("compatible") < 0 && rmozilla.exec(ua) || [];

				return {
					browser: match[1] || "",
					version: match[2] || "0"
				};
			},

			sub: function () {
				function jQuerySub(selector, context) {
					return new jQuerySub.fn.init(selector, context);
				}
				jQuery.extend(true, jQuerySub, this);
				jQuerySub.superclass = this;
				jQuerySub.fn = jQuerySub.prototype = this();
				jQuerySub.fn.constructor = jQuerySub;
				jQuerySub.sub = this.sub;
				jQuerySub.fn.init = function init(selector, context) {
					if (context && context instanceof jQuery && !(context instanceof jQuerySub)) {
						context = jQuerySub(context);
					}

					return jQuery.fn.init.call(this, selector, context, rootjQuerySub);
				};
				jQuerySub.fn.init.prototype = jQuerySub.fn;
				var rootjQuerySub = jQuerySub(document);
				return jQuerySub;
			},

			browser: {}
		});
```