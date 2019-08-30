/*!
 * jQuery JavaScript Library v1.7.1
 * http://jquery.com/
 *
 * Copyright 2011, John Resig
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 * Copyright 2011, The Dojo Foundation
 * Released under the MIT, BSD, and GPL Licenses.
 *
 * Date: Mon Nov 21 21:11:03 2011 -0500
 */
(function (window, undefined) {

	// Use the correct document accordingly with window argument (sandbox)
	var document = window.document,
		navigator = window.navigator,
		location = window.location;
	var jQuery = (function () {

		// Define a local copy of jQuery
		var jQuery = function (selector, context) {
				// The jQuery object is actually just the init constructor 'enhanced'
				return new jQuery.fn.init(selector, context, rootjQuery);
			},

			// 备份传入的window中的jQuery和$属性
			// 其实是利用了闭包原理
			// Map over jQuery in case of overwrite
			_jQuery = window.jQuery,

			// Map over the $ in case of overwrite
			_$ = window.$,

			// A central reference to the root jQuery(document)
			rootjQuery,

			// A simple way to check for HTML strings or ID strings
			// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
			quickExpr = /^(?:[^#<]*(<[\w\W]+>)[^>]*$|#([\w\-]*)$)/,

			// Check if a string has a non-whitespace character in it
			rnotwhite = /\S/,

			// Used for trimming whitespace
			trimLeft = /^\s+/,
			trimRight = /\s+$/,

			// Match a standalone tag
			rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>)?$/,

			// JSON RegExp
			rvalidchars = /^[\],:{}\s]*$/,
			rvalidescape = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,
			rvalidtokens = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
			rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g,

			// Useragent RegExp
			rwebkit = /(webkit)[ \/]([\w.]+)/,
			ropera = /(opera)(?:.*version)?[ \/]([\w.]+)/,
			rmsie = /(msie) ([\w.]+)/,
			rmozilla = /(mozilla)(?:.*? rv:([\w.]+))?/,

			// Matches dashed string for camelizing
			rdashAlpha = /-([a-z]|[0-9])/ig,
			rmsPrefix = /^-ms-/,

			// Used by jQuery.camelCase as callback to replace()
			fcamelCase = function (all, letter) {
				return (letter + "").toUpperCase();
			},

			// Keep a UserAgent string for use with jQuery.browser
			userAgent = navigator.userAgent,

			// For matching the engine and version of the browser
			browserMatch,

			// The deferred used on DOM ready
			readyList,

			// The ready event handler
			DOMContentLoaded,

			// Save a reference to some core methods
			toString = Object.prototype.toString,
			hasOwn = Object.prototype.hasOwnProperty,
			// push方法不仅可以作用对于数组，也可以作用于对象
			// var a = {0:'a',1:'b',2:'c', length:3};
			// Array.prototype.push.apply(a, ["hello"]); 
			// {0: "a", 1: "b", 2: "c", 3: "hello", length: 4}
			push = Array.prototype.push,
			slice = Array.prototype.slice,
			trim = String.prototype.trim,
			indexOf = Array.prototype.indexOf,

			// [[Class]] -> type pairs
			class2type = {};

		jQuery.fn = jQuery.prototype = {
			constructor: jQuery,
			init: function (selector, context, rootjQuery) {
				var match, elem, ret, doc;

				// Handle $(""), $(null), or $(undefined)
				// 1. 返回一个空的jQuery对象
				// 没有设置length,context等属性
				if (!selector) {
					return this;
				}

				// Handle $(DOMElement)
				// 2. 封装DOM元素为jQuery对象
				// 如果有nodeType属性，则表示该对象是DOMElement对象
				if (selector.nodeType) {
					this.context = this[0] = selector;
					this.length = 1;
					return this;
				}

				// The body element only exists once, optimize finding it
				// 对$("body")的优化
				if (selector === "body" && !context && document.body) {
					this.context = document;
					this[0] = document.body;
					this.selector = selector;
					this.length = 1;
					return this;
				}

				// Handle HTML strings
				// 3. 字符串创建jQuery对象
				if (typeof selector === "string") {
					// Are we dealing with HTML string or an ID?
					// 当selector为HTML代码，则match为数组，且match[1]为selector
					if (selector.charAt(0) === "<" && selector.charAt(selector.length - 1) === ">" && selector.length >= 3) {
						// Assume that strings that start and end with <> are HTML and skip the regex check
						match = [null, selector, null];

					} else {
						// 正则表达式返回值是一个数组
						match = quickExpr.exec(selector);
					}

					// Verify a match, and that no context was specified for #id
					// 没有出传入上下文:match != null, (match[1] != null 或者 context==null)
					if (match && (match[1] || !context)) {

						// HANDLE: $(html) -> $(array)
						// 5. 根据HTML代码创建jQuery对象，match[1]存在的时候，表示传入的是一个HTML字符串
						if (match[1]) {
							context = context instanceof jQuery ? context[0] : context;
							// ownerDocument：DOM属性，用来查找该context所属的document
							// 如果没有传入context，则doc = document
							doc = (context ? context.ownerDocument || context : document);

							// If a single string is passed in and it's a single tag
							// just do a createElement and skip the rest
							ret = rsingleTag.exec(selector);

							if (ret) {
								if (jQuery.isPlainObject(context)) {
									selector = [document.createElement(ret[1])];
									jQuery.fn.attr.call(selector, context, true);

								} else {
									selector = [doc.createElement(ret[1])];
								}

							} else {
								ret = jQuery.buildFragment([match[1]], [doc]);
								selector = (ret.cacheable ? jQuery.clone(ret.fragment) : ret.fragment).childNodes;
							}

							return jQuery.merge(this, selector);

							// HANDLE: $("#id")
						} else {
							elem = document.getElementById(match[2]);

							// Check parentNode to catch when Blackberry 4.6 returns
							// nodes that are no longer in the document #6963
							if (elem && elem.parentNode) {
								// Handle the case where IE and Opera return items
								// by name instead of ID
								if (elem.id !== match[2]) {
									return rootjQuery.find(selector);
								}

								// Otherwise, we inject the element directly into the jQuery object
								this.length = 1;
								this[0] = elem;
							}

							this.context = document;
							this.selector = selector;
							return this;
						}

						// HANDLE: $(expr, $(...))
					} else if (!context || context.jquery) {
						return (context || rootjQuery).find(selector);

						// HANDLE: $(expr, context)
						// (which is just equivalent to: $(context).find(expr)
					} else {
						return this.constructor(context).find(selector);
					}

					// HANDLE: $(function)
					// Shortcut for document ready
				} else if (jQuery.isFunction(selector)) {
					// 4. 绑定ready事件监听函数，当DOM结构加载完成时执行
					return rootjQuery.ready(selector);
				}

				if (selector.selector !== undefined) {
					this.selector = selector.selector;
					this.context = selector.context;
				}

				return jQuery.makeArray(selector, this);
			},

			// Start with an empty selector
			// 主要用于调试
			selector: "",

			// The current version of jQuery being used
			// 依附于实例才能获取到该变量
			jquery: "1.7.1",

			// The default length of a jQuery object is 0
			length: 0,

			// The number of elements contained in the matched element set
			size: function () {
				return this.length;
			},

			// 将当前jQuery对象转换为真正的数组
			// Array.prototype.slice函数start->end浅拷贝
			toArray: function () {
				return slice.call(this, 0);
			},

			// Get the Nth element in the matched element set OR
			// Get the whole matched element set as a clean array
			// 支持负数下标
			get: function (num) {
				return num == null ?

					// Return a 'clean' array
					this.toArray() :

					// Return just the object
					(num < 0 ? this[this.length + num] : this[num]);
			},

			// Take an array of elements and push it onto the stack
			// (returning the new matched element set)
			// pushStack其实并没有将什么东西添加到stack中，只是产生一空的jQuery对象，
			// 然后将elems添加到这个空的jQuery对象上
			// 核心方法！！！
			pushStack: function (elems, name, selector) {
				// Build a new jQuery matched element set
				// 相当于$()产生一个空的jQuery对象
				var ret = this.constructor();

				// 此处的push方法就是，js提供的原生数组方法
				// 如果elems是数组就使用数组的push方法
				if (jQuery.isArray(elems)) {
					push.apply(ret, elems);

				} else {
					// 如果elems是对象，就是用merge方法，将elems属性添加到空的jQuery对象上
					jQuery.merge(ret, elems);
				}

				// Add the old object onto the stack (as a reference)
				// 可能stack的含义是指这里吧
				ret.prevObject = this;

				// jQuery对象存在的上下文
				// 注意此处的上下文不是父节点位置，而是document
				// ret为空jQuery对象，ret.context为undefined
				ret.context = this.context;

				if (name === "find") {
					//this.selector不为空时，添加一个空格
					// 在this.selector下查找selector,修正selector
					ret.selector = this.selector + (this.selector ? " " : "") + selector;
				} else if (name) {
					ret.selector = this.selector + "." + name + "(" + selector + ")";
				}

				// Return the newly-formed element set
				return ret;
			},

			// Execute a callback for every element in the matched set.
			// (You can seed the arguments with an array of args, but this is
			// only used internally.)
			// 感觉each和map很相似，但是each不调用pushStack,没有返回值
			each: function (callback, args) {
				return jQuery.each(this, callback, args);
			},

			// ready事件的触发要早于load事件，load事件用于监听文档是否加载完毕，在页面中所有元素（如图像）加载完成后被触发
			// 在大多数情况下，只要DOM结构加载完成，脚本就可以尽快运行了，因此，通常最好把绑定事件和其他的jQuery代码都放到ready事件监听函数中
			// 在IE9+和其他浏览器中绑定DOMContentLoaded事件，在IE9以下的浏览器绑定onreadystatechange事件
			// 这两个事件都会在load事件之前被触发
			// 在IE9以下版本的浏览器中，还有一种技巧是，不同地执行document.documentElement.doScroll("left"),知道不抛出异常为止
			// 重点：由于回调函数实现方法：$(document).on("ready", handler)有以下区别
			// ready事件已经被触发后，再次尝试用方法.on("ready")绑定的ready事件监听函数将不会被执行，而用方法.ready(handler)
			// 绑定的ready事件监听函数则会被执行，无论它是什么时候绑定的，之所以出现这种差异，是因为.ready()是基于回调函数列表实现的，而方法
			// .on("ready")是基于数据缓存实现的	
			// 每一个jQuery对象都有这么一个方法			
			ready: function (fn) {
				// Attach the listeners
				jQuery.bindReady();

				// Add the callback
				readyList.add(fn);

				return this;
			},

			eq: function (i) {
				// 转换成数字--返回值为数字或者Nan
				i = +i;
				// slice(-1) 获取最后一个元素
				// slice(i, i+1) 获取第i个元素
				return i === -1 ?
					this.slice(i) :
					this.slice(i, i + 1);
			},

			first: function () {
				return this.eq(0);
			},

			last: function () {
				return this.eq(-1);
			},

			// 重新定义slice函数，pushStack返回jQuery对象
			// Array.prototype.slice.apply(this, arguments);
			// var a = {0:'a',1:'b',2:'c', length:3};
			// Array.prototype.slice.apply(a); // ['a', 'b', 'c'] 注意此处apply用法，借鸡下蛋方式
			// arguments.slice().join(",");// var b = [1,2,3]; b.slice().join(",");//"1,2,3"
			// name = "slice", selector="slice.call(arguments").join(',');
			// 将匹配元素集合缩减为指定范围的子集,传入参数一般为(start[, end]);
			// 返回值是一个jQuery对象
			slice: function () {
				return this.pushStack(slice.apply(this, arguments),
					"slice", slice.call(arguments).join(","));
			},

			// map作用后，返回的任然是一个jQuery对象
			// $app.map(fc) instanceof jQuery // true
			map: function (callback) {
				// jQuery.map,获取callback执行结果
				return this.pushStack(jQuery.map(this, function (elem, i) {
					return callback.call(elem, i, elem);
				}));
			},

			// 返回上一层jQuery对象，或者返回一个空的jQuery对象
			end: function () {
				return this.prevObject || this.constructor(null);
			},

			// For internal use only.
			// Behaves like an Array's method, not like a jQuery method.
			push: push,
			sort: [].sort,
			// 向当前jQuery对象中插入、删除或替换元素
			splice: [].splice
		};

		// Give the init function the jQuery prototype for later instantiation
		// jQuery中原型对象上init函数的额原型指向jQuery的原型
		// 也就是说jQuery原型链上不会再有其他原型了？？
		// $.prototype.init.prototype === $.prototype // true
		jQuery.fn.init.prototype = jQuery.fn;

		// 参数([deep], target, object1[, objectN])
		// jQuery上扩展的核心方法
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
			// 基本类型上设置非原生属性是无效的--typeof [] => object,也就是说数组也是对象的一种
			// 对象，数组以及函数都可以直接设置属性
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

			// 合并多个对象到target对象上
			for (; i < length; i++) {
				// Only deal with non-null/undefined values
				if ((options = arguments[i]) != null) {
					// Extend the base object
					for (name in options) {
						src = target[name];
						copy = options[name];

						// Prevent never-ending loop
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

		// jQuery扩展的静态属性和方法
		// 通过extend拓展的方法只能出现在该对象上
		// 通过在prototype[原型上添加方法]可以被其他对象共享
		// window.$就是一个jQuery对象，该对象被添加到window.$属性上，全局共享
		// 通过$()产生的对象，不会共享$上的属性和方法，但是会共享prototype上的属性和方法
		// 通过$.prototype.test = function(){console.log("test");}; $().test();// test
		jQuery.extend({
			noConflict: function (deep) {
				// window下属性赋值
				// 释放掉$,使window.$保留原来的引用
				// 但是没有保留window.jQuery的引用
				if (window.$ === jQuery) {
					window.$ = _$;
				}

				// 保留window.jQuery的引用
				if (deep && window.jQuery === jQuery) {
					window.jQuery = _jQuery;
				}

				return jQuery;
			},

			// Is the DOM ready to be used? Set to true once it occurs.
			// 全局ready状态标记，ready事件触发时设置为true
			isReady: false,

			// A counter to track how many items to wait for before
			// the ready event fires. See #6781
			// 全局ready事件等待计数器，记录在ready事件触发前等待的次数
			readyWait: 1,

			// Hold (or release) the ready event
			// 用于延迟或恢复ready事件的触发，这个高级特性通常用在ready事件触发之前
			// 由动态脚本加载其他JavaScript脚本（如jQuery插件）
			/**
			 * 要延迟ready事件，首先要执行jQuery.holdReady(true),当ready事件可以恢复执行了，
			 * 再执行jQuery.holdReady(false),可以多次执行jQuery.holdReady(true)来多次延迟ready事件，但是需要执行相同次数的jQuery.holdReady(false)
			 * 来恢复ready事件
			 */
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
				// jQuery.readyWait延迟执行ready函数标志
				// jQuery.isReady指示if语句块中的内容只被执行一次
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

			// 负责初始化ready事件监听函数列表readyList,并未document对象绑定ready事件主监听函数DOMContentLoaded事件
			// 在IE9+和其他浏览器中，该方法把监听函数DOMContentLoaded绑定到DOMContentLoaded事件上，
			// 在IE9以下的浏览器中，则绑定到onreadystatechange事件上
			bindReady: function () {
				// readyList不是undefined，表示方法jQuery.bindReady已经被调用过，不需要再次执行后面的代码
				if (readyList) {
					return;
				}

				readyList = jQuery.Callbacks("once memory");

				// Catch cases where $(document).ready() is called after the
				// browser event has already occurred.
				// 已经是ready状态了，通过setTimeout异步调用ready函数
				/**
				 * 有四种可能值：
				 * 1. uninitialized 尚未开始加载
				 * 2. loading 正在加载
				 * 3. interactive 已经加了必需内容，此时用户可以操作
				 * 4. complete： 全部加载完成
				 * 当document.readyState的值改变时，会触发一个readystatechange事件
				 */
				if (document.readyState === "complete") {
					// Handle it asynchronously to allow scripts the opportunity to delay ready
					return setTimeout(jQuery.ready, 1);
				}

				// Mozilla, Opera and webkit nightlies currently support this event
				if (document.addEventListener) {
					// Use the handy event callback
					// DOMContentLoaded是自定义函数-document.removeEventListener("DOMContentLoaded", DOMContentLoaded, false);
					// 然后调用ready函数
					document.addEventListener("DOMContentLoaded", DOMContentLoaded, false);

					// A fallback to window.onload, that will always work
					// 一段防御性代码，保证ready方法总是会被执行
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

					// IE中，通过该方法来检测是否可以触发ready事件
					// 每隔1ms模拟点击滚动条，直到不再抛出异常时，调用方法jQuery.ready(wait)执行ready事件监听函数
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
			// window对象中有setInterval属性,window中特征属性setInterval
			// 也可以检测window.window属性，来判断是否是window对象
			isWindow: function (obj) {
				return obj && typeof obj === "object" && "setInterval" in obj;
			},

			isNumeric: function (obj) {
				// isFinite 判断无穷大情况
				return !isNaN(parseFloat(obj)) && isFinite(obj);
			},

			// 如果参数是Javascript内部对象，则返回对应的字符串名称，其他情况一律返回""Object"
			type: function (obj) {
				return obj == null ?
					String(obj) :
					class2type[toString.call(obj)] || "object";
			},

			// 是否是用对象直接量{}或new Object()创建的对象
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
					// 1. 对象含有constructor属性，由构造函数创建的对象都有一个constructor属性，默认引用了该对象的构造函数
					// 如果对象没有constructor,则说明该对象必然是通过对象字面量{}创建的
					// 2. constructor是非继承属性，默认情况下，属性constructor继承自构造函数的原型对象
					// 如果属性constructor是非继承属性，说明该属性已经在自定义构造函数中被覆盖
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

			// 没有任何属性【包括继承属性】的就是空对象
			isEmptyObject: function (obj) {
				for (var name in obj) {
					return false;
				}
				return true;
			},

			error: function (msg) {
				// 调用JavaScript原生Error方法
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
				// var jsonData = "{\"a\":\"1\"}";
				// (new Function("return" + jsonData))();// {a: "1"}
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
				// 在IE以外的浏览器中，如果解析失败，parseFromString不会抛出异常，会返回一个包含了错误信息的文档对象
				if (!xml || !xml.documentElement || xml.getElementsByTagName("parsererror").length) {
					jQuery.error("Invalid XML: " + data);
				}
				return xml;
			},

			// 空函数，什么也不做
			noop: function () {},

			// Evaluates a script in a global context
			// Workarounds based on findings by Jim Driscoll
			// http://weblogs.java.net/blog/driscoll/archive/2009/09/08/eval-javascript-global-context
			// 用于在全局作用于中执行JavaScript代码
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
			// 转换连字符式为驼峰式
			camelCase: function (string) {
				return string.replace(rmsPrefix, "ms-").replace(rdashAlpha, fcamelCase);
			},

			nodeName: function (elem, name) {
				return elem.nodeName && elem.nodeName.toUpperCase() === name.toUpperCase();
			},

			// args is for internal usage only
			// object,回调函数callback的作用对象，args为传入回调函数的参数
			// 对于object上的每个元素调用callback回调函数
			each: function (object, callback, args) {
				// 对象也有可能有length属性
				// {0: 'a', 1:'b', ..., length: 2}
				var name, i = 0,
					length = object.length,
					isObj = length === undefined || jQuery.isFunction(object);

				// 此处应该对args的类型进行判断，如果args不是数组或者对象，apply函数会报错
				if (args) {
					if (isObj) {
						for (name in object) {
							// 回调函数callback返回false，终止继续调用该回调函数
							// [a, b, c, ...] 当callback.apply(b, args) 返回false时，就不会继续调用c了
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
					// 如果没有传入参数，则会把【属性名/下标, 当前值】传入回调函数
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
				// ret不一定是真正的数组
				var ret = results || [];

				if (array != null) {
					// The window, strings (and functions) also have 'length'
					// Tweaked logic slightly to handle Blackberry 4.7 RegExp issues #6930
					var type = jQuery.type(array);

					// 参数array是window对象，属性length返回窗口中的框架(frame, iframe)个数[不是body或者其他标签的长度]
					if (array.length == null || type === "string" || type === "function" || type === "regexp" || jQuery.isWindow(array)) {
						// 由于ret不一定是真正的数组，所以需要在此处使用借鸡下蛋的方法
						push.call(ret, array);
					} else {
						// 将array上1,2,3,...属性合并到ret上
						jQuery.merge(ret, array);
					}
				}

				return ret;
			},

			// 测试数组array中从下标i开始，是否有elem元素
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
						// 跳过稀疏数组
						if (i in array && array[i] === elem) {
							return i;
						}
					}
				}

				return -1;
			},

			// 将second上0,1,2,3,...【连续整型属性的对象】属性添加到first上
			// 并不是全部的属性
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

			// inv--invert反转，表示不一致才放入结果中
			// inv为true表示callback结果需要为false才放入结果中
			// inv为false表示callback结果需要为true才放入结果中
			grep: function (elems, callback, inv) {
				var ret = [],
					retVal;
				inv = !!inv;

				// Go through the array, only saving the items
				// that pass the validator function
				// 遍历数组，只存储通过callback回调函数的元素
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
					// 所谓的类数组：包含使用从零开始，且自然递增的整数做键名，并且定义了length表示元素个数的对象
					// instanceof运算符用来检测constructor.prototype是否存在于参数object的原型链上
					// var a = {}; function f(){}; a.__proto__ = f.prototype; a instanceof f;//true 
					isArray = elems instanceof jQuery || length !== undefined && typeof length === "number" && ((length > 0 && elems[0] && elems[length - 1]) || length === 0 || jQuery.isArray(elems));

				// Go through the array, translating each of the items to their
				// map函数是对每个元素进行作用，所以需要变量elems，对每个elems[i]应用callback
				if (isArray) {
					for (; i < length; i++) {
						value = callback(elems[i], i, arg);

						if (value != null) {
							// 赋值之后，ret.length会自动增加
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
				// [1,2,['a','b']] ==> [1,2,'a','b']
				// concat 只能拉平一层：[1,2,['a','b',['1','2']]] ==> [1,2,'a','b',['1','2']]
				return ret.concat.apply([], ret);
			},

			// A global GUID counter for objects
			// 全局计数器，用于jQuery事件模块和缓存模块，在jQuery事件模块中，
			// 每个事件监听函数会被设置一个guid属性，用来唯一标识这个函数；
			// 在缓存模块中，通过在DOM元素上附加一个唯一标识，来关联该元素和该元素对应的缓存
			guid: 1,

			// Bind a function to a context, optionally partially applying any
			// arguments.
			// 接受一个函数返回一个新函数，新函数总是持有特定的上下文
			// 类似于bind,apply,call
			// 有两种用法：
			// 1.jQuery.proxy(fn, context) 指定fn的上下文始终为参数context
			// 2.jQuery.proxy(context, name) 参数name是context的属性，指定参数name对应的函数上下文文始终未参数context
			proxy: function (fn, context) {
				// 这里判断的就是第二种情况
				if (typeof context === "string") {
					// fn表示context，context表示fn中的一个属性
					var tmp = fn[context];
					context = fn;
					// fn = fn[context]
					fn = tmp;
				}

				// Quick check to determine if target is callable, in the spec
				// this throws a TypeError, but we will just return undefined.
				// 处理过后的fn必须是是一个函数，对函数做处理
				if (!jQuery.isFunction(fn)) {
					return undefined;
				}

				// Simulated bind
				// 将参数组合一下
				var args = slice.call(arguments, 2),
					proxy = function () {
						// 这里的arguments是调用proxy函数的参数
						return fn.apply(context, args.concat(slice.call(arguments)));
					};

				// 为代理函数设置与原始函数相同的唯一标识guid，如果原始函数没有，则重新分配一个
				// 相同的唯一标识将代理函数和原始函数关联了起来，在jQuery事件系统中，如果为DOM元素绑定了事件监听函数的代理函数
				// 当移除事件时，即使传入的是原始函数，jQuery也能通过唯一标识guid移除正确的函数
				// Set the guid of unique handler to the same of original handler, so it can be removed
				proxy.guid = fn.guid = fn.guid || proxy.guid || jQuery.guid++;

				return proxy;
			},

			// Mutifunctional method to get and set values to a collection
			// The value/s can optionally be executed if it's a function
			// 为集合elems中元素设置一个或多个属性值，或者读取第一个元素的属性值
			// 为.attr(), .prop(), .css提供支持
			// elems元素集合，通常是jQuery对象
			// key: 属性名或含有键值对的对象
			// value: 属性值或函数，当参数key是对象时，该参数为undefined
			// exec: 布尔值，当属性值是函数时，该参数指示了是否执行函数
			// 参数fn: 回调函数，同时支持读取和设置属性
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
					// value是函数的情况下
					// Optionally, function values get executed if exec is true
					exec = !pass && exec && jQuery.isFunction(value);

					// 当exec为true时，获取value的返回值作为属性值
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

			// 浏览器嗅探：chrome和safari使用webkit作为内核引擎
			// Use of jQuery.browser is frowned upon.
			// More details: http://docs.jquery.com/Utilities/jQuery.browser
			uaMatch: function (ua) {
				ua = ua.toLowerCase();

				// 判断浏览器类型
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

		// Populate the class2type map
		jQuery.each("Boolean Number String Function Array Date RegExp Object".split(" "), function (i, name) {
			class2type["[object " + name + "]"] = name.toLowerCase();
		});

		browserMatch = jQuery.uaMatch(userAgent);
		if (browserMatch.browser) {
			jQuery.browser[browserMatch.browser] = true;
			jQuery.browser.version = browserMatch.version;
		}

		// Deprecated, use jQuery.browser.webkit instead
		if (jQuery.browser.webkit) {
			jQuery.browser.safari = true;
		}

		// IE doesn't match non-breaking spaces with \s
		if (rnotwhite.test("\xA0")) {
			trimLeft = /^[\s\xA0]+/;
			trimRight = /[\s\xA0]+$/;
		}

		// All jQuery objects should point back to these
		rootjQuery = jQuery(document);

		// Cleanup functions for the document ready method
		if (document.addEventListener) {
			DOMContentLoaded = function () {
				document.removeEventListener("DOMContentLoaded", DOMContentLoaded, false);
				jQuery.ready();
			};

		} else if (document.attachEvent) {
			DOMContentLoaded = function () {
				// Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
				if (document.readyState === "complete") {
					document.detachEvent("onreadystatechange", DOMContentLoaded);
					jQuery.ready();
				}
			};
		}

		// The DOM ready check for Internet Explorer
		function doScrollCheck() {
			if (jQuery.isReady) {
				return;
			}

			try {
				// If IE is used, use the trick by Diego Perini
				// http://javascript.nwbox.com/IEContentLoaded/
				document.documentElement.doScroll("left");
			} catch (e) {
				setTimeout(doScrollCheck, 1);
				return;
			}

			// and execute any waiting functions
			jQuery.ready();
		}

		return jQuery;

	})();


	// String to Object flags format cache
	var flagsCache = {};

	// Convert String-formatted flags into Object-formatted ones and store in cache
	// once memory unique stopOnFalse 标志处理
	function createFlags(flags) {
		var object = flagsCache[flags] = {},
			i, length;
		flags = flags.split(/\s+/);
		for (i = 0, length = flags.length; i < length; i++) {
			object[flags[i]] = true;
		}
		return object;
	}

	/* 用来管理回调函数的一组方法的集合，通过fire在合适时机触发回调函数
	 * 通过add来添加相关的回调函数集合
	 * Create a callback list using the following parameters:
	 *
	 *	flags:	an optional list of space-separated flags that will change how
	 *			the callback list behaves
	 *
	 * By default a callback list will act like an event callback list and can be
	 * "fired" multiple times.
	 *
	 * Possible flags:
	 *  确保回调函数列表只能被触发一次--执行一次之后，即使再改变回调函数列表也不会再次执行回调函数列表
	 *  也就是说调用第一次调用fire会执行回调函数列表，之后再调用fire不会执行回调函数列表
	 *	once:			will ensure the callback list can only be fired once (like a Deferred)
	 *  记录上一次触发【回调函数列表】时的参数，之后添加的任何回调函数都将用记录的参数值立即调用
	 *  其实是第二次add的时候会使用上次的参数立即执行加入的函数
	 *	memory:			will keep track of previous values and will call any callback added
	 *					after the list has been fired right away with the latest "memorized"
	 *					values (like a Deferred)
	 *  确保一个回调函数只能被添加一次
	 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
	 *  当某个回调函数返回false时中断执行
	 *	stopOnFalse:	interrupt callings when a callback returns false
	 *  组合使用情况：
	 *  1. once memory: 第一次调用fire时执行回调函数列表，以后再add回调函数时，不会再从头调用回调函数列表
	 *     而是会直接调用add进的函数
	 *
	 */
	// 返回一个链式工具对象，用于管理一组回调函数，支持添加、移除、触发、锁定和禁用回调函数
	// flags用以改变回调函数列表的行为，不传flags则回调函数列表的行为类似于事件监听函数，能够被触发多次；
	// 如果传入flags则如上面注释所述
	jQuery.Callbacks = function (flags) {

		// Convert flags from String-formatted to Object-formatted
		// (we check in cache first)
		// 先从缓存中查找是否已经解析过，如果没有解析过则进行参数解析
		flags = flags ? (flagsCache[flags] || createFlags(flags)) : {};

		var // Actual callback list
		    // 存储回调函数列表
			list = [],
			// Stack of fire calls for repeatable lists
			// 在可重复触发、正在执行的列表上，重复触发，将上下文和参数放入数组
			stack = [],
			// Last fire value (for non-forgettable lists)
			// undefined 表示当前回调函数列表未被触发过
			// 如果当前回调函数列表不是memory模式，则变量memory被赋值为true,间接表示当前回调函数列表已经被触发过
			// 如果当前回调函数列表时memory模式，则变量memory被赋值为[context, args],其中存放了传入的上下文context
			// 和参数args, 间接表示当前回调函数列表已经被触发过
			memory,
			// Flag to know if list is currently firing
			firing,
			// First callback to fire (used internally by add and fireWith)
			firingStart,
			// End of the loop when firing
			firingLength,
			// Index of currently firing callback (modified by remove if needed)
			firingIndex,
			// Add one or several callbacks to the list
			add = function (args) {
				var i,
					length,
					elem,
					type,
					actual;
				for (i = 0, length = args.length; i < length; i++) {
					elem = args[i];
					type = jQuery.type(elem);
					if (type === "array") {
						// 如果参数为数组则递归处理
						// Inspect recursively
						add(elem);
					} else if (type === "function") {
						// 保证添加的是函数: unique标志处理
						// Add if not in unique mode and callback is not in
						if (!flags.unique || !self.has(elem)) {
							list.push(elem);
						}
					}
				}
			},
			// Fire callbacks
			fire = function (context, args) {
				args = args || [];
				memory = !flags.memory || [context, args];
				firing = true;
				firingIndex = firingStart || 0;
				firingStart = 0;
				firingLength = list.length;
				for (; list && firingIndex < firingLength; firingIndex++) {
					if (list[firingIndex].apply(context, args) === false && flags.stopOnFalse) {
						// 此处标记memory为true, 表示遇到stopOnFlase了
						memory = true; // Mark as halted
						break;
					}
				}
				firing = false;
				if (list) {
					if (!flags.once) {
						if (stack && stack.length) {
							// Array.prototype.shift 从数组中删除第一个元素，并返回该元素的值，并且改变数组的长度
							// 感觉主要是应对memory模式，因为memory模式会在添加回调函数后触发fire
							memory = stack.shift();
							// 由于memory的设置，此处只是将上下文变量和参数放入stack中，并不会再次触发该函数
							self.fireWith(memory[0], memory[1]);
						}
					} else if (memory === true) {
						// stopOnFalse了，不再执行回调函数列表
						self.disable();
					} else {
						list = [];
					}
				}
			},
			// Actual Callbacks object
			// 闭包的形式返回开发的接口
			self = {
				// Add a callback or a collection of callbacks to the list
				add: function () {
					if (list) {
						var length = list.length;
						add(arguments);
						// Do we need to add the callbacks to the
						// current firing batch?
						// 回调函数列表正在执行，则修正结束下标，使得新添加的回调函数也能够执行
						if (firing) {
							firingLength = list.length;
							// With memory, if we're not firing then
							// we should call right away, unless previous
							// firing was halted (stopOnFalse)
						} else if (memory && memory !== true) {
							// 修正待执行的回调函数列表的首地址--从上次末尾开始
							// 也就是执行新添加的函数
							firingStart = length;
							fire(memory[0], memory[1]);
						}
					}
					return this;
				},
				// Remove a callback from the list
				remove: function () {
					if (list) {
						var args = arguments,
							argIndex = 0,
							argLength = args.length;
						for (; argIndex < argLength; argIndex++) {
							for (var i = 0; i < list.length; i++) {
								if (args[argIndex] === list[i]) {
									// Handle firingIndex and firingLength
									// 如果回调函数列表正在执行，要修正结束下标
									if (firing) {
										if (i <= firingLength) {
											firingLength--;
											// 同时修正正在执行的回调函数的下标，避免漏掉执行某个回调函数
											if (i <= firingIndex) {
												firingIndex--;
											}
										}
									}
									// Remove the element
									list.splice(i--, 1);
									// If we have some unicity property then
									// we only need to do this once
									if (flags.unique) {
										break;
									}
								}
							}
						}
					}
					return this;
				},
				// Control if a given callback is in the list
				has: function (fn) {
					if (list) {
						var i = 0,
							length = list.length;
						for (; i < length; i++) {
							// 通过引用的对象判断相等
							if (fn === list[i]) {
								return true;
							}
						}
					}
					return false;
				},
				// Remove all callbacks from the list
				empty: function () {
					list = [];
					return this;
				},
				// Have the list do nothing anymore
				disable: function () {
					list = stack = memory = undefined;
					return this;
				},
				// Is it disabled?
				disabled: function () {
					return !list;
				},
				// Lock the list in its current state
				lock: function () {
					stack = undefined;
					if (!memory || memory === true) {
						self.disable();
					}
					return this;
				},
				// Is it locked?
				locked: function () {
					return !stack;
				},
				// Call all callbacks with the given context and arguments
				// 使用指定的上下文和参数触发回调函数列表中的所有回调函数
				fireWith: function (context, args) {
					// !![] ==> true 但是 [] == false也是输出true,感觉很奇怪
					if (stack) {
						if (firing) {
							if (!flags.once) {
								stack.push([context, args]);
							}
						} else if (!(flags.once && memory)) {
							fire(context, args);
						}
					}
					return this;
				},
				// Call all the callbacks with the given arguments
				fire: function () {
					self.fireWith(this, arguments);
					return this;
				},
				// To know if the callbacks have already been called at least once
				fired: function () {
					return !!memory;
				}
			};

		return self;
	};




	var // Static reference to slice
		sliceDeferred = [].slice;

	jQuery.extend({

		/*
		* 该方法返回一个链式工具对象，支持添加多个回调函数到回调函数列表、触发回调函数列表、
		* 传播任意同步或异步任务的成功或失败状态等功能，返回的链式工具对象称为“异步队列”
		*/
		/**
		 * $.Deferred()返回的对象和$.Deferred().promise(),返回对象是不同的
		 * promise返回的对象上没有resolve这类可以改变deferred对象的状态的方法
		 * 不能改变执行状态
		 * 
		 * deferred触发resolve或reject
		 * promise中申明resolve或reject后应该做什么
		 */
		Deferred: function (func) {
			var doneList = jQuery.Callbacks("once memory"),
				failList = jQuery.Callbacks("once memory"),
				progressList = jQuery.Callbacks("memory"),
				state = "pending",
				lists = {
					resolve: doneList,//成功回调函数列表
					reject: failList,//失败回调函数列表
					notify: progressList//消息回调函数列表
				},
				// 构造的返回对象，对回调函数列表进行的封装
				promise = {
					done: doneList.add, // 添加成功回调函数
					fail: failList.add, // 添加失败回调函数
					progress: progressList.add, // 添加消息回调函数

					// 返回异步队列的状态
					state: function () {
						return state;
					},

					// Deprecated
					isResolved: doneList.fired,
					isRejected: failList.fired,

					// 同时添加成功，失败以及消息回调函数
					then: function (doneCallbacks, failCallbacks, progressCallbacks) {
						deferred.done(doneCallbacks).fail(failCallbacks).progress(progressCallbacks);
						return this;
					},
					// 用于将回调函数同时添加到成功回调函数列表doneList和失败回调函数列表failList
					// 通过always添加的回调函数最终都会得到调用，不管最终状态是成功还是失败
					always: function () {
						deferred.done.apply(deferred, arguments).fail.apply(deferred, arguments);
						return this;
					},
					// 将fnDone, fnFail, fnProgress添加对应的Callbacks中
					// 接受三个可选的过滤函数作为参数，用于过滤当前异步队列的状态和参数
					// 并返回一个新的异步队列的只读副本，当前异步队列被触发时，过滤函数将被调用并把返回值传给只读副本
					/**
					 * $.ajax("your/url", {
							dataType: "json"
						}).pipe(function(theOriginalData) {
							return $.ajax("your/web/service/doSomethingWith", {
								data: theOriginalData,
								dataType: "json"
							});
						}).done(function(theFinalData) {
							$.each(theFinalData, function(key, value) {
								$("#" + key).val(value);
							});
						});
					 */
					pipe: function (fnDone, fnFail, fnProgress) {
						// 旧异步队列deferred, 新异步队列newDefer,并且作为函数参数传入
						// 为jQuery对象中Deferred方法中传入一个参数func = function (newDefer){};
						// 根据代码逻辑，在Deferred方法返回之前，会调用func.call(deferred, deferred)==>func(deferred)
						// 也就是说调用function(deferred){} ==> newDefer表示deferred对象
						// 传入函数的deferred并不是jQuery的deferred,调用jQuery.Deferred时，会创建一个新的deferred对象
						// pipe函数return的异步队列就是newDefer[不是这样的]；因为后面又调用了promise函数--返回的是newDefer中的promise对象
						// demo
						/**
						 * var defer = $.Deferred();
						 * var filtered = defer.pip(function(value){
						 * 		return value * 2;
						 * });
						 * 进入调试环节，var old_promise = newDefer.promise();
						 * old_promise === filtered // true
						 */
						return jQuery.Deferred(function (newDefer) {
							/* 对于对象
							{
								done: [fnDone, "resolve"],
								fail: [fnFail, "reject"],
								progress: [fnProgress, "notify"]
							}
							中，每个属性都调用下面的回调函数
							callback.apply(object[name], name, object[name])==>
							callback.apply([fnDone, "resolve"], done, [fnDone, "resolve"])==>callback(done, [fnDone, "resolve"])
							*/
							jQuery.each({
								done: [fnDone, "resolve"],
								fail: [fnFail, "reject"],
								progress: [fnProgress, "notify"]
							}, function (handler, data) {
								var fn = data[0], // fnDone等的回调函数，传入fnDone函数
									action = data[1], // 回调函数的名称 resolve等
									returned;
								if (jQuery.isFunction(fn)) {
									// deferred[done] ==> doneList.add; 将函数添加到doneList这个callbacks对象中
									// 此处的deferred为闭包机制中的deferred,也就是下面注释的*deferred*
									// 实践中：
									/*
									* var defer = $.Deferred();
									* filtered = defer.pipe(function( value ) {
									*		return value * 2;
									*	});
									* 调试pipe可以测试：deferred === defer; // true
									*/
									// deferred["done"] = doneList.add; 完成回调函数列表添加回调函数
									// deferred["done"]列表中添加能够触发newDefer fire的函数
									deferred[handler](function () {
										// 由于func.call(deferred, deferred)方式调用，因此this表示newDefer对象
										// 这里的arguments就是调用deferred.resolve或者其他触发函数时传入的参数
										// this === deferred
										returned = fn.apply(this, arguments);
										if (returned && jQuery.isFunction(returned.promise)) {
											// 在传入函数返回异步队列的情况下，将newDefer的相关触发函数（fire）加入到对应的回调函数列表中
											// 这样当returned的对应回调函数列表触发后，就会触发newDefer对应的fire
											/** 应用于这样的链式调用
											 * var request = $.ajax( url, { dataType: "json" } ),
												chained = request.pipe(function( data ) {
													return $.ajax( url2, { data: { user: data.userId } } );
												});
												
												chained.done(function( data ) {
												// data retrieved from url2 as provided by the first request
												});
											 */
											// 将newDefer.resolve加入到return.promise的成功回调函数中，当returned执行成功后，将会
											// 执行newDefer的resolve函数，改变newDefer的状态，通过pipe函数返回的promise对象可以使用
											// promise的添加回调函数的方法，来判断newDefer的执行状态，从而执行某些操作
											returned.promise().then(newDefer.resolve, newDefer.reject, newDefer.notify);
										} else {
											// 如果返回值不是异步队列或不支持异步队列功能，newDefer中的相应状态的回调函数被执行，参数为过滤函数的返回值
											// 根据传入参数func.call(...,...)的调用方法，这里面的this一般为传入参数newDefer，并不是闭包机制中的deferred
											// 因为通过jQuery.Deferred()函数调用，该函数又进入一个新的变量区域，其中的deferred与jQuery.Deferred()被调用时所在
											// 区域的deferred已经不一样了，而是一个新的promise对象
											// 设置回调函数列表执行的上下文为当前的newDefer
											// 直接触发newDefer的fireWith
											// 通过闭包机制引用传入参数newDefer
											// filter的作用，将传入函数的返回结果，通过fireWith方法传入回调函数列表中
											newDefer[action + "With"](this === deferred ? newDefer : this, [returned]);
										}
									});
								} else {
									deferred[handler](newDefer[action]);
								}
							});
						}).promise();
					},
					// Get a promise for this deferred
					// If obj is provided, the promise aspect is added to the object
					// 在原来的deferred对象上返回另一个deferred对象，后者只开放与改变执行状态
					// 无关的方法（比如done和fail方法），屏蔽与改变执行状态有关的方法（比如resolve和reject方法）
					// 从而使执行状态不能被改变
					/**
					 * 传入对象（包括函数）在该对象上加上promise的相关方法
					 * 而且是通过闭包的原理引用doneList这些回调函数列表
					 * demo
					 * var dtd = $.Deferred();
					 * var wait = function(){}
					 * dtd.promise(wait);
					 * wait.done(function(){ alert("哈哈，成功了！"); }).fail(function(){ alert("出错啦！"); });
					 * dtd.resolve(); // 执行："哈哈，成功了！"
					 */
					promise: function (obj) {
						if (obj == null) {
							// 此处的promise是，闭包机制中定义的promise
							obj = promise;
						} else {
							for (var key in promise) {
								obj[key] = promise[key];
							}
						}
						return obj;
					}
				},
				// 定义异步队列
				// deferred为promise对象的副本，其中再次调用deferred.promise
				// 可以再次返回promise对象的副本
				// 或者为一个普通的JavaScript对象添加promise中的方法
				// 这里就是为空对象{}添加promise对象中的方法
				// 只读副本中只暴露了添加回调函数和判断状态的方法：done, fail, progress, then, always,
				// state, pipe， 不包含触发执行和改变状态的方法：resolve, reject, notify, resolveWith
				// rejectWith, notifyWith
				// *deferred*
				deferred = promise.promise({}),
				key;

			// deferred["resolve"] ==> doneList.fire 绑定对应函数
			// 为异步队列添加触发成功、失败、消息回调函数列表的方法
			// 通过调用deferred.resolve触发doneList执行，以此类似
			for (key in lists) {
				deferred[key] = lists[key].fire; // doneList.fire(args); 调用异步回调函数列表
				deferred[key + "With"] = lists[key].fireWith;
			}

			// Handle state
			// 为异步队列添加设置状态的回调函数，failList.disable, progressList.lock回调函数
			// 上面通过promise方法获得的deferred只是具有查看状态和添加回调函数的功能
			// 这里通过添加回调函数的功能，给异步队列deferred添加能够改变异步队列状态的方法
			// 通过给完成队列（done）添加回调函数，设置state = resolved, 禁用失败回调函数列表，锁定消息回调函数列表
			// 给失败队列添加（fail）添加回调函数，设置state = rejected，禁用成功回调函数列表，锁定消息回调函数列表
			deferred.done(function () {
				state = "resolved";
			}, failList.disable, progressList.lock).fail(function () {
				state = "rejected";
			}, doneList.disable, progressList.lock);

			// Call given func if any
			// func中可以接受deferred对象，在func中通过resolve等方法改变该deferred对象的执行状态
			// 由此来执行相应的回调函数列表
			if (func) {
				func.call(deferred, deferred);
			}

			// All done!
			return deferred;
		},

		// Deferred helper
		// 如果传入多个异步队列，该方法将返回一个新的“主”异步队列的只读副本，这个副本将跟踪所传入的异步队列的最终状态
		// 一旦所有异步队列都变为成功状态，“主“异步队列的成功回调函数将被调用，参数是包含了所有异步队列成功参数的数组
		// 如果其中一个异步队列变为失败状态，主异步队列的失败回调函数将被调用，参数是失败异步队列的失败参数
		// 也可以接受一个非异步队列作为参数，非异步队列被当做一个成功状态的异步队列
		// 添加时参数应该是函数执行后返回的参数
		when: function (firstParam) {
			// 为什么要这一步，复制吗？浅拷贝
			var args = sliceDeferred.call(arguments, 0),
				i = 0,
				length = args.length,
				pValues = new Array(length),
				// count就是参数的个数
				count = length,
				pCount = length,
				// 异步队列判定方法，只有异步队列有promise方法
				// 也就是说如果传入参数是一个异步队列，则deferred采用传入参数，
				// 否则传入多个异步队列等情况，通过jQuery.Deferred方法从新生成一个异步队列对象
				deferred = length <= 1 && firstParam && jQuery.isFunction(firstParam.promise) ?
				firstParam :
				jQuery.Deferred(),
				// 再次返回一个promise副本
				promise = deferred.promise();

			function resolveFunc(i) {
				// 这里的函数时添加给外部的异步队列deferred来进行调用的
				// 当外部的异步队列到达resolve状态时，就会调用这个函数
				// 外部异步队列就是传入的参数
				return function (value) {
					// 此处会改变args的内容
					// 把外部异步队列的成功参数放到args的对应位置上
					args[i] = arguments.length > 1 ? sliceDeferred.call(arguments, 0) : value;
					if (!(--count)) {
						// deferred调用采用了闭包原理
						// 此处只会有个异步队列（其实也就是最后一个执行的函数调用，count==0）会调用这个函数
						deferred.resolveWith(deferred, args);
					}
				};
			}

			// 之所以通过这种方式返回另一个函数，是为了使用闭包机制，引用下标
			function progressFunc(i) {
				// 返回一个用于收集外部异步队列消息参数的回调函数，消息参数收集函数
				return function (value) {
					pValues[i] = arguments.length > 1 ? sliceDeferred.call(arguments, 0) : value;
					deferred.notifyWith(promise, pValues);
				};
			}
			if (length > 1) {
				for (; i < length; i++) {
					// 如果参数是异步队列对象（具有promise方法），则给给该对象添加有关方法
					if (args[i] && args[i].promise && jQuery.isFunction(args[i].promise)) {
						// 这里只是添加响应的回调函数
						args[i].promise().then(resolveFunc(i), deferred.reject, progressFunc(i));
					} else {
						// 非异步队列被当做一个成功状态的异步队列
						--count;
					}
				}
				// count === 0 表示所有的回调函数都成功执行
				// 此处是当所有的异步队列都执行成功了，然后立即调用
				if (!count) {
					deferred.resolveWith(deferred, args);
				}
			} else if (deferred !== firstParam) {
				// 指定上下文和参数
				deferred.resolveWith(deferred, length ? [firstParam] : []);
			}
			// 返回promise,通过promise来调用.done/.fail
			return promise;
		}
	});



	// 浏览器功能测试模块
	// 一般解决浏览器不兼容问题有两种方式：
	// 1. 浏览器嗅探：通过解析navigator.userAgent来获取浏览器类型的和版本号，然后编写响应的兼容性代码
	// 2. 浏览器功能测试，通过检测某项功能在当前浏览器版本中是否被支持，然后编写响应的兼容性代码，这种
	//    方式不需要关心浏览器的类型和版本，是一种更好和更普遍的做法
	// 某些测试项在内部不需要时可能被移除，以改善页面启动性能
	jQuery.support = (function () {

		var support,
			all,
			a,
			select,
			opt,
			input,
			marginDiv,
			fragment,
			tds,
			events,
			eventName,
			i,
			isSupported,
			div = document.createElement("div"),
			documentElement = document.documentElement;

		// Preliminary tests
		div.setAttribute("className", "t");
		div.innerHTML = "   <link/><table></table><a href='/a' style='top:1px;float:left;opacity:.55;'>a</a><input type='checkbox'/>";

		all = div.getElementsByTagName("*");
		a = div.getElementsByTagName("a")[0];

		// Can't get basic test support
		if (!all || !all.length || !a) {
			return {};
		}

		// First batch of supports tests
		select = document.createElement("select");
		opt = select.appendChild(document.createElement("option"));
		input = div.getElementsByTagName("input")[0];

		// 不需要文档结构就可以执行的测试内容
		support = {
			// IE strips leading whitespace when .innerHTML is used
			// 如果浏览器使用innerHTML属性插入HTML代码时保留前导空白符，则该测试项为true
			// 检测第一个子元素是否是文本节点-nodeType 3，来测试
			leadingWhitespace: (div.firstChild.nodeType === 3),

			// Make sure that tbody elements aren't automatically inserted
			// IE will insert them into empty tables
			// 检测tbody元素是否会被自动插入<table>标签内
			tbody: !div.getElementsByTagName("tbody").length,

			// Make sure that link elements get serialized correctly by innerHTML
			// This requires a wrapper element in IE
			htmlSerialize: !!div.getElementsByTagName("link").length,

			// Get the style information from getAttribute
			// (IE uses .cssText instead)
			// DOM元素的内联样式是否可以通过DOM属性style直接访问
			// IE6, IE7,IE8中，需要通过style.cssText访问内联样式
			style: /top/.test(a.getAttribute("style")),

			// Make sure that URLs aren't manipulated
			// (IE normalizes it by default)
			// 有没有被格式化为一个全路径URL
			hrefNormalized: (a.getAttribute("href") === "/a"),

			// Make sure that element opacity exists
			// (IE uses filter instead)
			// Use a regex to work around a WebKit issue. See #5145
			// 浏览器是否支持opacity样�����
			// IE6,7,8中不支持opacity样式，需要用alpha filters代替
			opacity: /^0.55/.test(a.style.opacity),

			// Verify style float existence
			// (IE uses styleFloat instead of cssFloat)
			// 浏览器是否支持通过style.cssFloat访问样式float
			cssFloat: !!a.style.cssFloat,

			// Make sure that if no value is specified for a checkbox
			// that it defaults to "on".
			// (WebKit defaults to "" instead)
			checkOn: (input.value === "on"),

			// Make sure that a selected-by-default option has a working selected property.
			// (WebKit defaults to false instead of true, IE too, if it's in an optgroup)
			optSelected: opt.selected,

			// Test setAttribute on camelCase class. If it works, we need attrFixes when doing get/setAttribute (ie6/7)
			// 在IE6、IE7中，执行方法getAttribute,setAttribute和removeAttribute时需要传入DOM属性作为参数，而不是HTML属性
			// 在设置和读取HTML属性class时，需要传入DOM属性className
			getSetAttribute: div.className !== "t",

			// Tests for enctype support on a form(#6743)
			// 表单元素是否支持属性enctype，该属性用于规定将表单数据发送到服务器之前应该如何对其进行编码
			// 与属性encoding是等价的，但是在一些老版本的浏览器中只支持属性encoding
			// 在不支持属性enctype的浏览器中，对属性enctype的操作将被转换为对属性encoding的操作
			enctype: !!document.createElement("form").enctype,

			// Makes sure cloning an html5 element does not cause problems
			// Where outerHTML is undefined, this still works
			// 浏览器是否能够正确复制HTML5元素
			// 检查副本元素的属性outerHTML是否是非法值，<:nav></:nav>就是非法值
			html5Clone: document.createElement("nav").cloneNode(true).outerHTML !== "<:nav></:nav>",

			// Will be defined later
			// 没有见到有改变其值得地方，主要是测试sumbit事件是否沿着DOM树向上冒泡
			// 在IE6,7,8中，submit事件不会向上冒泡
			submitBubbles: true,
			// 测试change事件是够沿着DOM树向上冒泡
			changeBubbles: true,
			focusinBubbles: false,
			deleteExpando: true,
			noCloneEvent: true,
			inlineBlockNeedsLayout: false,
			shrinkWrapBlocks: false,
			reliableMarginRight: true
		};

		// Make sure checked status is properly cloned
		input.checked = true;
		// 浏览器在复制DOM元素时会不会复制选中状态
		// 在IE中，复制DOM元素时不会复制属性checked，该测试项为false
		support.noCloneChecked = input.cloneNode(true).checked;

		// Make sure that the options inside disabled selects aren't marked as disabled
		// (WebKit marks them as disabled)
		// 如果已禁用的select元素中的option子元素未被自动禁用，则该测试项为true
		// 在早期的Safari中，如果元素select被禁用，则子元素option会被自动禁用
		select.disabled = true;
		support.optDisabled = !opt.disabled;

		// Test to see if it's possible to delete an expando from an element
		// Fails in Internet Explorer
		// 如果浏览器允许删除DOM元素上的属性，则该测试项为true
		// 在IE6，IE7，IE8中，删除DOM元素上的属性会抛出异常
		try {
			delete div.test;
		} catch (e) {
			support.deleteExpando = false;
		}

		if (!div.addEventListener && div.attachEvent && div.fireEvent) {
			// 通过先复制绑定了事件的DOM元素，然后在副本上触发事件，在事件的监听回调函数内检测
			// 只有IE中才有attachEvent这个方法，也就是说这个兼容性测试专门针对IE浏览器
			div.attachEvent("onclick", function () {
				// Cloning a node shouldn't copy over any
				// bound event handlers (IE does this)
				// 在IE6,7,8中，复制DOM元素时会连同事件监听函数一起复制
				support.noCloneEvent = false;
			});
			div.cloneNode(true).fireEvent("onclick");
		}

		// Check if a radio maintains its value
		// after being appended to the DOM
		input = document.createElement("input");
		input.value = "t";
		input.setAttribute("type", "radio");
		// 设置input元素的属性value，再设置属性type为radio，检查属性value的值与设置的值是否相等
		// 判断设置input元素的属性type为radio会不会导致属性value的值丢失
		support.radioValue = input.value === "t";

		input.setAttribute("checked", "checked");
		div.appendChild(input);
		fragment = document.createDocumentFragment();
		fragment.appendChild(div.lastChild);

		// WebKit doesn't clone checked state correctly in fragments
		// 浏览器是否能够正确复制单选按钮和复选框的选中状态（即属性checked)
		support.checkClone = fragment.cloneNode(true).cloneNode(true).lastChild.checked;

		// Check if a disconnected checkbox will retain its checked
		// value of true after appended to the DOM (IE6/7)
		// 已选中的单选按钮和复选框添加到DOM树中，如果仍为选中状态，则该测试项为true
		support.appendChecked = input.checked;

		fragment.removeChild(input);
		fragment.appendChild(div);

		div.innerHTML = "";

		// Check if div with explicit width and no margin-right incorrectly
		// gets computed margin-right based on width of container. For more
		// info see bug #3333
		// Fails in WebKit before Feb 2011 nightlies
		// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
		if (window.getComputedStyle) {
			marginDiv = document.createElement("div");
			marginDiv.style.width = "0";
			marginDiv.style.marginRight = "0";
			div.style.width = "2px";
			div.appendChild(marginDiv);
			// 盒模型测试
			support.reliableMarginRight =
				(parseInt((window.getComputedStyle(marginDiv, null) || {
					marginRight: 0
				}).marginRight, 10) || 0) === 0;
		}

		// Technique from Juriy Zaytsev
		// http://perfectionkills.com/detecting-event-support-without-browser-sniffing/
		// We only care about the case where non-standard event systems
		// are used, namely in IE. Short-circuiting here helps us to
		// avoid an eval call (in setAttribute) which can cause CSP
		// to go haywire. See: https://developer.mozilla.org/en/Security/CSP
		if (div.attachEvent) {
			// attachEvent方法时IE中特有的方法，这些兼容性测试也是为IE单独测试的
			// 通过检测非表单元素上是否有属性onsubmit,onchange,onfocusin
			// 或者为属性onsubmit,onchange,onfocusin设置的字符串值是否会被转换为函数，来测试测试项
			// submitBubles, changeBubbles, focusinBubbles
			// 在不支持这些事件冒泡的浏览器中，jQuery事件系统会调用jQuery.event.simulate方法模拟冒泡过程
			for (i in {
					submit: 1,
					change: 1,
					focusin: 1
				}) {
				eventName = "on" + i;
				isSupported = (eventName in div);
				if (!isSupported) {
					div.setAttribute(eventName, "return;");
					isSupported = (typeof div[eventName] === "function");
				}
				support[i + "Bubbles"] = isSupported;
			}
		}

		fragment.removeChild(div);

		// Null elements to avoid leaks in IE
		fragment = select = opt = marginDiv = div = input = null;

		// Run tests that need a body at doc ready
		// 文档结构加载完成后执行的测试内容
		jQuery(function () {
			var container, outer, inner, table, td, offsetSupport,
				conMarginTop, ptlm, vb, style, html,
				body = document.getElementsByTagName("body")[0];

			if (!body) {
				// Return for frameset docs that don't have a body
				return;
			}

			conMarginTop = 1;
			ptlm = "position:absolute;top:0;left:0;width:1px;height:1px;margin:0;";
			vb = "visibility:hidden;border:0;";
			style = "style='" + ptlm + "border:5px solid #000;padding:0;'";
			html = "<div " + style + "><div></div></div>" +
				"<table " + style + " cellpadding='0' cellspacing='0'>" +
				"<tr><td></td></tr></table>";

			container = document.createElement("div");
			container.style.cssText = vb + "width:0;height:0;position:static;top:0;margin-top:" + conMarginTop + "px";
			body.insertBefore(container, body.firstChild);

			// Construct the test element
			div = document.createElement("div");
			container.appendChild(div);

			// Check if table cells still have offsetWidth/Height when they are set
			// to display:none and there are still other visible table cells in a
			// table row; if so, offsetWidth/Height are not reliable for use when
			// determining if an element has been hidden directly using
			// display:none (it is still safe to use offsets if a parent element is
			// hidden; don safety goggles and see bug #4512 for more information).
			// (only IE 8 fails this test)
			div.innerHTML = "<table><tr><td style='padding:0;border:0;display:none'></td><td>t</td></tr></table>";
			tds = div.getElementsByTagName("td");
			isSupported = (tds[0].offsetHeight === 0);

			tds[0].style.display = "";
			tds[1].style.display = "none";

			// Check if empty table cells still have offsetWidth/Height
			// (IE <= 8 fail this test)
			support.reliableHiddenOffsets = isSupported && (tds[0].offsetHeight === 0);

			// Figure out if the W3C box model works as expected
			div.innerHTML = "";
			div.style.width = div.style.paddingLeft = "1px";
			jQuery.boxModel = support.boxModel = div.offsetWidth === 2;

			if (typeof div.style.zoom !== "undefined") {
				// Check if natively block-level elements act like inline-block
				// elements when setting their display to 'inline' and giving
				// them layout
				// (IE < 8 does this)
				div.style.display = "inline";
				div.style.zoom = 1;
				support.inlineBlockNeedsLayout = (div.offsetWidth === 2);

				// Check if elements with layout shrink-wrap their children
				// (IE 6 does this)
				div.style.display = "";
				div.innerHTML = "<div style='width:4px;'></div>";
				// 浏览器中，父元素是否会被子元素撑大
				support.shrinkWrapBlocks = (div.offsetWidth !== 2);
			}

			div.style.cssText = ptlm + vb;
			div.innerHTML = html;

			outer = div.firstChild;
			inner = outer.firstChild;
			td = outer.nextSibling.firstChild.firstChild;

			offsetSupport = {
				// 浏览器中，子元素距离器父元素上边界的距离offsetTop不包含父元素的上边框厚度
				doesNotAddBorder: (inner.offsetTop !== 5),
				// 浏览器中，td元素距离器父元素tr上边界的距离offsetTop包含table元素的上边框厚度
				doesAddBorderForTableAndCells: (td.offsetTop === 5)
			};

			inner.style.position = "fixed";
			inner.style.top = "20px";

			// safari subtracts parent border width here which is 5px
			// 浏览器能否正确返回fixed元素的窗口坐标
			offsetSupport.fixedPosition = (inner.offsetTop === 20 || inner.offsetTop === 15);
			inner.style.position = inner.style.top = "";

			outer.style.overflow = "hidden";
			outer.style.position = "relative";

			// 如果父元素的样式overflow为hidden，子元素距离父元素边界的距离会减去父元素的边框厚度
			offsetSupport.subtractsBorderForOverflowNotVisible = (inner.offsetTop === -5);
			offsetSupport.doesNotIncludeMarginInBodyOffset = (body.offsetTop !== conMarginTop);

			body.removeChild(container);
			div = container = null;

			jQuery.extend(support, offsetSupport);
		});

		return support;
	})();




	var rbrace = /^(?:\{.*\}|\[.*\])$/,
		rmultiDash = /([A-Z])/g;

	// 独立扩展一个数据缓存模块
	// 数据缓存模块以一种安全的方式为DOM元素附加任意类型的数据，避免了在JavaScript对象和DOM元素之间出现
	// 循环引用，以及由此而导致的内存泄漏
	// 数据缓存模块会为每个DOM元素分配一个唯一id并附加到DOM元素上，同时会把该id作为属性添加到全局缓存对象jQuery.cache中，
	// 对应的属性值是一个JavaScript对象，该对象被称为“DOM元素的数据缓存对象“，其中存储着数据名和数据的映射
	// 也就是说，通过分配一个唯一id把DOM元素和该DOM元素的数据缓存对象关联起来
	/**
	 * 唯一id是一个整数--也就是上面的uuid,初始值为0，每次分配时自动加1
	 * 唯一id被附加到以jQuery.expando的值命名的属性上，以避免与用户自定义属性冲突
	 * 为DOM元素设置数据时，如果该DOM元素没有关联id,才会为之分配一个唯一id
	 * jQuery17107051154473688359: 4; jQuery对象中的属性
	 * $.uuid = 4
	 * $.expando = jQuery17107051154473688359
	 * $.cache中内容 4:
	 *               data: {test: "world"}
	 * 注意：通过.data方法设置的数据存储在data属性上，如上面所示
	 *      而内部数据则直接存在数据缓存对象上，例如通过$._data设置的数据
	 *      $._data($app2[0], "self", "self")
	 *      4: {data: {…}, parsedAttrs: true, self: "self"}
	 *      主要是为了避免冲突
	 */
	// 为JavaScript对象添加数据缓存模块时，数据直接存储在该JavaScript对象的属性jQuery.expando上
	jQuery.extend({
		cache: {},

		// Please use with caution
		uuid: 0,

		// Unique for each copy of jQuery on the page
		// Non-digits removed to match rinlinejQuery
		// jQuery17107051154473688359: jQuery版本号随机数
		// 该数值对于同一个jQuery对象是一样的，不会变
		// 但是刷新页面后，重新加载jQuery库时，会发生改变
		// replace作用是去掉其中的非数字字符
		expando: "jQuery" + (jQuery.fn.jquery + Math.random()).replace(/\D/g, ""),

		// The following elements throw uncatchable exceptions if you
		// attempt to add expando properties to them.
		// 向这些元素添加jQuery.expando属性时，会抛出异常
		// 这些都是应用于多媒体的标签
		noData: {
			"embed": true,
			// Ban all objects except for Flash (which handle expandos)
			// object标签，用于包含对象，比如图像、音频、视频、Java applets、ActiveX、PDF、以及Flash
			// 但是Flash可以设置，这里将Flash排除[clsid用来检测是否是Flash]
			"object": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",
			"applet": true
		},

		hasData: function (elem) {
			// 如果是DOM对象，1. 从该对象的jQuery.expando属性上获取到uuid； 2.从jQuery.cache中获取对应uuid的值
			// 如果不是DOM对象，直接从该对象的jQuery.expando上获取对应的值
			elem = elem.nodeType ? jQuery.cache[elem[jQuery.expando]] : elem[jQuery.expando];
			// 由于!!{} === true, 因此需要判断是否是一个非空的数据对象
			return !!elem && !isEmptyDataObject(elem);
		},

		data: function (elem, name, data, pvt /* Internal Use Only */ ) {
			// 如果不是可设置的类型，直接返回，当返回值是undefined时，可以判断设置失败，与下面返回值对比
			if (!jQuery.acceptData(elem)) {
				return;
			}

			var privateCache, thisCache, ret,
				internalKey = jQuery.expando,
				getByName = typeof name === "string",

				// We have to handle DOM nodes and JS objects differently because IE6-7
				// can't GC object references properly across the DOM-JS boundary
				// GC--垃圾回收机制，不能正确处理对象的引用
				isNode = elem.nodeType,

				// Only DOM nodes need the global jQuery cache; JS object data is
				// attached directly to the object so GC can occur automatically
				// 只有DOM元素才需要全局的jQuery缓存，JS对象可以直接存储缓存数据，GC可以自动处理回收机制
				// 如果不是DOM，就将cache设置为elem元素本身
				// 主要是IE6/IE7中JavaScript和DOM元素之间循环引用导致的垃圾回收机制不起作用
				cache = isNode ? jQuery.cache : elem,

				// Only defining an ID for JS objects if its cache already exists allows
				// the code to shortcut on the same path as a DOM node with no cache
				// 获取uuid
				/**
				 * var obj = {};
				 * $.data(obj, "hello", "hello");
				 * obj = {jQuery171013379987966002638: {toJSON: ƒ, data: {…}}
				 * 直接以internalKey为属性，设置数据缓存， 如果不是DOM元素，则需要elem[internalKey] && internalKey都为true才返回internalKey
				 * DOM直接返回internalKey的属性值uuid
				 */
				id = isNode ? elem[internalKey] : elem[internalKey] && internalKey,
				// 表示是否读取私有数据events,events是事件缓存对象，用于存储事件监听函数
				isEvents = name === "events";

			// Avoid doing any more work than we need to when trying to get data on an
			// object that has no data at all
			// data === undefined时，表示获取对应的缓存数据，如果此时并没有缓存数据，则直接返回
			// (!isEvents && !pvt && !cache[id].data) 这个判断是因为pvt为true时，表示缓存数据直接存储在该对象上，而不是该对象
			// 的data属性上
			// 注意此处getByName只有在传入参数name为string类型时才为true，否则为false，那么下面这个判断也就不生效了--
			// 这样也是为了下面对于name未object或者function类型时，不用通过key/value方式设置数据缓存的情况
			if ((!id || !cache[id] || (!isEvents && !pvt && !cache[id].data)) && getByName && data === undefined) {
				return;
			}

			if (!id) {
				// Only DOM nodes need a new unique ID for each element since their data
				// ends up in the global cache
				if (isNode) {
					elem[internalKey] = id = ++jQuery.uuid;
				} else {
					id = internalKey;
				}
			}

			// 注意此处的cache对应jQuery.cache或者elem本身
			if (!cache[id]) {
				cache[id] = {};

				// Avoids exposing jQuery metadata on plain JS objects when the object
				// is serialized using JSON.stringify
				// 如果不是DOM元素，则重新定义toJSON函数为空函数，这样序列化该对象时，直接返回个空对象, 而不是该对象实际内容
				/**
				 * var obj = {};
				 * $.data(obj, "hello", "hello");
				 * obj = {jQuery171013379987966002638: {toJSON: ƒ, data: {…}}
				 * JSON.stringify(obj); // {}
				 */
				if (!isNode) {
					cache[id].toJSON = jQuery.noop;
				}
			}

			// An object can be passed to jQuery.data instead of a key/value pair; this gets
			// shallow copied over onto the existing cache
			// 这里为什么不使用深拷贝呢 jQuery.extend(true, ...);
			if (typeof name === "object" || typeof name === "function") {
				if (pvt) {
					cache[id] = jQuery.extend(cache[id], name);
				} else {
					cache[id].data = jQuery.extend(cache[id].data, name);
				}
			}

			privateCache = thisCache = cache[id];

			// jQuery data() is stored in a separate object inside the object's internal data
			// cache in order to avoid key collisions between internal data and user-defined
			// data.
			// 设置数据缓存位置是thisCache还是thisCache中的data属性上
			if (!pvt) {
				if (!thisCache.data) {
					thisCache.data = {};
				}

				thisCache = thisCache.data;
			}

			// 这个地方是有问题的，当name不是string类型时，会报错，因为jQuery.camelCase要求参数为string类型
			if (data !== undefined) {
				// name短划线转换为驼峰式
				/**
				 * $.data(obj, "hello-hello", "hello");
				 * jQuery171013379987966002638:
				 *      data: {hello: "hello", helloHello: "hello"}
				 */
				thisCache[jQuery.camelCase(name)] = data;
			}

			// Users should not attempt to inspect the internal events object using jQuery.data,
			// it is undocumented and subject to change. But does anyone listen? No.
			// name === "events", 同时thisCache中没有这个属性,也就是没有设置过events属性
			// 如果pvt为false, privateCache与thisCache[==privateCache.data]其实是不一样的
			if (isEvents && !thisCache[name]) {
				return privateCache.events;
			}

			// Check for both converted-to-camel and non-converted data property names
			// If a data property was specified
			// 设置数据缓存之后，返回设置的值，有以下两种情况：
			// 1. 如果是以key/value方式设置，则返回对应的value值
			// 2. 如果是以object或者function方式设置的，则返回整个数据缓存对象【根据pvt选择返回data中还是整个数据缓存对象】
			if (getByName) {

				// First Try to find as-is property data
				ret = thisCache[name];

				// Test for null|undefined property data
				if (ret == null) {

					// Try to find the camelCased property
					ret = thisCache[jQuery.camelCase(name)];
				}
			} else {
				ret = thisCache;
			}

			// 未传入参数name,data,返回数据缓存对象
			return ret;
		},

		removeData: function (elem, name, pvt /* Internal Use Only */ ) {
			if (!jQuery.acceptData(elem)) {
				return;
			}

			var thisCache, i, l,

				// Reference to internal data cache key
				internalKey = jQuery.expando,

				isNode = elem.nodeType,

				// See jQuery.data for more information
				cache = isNode ? jQuery.cache : elem,

				// See jQuery.data for more information
				id = isNode ? elem[internalKey] : internalKey;

			// If there is already no cache entry for this object, there is no
			// purpose in continuing
			if (!cache[id]) {
				return;
			}

			if (name) {

				thisCache = pvt ? cache[id] : cache[id].data;

				if (thisCache) {

					// Support array or space separated string names for data keys
					// 如果name不是数据，不管怎样，最终将name转换成数组
					if (!jQuery.isArray(name)) {

						// try the string as a key before any manipulation
						if (name in thisCache) {
							name = [name];
						} else {

							// split the camel cased version by spaces unless a key with the spaces exists
							// 判断是不是连字符连接的key
							name = jQuery.camelCase(name);
							if (name in thisCache) {
								name = [name];
							} else {
								// 这一段的处理就是为了name是以空格分隔的key的形式，感觉有点略麻烦了
								name = name.split(" ");
							}
						}
					}

					for (i = 0, l = name.length; i < l; i++) {
						// delete 即使没有这个属性也不会报错
						delete thisCache[name[i]];
					}

					// If there is no data left in the cache, we want to continue
					// and let the cache object itself get destroyed
					// isEmptyDataObject 可以有data属性但是data属性为空，可以有toJSON属性，因为这个是jQuery添加上去的
					// isEmptyObject 不能有任何属性, data属性是用这个方法来判断是否为空的
					if (!(pvt ? isEmptyDataObject : jQuery.isEmptyObject)(thisCache)) {
						return;
					}
				}
			}

			// See jQuery.data for more information
			// 删除了所有属性之后，释放空间
			if (!pvt) {
				delete cache[id].data;

				// Don't destroy the parent cache unless the internal data object
				// had been the only thing left in it
				if (!isEmptyDataObject(cache[id])) {
					return;
				}
			}

			// Browsers that fail expando deletion also refuse to delete expandos on
			// the window, but it will allow it on all other JS objects; other browsers
			// don't care
			// Ensure that `cache` is not a window object #10080
			// 从cache中删除对应的id属性，cache可能是jQuery.cache也可能是JavaScript对象
			if (jQuery.support.deleteExpando || !cache.setInterval) {
				delete cache[id];
			} else {
				cache[id] = null;
			}

			// We destroyed the cache and need to eliminate the expando on the node to avoid
			// false lookups in the cache for entries that no longer exist
			if (isNode) {
				// IE does not allow us to delete expando properties from nodes,
				// nor does it have a removeAttribute function on Document nodes;
				// we must handle all of these cases
				if (jQuery.support.deleteExpando) {
					delete elem[internalKey];
				} else if (elem.removeAttribute) {
					elem.removeAttribute(internalKey);
				} else {
					elem[internalKey] = null;
				}
			}
		},

		// For internal use only.
		// 用于为队列模块、动画模块、样式操作模块、事件系统提供基础功能，负责设置或读取这些模块运行时的内部数据
		_data: function (elem, name, data) {
			return jQuery.data(elem, name, data, true);
		},

		// A method for determining if a DOM node can handle the data expando
		acceptData: function (elem) {
			// 如果elem是一个DOM元素
			if (elem.nodeName) {
				// 元素名称不能是embed，applet
				var match = jQuery.noData[elem.nodeName.toLowerCase()];

				if (match) {
					// 如果elem.nodeName是object，需要判断elem的classid属性值是否等于jQuery.noData中给出的属性值
					return !(match === true || elem.getAttribute("classid") !== match);
				}
			}

			return true;
		}
	});

	// 原型链上拓展的数据缓存方法，作用于每个jQuery对象上
	jQuery.fn.extend({
		// 用于为匹配元素设置或读取自定义数据，解析HTML5属性data-
		// 并触发相应的自定义事件getData, setData, changeData
		// 该方法的功能取决于参数的个数和类型，共四种
		// 1. data(key, value) 如果传入参数key和value,则为每个匹配元素设置任意类型的数据，并触发自定义事件setData, changeData
		// 2. data(obj) 如果传入含有键值对的对象，则为每个匹配元素批量设置数据
		// 3. data(key) 如果只传入key, 则返回第一个匹配元素的指定名称的数据，并触发自定义事件getData
		// 4. data() 如果未传入任何参数，则返回第一个匹配元素的自定义数据缓存对象，包含HTML5属性data-中数据
		data: function (key, value) {
			var parts, attr, name,
				data = null;

			if (typeof key === "undefined") {
				if (this.length) {
					// 返回第一个匹配元素的自定义数据缓存对象elem[jQuery.expando].data
					data = jQuery.data(this[0]);

					// 如果未解析过第一个匹配元素的HTML5的属性data-,则调用dataAttr(elem, key, data)
					// 解析属性data-中含有的数据，并把解析结果放入关联的自定义数据缓存对象中
					if (this[0].nodeType === 1 && !jQuery._data(this[0], "parsedAttrs")) {
						attr = this[0].attributes;
						for (var i = 0, l = attr.length; i < l; i++) {
							name = attr[i].name;

							if (name.indexOf("data-") === 0) {
								name = jQuery.camelCase(name.substring(5));

								dataAttr(this[0], name, data[name]);
							}
						}
						jQuery._data(this[0], "parsedAttrs", true);
					}
				}

				return data;

			} else if (typeof key === "object") {
				return this.each(function () {
					jQuery.data(this, key);
				});
			}

			// jQuery技术内幕上说，这里是取出命名空间，不太明白。。。
			parts = key.split(".");
			parts[1] = parts[1] ? "." + parts[1] : "";

			// 上述的第三种情况，只传入key
			// "!"表示只执行没有命名空间的事件监听函数
			if (value === undefined) {
				data = this.triggerHandler("getData" + parts[1] + "!", [parts[0]]);

				// Try to fetch any internally stored data first
				if (data === undefined && this.length) {
					data = jQuery.data(this[0], key);
					data = dataAttr(this[0], key, data);
				}

				return data === undefined && parts[1] ?
					this.data(parts[0]) :
					data;

			} else {
				return this.each(function () {
					var self = jQuery(this),
						args = [parts[0], value];

					self.triggerHandler("setData" + parts[1] + "!", args);
					jQuery.data(this, key, value);
					self.triggerHandler("changeData" + parts[1] + "!", args);
				});
			}
		},

		removeData: function (key) {
			return this.each(function () {
				jQuery.removeData(this, key);
			});
		}
	});

	// 用于解析HTML5属性data-中含有的数据，并把解析结果放入DOM元素关联的自定义数据缓存对象中
	// 参数data表示从DOM元素关联的自定义数据缓存对象中读取到的数据
	function dataAttr(elem, key, data) {
		// If nothing was found internally, try to fetch any
		// data from the HTML5 data-* attribute
		// 如果data未undefined，也就是说elem关联的自定义数据缓存对象中没有指定名称的数据，
		// 才会尝试从HTML5属性data-中解析数据，并尝试吧解析结果转换为合适的JavaScript类型，最后会把
		// 解析结果放入elem元素关联的自定义数据缓存对象中
		if (data === undefined && elem.nodeType === 1) {

			var name = "data-" + key.replace(rmultiDash, "-$1").toLowerCase();

			data = elem.getAttribute(name);

			if (typeof data === "string") {
				try {
					// 将字符串类型转换为对应的JavaScript类型
					data = data === "true" ? true :
						data === "false" ? false :
						data === "null" ? null :
						jQuery.isNumeric(data) ? parseFloat(data) :
						rbrace.test(data) ? jQuery.parseJSON(data) :
						data;
				} catch (e) {}

				// Make sure we set the data so it isn't changed later
				jQuery.data(elem, key, data);

			} else {
				data = undefined;
			}
		}

		return data;
	}

	// checks a cache object for emptiness
	function isEmptyDataObject(obj) {
		for (var name in obj) {

			// if the public data object is empty, the private is still empty
			// 如果对象中有data属性，则data属性不能有值，或者不能有任何属性
			// data=undefined, null, [], {}这些表示空值的是可以的
			if (name === "data" && jQuery.isEmptyObject(obj[name])) {
				continue;
			}
			// 有非data和toJSON的属性，就是一个非空的数据对象
			if (name !== "toJSON") {
				return false;
			}
		}

		return true;
	}



	// 负责检测匹配元素关联的队列type+"queue"和计数器type+"mark"是否完成
	// 如果都完成则触发方法.promise中的计数器减1
	function handleQueueMarkDefer(elem, type, src) {
		var deferDataKey = type + "defer",
			queueDataKey = type + "queue",
			markDataKey = type + "mark",
			defer = jQuery._data(elem, deferDataKey);
		if (defer &&
			(src === "queue" || !jQuery._data(elem, queueDataKey)) &&
			(src === "mark" || !jQuery._data(elem, markDataKey))) {
			// Give room for hard-coded callbacks to fire first
			// and eventually mark/queue something else on the element
			// 队列的执行顺序
			setTimeout(function () {
				if (!jQuery._data(elem, queueDataKey) &&
					!jQuery._data(elem, markDataKey)) {
					jQuery.removeData(elem, deferDataKey, true);
					defer.fire();
				}
			}, 0);
		}
	}

	jQuery.extend({

		// _mark好_unmark用于动画模块的非阻塞动画，这两个方法不是公开方法，也不属于队列模块
		// 但是jQuery把它们的实现放在了队列模块中
		_mark: function (elem, type) {
			if (elem) {
				type = (type || "fx") + "mark";
				jQuery._data(elem, type, (jQuery._data(elem, type) || 0) + 1);
			}
		},

		// _mark和_unmark用于维护一个匹配元素关联的计数器，它们分别使计数器加一和减一
		// 计数器存储在关联的数据缓存对象中，type+"mark"
		_unmark: function (force, elem, type) {
			// 如果force不为true，说明传入的是(elem, type)参数，所以
			// 将force赋值给elem, 将elem赋值给type
			if (force !== true) {
				type = elem;
				elem = force;
				force = false;
			}
			if (elem) {
				type = type || "fx";
				var key = type + "mark",
					count = force ? 0 : ((jQuery._data(elem, key) || 1) - 1);
				if (count) {
					// count不是0，更新相关的count值
					jQuery._data(elem, key, count);
				} else {
					// count为0，移除对应的计数器
					jQuery.removeData(elem, key, true);
					handleQueueMarkDefer(elem, type, "mark");
				}
			}
		},

		// 返回或修改匹配元素关联的函数队列，该方法的功能取决于参数的个数和类型
		// 1. jQuery.queue(element[, queueName]) 返回匹配元素关联的函数队列
		// 2. jQuery.queue(element, queueName, newQueue) 修改匹配元素关联的函数队列，用函数数组newQueue替换当前队列
		// 3. jQuery.queue(element, queueName, callback()) 修改匹配元素关联的函数队列，添加函数callback到队列中
		queue: function (elem, type, data) {
			var q;
			if (elem) {
				// 如果没有传入名称type, 则认为是标准动画"fx"
				// 同时会在名称后面加上"queue"表示这是一个队列
				type = (type || "fx") + "queue";
				// jQuery数据缓存模块内部方法，从elem元素上获取名称为type的缓存数据
				// e.g. type="fxqueue"
				q = jQuery._data(elem, type);

				// Speed up dequeue by getting out quickly if this is just a lookup
				// 如果没有传入data, 则从elem上获取缓存数据后就返回了
				if (data) {
					// 如果在该元素上没有获取到对应名称type的缓存数据，则在该元素上添加名称为type的缓存数据
					// 当时当data为数组时，也会替换掉原有的缓存数据
					if (!q || jQuery.isArray(data)) {
						q = jQuery._data(elem, type, jQuery.makeArray(data));
					} else {
						// 如果已经存在名称为type的缓存数据，则直接将data数据放入该缓存数据中
						q.push(data);
					}
				}
				return q || [];
			}
		},

		// elem: DOM元素或JavaScript对象，在其上出队并执行函数
		// type: 队列名称
		dequeue: function (elem, type) {
			type = type || "fx";

			var queue = jQuery.queue(elem, type),
				fn = queue.shift(),
				// 用于存放出队的函数在执行时的数据
				hooks = {};

			// 哨兵作用--占位符，表示动画函数正则执行中
			// 如果出队的是占位符"inprogess",则丢弃再出队一个，
			// 只有动画队列会设置占位符"inprogress"
			// If the fx queue is dequeued, always remove the progress sentinel
			if (fn === "inprogress") {
				fn = queue.shift();
			}

			if (fn) {
				// Add a progress sentinel to prevent the fx queue from being
				// automatically dequeued
				// 如果是标准动画队列，则自动添加占位符标志"inprogress",表示动画函数正在执行
				if (type === "fx") {
					// 向queue头部添加元素
					queue.unshift("inprogress");
				}

				// 设置内部数据type+".run",表示type对应的队列正在执行
				// 该属性对应的值为对象hooks
				// 在下一个函数出队之前可以调用该函数取出上一个函数运行时的数据
				jQuery._data(elem, type + ".run", hooks);
				// fn.call(elem, next, hooks)
				// 将jQuery.dequeue封装进next函数，但是不会自动执行，需要在
				// 出队的函数返回前手动调用next函数，以使下一个函数继续执行
				fn.call(elem, function () {
					jQuery.dequeue(elem, type);
				}, hooks);
			}

			// 如果出队之后变成空队列，则移除该队列type+"queue"，以及该元素上的数据对象type+".run"
			if (!queue.length) {
				jQuery.removeData(elem, type + "queue " + type + ".run", true);
				// 检测匹配元素关联的队列type+"queue"和计数器(type+"mark")是否完成
				handleQueueMarkDefer(elem, type, "queue");
			}
		}
	});

	// 队列模块可以应用于任何需要顺序执行函数的场景
	jQuery.fn.extend({
		queue: function (type, data) {
			// 可以不传type类型，直接传递数据
			if (typeof type !== "string") {
				data = type;
				type = "fx";
			}

			// 返回队列
			if (data === undefined) {
				return jQuery.queue(this[0], type);
			}
			// data 存在时，修改该元素上的队列
			return this.each(function () {
				var queue = jQuery.queue(this, type, data);

				// 修改完成后，如果是动画队列，而且没有在执行中，则自动调用出队方法
				// 执行队列
				if (type === "fx" && queue[0] !== "inprogress") {
					jQuery.dequeue(this, type);
				}
			});
		},
		dequeue: function (type) {
			// 通过this.each可以达到在每个匹配的元素的执行函数
			return this.each(function () {
				jQuery.dequeue(this, type);
			});
		},
		// Based off of the plugin by Clint Helfers, with permission.
		// http://blindsignals.com/index.php/2009/07/jquery-delay/
		// 用于设置一个定时器，以使匹配元素关联的函数队列总后续的函数延迟出队和执行
		delay: function (time, type) {
			time = jQuery.fx ? jQuery.fx.speeds[time] || time : time;
			type = type || "fx";

			return this.queue(type, function (next, hooks) {
				var timeout = setTimeout(next, time);
				hooks.stop = function () {
					clearTimeout(timeout);
				};
			});
		},
		clearQueue: function (type) {
			// 传入空数组[]参数可以清空队列
			return this.queue(type || "fx", []);
		},
		// Get a promise resolved when queues of a certain type
		// are emptied (fx is the type by default)
		// 阻塞动画基于队列实现，非阻塞动画基于计数器实现
		promise: function (type, object) {
			// 处理参数传递：promise(object)形式，为了正确处理参数的位置
			if (typeof type !== "string") {
				object = type;
				type = undefined;
			}
			type = type || "fx";
			var defer = jQuery.Deferred(),
				elements = this,
				i = elements.length,
				count = 1,
				// fxdefer, fxqueue, fxmark三个数据
				deferDataKey = type + "defer",
				queueDataKey = type + "queue",
				markDataKey = type + "mark",
				tmp;

			function resolve() {
				// 当count变为0时，表示所有需要观察的元素所关联的函数队列(type+"queue")
				// 和计数器(type+"mark")都已经完成，这时会触发异步队列的成功回调函数
				if (!(--count)) {
					defer.resolveWith(elements, [elements]);
				}
			}
			while (i--) {
				// jQuery.data(elem, name, data, pvt), 当data为undefined时，获取对应name上的值
				// 当data不是undefined时，这是name属性，并且该属性值为data a || b && c
				// 如果该元素上有异步队列：type+"defer"则tmp即为该元素上的type+"defer"队列，否则会在该元素上创建type+"defer"队列
				// 需要观察该元素的标记：1. 存在type+"defer"队列，2.存在type+"queue"或者type+"mark"队列
				if ((tmp = jQuery.data(elements[i], deferDataKey, undefined, true) ||
						(jQuery.data(elements[i], queueDataKey, undefined, true) ||	jQuery.data(elements[i], markDataKey, undefined, true))
						 &&	jQuery.data(elements[i], deferDataKey, jQuery.Callbacks("once memory"), true)
					)) {
					// 通过最后的jQuery.data方法，tmp其实是一个Callbacks
					count++;
					tmp.add(resolve);
				}
			}
			resolve();
			// 有个bug,并没有把object附加到defer上
			return defer.promise();
		}
	});




	var rclass = /[\n\t\r]/g,
		rspace = /\s+/,
		rreturn = /\r/g,
		rtype = /^(?:button|input)$/i,
		rfocusable = /^(?:button|input|object|select|textarea)$/i,
		rclickable = /^a(?:rea)?$/i,
		// rboolean中定义了需要修正的布尔型HTML属性
		rboolean = /^(?:autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected)$/i,
		getSetAttribute = jQuery.support.getSetAttribute,
		nodeHook, boolHook, fixSpecified;

	// 属性操作，分为以下4中
	// 1. HTML属性操作
	// 2. DOM属性操作
	// 3. 类样式操作
	// 4. 值操作
	jQuery.fn.extend({
		attr: function (name, value) {
			return jQuery.access(this, name, value, true, jQuery.attr);
		},

		removeAttr: function (name) {
			// 对jQuery对象中的每个对象都调用removeAttr方法，也就是对于每个对象都删除这一组属性
			return this.each(function () {
				jQuery.removeAttr(this, name);
			});
		},

		prop: function (name, value) {
			return jQuery.access(this, name, value, true, jQuery.prop);
		},

		// 对delete的简单封装，通过try..catch捕获无法删除DOM属性的兼容性问题
		removeProp: function (name) {
			name = jQuery.propFix[name] || name;
			return this.each(function () {
				// try/catch handles cases where IE balks (such as removing a property on window)
				try {
					this[name] = undefined;
					delete this[name];
				} catch (e) {}
			});
		},

		// 为匹配元素集合中的每一个元素添加一个或多个类样式，通过修改DOM属性className来修改样式
		// 通过indexOf的返回值，来决定是添加还是忽略，参数可以是以下两种类型
		// 1. value是一个多个以空格分隔的类样式
		// 2. value是一个函数，返回一个或多个以空格分隔的类样式
		//     该函数接受两个参数，当前元素在集合中的下标位置、当前类样式
		addClass: function (value) {
			var classNames, i, l, elem,
				setClass, c, cl;

			if (jQuery.isFunction(value)) {
				return this.each(function (j) {
					jQuery(this).addClass(value.call(this, j, this.className));
				});
			}

			// 不管传入参数是函数还是类样式，最终都会调用到这一段代码
			if (value && typeof value === "string") {
				classNames = value.split(rspace);

				for (i = 0, l = this.length; i < l; i++) {
					elem = this[i];

					if (elem.nodeType === 1) {
						if (!elem.className && classNames.length === 1) {
							elem.className = value;

						} else {
							setClass = " " + elem.className + " ";

							// 消除可能存在的重复类样式
							for (c = 0, cl = classNames.length; c < cl; c++) {
								if (!~setClass.indexOf(" " + classNames[c] + " ")) {
									setClass += classNames[c] + " ";
								}
							}
							elem.className = jQuery.trim(setClass);
						}
					}
				}
			}

			return this;
		},

		// 类似于addClass
		removeClass: function (value) {
			var classNames, i, l, elem, className, c, cl;

			if (jQuery.isFunction(value)) {
				return this.each(function (j) {
					jQuery(this).removeClass(value.call(this, j, this.className));
				});
			}

			if ((value && typeof value === "string") || value === undefined) {
				classNames = (value || "").split(rspace);

				for (i = 0, l = this.length; i < l; i++) {
					elem = this[i];

					if (elem.nodeType === 1 && elem.className) {
						if (value) {
							// 前后添加空格，同时将一个tab分隔转换成空格，便于后续直接替换处理
							className = (" " + elem.className + " ").replace(rclass, " ");
							for (c = 0, cl = classNames.length; c < cl; c++) {
								// 将待移除的类样式用空格替换
								className = className.replace(" " + classNames[c] + " ", " ");
							}
							elem.className = jQuery.trim(className);

						} else {
							elem.className = "";
						}
					}
				}
			}

			return this;
		},

		// 用于为匹配元素集合中的每个元素添加或删除一个或多个或全部类样式，
		// : 如果匹配元素含有指定的类样式，则移除，否则添加
		// 添加或删除的行为依赖于匹配元素是否含有指定的类样式以及参数switch的值
		toggleClass: function (value, stateVal) {
			var type = typeof value,
				isBool = typeof stateVal === "boolean";

			if (jQuery.isFunction(value)) {
				return this.each(function (i) {
					jQuery(this).toggleClass(value.call(this, i, this.className, stateVal), stateVal);
				});
			}

			return this.each(function () {
				if (type === "string") {
					// toggle individual class names
					var className,
						i = 0,
						self = jQuery(this),
						state = stateVal,
						classNames = value.split(rspace);

					while ((className = classNames[i++])) {
						// check each className given, space seperated list
						state = isBool ? state : !self.hasClass(className);
						self[state ? "addClass" : "removeClass"](className);
					}

				} else if (type === "undefined" || type === "boolean") {
					if (this.className) {
						// store className if set
						jQuery._data(this, "__className__", this.className);
					}

					// toggle whole className
					this.className = this.className || value === false ? "" : jQuery._data(this, "__className__") || "";
				}
			});
		},

		hasClass: function (selector) {
			var className = " " + selector + " ",
				i = 0,
				l = this.length;
			for (; i < l; i++) {
				// replace用来替换其中的换行符、制表符、回车符为空格
				if (this[i].nodeType === 1 && (" " + this[i].className + " ").replace(rclass, " ").indexOf(className) > -1) {
					return true;
				}
			}

			return false;
		},

		// 用于获取匹配元素集合中的第一个元素的当前值，或者设置匹配元素集合中的每一个值
		// 参数主要有以下三种类型
		// 1. undefined 获取第一个匹配元素的当前值
		// 2. value 设置每个匹配元素的值
		// 3. function 设置每个元素的值，由一个函数返回待设置的值
		//    该函数接收两个参数：当前元素在集合中的下标位置、当前值
		val: function (value) {
			var hooks, ret, isFunction,
				elem = this[0];

			if (!arguments.length) {
				if (elem) {
					hooks = jQuery.valHooks[elem.nodeName.toLowerCase()] || jQuery.valHooks[elem.type];

					if (hooks && "get" in hooks && (ret = hooks.get(elem, "value")) !== undefined) {
						return ret;
					}

					ret = elem.value;

					return typeof ret === "string" ?
						// handle most common string cases
						// 删除回车符\r
						ret.replace(rreturn, "") :
						// handle cases where value is null/undef or number
						ret == null ? "" : ret;
				}

				return;
			}

			isFunction = jQuery.isFunction(value);

			// 传入参数，设置每个匹配元素的值
			return this.each(function (i) {
				var self = jQuery(this),
					val;

				if (this.nodeType !== 1) {
					return;
				}

				if (isFunction) {
					// 传入函数，获取函数的值
					val = value.call(this, i, self.val());
				} else {
					val = value;
				}

				// Treat null/undefined as ""; convert numbers to string
				if (val == null) {
					val = "";
				} else if (typeof val === "number") {
					val += "";
				} else if (jQuery.isArray(val)) {
					// 如果是数组，则设置每个匹配元素的选中状态
					val = jQuery.map(val, function (value) {
						return value == null ? "" : value + "";
					});
				}

				hooks = jQuery.valHooks[this.nodeName.toLowerCase()] || jQuery.valHooks[this.type];

				// If set returns undefined, fall back to normal setting
				if (!hooks || !("set" in hooks) || hooks.set(this, val, "value") === undefined) {
					this.value = val;
				}
			});
		}
	});

	jQuery.extend({
		// 值修正对象集
		valHooks: {
			option: {
				get: function (elem) {
					// attributes.value is undefined in Blackberry 4.7 but
					// uses .value. See #6932
					var val = elem.attributes.value;
					return !val || val.specified ? elem.value : elem.text;
				}
			},
			// 读取select元素的值，如果该select元素时单选，则读取属性selectIndex指定的option
			// 元素的值，如果是多选，则遍历所有的option元素，返回包含；额所有选中的option元素的值的数组
			select: {
				get: function (elem) {
					var value, i, max, option,
						index = elem.selectedIndex,
						values = [],
						options = elem.options,
						// DOM属性上type属性会指示该select是多选还是单选
						one = elem.type === "select-one";

					// Nothing was selected
					if (index < 0) {
						return null;
					}

					// Loop through all the selected options
					i = one ? index : 0;
					max = one ? index + 1 : options.length;
					for (; i < max; i++) {
						option = options[i];

						// Don't return options that are disabled or in a disabled optgroup
						if (option.selected && (jQuery.support.optDisabled ? !option.disabled : option.getAttribute("disabled") === null) &&
							(!option.parentNode.disabled || !jQuery.nodeName(option.parentNode, "optgroup"))) {

							// Get the specific value for the option
							value = jQuery(option).val();

							// We don't need an array for one selects
							if (one) {
								return value;
							}

							// Multi-Selects return an array
							values.push(value);
						}
					}

					// Fixes Bug #2551 -- select.val() broken in IE after form.reset()
					if (one && !values.length && options.length) {
						return jQuery(options[index]).val();
					}

					return values;
				},

				set: function (elem, value) {
					var values = jQuery.makeArray(value);

					jQuery(elem).find("option").each(function () {
						this.selected = jQuery.inArray(jQuery(this).val(), values) >= 0;
					});

					if (!values.length) {
						elem.selectedIndex = -1;
					}
					return values;
				}
			}
		},

		// 与HTML属性同名的jQuery方法集
		attrFn: {
			val: true,
			css: true,
			html: true,
			text: true,
			data: true,
			width: true,
			height: true,
			offset: true
		},

		// 设置或读取HTML属性
		/**
		 * 用于获取DOM元素的HTML属性值，或者为DOM元素设置一个HTML属性
		 * 该方法为.attr(name, value)提供了基础，是对原生getAttribute和
		 * setAttribute的封装和简化，并解决了大量的浏览器兼容性问题
		 * pass: 如果HTML属性与jQuery方法同名，是否调用同名的jQuery方法，如果该参数是
		 *  	true则调用
		 */
		attr: function (elem, name, value, pass) {
			var ret, hooks, notxml,
				nType = elem.nodeType;

			// don't get/set attributes on text, comment and attribute nodes
			// ELEMENT_NODE=1,ATTRIBUTE_NODE=2,TEXT_NODE=3,COMMENT_NODE=8
			if (!elem || nType === 3 || nType === 8 || nType === 2) {
				return;
			}

			// 类似于val,text等，jQuery对象已有内置函数可以直接调用
			// pass 为true表示使用jQuery方法
			if (pass && name in jQuery.attrFn) {
				return jQuery(elem)[name](value);
			}

			// Fallback to prop when attributes are not supported
			// DOM元素才有getAttribute属性，不支持属性设置的，则设置对应的DOM属性
			if (typeof elem.getAttribute === "undefined") {
				return jQuery.prop(elem, name, value);
			}

			notxml = nType !== 1 || !jQuery.isXMLDoc(elem);

			// All attributes are lowercase
			// Grab necessary hook if one is defined
			// 转换HTML属性为小写，并获取对应的修正对象
			// HTML属性必须是小写的，
			if (notxml) {
				name = name.toLowerCase();
				hooks = jQuery.attrHooks[name] || (rboolean.test(name) ? boolHook : nodeHook);
			}

			if (value !== undefined) {

				if (value === null) {
					jQuery.removeAttr(elem, name);
					return;

				} else if (hooks && "set" in hooks && notxml && (ret = hooks.set(elem, value, name)) !== undefined) {
					return ret;

				} else {
					elem.setAttribute(name, "" + value);
					return value;
				}

			} else if (hooks && "get" in hooks && notxml && (ret = hooks.get(elem, name)) !== null) {
				return ret;

			} else {

				ret = elem.getAttribute(name);

				// Non-existent attributes return null, we normalize to undefined
				return ret === null ?
					undefined :
					ret;
			}
		},

		// 移除HTML属性--value是以空格分隔的属性名称
		removeAttr: function (elem, value) {
			var propName, attrNames, name, l,
				i = 0;

			if (value && elem.nodeType === 1) {
				attrNames = value.toLowerCase().split(rspace);
				l = attrNames.length;

				for (; i < l; i++) {
					name = attrNames[i];

					if (name) {
						propName = jQuery.propFix[name] || name;

						// See #9699 for explanation of this approach (setting first, then removal)
						// 在调用原生方法removeAttribute前将HTML属性设置为空字符串，来解决Webkit内核浏览器不能移除HTML属性style的问题
						jQuery.attr(elem, name, "");
						elem.removeAttribute(getSetAttribute ? name : propName);

						// Set corresponding property to false for boolean attributes
						// 移除属性之后，如果是布尔型的HTML属性，还需要设置对应的DOM属性值为false
						if (rboolean.test(name) && propName in elem) {
							elem[propName] = false;
						}
					}
				}
			}
		},

		// 特殊HTML属性修正对象集
		attrHooks: {
			type: {
				// 设置input元素的属性type为radio会导致value的值丢失，需要在设置之前先备份属性value的值，
				// 设置完成之后再恢复属性value为备份值
				// 对于type属性进行修正，也就是兼容性
				set: function (elem, value) {
					// rtype包含button,input，IE9以下的浏览器中修改有父元素的button,input元素的属性type时，会抛出异常
					// 因此这里统一处理为不允许修改
					// We can't allow the type property to be changed (since it causes problems in IE)
					if (rtype.test(elem.nodeName) && elem.parentNode) {
						jQuery.error("type property can't be changed");
					} else if (!jQuery.support.radioValue && value === "radio" && jQuery.nodeName(elem, "input")) {
						// Setting the type on a radio button after the value resets the value in IE6-9
						// Reset value to it's default in case type is set after value
						// This is for element creation
						var val = elem.value;
						elem.setAttribute("type", value);
						if (val) {
							elem.value = val;
						}
						return value;
					}
				}
			},
			// Use the value property for back compat
			// Use the nodeHook for button elements in IE6/7 (#1954)
			// 在IE6.7中,button元素的DOM属性value返回的是DOM属性innerHTML的值
			value: {
				get: function (elem, name) {
					if (nodeHook && jQuery.nodeName(elem, "button")) {
						return nodeHook.get(elem, name);
					}
					return name in elem ?
						elem.value :
						null;
				},
				set: function (elem, value, name) {
					if (nodeHook && jQuery.nodeName(elem, "button")) {
						return nodeHook.set(elem, value, name);
					}
					// Does not return so that setAttribute is also used
					elem.value = value;
				}
			}
		},

		// 转换DOM属性为驼峰式--DOM属性必须是驼峰式的
		propFix: {
			tabindex: "tabIndex",
			readonly: "readOnly",
			// for和class属性之所以用引号，是因为这两个名称是JS中的关键字
			"for": "htmlFor",
			"class": "className",
			maxlength: "maxLength",
			cellspacing: "cellSpacing",
			cellpadding: "cellPadding",
			rowspan: "rowSpan",
			colspan: "colSpan",
			usemap: "useMap",
			frameborder: "frameBorder",
			contenteditable: "contentEditable"
		},

		// 设置或读取DOM属性
		prop: function (elem, name, value) {
			var ret, hooks, notxml,
				nType = elem.nodeType;

			// don't get/set properties on text, comment and attribute nodes
			if (!elem || nType === 3 || nType === 8 || nType === 2) {
				return;
			}

			notxml = nType !== 1 || !jQuery.isXMLDoc(elem);

			if (notxml) {
				// Fix name and attach hooks
				name = jQuery.propFix[name] || name;
				hooks = jQuery.propHooks[name];
			}

			if (value !== undefined) {
				// 修改DOM属性，优先调用set兼容性方法
				if (hooks && "set" in hooks && (ret = hooks.set(elem, value, name)) !== undefined) {
					return ret;

				} else {
					// 没有对相应的set兼容性方法时，直接设置相应属性值
					return (elem[name] = value);
				}

			} else {
				// 未传入value，读取DOM属性，首先使用get兼容性方法
				if (hooks && "get" in hooks && (ret = hooks.get(elem, name)) !== null) {
					return ret;

				} else {
					// 没有响应的get兼容性方法时，直接读取DOM属性
					return elem[name];
				}
			}
		},

		// 特殊DOM属性修正对象集
		// 如果在文档中未明确指定HTML属性tabindex,则DOM属性tabindex并总是返回正确的值
		// 安全的做法是通过属性节点来读取HTML属性tabindex
		propHooks: {
			tabIndex: {
				get: function (elem) {
					// 如果明确指定了HTML属性tabindex,则可以通过属性节点来读取，如果未指定，对于可以获得焦点或可以点击的元素，一律返回0
					// 其他元素一律返回undefined
					// elem.tabIndex doesn't always return the correct value when it hasn't been explicitly set
					// http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
					var attributeNode = elem.getAttributeNode("tabindex");

					return attributeNode && attributeNode.specified ?
						parseInt(attributeNode.value, 10) :
						rfocusable.test(elem.nodeName) || rclickable.test(elem.nodeName) && elem.href ?
						0 :
						undefined;
				}
			}
		}
	});

	// Add the tabIndex propHook to attrHooks for back-compat (different case is intentional)
	jQuery.attrHooks.tabindex = jQuery.propHooks.tabIndex;

	// Hook for boolean attributes
	/**
	 * 初始化或扩展：布尔型HTML属性修正对象boolHook
	 * 针对IE 6/7的通用HTML属性修正对象nodeHook
	 * 特殊HTML属性修正对象集jQuery.attrHooks
	 * 特殊DOM属性修正对象集jQuery.propHooks
	 * 值修正对象集jQuery.valHooks
	 */
	// 用于布尔型HTML属性修正对象
	// 为什么要这么做呢？是因为布尔型HTML属性映射到DOM属性时二者的表示不一致导致的
	// 在HTML属性中，布尔型HTML属性为true时其属性值为HTML属性的小写，但是在DOM中就是表示true
	// 布尔型HTML属性为false时，HTML上就没有该属性，但是对应名称的DOM属性值为false
	boolHook = {
		// 如果某个HTML属性对应的DOM属性的值是布尔型，则称该HTML属性为布尔型HTML属性，其属性值是小写的属性名
		get: function (elem, name) {
			// Align boolean attributes with corresponding properties
			// Fall back to attribute presence where some booleans are not supported
			var attrNode,
				property = jQuery.prop(elem, name);
			return property === true || typeof property !== "boolean" && (attrNode = elem.getAttributeNode(name)) && attrNode.nodeValue !== false ?
				name.toLowerCase() :
				undefined;
		},
		set: function (elem, value, name) {
			var propName;
			// 布尔型HTML属性为false时，默认删除该HTML属性
			if (value === false) {
				// Remove boolean attributes when set to false
				jQuery.removeAttr(elem, name);
			} else {
				// value is true since we know at this point it's type boolean and not false
				// Set boolean attributes to the same name and set the DOM property
				propName = jQuery.propFix[name] || name;
				if (propName in elem) {
					// Only set the IDL specifically if it already exists on the element
					// 设置DOM属性值为true
					elem[propName] = true;
				}

				elem.setAttribute(name, name.toLowerCase());
			}
			return name;
		}
	};

	// IE6/7 do not support getting/setting some attributes with get/setAttribute
	if (!getSetAttribute) {

		fixSpecified = {
			name: true,
			id: true
		};

		// Use this for any attribute in IE6/7
		// This fixes almost every IE6/7 issue
		nodeHook = jQuery.valHooks.button = {
			get: function (elem, name) {
				var ret;
				ret = elem.getAttributeNode(name);
				return ret && (fixSpecified[name] ? ret.nodeValue !== "" : ret.specified) ?
					ret.nodeValue :
					undefined;
			},
			set: function (elem, value, name) {
				// Set the existing or create a new attribute node
				var ret = elem.getAttributeNode(name);
				if (!ret) {
					ret = document.createAttribute(name);
					elem.setAttributeNode(ret);
				}
				return (ret.nodeValue = value + "");
			}
		};

		// Apply the nodeHook to tabindex
		jQuery.attrHooks.tabindex.set = nodeHook.set;

		// Set width and height to auto instead of 0 on empty string( Bug #8150 )
		// This is for removals
		// 修正方法在设置HTML属性width或height时，如果参数value是空字符串，则将其修成为auto
		jQuery.each(["width", "height"], function (i, name) {
			jQuery.attrHooks[name] = jQuery.extend(jQuery.attrHooks[name], {
				set: function (elem, value) {
					if (value === "") {
						elem.setAttribute(name, "auto");
						return value;
					}
				}
			});
		});

		// Set contenteditable to false on removals(#10429)
		// Setting to empty string throws an error as an invalid value
		// 修正contenteditable属性
		jQuery.attrHooks.contenteditable = {
			get: nodeHook.get,
			set: function (elem, value, name) {
				if (value === "") {
					value = "false";
				}
				nodeHook.set(elem, value, name);
			}
		};
	}


	// Some attributes require a special call on IE
	if (!jQuery.support.hrefNormalized) {
		jQuery.each(["href", "src", "width", "height"], function (i, name) {
			jQuery.attrHooks[name] = jQuery.extend(jQuery.attrHooks[name], {
				get: function (elem) {
					var ret = elem.getAttribute(name, 2);
					return ret === null ? undefined : ret;
				}
			});
		});
	}

	if (!jQuery.support.style) {
		jQuery.attrHooks.style = {
			get: function (elem) {
				// Return undefined in the case of empty string
				// Normalize to lowercase since IE uppercases css property names
				return elem.style.cssText.toLowerCase() || undefined;
			},
			set: function (elem, value) {
				return (elem.style.cssText = "" + value);
			}
		};
	}

	// Safari mis-reports the default selected property of an option
	// Accessing the parent's selectedIndex property fixes it
	if (!jQuery.support.optSelected) {
		jQuery.propHooks.selected = jQuery.extend(jQuery.propHooks.selected, {
			get: function (elem) {
				// 通过读取父元素select和父元素optgroup的属性selectedIndex来触发修正option元素的属性selected
				var parent = elem.parentNode;

				if (parent) {
					// 这里并没有相应的返回值，确实都点奇怪
					// 通过读取相应的属性来触发？？
					parent.selectedIndex;

					// Make sure that it also works with optgroups, see #5701
					if (parent.parentNode) {
						parent.parentNode.selectedIndex;
					}
				}
				return null;
			}
		});
	}

	// IE6/7 call enctype encoding
	if (!jQuery.support.enctype) {
		jQuery.propFix.enctype = "encoding";
	}

	// Radios and checkboxes getter/setter
	if (!jQuery.support.checkOn) {
		jQuery.each(["radio", "checkbox"], function () {
			jQuery.valHooks[this] = {
				get: function (elem) {
					// Handle the case where in Webkit "" is returned instead of "on" if a value isn't specified
					return elem.getAttribute("value") === null ? "on" : elem.value;
				}
			};
		});
	}
	jQuery.each(["radio", "checkbox"], function () {
		jQuery.valHooks[this] = jQuery.extend(jQuery.valHooks[this], {
			set: function (elem, value) {
				if (jQuery.isArray(value)) {
					return (elem.checked = jQuery.inArray(jQuery(elem).val(), value) >= 0);
				}
			}
		});
	});




	var rformElems = /^(?:textarea|input|select)$/i,
		rtypenamespace = /^([^\.]*)?(?:\.(.+))?$/,
		rhoverHack = /\bhover(\.\S+)?\b/,
		rkeyEvent = /^key/,
		rmouseEvent = /^(?:mouse|contextmenu)|click/,
		rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
		rquickIs = /^(\w*)(?:#([\w\-]+))?(?:\.([\w\-]+))?$/,
		quickParse = function (selector) {
			var quick = rquickIs.exec(selector);
			if (quick) {
				//   0  1    2   3
				// [ _, tag, id, class ]
				quick[1] = (quick[1] || "").toLowerCase();
				quick[3] = quick[3] && new RegExp("(?:^|\\s)" + quick[3] + "(?:\\s|$)");
			}
			return quick;
		},
		quickIs = function (elem, m) {
			var attrs = elem.attributes || {};
			return (
				(!m[1] || elem.nodeName.toLowerCase() === m[1]) &&
				(!m[2] || (attrs.id || {}).value === m[2]) &&
				(!m[3] || m[3].test((attrs["class"] || {}).value))
			);
		},
		hoverHack = function (events) {
			return jQuery.event.special.hover ? events : events.replace(rhoverHack, "mouseenter$1 mouseleave$1");
		};

	/*
	 * Helper functions for managing events -- not part of the public interface.
	 * Props to Dean Edwards' addEvent library for many of the ideas.
	 */
	/**
	 * jQuery并没有将事件监听函数直接绑定到DOM元素上，而是基于数据缓存模块来管理监听函数的
	 * DOM元素关联的数据缓存对象的属性events称为该DOM元素的事件缓存对象，其中存储了该DOM元素的所有事件
	 * 方法调用链为：.one/bind/delegate/live/事件便捷方法-->on-->jQuery.event.add-->
	 * addEventListener/attachEvent/jQuery._data
	 */
	jQuery.event = {
		// 绑定一个或多个类型的事件监听函数
		add: function (elem, types, handler, data, selector) {

			var elemData, eventHandle, events,
				t, tns, type, namespaces, handleObj,
				handleObjIn, quick, handlers, special;

			// Don't attach events to noData or text/comment nodes (allow plain objects tho)
			// 过滤文本节点、注释节点、不支持附加扩展属性的DOM元素，以及参数不完整的情况
			// 将elemData指向elem元素的data对象
			if (elem.nodeType === 3 || elem.nodeType === 8 || !types || !handler || !(elemData = jQuery._data(elem))) {
				return;
			}

			// Caller can pass in an object of custom data in lieu of the handler
			if (handler.handler) {
				handleObjIn = handler;
				handler = handleObjIn.handler;
			}

			// Make sure that the handler has a unique ID, used to find/remove it later
			// 为函数分配一个唯一的标识，在移除监听函数时，将通过这个唯一标识来匹配监听函数
			if (!handler.guid) {
				handler.guid = jQuery.guid++;
			}

			// Init the element's event structure and main handler, if this is the first
			// 在elem元素的data对象上初始化events对象
			events = elemData.events;
			if (!events) {
				elemData.events = events = {};
			}
			// 同时在elem元素上添加一个handle属性
			// elem元素的data属性的handle属性存储着主监听函数
			eventHandle = elemData.handle;
			if (!eventHandle) {
				// 初始化eventHandle,相当于一个事件处理的主入口函数
				elemData.handle = eventHandle = function (e) {
					// Discard the second event of a jQuery.event.trigger() and
					// when an event is called after a page has unloaded
					return typeof jQuery !== "undefined" && (!e || jQuery.event.triggered !== e.type) ?
						jQuery.event.dispatch.apply(eventHandle.elem, arguments) :
						undefined;
				};
				// Add elem as a property of the handle fn to prevent a memory leak with IE non-native events
				// 同时将事件处理函数上绑定当前元素对象
				eventHandle.elem = elem;
			}

			// Handle multiple events separated by a space
			// jQuery(...).bind("mouseover mouseout", fn);
			// 同时处理多个绑定事件，将types转换为数组
			types = jQuery.trim(hoverHack(types)).split(" ");
			for (t = 0; t < types.length; t++) {

				tns = rtypenamespace.exec(types[t]) || [];
				type = tns[1];
				namespaces = (tns[2] || "").split(".").sort();

				// If event changes its type, use the special event handlers for the changed type
				special = jQuery.event.special[type] || {};

				// If selector defined, determine special event api type, otherwise given type
				type = (selector ? special.delegateType : special.bindType) || type;

				// Update special based on newly reset type
				special = jQuery.event.special[type] || {};

				// handleObj is passed to all event handlers
				// 封装监听函数为监听对象，用来支持事件模拟、自定义事件数据、事件移除、事件触发、
				// 事件代理、事件命名空间等功能
				handleObj = jQuery.extend({
					type: type,
					origType: tns[1],
					data: data,
					handler: handler,
					guid: handler.guid,
					selector: selector,
					quick: quickParse(selector),
					namespace: namespaces.join(".")
				}, handleObjIn);

				// Init the event handler queue if we're the first
				// 所谓主监听函数是干嘛的呢？没发现主监听函数具体监听的事件
				handlers = events[type];
				if (!handlers) {
					handlers = events[type] = [];
					// 用于指示下一个代理监听对象的插入位置，称为“位置计数器”
					// 初始值为0，每次插入后自动加一，每次移除后自动减一
					handlers.delegateCount = 0;

					// Only use addEventListener/attachEvent if the special events handler returns false
					if (!special.setup || special.setup.call(elem, data, namespaces, eventHandle) === false) {
						// Bind the global event handler to the element
						if (elem.addEventListener) {
							elem.addEventListener(type, eventHandle, false);

						} else if (elem.attachEvent) {
							elem.attachEvent("on" + type, eventHandle);
						}
					}
				}

				if (special.add) {
					special.add.call(elem, handleObj);

					if (!handleObj.handler.guid) {
						handleObj.handler.guid = handler.guid;
					}
				}

				// Add to the element's handler list, delegates in front
				// 传入了参数selector，表示绑定的是代理事件，可能需要把当前事件类型修正为可冒泡的事件类型
				if (selector) {
					handlers.splice(handlers.delegateCount++, 0, handleObj);
				} else {
					handlers.push(handleObj);
				}

				// Keep track of which events have ever been used, for event optimization
				// 记录绑定过的事件类型，这个是在jQuery对象上进行记录
				// 不同对象上绑定的事件会混在一起？？--经过验证好像还真是这样的，感觉有点奇怪
				// 当某个事件被手动触发时，可以方便地通过这个标记来检查是否绑定过该类型的事件
				jQuery.event.global[type] = true;
			}

			// Nullify elem to prevent memory leaks in IE
			// 设置为null，接触参数elem对DOM元素的引用，以避免内存泄漏（IE）
			elem = null;
		},

		global: {},

		// Detach an event or set of events from an element
		// 移除一个或多个类型的事件监听函数
		remove: function (elem, types, handler, selector, mappedTypes) {

			var elemData = jQuery.hasData(elem) && jQuery._data(elem),
				t, tns, type, origType, namespaces, origCount,
				j, events, special, handle, eventType, handleObj;

			// 1. 过滤没有缓存数据或事件缓存对象的情况
			if (!elemData || !(events = elemData.events)) {
				return;
			}

			// Once for each type.namespace in types; type may be omitted
			// 以空格为分隔标记，分隔types为数组
			types = jQuery.trim(hoverHack(types || "")).split(" ");
			for (t = 0; t < types.length; t++) {
				// 解析事件类型和命名空间
				tns = rtypenamespace.exec(types[t]) || [];
				type = origType = tns[1];
				namespaces = tns[2];

				// Unbind all events (on this namespace, if provided) for the element
				// 没有指定事件类型，则移除该命名空间下的所有事件，此时types中存储的是命名空间数组
				if (!type) {
					for (type in events) {
						jQuery.event.remove(elem, type + types[t], handler, selector, true);
					}
					continue;
				}

				// 修正对象用于事件的绑定、代理、触发和移除行为
				special = jQuery.event.special[type] || {};
				// 如果传入selector，则移除的是代理事件，则移除的是代理事件，可能需要把当前事件类型修正为可冒泡的事件类型
				// special.delegateType, 例如不冒泡的focus, blur会被修正为可冒泡的focusin, focusout
				// 如果未传入参数selector,则是普通的事件移除，但是也可能会因为浏览器对某些事件不支持或支持的不完整，
				// 而需要修正为支持度更好的事件类型(special.bindType), 例如mouseenter, mouseleave会被修正为mouseover, mouseout
				type = (selector ? special.delegateType : special.bindType) || type;
				eventType = events[type] || [];
				origCount = eventType.length;
				namespaces = namespaces ? new RegExp("(^|\\.)" + namespaces.split(".").sort().join("\\.(?:.*\\.)?") + "(\\.|$)") : null;

				// Remove matching events
				for (j = 0; j < eventType.length; j++) {
					handleObj = eventType[j];

					/**
					 * 1. 不需要检测原始事件类型，或者监听对象的原始事件类型与传入的相等
					 * 2. 没有指定监听函数，或者监听对象与指定的监听函数具有相同的唯一标识guid
					 * 3. 没有指定命名空间，或者监听对象的命名空间含有指定的命名空间（通过正则表达式namespaces来检测）
					 * 4. 没有传入选择器表达式，或者监听对象的选择器表达式与传入的相等（如果传入的是“**”，
					 *    则表示要移除所有的代理事件，此时只需要监听对象含有选择器表达式即可）
					 */
					if ((mappedTypes || origType === handleObj.origType) &&
						(!handler || handler.guid === handleObj.guid) &&
						(!namespaces || namespaces.test(handleObj.namespace)) &&
						(!selector || selector === handleObj.selector || selector === "**" && handleObj.selector)) {
						eventType.splice(j--, 1);

						if (handleObj.selector) {
							eventType.delegateCount--;
						}
						// 专有的remove方法
						if (special.remove) {
							special.remove.call(elem, handleObj);
						}
					}
				}

				// Remove generic event handler if we removed something and no more handlers exist
				// (avoids potential for endless recursion during removal of special event handlers)
				if (eventType.length === 0 && origCount !== eventType.length) {
					if (!special.teardown || special.teardown.call(elem, namespaces) === false) {
						jQuery.removeEvent(elem, type, elemData.handle);
					}

					delete events[type];
				}
			}

			// Remove the expando if it's no longer used
			// 如果监听对象数组为空，则移除主监听函数
			if (jQuery.isEmptyObject(events)) {
				handle = elemData.handle;
				if (handle) {
					handle.elem = null;
				}

				// removeData also checks for emptiness and clears the expando if empty
				// so use it instead of delete
				jQuery.removeData(elem, ["events", "handle"], true);
			}
		},

		// Events that are safe to short-circuit if no handlers are attached.
		// Native DOM events should not be added, they may have inline handlers.
		customEvent: {
			"getData": true,
			"setData": true,
			"changeData": true
		},

		// 直接在DOM元素关联的事件缓存对象中查找指定类型对应的监听对象数组，然后逐个执行监听对象中的监听函数
		// 因为是之间执行监听函数，所以不会有冒泡阶段，需要手动模拟
		// 在模拟时，先从当前元素开始，沿着DOM树向上遍历，构造出一条冒泡路径，然后出发这条路径是哪个的主监听函数
		// 主监听函数负责事件的分发和执行
		// 该方法还会出发这条路径上元素的事件句柄和默认行为
		// 1. 如果没有传入elem, 则在所有绑定过该类型事件的元素上手动触发事件，称为：全局触发事件
		/**
		 * 
		 * @param {*} event 待触发的事件，可以是事件类型、自定义事件对象或jQuery事件对象
		 * @param {*} data 将被传给主监听函数的数据
		 * @param {*} elem DOM元素，将在该元素上手动触发事件和默认行为
		 * @param {*} onlyHandlers 指示是否执行监听函数，而不会触发默认行为
		 */
		trigger: function (event, data, elem, onlyHandlers) {
			// Don't do events on text and comment nodes0
			if (elem && (elem.nodeType === 3 || elem.nodeType === 8)) {
				return;
			}

			// Event object or event type
			var type = event.type || event,
				namespaces = [],
				cache, exclusive, i, cur, old, ontype, special, handle, eventPath, bubbleType;

			// focus/blur morphs to focusin/out; ensure we're not firing them right now
			// 如果正在触发focus/blur事件的默认行为，浏览器应该自动触发focusin/focusout事件
			// 但是非IE浏览器对这两个事件的支持不太完善，这里把这种差异统一过滤掉，在后面的代码中会统一模拟focusin/focusout事件
			// jQuery.event.triggered指示了正在触发默认行为的事件类型，该属性在触发行为前被设置为事件类型，触发后被设置为undefined
			if (rfocusMorph.test(type + jQuery.event.triggered)) {
				return;
			}

			// 事件类型以感叹号结尾，如click!表示只会触发没有命名空间的监听函数
			if (type.indexOf("!") >= 0) {
				// Exclusive events trigger only for the exact event (no namespaces)
				type = type.slice(0, -1);
				exclusive = true;
			}

			// 存在"."则说明有命名空间存在
			if (type.indexOf(".") >= 0) {
				// Namespaced trigger; create a regexp to match event type in handle()
				namespaces = type.split(".");
				type = namespaces.shift();
				namespaces.sort();
			}

			if ((!elem || jQuery.event.customEvent[type]) && !jQuery.event.global[type]) {
				// No jQuery handlers for this event type, and it can't have inline handlers
				return;
			}

			// Caller can pass in an Event, Object, or just an event type string
			event = typeof event === "object" ?
				// jQuery.Event object
				event[jQuery.expando] ? event :
				// Object literal
				new jQuery.Event(type, event) :
				// Just the event type (string)
				new jQuery.Event(type);

			event.type = type;
			event.isTrigger = true;
			event.exclusive = exclusive;
			event.namespace = namespaces.join(".");
			event.namespace_re = event.namespace ? new RegExp("(^|\\.)" + namespaces.join("\\.(?:.*\\.)?") + "(\\.|$)") : null;
			ontype = type.indexOf(":") < 0 ? "on" + type : "";

			// Handle a global trigger
			if (!elem) {

				// TODO: Stop taunting the data cache; remove global events and always attach to document
				cache = jQuery.cache;
				for (i in cache) {
					if (cache[i].events && cache[i].events[type]) {
						// 只触发事件监听函数，不触发默认行为，因为如果触发所有的默认行为，浏览器的行为将变得混乱和不可预知
						// 比如，可能同时触发多个链接跳转
						jQuery.event.trigger(event, data, cache[i].handle.elem, true);
					}
				}
				return;
			}

			// Clean up the event in case it is being reused
			// 重置为undefined,用于存放事件监听函数的返回值
			event.result = undefined;
			if (!event.target) {
				event.target = elem;
			}

			// Clone any incoming data and prepend the event, creating the handler arg list
			data = data != null ? jQuery.makeArray(data) : [];
			data.unshift(event);

			// Allow special events to draw outside the lines
			special = jQuery.event.special[type] || {};
			if (special.trigger && special.trigger.apply(elem, data) === false) {
				return;
			}

			// Determine event propagation path in advance, per W3C events spec (#9951)
			// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
			// [当前元素，事件类型]
			eventPath = [
				[elem, special.bindType || type]
			];
			// onlyHandlers为true，表示只触发当前元素上的事件监听函数，不会触发默认行为，不会模拟冒泡过程
			// 对应的修正对象的属性delegateType.noBubble是true，即不允许当前事件冒泡，例如load事件
			// 当前元素已经是window对象
			if (!onlyHandlers && !special.noBubble && !jQuery.isWindow(elem)) {
				// 优先使用修正对象的属性delegateType, 该属性指定了当前事件类型所对应的冒泡事件类型
				// 例如，不冒泡的focus对应了冒泡的focusin
				bubbleType = special.delegateType || type;
				cur = rfocusMorph.test(bubbleType + type) ? elem : elem.parentNode;
				old = null;
				// 从当前元素出发，沿着DOM树向上遍历，构造出一条冒泡路径
				for (; cur; cur = cur.parentNode) {
					eventPath.push([cur, bubbleType]);
					old = cur;
				}

				// Only add window if we got to document (e.g., not plain obj or detached DOM)
				if (old && old === elem.ownerDocument) {
					eventPath.push([old.defaultView || old.parentWindow || window, bubbleType]);
				}
			}

			// Fire handlers on the event path
			for (i = 0; i < eventPath.length && !event.isPropagationStopped(); i++) {

				cur = eventPath[i][0];
				event.type = eventPath[i][1];

				// 先检查是否有绑定过该类型的事件，然后获取该元素上绑定的主监听函数
				handle = (jQuery._data(cur, "events") || {})[event.type] && jQuery._data(cur, "handle");
				if (handle) {
					handle.apply(cur, data);
				}
				// Note that this is a bare JS function and not a jQuery handler
				handle = ontype && cur[ontype];
				// 绑定的事件回调函数返回值false，表示阻止改事件的默认行为
				if (handle && jQuery.acceptData(cur) && handle.apply(cur, data) === false) {
					event.preventDefault();
				}
			}
			event.type = type;

			// If nobody prevented the default action, do it now
			// 触发默认行为
			if (!onlyHandlers && !event.isDefaultPrevented()) {
				// special._default是一个预留方法，用于执行特殊的默认行为
				// 不在<a>元素上触发默认行为click,因为很可能导致页面跳转
				// 不在隐藏元素上触发默认行为focus/blur, IE9以下浏览器会抛出异常
				// 不在window对象上触发默认行为，因为window对象时定义全局变量的地方
				// 触发默认行为有可能导致同一个事件触发两次
				if ((!special._default || special._default.apply(elem.ownerDocument, data) === false) &&
					!(type === "click" && jQuery.nodeName(elem, "a")) && jQuery.acceptData(elem)) {

					// Call a native DOM method on the target with the same name name as the event.
					// Can't use an .isFunction() check here because IE6/7 fails that test.
					// Don't do default actions on window, that's where global variables be (#6170)
					// IE<9 dies on focus/blur to hidden element (#1486)
					if (ontype && elem[type] && ((type !== "focus" && type !== "blur") || event.target.offsetWidth !== 0) && !jQuery.isWindow(elem)) {

						// Don't re-trigger an onFOO event when we call its FOO() method
						old = elem[ontype];

						if (old) {
							elem[ontype] = null;
						}

						// Prevent re-triggering of the same event, since we already bubbled it above
						jQuery.event.triggered = type;
						elem[type]();
						jQuery.event.triggered = undefined;

						if (old) {
							elem[ontype] = old;
						}
					}
				}
			}

			return event.result;
		},

		// 分发事件，执行事件的监听函数,有以下四个关键步骤
		/**
		 * 1. 构造jQuery事件对象
		 * 2. 提取后代元素匹配的代理监听对象数组和代理元素上绑定的普通监听对象数组
		 * 3. 执行后代元素匹配的监听对象数组和代理元素上绑定的普通监听对象数组
		 * 4. 返回最后一个有返回值的监听函数的返回值
		 */
		// 如果事件由浏览器触发，测参数event是原生事件，后面会被封装成jQuery事件对象
		// 如果事件是手动触发的，则参数event是jQuery对象
		dispatch: function (event) {

			// Make a writable jQuery.Event from the native event object
			// IE 9以下的浏览器在触发事件时，不会把原生事件对象传给监听函数，需要通过
			// 访问window.event来获取
			// 该方法会返回封装成jQuery事件
			event = jQuery.event.fix(event || window.event);

			// handlers 指向当前事件类型对应的监听对象数组
			// delegateCount 代理监听对象的位置计数器，指示了下一个代理监听对象的插入位置和普通监听对象的起始插入位置
			//               也表示已绑定的代理监听对象个数
			var handlers = ((jQuery._data(this, "events") || {})[event.type] || []),
				delegateCount = handlers.delegateCount,
				args = [].slice.call(arguments, 0),
				run_all = !event.exclusive && !event.namespace,
				// 待执行队列，包含了后代元素匹配的代理监听对象数组，以及当前元素上绑定的普通监听对象数组
				/**
				 * [
				 * {elem: 冒泡路径上的某个后代元素， matches: 该后代元素匹配的代理事件监听数组}
				 * ]
				 */
				handlerQueue = [],
				i, j, cur, jqcur, ret, selMatch, matched, matches, handleObj, sel, related;

			// Use the fix-ed jQuery.Event rather than the (read-only) native event
			args[0] = event;
			event.delegateTarget = this;

			// Determine handlers that should run if there are delegated events
			// Avoid disabled elements in IE (#6911) and non-left-click bubbling in Firefox (#3861)
			if (delegateCount && !event.target.disabled && !(event.button && event.type === "click")) {

				// Pregenerate a single jQuery object for reuse with .is()
				jqcur = jQuery(this);
				jqcur.context = this.ownerDocument || this;

				// 冒泡机制，从目标元素开始，一直往上冒泡
				for (cur = event.target; cur != this; cur = cur.parentNode || this) {
					selMatch = {};
					matches = [];
					jqcur[0] = cur;
					for (i = 0; i < delegateCount; i++) {
						handleObj = handlers[i];
						sel = handleObj.selector;

						if (selMatch[sel] === undefined) {
							selMatch[sel] = (
								handleObj.quick ? quickIs(cur, handleObj.quick) : jqcur.is(sel)
							);
						}
						if (selMatch[sel]) {
							matches.push(handleObj);
						}
					}
					if (matches.length) {
						handlerQueue.push({
							elem: cur,
							matches: matches
						});
					}
				}
			}

			// Add the remaining (directly-bound) handlers
			if (handlers.length > delegateCount) {
				handlerQueue.push({
					elem: this,
					matches: handlers.slice(delegateCount)
				});
			}

			// Run delegates first; they may want to stop propagation beneath us
			// 用两层for循环执行后代元素匹配的代理监听对象数组和代理元素上绑定的普通监听对象数组
			// 第一层遍历有监听对象的元素，第二层遍历元素对应的监听对象数组，并执行监听对象中的监听函数
			// isPropagationStopped 模拟实现了停止事件传播，调用方法event.stopPropagation会导致该方法返回true
			for (i = 0; i < handlerQueue.length && !event.isPropagationStopped(); i++) {
				matched = handlerQueue[i];
				event.currentTarget = matched.elem;

				// isImmediatePropagationStopped模拟了实现了立即停止事件传播，不再执行当前元素和其他元素的监听函数
				for (j = 0; j < matched.matches.length && !event.isImmediatePropagationStopped(); j++) {
					handleObj = matched.matches[j];

					// Triggered event must either 1) be non-exclusive and have no namespace, or
					// 2) have namespace(s) a subset or equal to those in the bound event (both can have no namespace).
					if (run_all || (!event.namespace && !handleObj.namespace) || event.namespace_re && event.namespace_re.test(handleObj.namespace)) {

						event.data = handleObj.data;
						event.handleObj = handleObj;

						ret = ((jQuery.event.special[handleObj.origType] || {}).handle || handleObj.handler)
							.apply(matched.elem, args);

						if (ret !== undefined) {
							event.result = ret;
							// 返回false表示停止冒泡和传播，阻止默认行为
							// 此处与浏览器事件模型不一致，在浏览器事件模型中，如果监听函数返回false，只会阻止默认行为，不会停止事件传播
							if (ret === false) {
								event.preventDefault();
								event.stopPropagation();
							}
						}
					}
				}
			}

			return event.result;
		},

		// Includes some event props shared by KeyEvent and MouseEvent
		// *** attrChange attrName relatedNode srcElement  are not normalized, non-W3C, deprecated, will be removed in 1.8 ***
		// 事件对象的公共属性
		props: "attrChange attrName relatedNode srcElement altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),

		// 事件属性的修正对象
		fixHooks: {},

		// 键盘事件对象的属性和修正方法
		keyHooks: {
			props: "char charCode key keyCode".split(" "),
			filter: function (event, original) {

				// Add which for key events
				// 如果事件属性which不存在，则依次尝试从可打印字符码charCode,虚拟按键码keyCode中读取
				if (event.which == null) {
					event.which = original.charCode != null ? original.charCode : original.keyCode;
				}

				return event;
			}
		},

		// 鼠标事件对象的属性和修正方法
		mouseHooks: {
			props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
			filter: function (event, original) {
				var eventDoc, doc, body,
					button = original.button,
					fromElement = original.fromElement;

				// Calculate pageX/Y if missing and clientX/Y available
				if (event.pageX == null && original.clientX != null) {
					eventDoc = event.target.ownerDocument || document;
					doc = eventDoc.documentElement;
					body = eventDoc.body;

					/**
					 * 如果浏览器不支持文档坐标pageX，pageY，则手动计算他们，计算公式为：
					 * 距文档左坐标 pageX=距窗口左坐标clientX + 水平滚动便宜-文档做边框厚度
					 * 距文档上坐标pageY = 距窗口上坐标clientY + 垂直滚动偏移 - 文档上边框厚度
					 */
					event.pageX = original.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc && doc.clientLeft || body && body.clientLeft || 0);
					event.pageY = original.clientY + (doc && doc.scrollTop || body && body.scrollTop || 0) - (doc && doc.clientTop || body && body.clientTop || 0);
				}

				// Add relatedTarget, if necessary
				/**
				 * relatedTarget事件属性返回与事件的目标节点相关的节点
				 * 1. mouseover， 该属性是鼠标指针移到目标节点上时所离开的那个节点
				 * 2. mouseout，该属性是离开目标时，鼠标指针进入的节点
				 * 对于其他类型事件来说这个属性没有用
				 */
				if (!event.relatedTarget && fromElement) {
					event.relatedTarget = fromElement === event.target ? original.toElement : fromElement;
				}

				// Add which for click: 1 === left; 2 === middle; 3 === right
				// Note: button is not normalized, so don't use it
				/**
				 * which属性返回onkeypress, onkeydown,onkeyup事件触发的键的值的字符代码
				 */
				if (!event.which && button !== undefined) {
					event.which = (button & 1 ? 1 : (button & 2 ? 3 : (button & 4 ? 2 : 0)));
				}

				return event;
			}
		},

		// 把原生事件对象封装为jQuery事件对象，并修正不兼容性
		// 事件属性修正方法--会把大部分原生事件对象的属性复制到jQuery事件对象上的，并对一些不兼容性进行修正
		// 当浏览器触发事件时，方法调用链为：
		// 主监听函数-->jQuery.event.dispatch-->jQuery.event.fixed-->jQuery.Event
		fix: function (event) {
			// event可以是原生事件对象或jQuery对象
			// 如果参数event含有属性jQuery.expando,说明该参数是一个jQuery事件对象
			// 不需要再执行后面的封装和修正的代码
			if (event[jQuery.expando]) {
				return event;
			}

			// Create a writable copy of the event object and normalize some properties
			var i, prop,
				originalEvent = event,
				fixHook = jQuery.event.fixHooks[event.type] || {},
				copy = fixHook.props ? this.props.concat(fixHook.props) : this.props;

			event = jQuery.Event(originalEvent);

			// 倒序遍历方式的简洁性
			for (i = copy.length; i;) {
				prop = copy[--i];
				event[prop] = originalEvent[prop];
			}

			// Fix target property, if necessary (#1925, IE 6/7/8 & Safari2)
			if (!event.target) {
				event.target = originalEvent.srcElement || document;
			}

			// Target should not be a text node (#504, Safari)
			if (event.target.nodeType === 3) {
				event.target = event.target.parentNode;
			}

			// For mouse/key events; add metaKey if it's not there (#3368, IE6/7/8)
			if (event.metaKey === undefined) {
				event.metaKey = event.ctrlKey;
			}

			return fixHook.filter ? fixHook.filter(event, originalEvent) : event;
		},

		// 用于修正事件的绑定、代理、触发和移除行为
		// 该对象中存放了事件类型和修正对象的映射，修正对象包含以下各个属性
		/**
		 * noBubble, bindType, delegateType, setup, teardown, handle, add
		 * remove，trigger, _default
		 * 可能需要修正的事件有：
		 * ready, load, beforeunload, focus, blur, mouseenter, mouseleave, submit
		 * change, focusin focusout
		 */
		special: {
			ready: {
				// Make sure the ready event is setup
				// 用于执行特殊的主监听函数绑定行为，或者执行必须的初始化操作
				// 在第一次绑定当前类型的事件时被调用
				setup: jQuery.bindReady
			},

			// load事件本身是不冒泡的，但是当手动调用方法jQuery.event.trigger手动触发load事件时，该
			// 方法会构造一条从当前元素到window对象的冒泡路径，然后触发这条路径上元素的主监听函数和行内监听函数
			// 以此来模拟冒泡过程
			// 当一个资源以及其依赖资源已完成加载时，将触发load事件
			load: {
				// Prevent triggered image.load events from bubbling to window.load
				// 指示当前事件类型不支持或不允许冒泡
				noBubble: true
			},

			// 在为不冒泡的focus/blur应用事件代理时，需要把事件类型修正为支持冒泡的focusing/focusout
			focus: {
				// 指示绑定代理事件时使用的事件类型
				delegateType: "focusin"
			},
			blur: {
				delegateType: "focusout"
			},

			// 在页面刷新或关闭时被触发，如果对应的监听函数返回一个非空字符串，
			// 则会弹出一个确认对话框，让用户选择继续留在当前页面或离开
			// 监听函数可以返回除undefined和null以外的任意值，在确认对话框中，将会显示返回值的字符串形式
			beforeunload: {
				setup: function (data, namespaces, eventHandle) {
					// We only want to do this special case on windows
					if (jQuery.isWindow(this)) {
						this.onbeforeunload = eventHandle;
					}
				},

				// 用于执行特殊的主监听函数移除行为，在当前类型的事件全部移除后被调用
				teardown: function (namespaces, eventHandle) {
					if (this.onbeforeunload === eventHandle) {
						this.onbeforeunload = null;
					}
				}
			}
		},

		// 借助一个原生事件对象或jQuery事件对象，来为不支持冒泡的事件模拟冒泡过程
		simulate: function (type, elem, event, bubble) {
			// Piggyback on a donor event to simulate a different one.
			// Fake originalEvent to avoid donor's stopPropagation, but if the
			// simulated event prevents default then we do the same on the donor.
			var e = jQuery.extend(
				new jQuery.Event(),
				event, {
					type: type,
					isSimulated: true, // 设置isSimulated为true
					originalEvent: {}
				}
			);
			if (bubble) {
				jQuery.event.trigger(e, null, elem);
			} else {
				jQuery.event.dispatch.call(elem, e);
			}
			if (e.isDefaultPrevented()) {
				event.preventDefault();
			}
		}
	};

	// Some plugins are using, but it's undocumented/deprecated and will be removed.
	// The 1.7 special event interface should provide all the hooks needed now.
	/**
	 * DOM元素关联的数据缓存对象的属性handle称为该DOM元素的主监听函数，负责分发事件和执行监听函数
	 * 对于一个DOM元素，jQuery事件系统只会为之分配一个主监听函数，并且所有类型的事件在被绑定时，
	 * 真正绑定到元素上的只有这个主监听函数
	 * 传入的监听函数则被封装成监听对象，存储在事件类型对应的监听对象数组events[type]中
	 * 如果是第一次绑定某个类型的事件，则调用原生方法addEventListener或attachEvent把主监听函数绑定到元素上
	 */
	// 主监听函数是真正绑定到元素上的监听函数，负责分发事件和执行监听函数
	// 这点如何理解？click这些没有指定绑定到主函数上，如果通过DOM绑定同一个
	// 事件和jQuery上的事件之间会有冲突吗？？
	jQuery.event.handle = jQuery.event.dispatch;

	// 移除主监听函数
	jQuery.removeEvent = document.removeEventListener ?
		function (elem, type, handle) {
			if (elem.removeEventListener) {
				elem.removeEventListener(type, handle, false);
			}
		} :
		function (elem, type, handle) {
			if (elem.detachEvent) {
				elem.detachEvent("on" + type, handle);
			}
		};

	// jQuery事件对象
	// 1.构造函数
	/**
	 * 用于创建一个jQUery对象，创建时new操作符是可选的
	 * 当浏览器触发事件时，方法调用链为：主监听函数->jQuery.event.dispatch->
	 * jQuery.event.fix->jQuery.Event
	 * 当手动触发事件时，方法调用链为：事件便捷方法->.trigger/triggerHandler->jQuery.Event
	 */
	jQuery.Event = function (src, props) {
		// Allow instantiation without the 'new' keyword
		// 调用该函数时可以不用new,这里对这种情况进行处理
		if (!(this instanceof jQuery.Event)) {
			return new jQuery.Event(src, props);
		}

		// Event object
		// 参数src是原生事件对象（通过检测是否含有特征属性type来判断）
		if (src && src.type) {
			// 备份原生事件
			this.originalEvent = src;
			// 修正事件属性type
			this.type = src.type;

			// Events bubbling up the document may have been marked as prevented
			// by a handler lower down the tree; reflect the correct value.
			// 如果当前事件在冒泡过程中已经被另一个更底层的事件监听函数阻止了默认行为，则修正事件方法isDefaulePrevented为函数returnTrue，如果未被
			// 阻止则修正为函数returnFalse
			this.isDefaultPrevented = (src.defaultPrevented || src.returnValue === false ||
				src.getPreventDefault && src.getPreventDefault()) ? returnTrue : returnFalse;

			// Event type
		} else {
			// 参数src是事件类型，设置到jQuery事件对象的属性type上
			this.type = src;
		}

		// Put explicitly provided properties onto the event object
		if (props) {
			// 扩展自定义事件属性
			jQuery.extend(this, props);
		}

		// Create a timestamp if incoming event doesn't have one
		// 修正时间戳，原生事件类型上有timestamp属性
		this.timeStamp = src && src.timeStamp || jQuery.now();

		// Mark it as fixed
		// 标记该对象上已有jQuery事件对象
		this[jQuery.expando] = true;
	};

	function returnFalse() {
		return false;
	}

	function returnTrue() {
		return true;
	}

	// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
	// http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
	// 2.原型对象
	jQuery.Event.prototype = {
		// 阻止浏览器默认行为
		preventDefault: function () {
			this.isDefaultPrevented = returnTrue;

			var e = this.originalEvent;
			if (!e) {
				return;
			}

			// if preventDefault exists run it on the original event
			if (e.preventDefault) {
				e.preventDefault();

				// otherwise set the returnValue property of the original event to false (IE)
			} else {
				e.returnValue = false;
			}
		},
		// 停止事件传播--阻止任何祖先元素收到这个事件
		stopPropagation: function () {
			this.isPropagationStopped = returnTrue;

			var e = this.originalEvent;
			// 如果原生事件对象originalEvent不存在，说明当前对象一个自定义事件对象
			// 不会有事件传播行为，可以直接返回
			if (!e) {
				return;
			}
			// if stopPropagation exists run it on the original event
			if (e.stopPropagation) {
				e.stopPropagation();
			}
			// otherwise set the cancelBubble property of the original event to true (IE)
			e.cancelBubble = true;
		},
		// 立即停止事件执行和事件传播
		stopImmediatePropagation: function () {
			this.isImmediatePropagationStopped = returnTrue;
			this.stopPropagation();
		},
		// 调用了上面preventDefault方法，会设置该isDefaultPrevented为returnTrue
		isDefaultPrevented: returnFalse,
		isPropagationStopped: returnFalse,
		isImmediatePropagationStopped: returnFalse
	};

	// Create mouseenter/leave events using mouseover/out and event-time checks
	// mouseenter和mouseleave在鼠标指针进入和离开元素时被触发，不支持冒泡
	// mouseover和mouseout在鼠标指针进入和离开元素时触发，支持冒泡
	// 事件委托是通过事件冒泡的原理，利用父级去触发子级的事件，利用事件委托的话，只需要给父级
	// 绑定一个事件监听，即可让每个子元素上绑定上相应的事件
	/**
	 * 例如，事件委托的例子
	 * $('#wrap').delegate('li', 'click', function(ev){})
	 * 表示由id为wrap的父元素来代理子元素的点击事件，
	 * 此外on函数也可以实现事件绑定：$('#warp').on('click', 'li', function(ev){})
	 */
	jQuery.each({
		mouseenter: "mouseover",
		mouseleave: "mouseout"
	}, function (orig, fix) {
		jQuery.event.special[orig] = {
			delegateType: fix,
			bindType: fix,

			// 此函数实现用mouseover、mouseout模拟事件mouseenter、mouseleave
			handle: function (event) {
				var target = this,
					related = event.relatedTarget,
					handleObj = event.handleObj,
					selector = handleObj.selector,
					ret;

				/**
				 * 分为以下三种情况：
				 * 1. 鼠标指针从父元素进入子元素时，将会过滤在父元素上触发的mouseout事件和从子元素冒泡到父元素的mouseover事件，只处理在子元素上触发的mouseover事件
				 * 2. 鼠标指针从子元素进入父元素时，将会过滤从子元素冒泡到父元素的mouseout事件和在父元素上触发的mouseover事件，只处理在子元素上触发的mouseout事件
				 * 3. 鼠标指针进入和离开浏览器窗口时，事件mouseover、mouseout的属性relatedTarget不存在，此时可以直接在当前元素上触发监听函数
				 */
				// For mousenter/leave call the handler if related is outside the target.
				// NB: No relatedTarget if the mouse left/entered the browser window
				if (!related || (related !== target && !jQuery.contains(target, related))) {
					event.type = handleObj.origType;
					ret = handleObj.handler.apply(this, arguments);
					event.type = fix;
				}
				return ret;
			}
		};
	});

	// IE submit delegation
	// 首先检测submit是否支持冒泡事件，如果不支持冒泡则有以下兼容性方法
	if (!jQuery.support.submitBubbles) {
		// 在IE9以下的浏览器中，事件submit不支持冒泡，jQuery事件系统通过该修正对象模拟实现了
		// submit事件的监听和冒泡过程， 模拟过程统一在命名空间._submit下进行
		jQuery.event.special.submit = {
			setup: function () {
				// Only need this for delegated form submit events、
				// 这种情况下不需要模拟冒泡过程，当前元素上绑定的submit事件会被直接触发
				// 如果setup函数返回false，则继续调用原生方法addEventListener或attachEvent绑定主监听函数
				if (jQuery.nodeName(this, "form")) {
					return false;
				}

				// Lazy-add a submit handler when a descendant form may potentially be submitted
				// 一次绑定多个事件，每个事件由空格分隔，"."指定事件的命名空间
				jQuery.event.add(this, "click._submit keypress._submit", function (e) {
					// Node name check avoids a VML-related crash in IE (#9807)
					// 如果触发事件的是某个表单中的input或button元素，并且没有在该表单上绑定过submit._submit事件，
					// 则为该form绑定一次submit，当有submit事件被触发时，通过simulate来模仿
					// elem.form指向其form表单
					var elem = e.target,
						form = jQuery.nodeName(elem, "input") || jQuery.nodeName(elem, "button") ? elem.form : undefined;
					if (form && !form._submit_attached) {
						jQuery.event.add(form, "submit._submit", function (event) {
							// If form was submitted by the user, bubble the event up the tree
							if (this.parentNode && !event.isTrigger) {
								jQuery.event.simulate("submit", this.parentNode, event, true);
							}
						});
						form._submit_attached = true;
					}
				});
				// return undefined since we don't need an event listener
			},

			teardown: function () {
				// Only need this for delegated form submit events
				if (jQuery.nodeName(this, "form")) {
					return false;
				}

				// Remove delegated handlers; cleanData eventually reaps submit handlers attached above
				jQuery.event.remove(this, "._submit");
			}
		};
	}

	// IE change delegation and checkbox/radio fix
	if (!jQuery.support.changeBubbles) {
		// 模拟实现change事件的监听和冒泡过程，模拟过程统一在命名空间"_change"下进行
		jQuery.event.special.change = {
			// 通过在代理元素上绑定beforeactivate事件来监听表单元素textarea、input、select的change事件，
			// 在change事件的监听函数中会调用jQuery.event.special.simulate(type, elem, event, bubble)
			// 来模拟change事件的冒泡过程，执行change代理监听函数
			setup: function () {
				// 如果是表单元素（textarea,input,select之一），不需要使用事件代理，，change会直接在当前元素上触发
				// 只需要执行正常的事件绑定过程
				if (rformElems.test(this.nodeName)) {
					// IE doesn't fire change on a check/radio until blur; trigger it on click
					// after a propertychange. Eat the blur-change in special.change.handle.
					// This still fires onchange a second time for check/radio after blur.
					// 如果当前元素时复选框或单选按钮，则用propertychange事件来监听选中状态checked的改变
					// 在IE9以下的浏览器中，不会被立即触发复选框和单选按钮的change事件，直到失去焦点才会触发
					if (this.type === "checkbox" || this.type === "radio") {
						jQuery.event.add(this, "propertychange._change", function (event) {
							if (event.originalEvent.propertyName === "checked") {
								this._just_changed = true;
							}
						});
						jQuery.event.add(this, "click._change", function (event) {
							if (this._just_changed && !event.isTrigger) {
								this._just_changed = false;
								jQuery.event.simulate("change", this, event, true);
							}
						});
					}
					// 返回false，继续在表单元素上绑定change事件的主监听函数
					return false;
				}
				// Delegated event; lazy-add a change handler on descendant inputs
				// 如果当前元素不是表单元素（是代理元素）（textarea,input,select)
				// beforeactivate事件来监听可能会改变选中状态checked的操作，在元素得到焦点前被触发
				// 该事件仅IE支持
				jQuery.event.add(this, "beforeactivate._change", function (e) {
					var elem = e.target;
					// 通过_change_attached来指示，只绑定一次change事件
					if (rformElems.test(elem.nodeName) && !elem._change_attached) {
						jQuery.event.add(elem, "change._change", function (event) {
							// isSimulated：当前事件是否是模拟事件,在模拟事件时，会设置该属性为true，并且会模拟冒泡过程
							// isTrigger: 当前事件是否被手动触发过，在手动触发时，设置该属性为true，并且会模拟冒泡过程
							if (this.parentNode && !event.isSimulated && !event.isTrigger) {
								jQuery.event.simulate("change", this.parentNode, event, true);
							}
						});
						elem._change_attached = true;
					}
				});
			},

			handle: function (event) {
				var elem = event.target;

				// Swallow native change events from checkbox/radio, we already triggered them above
				if (this !== elem || event.isSimulated || event.isTrigger || (elem.type !== "radio" && elem.type !== "checkbox")) {
					return event.handleObj.handler.apply(this, arguments);
				}
			},

			teardown: function () {
				jQuery.event.remove(this, "._change");

				// 应该修正为！rformElems.test(this.nodeName)
				/**
				 * 对于表单元素textarea,input,select会返回false，从而可以继续移除这些元素上绑定的主监听函数
				 * 对于非表单元素，则返回true，因为在修正方法setup中，对于非表单元素通过beforeactivate事件来监听可能会
				 *     改变选中状态checked的操作，并且没有返回值，不会在非表单元素上绑定主监听函数
				 */
				return rformElems.test(this.nodeName);
			}
		};
	}

	// Create "bubbling" focus and blur events
	if (!jQuery.support.focusinBubbles) {
		jQuery.each({
			focus: "focusin",
			blur: "focusout"
		}, function (orig, fix) {

			// Attach a single capturing handler while someone wants focusin/focusout
			// attaches是一个计数器，用于记录绑定focusin, focusout事件的次数，该变量的初始值为0，
			// 当绑定事件时自动加1，当移除事件时自动减1
			var attaches = 0,
				handler = function (event) {
					jQuery.event.simulate(fix, event.target, jQuery.event.fix(event), true);
				};

			jQuery.event.special[fix] = {
				setup: function () {
					if (attaches++ === 0) {
						// 1. 直接在document上添加，所以只需要添加一次
						// 2. 监听函数添加在事件捕获阶段
						// 3. 当某个元素出发focus、blur事件时，这个主监听函数将被触发，主监听函数内部再通过调用simulate方法
						//     来模拟focusin和focusout事件的冒泡过程
						/**
						 * EventTarget.addEventListener方法将指定的监听器注册到EventTarget上，实质是添加到调用它的
						 * EventTarget上的指定事件类型的事件侦听器列表中
						 * 1. target.addEventListener(type, listener[, options])
						 * 2. target.addEventListener(type, listener[, useCapture])
						 * type 表示监听事件类型的字符串，所有事件类型参考【https://developer.mozilla.org/zh-CN/docs/Web/Events】
						 * listener，一个实现了EventListener接口的对象，或者是一个函数
						 * options，指定有关listener属性的可选参数对象，主要有以下：
						 * 			capture： Boolean, 表示listener会在该类型的事件捕获阶段传播到改EventTarget时触发
						 * 			once：Boolean, 表示listener在添加之后最多只调用一次，如果是true，listener会在其被调用之后自动移除
						 * 			passive: Boolean, 设置为true时，表示listener永远不会调用preventDefault，如果listener仍然调用了这个函数，客户端将会忽略它，
						 * 						并抛出一个控制台警告
						 * useCapture, 在DOM树中，注册了listener的元素，是否要先于它下面的EventTarget，调用该listener；
						 * 				当useCapture设置为true时，沿着DOM树向上冒泡的事件不会触发listener
						 *  */	
						document.addEventListener(orig, handler, true);
					}
				},
				teardown: function () {
					if (--attaches === 0) {
						document.removeEventListener(orig, handler, true);
					}
				}
			};
		});
	}

	jQuery.fn.extend({

		// 统一的事件绑定方法
		/**
		 * 用于为匹配元素集合中的每个元素绑定一个或多个类型的事件监听函数
		 * 方法调用链为：one/bind/delegate/live/事件便捷方法-->on-->jQuery.event.add-->
		 * addEventListener/attachEvent/jQuery._data
		 * 
		 * types为事件类型字符串，多个事件类型之间用空格隔开；事件类型可以含有一个或多个命名空间，
		 * 多个命名空间用句号隔开：click._submit keypress._submit
		 * 可以是浏览器标准事件，也可以是用户自定义事件类型
		 */
		on: function (types, selector, data, fn, /*INTERNAL*/ one) {
			var origFn, type;

			// Types can be a map of types/handlers
			if (typeof types === "object") {
				// ( types-Object, selector, data )
				if (typeof selector !== "string") {
					// ( types-Object, data )
					data = selector;
					selector = undefined;
				}
				// 参数events是对象，遍历参数events，递归调用方法on,绑定事件
				for (type in types) {
					this.on(type, selector, data, types[type], one);
				}
				return this;
			}

			if (data == null && fn == null) {
				// ( types, fn )
				fn = selector;
				data = selector = undefined;
			} else if (fn == null) {
				if (typeof selector === "string") {
					// ( types, selector, fn )
					fn = data;
					data = undefined;
				} else {
					// ( types, data, fn )
					fn = data;
					data = selector;
					selector = undefined;
				}
			}
			if (fn === false) {
				fn = returnFalse;
			} else if (!fn) {
				return this;
			}

			if (one === 1) {
				// 通过封装，使得监听函数最多执行一次
				origFn = fn;
				fn = function (event) {
					// Can use an empty set, since event contains the info
					jQuery().off(event);
					return origFn.apply(this, arguments);
				};
				// Use same guid so caller can remove using origFn
				fn.guid = origFn.guid || (origFn.guid = jQuery.guid++);
			}
			return this.each(function () {
				jQuery.event.add(this, types, fn, data, selector);
			});
		},
		// 绑定最多执行一次的事件监听函数
		one: function (types, selector, data, fn) {
			return this.on.call(this, types, selector, data, fn, 1);
		},
		// 统一的事件移除方法
		// 方法调用链为：unbind/delegate/die-->off-->jQuery.event.remove
		// -->jQuery._data/removeEventListener/detachEvent
		// 从jQuery1.7开始，推荐优先使用方法.on和.off来绑定和移除事件
		off: function (types, selector, fn) {
			// 1. 参数types是jQuery事件对象，则以对应的监听对象的属性作为参数，递归调用off移除事件
			if (types && types.preventDefault && types.handleObj) {
				// ( event )  dispatched jQuery.Event
				var handleObj = types.handleObj;
				// 目标对象：监听函数被绑定的元素，先将目标对象封装成jQuery对象
				jQuery(types.delegateTarget).off(
					handleObj.namespace ? handleObj.type + "." + handleObj.namespace : handleObj.type,
					handleObj.selector,
					handleObj.handler
				);
				return this;
			}
			// 2. 如果参数是对象，则遍历参数events，递归调用方法.off移除事件
			if (typeof types === "object") {
				// ( types-object [, selector] )
				for (var type in types) {
					this.off(type, selector, types[type]);
				}
				return this;
			}
			// 没有传入selector,此时selector为function类型，即待移除的监听函数
			if (selector === false || typeof selector === "function") {
				// ( types [, fn] )
				fn = selector;
				selector = undefined;
			}
			// 传入的待移除函数为布尔值false，则修正为总是返回false的函数
			if (fn === false) {
				fn = returnFalse;
			}
			return this.each(function () {
				jQuery.event.remove(this, types, fn, selector);
			});
		},

		// 遗留方法
		bind: function (types, data, fn) {
			return this.on(types, null, data, fn);
		},
		unbind: function (types, fn) {
			return this.off(types, null, fn);
		},

		// 强制绑定事件到this.context上，一般是document
		live: function (types, data, fn) {
			jQuery(this.context).on(types, this.selector, data, fn);
			return this;
		},
		die: function (types, fn) {
			jQuery(this.context).off(types, this.selector || "**", fn);
			return this;
		},

		// 事件绑定，将事件处理函数绑定在指定的根元素上，由于事件会冒泡，它用来处理指定的子元素上的事件
		// 可以实现自动绑定添加的子元素--重要作用
		delegate: function (selector, types, data, fn) {
			return this.on(types, selector, data, fn);
		},
		undelegate: function (selector, types, fn) {
			// ( namespace ) or ( selector, types [, fn] )
			return arguments.length == 1 ? this.off(selector, "**") : this.off(types, selector, fn);
		},

		// 执行每个匹配元素上绑定的监听函数和默认行为，并模拟冒泡过程
		trigger: function (type, data) {
			return this.each(function () {
				// 注意此处传入的参数为this, 为匹配元素的全部集合
				jQuery.event.trigger(type, data, this);
			});
		},
		// 用于执行第一个匹配元素上绑定的监听函数，并模拟冒泡过程，但不触发默认行为
		triggerHandler: function (type, data) {
			if (this[0]) {
				// 注意此处传入的参数为this[0], 表示匹配元素的第一个元素
				return jQuery.event.trigger(type, data, this[0], true);
			}
		},

		// 绑定点击时，轮流执行的监听函数
		toggle: function (fn) {
			// Save reference to arguments for access in closure
			var args = arguments,
				guid = fn.guid || jQuery.guid++,
				i = 0,
				toggler = function (event) {
					// Figure out which function to execute
					var lastToggle = (jQuery._data(this, "lastToggle" + fn.guid) || 0) % i;
					jQuery._data(this, "lastToggle" + fn.guid, lastToggle + 1);

					// Make sure that clicks stop
					event.preventDefault();

					// and execute the function
					return args[lastToggle].apply(this, arguments) || false;
				};

			// link all the functions, so any of them can unbind this click handler
			toggler.guid = guid;
			while (i < args.length) {
				args[i++].guid = guid;
			}

			return this.click(toggler);
		},

		// 绑定鼠标指针进入和离开时执行的事件监听函数
		hover: function (fnOver, fnOut) {
			return this.mouseenter(fnOver).mouseleave(fnOut || fnOver);
		}
	});

	// 事件便捷方法
	jQuery.each(("blur focus focusin focusout load resize scroll unload click dblclick " +
		"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
		"change select submit keydown keypress keyup error contextmenu").split(" "), function (i, name) {

		// Handle event binding
		jQuery.fn[name] = function (data, fn) {
			if (fn == null) {
				fn = data;
				data = null;
			}

			return arguments.length > 0 ?
				this.on(name, null, data, fn) :
				this.trigger(name);
		};

		if (jQuery.attrFn) {
			jQuery.attrFn[name] = true;
		}

		if (rkeyEvent.test(name)) {
			jQuery.event.fixHooks[name] = jQuery.event.keyHooks;
		}

		if (rmouseEvent.test(name)) {
			jQuery.event.fixHooks[name] = jQuery.event.mouseHooks;
		}
	});



	/*!
	 * Sizzle CSS Selector Engine
	 *  Copyright 2011, The Dojo Foundation
	 *  Released under the MIT, BSD, and GPL Licenses.
	 *  More information: http://sizzlejs.com/
	 */
	// Sizzle选择器引擎部分
	(function () {

		var chunker = /((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^\[\]]*\]|['"][^'"]*['"]|[^\[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?((?:.|\r|\n)*)/g,
			expando = "sizcache" + (Math.random() + '').replace('.', ''),
			done = 0,
			toString = Object.prototype.toString,
			hasDuplicate = false,
			baseHasDuplicate = true,
			rBackslash = /\\/g,
			rReturn = /\r\n/g,
			rNonWord = /\W/;

		// Here we check if the JavaScript engine is using some sort of
		// optimization where it does not always call our comparision
		// function. If that is the case, discard the hasDuplicate value.
		//   Thus far that includes Google Chrome.
		[0, 0].sort(function () {
			baseHasDuplicate = false;
			return 0;
		});

		var Sizzle = function (selector, context, results, seed) {
			results = results || [];
			context = context || document;

			var origContext = context;

			if (context.nodeType !== 1 && context.nodeType !== 9) {
				return [];
			}

			if (!selector || typeof selector !== "string") {
				return results;
			}

			var m, set, checkSet, extra, ret, cur, pop, i,
				prune = true,
				contextXML = Sizzle.isXML(context),
				parts = [],
				soFar = selector;

			// Reset the position of the chunker regexp (start from head)
			do {
				chunker.exec("");
				m = chunker.exec(soFar);

				if (m) {
					soFar = m[3];

					parts.push(m[1]);

					if (m[2]) {
						extra = m[3];
						break;
					}
				}
			} while (m);

			if (parts.length > 1 && origPOS.exec(selector)) {

				if (parts.length === 2 && Expr.relative[parts[0]]) {
					set = posProcess(parts[0] + parts[1], context, seed);

				} else {
					set = Expr.relative[parts[0]] ? [context] :
						Sizzle(parts.shift(), context);

					while (parts.length) {
						selector = parts.shift();

						if (Expr.relative[selector]) {
							selector += parts.shift();
						}

						set = posProcess(selector, set, seed);
					}
				}

			} else {
				// Take a shortcut and set the context if the root selector is an ID
				// (but not if it'll be faster if the inner selector is an ID)
				if (!seed && parts.length > 1 && context.nodeType === 9 && !contextXML &&
					Expr.match.ID.test(parts[0]) && !Expr.match.ID.test(parts[parts.length - 1])) {

					ret = Sizzle.find(parts.shift(), context, contextXML);
					context = ret.expr ?
						Sizzle.filter(ret.expr, ret.set)[0] :
						ret.set[0];
				}

				if (context) {
					ret = seed ? {
							expr: parts.pop(),
							set: makeArray(seed)
						} :
						Sizzle.find(parts.pop(), parts.length === 1 && (parts[0] === "~" || parts[0] === "+") && context.parentNode ? context.parentNode : context, contextXML);

					set = ret.expr ?
						Sizzle.filter(ret.expr, ret.set) :
						ret.set;

					if (parts.length > 0) {
						checkSet = makeArray(set);

					} else {
						prune = false;
					}

					while (parts.length) {
						cur = parts.pop();
						pop = cur;

						if (!Expr.relative[cur]) {
							cur = "";
						} else {
							pop = parts.pop();
						}

						if (pop == null) {
							pop = context;
						}

						Expr.relative[cur](checkSet, pop, contextXML);
					}

				} else {
					checkSet = parts = [];
				}
			}

			if (!checkSet) {
				checkSet = set;
			}

			if (!checkSet) {
				Sizzle.error(cur || selector);
			}

			if (toString.call(checkSet) === "[object Array]") {
				if (!prune) {
					results.push.apply(results, checkSet);

				} else if (context && context.nodeType === 1) {
					for (i = 0; checkSet[i] != null; i++) {
						if (checkSet[i] && (checkSet[i] === true || checkSet[i].nodeType === 1 && Sizzle.contains(context, checkSet[i]))) {
							results.push(set[i]);
						}
					}

				} else {
					for (i = 0; checkSet[i] != null; i++) {
						if (checkSet[i] && checkSet[i].nodeType === 1) {
							results.push(set[i]);
						}
					}
				}

			} else {
				makeArray(checkSet, results);
			}

			if (extra) {
				Sizzle(extra, origContext, results, seed);
				Sizzle.uniqueSort(results);
			}

			return results;
		};

		Sizzle.uniqueSort = function (results) {
			if (sortOrder) {
				hasDuplicate = baseHasDuplicate;
				results.sort(sortOrder);

				if (hasDuplicate) {
					for (var i = 1; i < results.length; i++) {
						if (results[i] === results[i - 1]) {
							results.splice(i--, 1);
						}
					}
				}
			}

			return results;
		};

		Sizzle.matches = function (expr, set) {
			return Sizzle(expr, null, null, set);
		};

		Sizzle.matchesSelector = function (node, expr) {
			return Sizzle(expr, null, null, [node]).length > 0;
		};

		Sizzle.find = function (expr, context, isXML) {
			var set, i, len, match, type, left;

			if (!expr) {
				return [];
			}

			for (i = 0, len = Expr.order.length; i < len; i++) {
				type = Expr.order[i];

				if ((match = Expr.leftMatch[type].exec(expr))) {
					left = match[1];
					match.splice(1, 1);

					if (left.substr(left.length - 1) !== "\\") {
						match[1] = (match[1] || "").replace(rBackslash, "");
						set = Expr.find[type](match, context, isXML);

						if (set != null) {
							expr = expr.replace(Expr.match[type], "");
							break;
						}
					}
				}
			}

			if (!set) {
				set = typeof context.getElementsByTagName !== "undefined" ?
					context.getElementsByTagName("*") : [];
			}

			return {
				set: set,
				expr: expr
			};
		};

		Sizzle.filter = function (expr, set, inplace, not) {
			var match, anyFound,
				type, found, item, filter, left,
				i, pass,
				old = expr,
				result = [],
				curLoop = set,
				isXMLFilter = set && set[0] && Sizzle.isXML(set[0]);

			while (expr && set.length) {
				for (type in Expr.filter) {
					if ((match = Expr.leftMatch[type].exec(expr)) != null && match[2]) {
						filter = Expr.filter[type];
						left = match[1];

						anyFound = false;

						match.splice(1, 1);

						if (left.substr(left.length - 1) === "\\") {
							continue;
						}

						if (curLoop === result) {
							result = [];
						}

						if (Expr.preFilter[type]) {
							match = Expr.preFilter[type](match, curLoop, inplace, result, not, isXMLFilter);

							if (!match) {
								anyFound = found = true;

							} else if (match === true) {
								continue;
							}
						}

						if (match) {
							for (i = 0;
								(item = curLoop[i]) != null; i++) {
								if (item) {
									found = filter(item, match, i, curLoop);
									pass = not ^ found;

									if (inplace && found != null) {
										if (pass) {
											anyFound = true;

										} else {
											curLoop[i] = false;
										}

									} else if (pass) {
										result.push(item);
										anyFound = true;
									}
								}
							}
						}

						if (found !== undefined) {
							if (!inplace) {
								curLoop = result;
							}

							expr = expr.replace(Expr.match[type], "");

							if (!anyFound) {
								return [];
							}

							break;
						}
					}
				}

				// Improper expression
				if (expr === old) {
					if (anyFound == null) {
						Sizzle.error(expr);

					} else {
						break;
					}
				}

				old = expr;
			}

			return curLoop;
		};

		Sizzle.error = function (msg) {
			throw new Error("Syntax error, unrecognized expression: " + msg);
		};

		/**
		 * Utility function for retreiving the text value of an array of DOM nodes
		 * @param {Array|Element} elem
		 */
		var getText = Sizzle.getText = function (elem) {
			var i, node,
				nodeType = elem.nodeType,
				ret = "";

			if (nodeType) {
				if (nodeType === 1 || nodeType === 9) {
					// Use textContent || innerText for elements
					if (typeof elem.textContent === 'string') {
						return elem.textContent;
					} else if (typeof elem.innerText === 'string') {
						// Replace IE's carriage returns
						return elem.innerText.replace(rReturn, '');
					} else {
						// Traverse it's children
						for (elem = elem.firstChild; elem; elem = elem.nextSibling) {
							ret += getText(elem);
						}
					}
				} else if (nodeType === 3 || nodeType === 4) {
					return elem.nodeValue;
				}
			} else {

				// If no nodeType, this is expected to be an array
				for (i = 0;
					(node = elem[i]); i++) {
					// Do not traverse comment nodes
					if (node.nodeType !== 8) {
						ret += getText(node);
					}
				}
			}
			return ret;
		};

		var Expr = Sizzle.selectors = {
			order: ["ID", "NAME", "TAG"],

			match: {
				ID: /#((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
				CLASS: /\.((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
				NAME: /\[name=['"]*((?:[\w\u00c0-\uFFFF\-]|\\.)+)['"]*\]/,
				ATTR: /\[\s*((?:[\w\u00c0-\uFFFF\-]|\\.)+)\s*(?:(\S?=)\s*(?:(['"])(.*?)\3|(#?(?:[\w\u00c0-\uFFFF\-]|\\.)*)|)|)\s*\]/,
				TAG: /^((?:[\w\u00c0-\uFFFF\*\-]|\\.)+)/,
				CHILD: /:(only|nth|last|first)-child(?:\(\s*(even|odd|(?:[+\-]?\d+|(?:[+\-]?\d*)?n\s*(?:[+\-]\s*\d+)?))\s*\))?/,
				POS: /:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^\-]|$)/,
				PSEUDO: /:((?:[\w\u00c0-\uFFFF\-]|\\.)+)(?:\((['"]?)((?:\([^\)]+\)|[^\(\)]*)+)\2\))?/
			},

			leftMatch: {},

			attrMap: {
				"class": "className",
				"for": "htmlFor"
			},

			attrHandle: {
				href: function (elem) {
					return elem.getAttribute("href");
				},
				type: function (elem) {
					return elem.getAttribute("type");
				}
			},

			relative: {
				"+": function (checkSet, part) {
					var isPartStr = typeof part === "string",
						isTag = isPartStr && !rNonWord.test(part),
						isPartStrNotTag = isPartStr && !isTag;

					if (isTag) {
						part = part.toLowerCase();
					}

					for (var i = 0, l = checkSet.length, elem; i < l; i++) {
						if ((elem = checkSet[i])) {
							while ((elem = elem.previousSibling) && elem.nodeType !== 1) {}

							checkSet[i] = isPartStrNotTag || elem && elem.nodeName.toLowerCase() === part ?
								elem || false :
								elem === part;
						}
					}

					if (isPartStrNotTag) {
						Sizzle.filter(part, checkSet, true);
					}
				},

				">": function (checkSet, part) {
					var elem,
						isPartStr = typeof part === "string",
						i = 0,
						l = checkSet.length;

					if (isPartStr && !rNonWord.test(part)) {
						part = part.toLowerCase();

						for (; i < l; i++) {
							elem = checkSet[i];

							if (elem) {
								var parent = elem.parentNode;
								checkSet[i] = parent.nodeName.toLowerCase() === part ? parent : false;
							}
						}

					} else {
						for (; i < l; i++) {
							elem = checkSet[i];

							if (elem) {
								checkSet[i] = isPartStr ?
									elem.parentNode :
									elem.parentNode === part;
							}
						}

						if (isPartStr) {
							Sizzle.filter(part, checkSet, true);
						}
					}
				},

				"": function (checkSet, part, isXML) {
					var nodeCheck,
						doneName = done++,
						checkFn = dirCheck;

					if (typeof part === "string" && !rNonWord.test(part)) {
						part = part.toLowerCase();
						nodeCheck = part;
						checkFn = dirNodeCheck;
					}

					checkFn("parentNode", part, doneName, checkSet, nodeCheck, isXML);
				},

				"~": function (checkSet, part, isXML) {
					var nodeCheck,
						doneName = done++,
						checkFn = dirCheck;

					if (typeof part === "string" && !rNonWord.test(part)) {
						part = part.toLowerCase();
						nodeCheck = part;
						checkFn = dirNodeCheck;
					}

					checkFn("previousSibling", part, doneName, checkSet, nodeCheck, isXML);
				}
			},

			find: {
				ID: function (match, context, isXML) {
					if (typeof context.getElementById !== "undefined" && !isXML) {
						var m = context.getElementById(match[1]);
						// Check parentNode to catch when Blackberry 4.6 returns
						// nodes that are no longer in the document #6963
						return m && m.parentNode ? [m] : [];
					}
				},

				NAME: function (match, context) {
					if (typeof context.getElementsByName !== "undefined") {
						var ret = [],
							results = context.getElementsByName(match[1]);

						for (var i = 0, l = results.length; i < l; i++) {
							if (results[i].getAttribute("name") === match[1]) {
								ret.push(results[i]);
							}
						}

						return ret.length === 0 ? null : ret;
					}
				},

				TAG: function (match, context) {
					if (typeof context.getElementsByTagName !== "undefined") {
						return context.getElementsByTagName(match[1]);
					}
				}
			},
			preFilter: {
				CLASS: function (match, curLoop, inplace, result, not, isXML) {
					match = " " + match[1].replace(rBackslash, "") + " ";

					if (isXML) {
						return match;
					}

					for (var i = 0, elem;
						(elem = curLoop[i]) != null; i++) {
						if (elem) {
							if (not ^ (elem.className && (" " + elem.className + " ").replace(/[\t\n\r]/g, " ").indexOf(match) >= 0)) {
								if (!inplace) {
									result.push(elem);
								}

							} else if (inplace) {
								curLoop[i] = false;
							}
						}
					}

					return false;
				},

				ID: function (match) {
					return match[1].replace(rBackslash, "");
				},

				TAG: function (match, curLoop) {
					return match[1].replace(rBackslash, "").toLowerCase();
				},

				CHILD: function (match) {
					if (match[1] === "nth") {
						if (!match[2]) {
							Sizzle.error(match[0]);
						}

						match[2] = match[2].replace(/^\+|\s*/g, '');

						// parse equations like 'even', 'odd', '5', '2n', '3n+2', '4n-1', '-n+6'
						var test = /(-?)(\d*)(?:n([+\-]?\d*))?/.exec(
							match[2] === "even" && "2n" || match[2] === "odd" && "2n+1" ||
							!/\D/.test(match[2]) && "0n+" + match[2] || match[2]);

						// calculate the numbers (first)n+(last) including if they are negative
						match[2] = (test[1] + (test[2] || 1)) - 0;
						match[3] = test[3] - 0;
					} else if (match[2]) {
						Sizzle.error(match[0]);
					}

					// TODO: Move to normal caching system
					match[0] = done++;

					return match;
				},

				ATTR: function (match, curLoop, inplace, result, not, isXML) {
					var name = match[1] = match[1].replace(rBackslash, "");

					if (!isXML && Expr.attrMap[name]) {
						match[1] = Expr.attrMap[name];
					}

					// Handle if an un-quoted value was used
					match[4] = (match[4] || match[5] || "").replace(rBackslash, "");

					if (match[2] === "~=") {
						match[4] = " " + match[4] + " ";
					}

					return match;
				},

				PSEUDO: function (match, curLoop, inplace, result, not) {
					if (match[1] === "not") {
						// If we're dealing with a complex expression, or a simple one
						if ((chunker.exec(match[3]) || "").length > 1 || /^\w/.test(match[3])) {
							match[3] = Sizzle(match[3], null, null, curLoop);

						} else {
							var ret = Sizzle.filter(match[3], curLoop, inplace, true ^ not);

							if (!inplace) {
								result.push.apply(result, ret);
							}

							return false;
						}

					} else if (Expr.match.POS.test(match[0]) || Expr.match.CHILD.test(match[0])) {
						return true;
					}

					return match;
				},

				POS: function (match) {
					match.unshift(true);

					return match;
				}
			},

			filters: {
				enabled: function (elem) {
					return elem.disabled === false && elem.type !== "hidden";
				},

				disabled: function (elem) {
					return elem.disabled === true;
				},

				checked: function (elem) {
					return elem.checked === true;
				},

				selected: function (elem) {
					// Accessing this property makes selected-by-default
					// options in Safari work properly
					if (elem.parentNode) {
						elem.parentNode.selectedIndex;
					}

					return elem.selected === true;
				},

				parent: function (elem) {
					return !!elem.firstChild;
				},

				empty: function (elem) {
					return !elem.firstChild;
				},

				has: function (elem, i, match) {
					return !!Sizzle(match[3], elem).length;
				},

				header: function (elem) {
					return (/h\d/i).test(elem.nodeName);
				},

				text: function (elem) {
					var attr = elem.getAttribute("type"),
						type = elem.type;
					// IE6 and 7 will map elem.type to 'text' for new HTML5 types (search, etc) 
					// use getAttribute instead to test this case
					return elem.nodeName.toLowerCase() === "input" && "text" === type && (attr === type || attr === null);
				},

				radio: function (elem) {
					return elem.nodeName.toLowerCase() === "input" && "radio" === elem.type;
				},

				checkbox: function (elem) {
					return elem.nodeName.toLowerCase() === "input" && "checkbox" === elem.type;
				},

				file: function (elem) {
					return elem.nodeName.toLowerCase() === "input" && "file" === elem.type;
				},

				password: function (elem) {
					return elem.nodeName.toLowerCase() === "input" && "password" === elem.type;
				},

				submit: function (elem) {
					var name = elem.nodeName.toLowerCase();
					return (name === "input" || name === "button") && "submit" === elem.type;
				},

				image: function (elem) {
					return elem.nodeName.toLowerCase() === "input" && "image" === elem.type;
				},

				reset: function (elem) {
					var name = elem.nodeName.toLowerCase();
					return (name === "input" || name === "button") && "reset" === elem.type;
				},

				button: function (elem) {
					var name = elem.nodeName.toLowerCase();
					return name === "input" && "button" === elem.type || name === "button";
				},

				input: function (elem) {
					return (/input|select|textarea|button/i).test(elem.nodeName);
				},

				focus: function (elem) {
					return elem === elem.ownerDocument.activeElement;
				}
			},
			setFilters: {
				first: function (elem, i) {
					return i === 0;
				},

				last: function (elem, i, match, array) {
					return i === array.length - 1;
				},

				even: function (elem, i) {
					return i % 2 === 0;
				},

				odd: function (elem, i) {
					return i % 2 === 1;
				},

				lt: function (elem, i, match) {
					return i < match[3] - 0;
				},

				gt: function (elem, i, match) {
					return i > match[3] - 0;
				},

				nth: function (elem, i, match) {
					return match[3] - 0 === i;
				},

				eq: function (elem, i, match) {
					return match[3] - 0 === i;
				}
			},
			filter: {
				PSEUDO: function (elem, match, i, array) {
					var name = match[1],
						filter = Expr.filters[name];

					if (filter) {
						return filter(elem, i, match, array);

					} else if (name === "contains") {
						return (elem.textContent || elem.innerText || getText([elem]) || "").indexOf(match[3]) >= 0;

					} else if (name === "not") {
						var not = match[3];

						for (var j = 0, l = not.length; j < l; j++) {
							if (not[j] === elem) {
								return false;
							}
						}

						return true;

					} else {
						Sizzle.error(name);
					}
				},

				CHILD: function (elem, match) {
					var first, last,
						doneName, parent, cache,
						count, diff,
						type = match[1],
						node = elem;

					switch (type) {
						case "only":
						case "first":
							while ((node = node.previousSibling)) {
								if (node.nodeType === 1) {
									return false;
								}
							}

							if (type === "first") {
								return true;
							}

							node = elem;

						case "last":
							while ((node = node.nextSibling)) {
								if (node.nodeType === 1) {
									return false;
								}
							}

							return true;

						case "nth":
							first = match[2];
							last = match[3];

							if (first === 1 && last === 0) {
								return true;
							}

							doneName = match[0];
							parent = elem.parentNode;

							if (parent && (parent[expando] !== doneName || !elem.nodeIndex)) {
								count = 0;

								for (node = parent.firstChild; node; node = node.nextSibling) {
									if (node.nodeType === 1) {
										node.nodeIndex = ++count;
									}
								}

								parent[expando] = doneName;
							}

							diff = elem.nodeIndex - last;

							if (first === 0) {
								return diff === 0;

							} else {
								return (diff % first === 0 && diff / first >= 0);
							}
					}
				},

				ID: function (elem, match) {
					return elem.nodeType === 1 && elem.getAttribute("id") === match;
				},

				TAG: function (elem, match) {
					return (match === "*" && elem.nodeType === 1) || !!elem.nodeName && elem.nodeName.toLowerCase() === match;
				},

				CLASS: function (elem, match) {
					return (" " + (elem.className || elem.getAttribute("class")) + " ")
						.indexOf(match) > -1;
				},

				ATTR: function (elem, match) {
					var name = match[1],
						result = Sizzle.attr ?
						Sizzle.attr(elem, name) :
						Expr.attrHandle[name] ?
						Expr.attrHandle[name](elem) :
						elem[name] != null ?
						elem[name] :
						elem.getAttribute(name),
						value = result + "",
						type = match[2],
						check = match[4];

					return result == null ?
						type === "!=" :
						!type && Sizzle.attr ?
						result != null :
						type === "=" ?
						value === check :
						type === "*=" ?
						value.indexOf(check) >= 0 :
						type === "~=" ?
						(" " + value + " ").indexOf(check) >= 0 :
						!check ?
						value && result !== false :
						type === "!=" ?
						value !== check :
						type === "^=" ?
						value.indexOf(check) === 0 :
						type === "$=" ?
						value.substr(value.length - check.length) === check :
						type === "|=" ?
						value === check || value.substr(0, check.length + 1) === check + "-" :
						false;
				},

				POS: function (elem, match, i, array) {
					var name = match[2],
						filter = Expr.setFilters[name];

					if (filter) {
						return filter(elem, i, match, array);
					}
				}
			}
		};

		var origPOS = Expr.match.POS,
			fescape = function (all, num) {
				return "\\" + (num - 0 + 1);
			};

		for (var type in Expr.match) {
			Expr.match[type] = new RegExp(Expr.match[type].source + (/(?![^\[]*\])(?![^\(]*\))/.source));
			Expr.leftMatch[type] = new RegExp(/(^(?:.|\r|\n)*?)/.source + Expr.match[type].source.replace(/\\(\d+)/g, fescape));
		}

		var makeArray = function (array, results) {
			array = Array.prototype.slice.call(array, 0);

			if (results) {
				results.push.apply(results, array);
				return results;
			}

			return array;
		};

		// Perform a simple check to determine if the browser is capable of
		// converting a NodeList to an array using builtin methods.
		// Also verifies that the returned array holds DOM nodes
		// (which is not the case in the Blackberry browser)
		try {
			Array.prototype.slice.call(document.documentElement.childNodes, 0)[0].nodeType;

			// Provide a fallback method if it does not work
		} catch (e) {
			makeArray = function (array, results) {
				var i = 0,
					ret = results || [];

				if (toString.call(array) === "[object Array]") {
					Array.prototype.push.apply(ret, array);

				} else {
					if (typeof array.length === "number") {
						for (var l = array.length; i < l; i++) {
							ret.push(array[i]);
						}

					} else {
						for (; array[i]; i++) {
							ret.push(array[i]);
						}
					}
				}

				return ret;
			};
		}

		var sortOrder, siblingCheck;

		if (document.documentElement.compareDocumentPosition) {
			sortOrder = function (a, b) {
				if (a === b) {
					hasDuplicate = true;
					return 0;
				}

				if (!a.compareDocumentPosition || !b.compareDocumentPosition) {
					return a.compareDocumentPosition ? -1 : 1;
				}

				return a.compareDocumentPosition(b) & 4 ? -1 : 1;
			};

		} else {
			sortOrder = function (a, b) {
				// The nodes are identical, we can exit early
				if (a === b) {
					hasDuplicate = true;
					return 0;

					// Fallback to using sourceIndex (in IE) if it's available on both nodes
				} else if (a.sourceIndex && b.sourceIndex) {
					return a.sourceIndex - b.sourceIndex;
				}

				var al, bl,
					ap = [],
					bp = [],
					aup = a.parentNode,
					bup = b.parentNode,
					cur = aup;

				// If the nodes are siblings (or identical) we can do a quick check
				if (aup === bup) {
					return siblingCheck(a, b);

					// If no parents were found then the nodes are disconnected
				} else if (!aup) {
					return -1;

				} else if (!bup) {
					return 1;
				}

				// Otherwise they're somewhere else in the tree so we need
				// to build up a full list of the parentNodes for comparison
				while (cur) {
					ap.unshift(cur);
					cur = cur.parentNode;
				}

				cur = bup;

				while (cur) {
					bp.unshift(cur);
					cur = cur.parentNode;
				}

				al = ap.length;
				bl = bp.length;

				// Start walking down the tree looking for a discrepancy
				for (var i = 0; i < al && i < bl; i++) {
					if (ap[i] !== bp[i]) {
						return siblingCheck(ap[i], bp[i]);
					}
				}

				// We ended someplace up the tree so do a sibling check
				return i === al ?
					siblingCheck(a, bp[i], -1) :
					siblingCheck(ap[i], b, 1);
			};

			siblingCheck = function (a, b, ret) {
				if (a === b) {
					return ret;
				}

				var cur = a.nextSibling;

				while (cur) {
					if (cur === b) {
						return -1;
					}

					cur = cur.nextSibling;
				}

				return 1;
			};
		}

		// Check to see if the browser returns elements by name when
		// querying by getElementById (and provide a workaround)
		(function () {
			// We're going to inject a fake input element with a specified name
			var form = document.createElement("div"),
				id = "script" + (new Date()).getTime(),
				root = document.documentElement;

			form.innerHTML = "<a name='" + id + "'/>";

			// Inject it into the root element, check its status, and remove it quickly
			root.insertBefore(form, root.firstChild);

			// The workaround has to do additional checks after a getElementById
			// Which slows things down for other browsers (hence the branching)
			if (document.getElementById(id)) {
				Expr.find.ID = function (match, context, isXML) {
					if (typeof context.getElementById !== "undefined" && !isXML) {
						var m = context.getElementById(match[1]);

						return m ?
							m.id === match[1] || typeof m.getAttributeNode !== "undefined" && m.getAttributeNode("id").nodeValue === match[1] ? [m] :
							undefined : [];
					}
				};

				Expr.filter.ID = function (elem, match) {
					var node = typeof elem.getAttributeNode !== "undefined" && elem.getAttributeNode("id");

					return elem.nodeType === 1 && node && node.nodeValue === match;
				};
			}

			root.removeChild(form);

			// release memory in IE
			root = form = null;
		})();

		(function () {
			// Check to see if the browser returns only elements
			// when doing getElementsByTagName("*")

			// Create a fake element
			var div = document.createElement("div");
			div.appendChild(document.createComment(""));

			// Make sure no comments are found
			if (div.getElementsByTagName("*").length > 0) {
				Expr.find.TAG = function (match, context) {
					var results = context.getElementsByTagName(match[1]);

					// Filter out possible comments
					if (match[1] === "*") {
						var tmp = [];

						for (var i = 0; results[i]; i++) {
							if (results[i].nodeType === 1) {
								tmp.push(results[i]);
							}
						}

						results = tmp;
					}

					return results;
				};
			}

			// Check to see if an attribute returns normalized href attributes
			div.innerHTML = "<a href='#'></a>";

			if (div.firstChild && typeof div.firstChild.getAttribute !== "undefined" &&
				div.firstChild.getAttribute("href") !== "#") {

				Expr.attrHandle.href = function (elem) {
					return elem.getAttribute("href", 2);
				};
			}

			// release memory in IE
			div = null;
		})();

		if (document.querySelectorAll) {
			(function () {
				var oldSizzle = Sizzle,
					div = document.createElement("div"),
					id = "__sizzle__";

				div.innerHTML = "<p class='TEST'></p>";

				// Safari can't handle uppercase or unicode characters when
				// in quirks mode.
				if (div.querySelectorAll && div.querySelectorAll(".TEST").length === 0) {
					return;
				}

				Sizzle = function (query, context, extra, seed) {
					context = context || document;

					// Only use querySelectorAll on non-XML documents
					// (ID selectors don't work in non-HTML documents)
					if (!seed && !Sizzle.isXML(context)) {
						// See if we find a selector to speed up
						var match = /^(\w+$)|^\.([\w\-]+$)|^#([\w\-]+$)/.exec(query);

						if (match && (context.nodeType === 1 || context.nodeType === 9)) {
							// Speed-up: Sizzle("TAG")
							if (match[1]) {
								return makeArray(context.getElementsByTagName(query), extra);

								// Speed-up: Sizzle(".CLASS")
							} else if (match[2] && Expr.find.CLASS && context.getElementsByClassName) {
								return makeArray(context.getElementsByClassName(match[2]), extra);
							}
						}

						if (context.nodeType === 9) {
							// Speed-up: Sizzle("body")
							// The body element only exists once, optimize finding it
							if (query === "body" && context.body) {
								return makeArray([context.body], extra);

								// Speed-up: Sizzle("#ID")
							} else if (match && match[3]) {
								var elem = context.getElementById(match[3]);

								// Check parentNode to catch when Blackberry 4.6 returns
								// nodes that are no longer in the document #6963
								if (elem && elem.parentNode) {
									// Handle the case where IE and Opera return items
									// by name instead of ID
									if (elem.id === match[3]) {
										return makeArray([elem], extra);
									}

								} else {
									return makeArray([], extra);
								}
							}

							try {
								return makeArray(context.querySelectorAll(query), extra);
							} catch (qsaError) {}

							// qSA works strangely on Element-rooted queries
							// We can work around this by specifying an extra ID on the root
							// and working up from there (Thanks to Andrew Dupont for the technique)
							// IE 8 doesn't work on object elements
						} else if (context.nodeType === 1 && context.nodeName.toLowerCase() !== "object") {
							var oldContext = context,
								old = context.getAttribute("id"),
								nid = old || id,
								hasParent = context.parentNode,
								relativeHierarchySelector = /^\s*[+~]/.test(query);

							if (!old) {
								context.setAttribute("id", nid);
							} else {
								nid = nid.replace(/'/g, "\\$&");
							}
							if (relativeHierarchySelector && hasParent) {
								context = context.parentNode;
							}

							try {
								if (!relativeHierarchySelector || hasParent) {
									return makeArray(context.querySelectorAll("[id='" + nid + "'] " + query), extra);
								}

							} catch (pseudoError) {} finally {
								if (!old) {
									oldContext.removeAttribute("id");
								}
							}
						}
					}

					return oldSizzle(query, context, extra, seed);
				};

				for (var prop in oldSizzle) {
					Sizzle[prop] = oldSizzle[prop];
				}

				// release memory in IE
				div = null;
			})();
		}

		(function () {
			var html = document.documentElement,
				matches = html.matchesSelector || html.mozMatchesSelector || html.webkitMatchesSelector || html.msMatchesSelector;

			if (matches) {
				// Check to see if it's possible to do matchesSelector
				// on a disconnected node (IE 9 fails this)
				var disconnectedMatch = !matches.call(document.createElement("div"), "div"),
					pseudoWorks = false;

				try {
					// This should fail with an exception
					// Gecko does not error, returns false instead
					matches.call(document.documentElement, "[test!='']:sizzle");

				} catch (pseudoError) {
					pseudoWorks = true;
				}

				Sizzle.matchesSelector = function (node, expr) {
					// Make sure that attribute selectors are quoted
					expr = expr.replace(/\=\s*([^'"\]]*)\s*\]/g, "='$1']");

					if (!Sizzle.isXML(node)) {
						try {
							if (pseudoWorks || !Expr.match.PSEUDO.test(expr) && !/!=/.test(expr)) {
								var ret = matches.call(node, expr);

								// IE 9's matchesSelector returns false on disconnected nodes
								if (ret || !disconnectedMatch ||
									// As well, disconnected nodes are said to be in a document
									// fragment in IE 9, so check for that
									node.document && node.document.nodeType !== 11) {
									return ret;
								}
							}
						} catch (e) {}
					}

					return Sizzle(expr, null, null, [node]).length > 0;
				};
			}
		})();

		(function () {
			var div = document.createElement("div");

			div.innerHTML = "<div class='test e'></div><div class='test'></div>";

			// Opera can't find a second classname (in 9.6)
			// Also, make sure that getElementsByClassName actually exists
			if (!div.getElementsByClassName || div.getElementsByClassName("e").length === 0) {
				return;
			}

			// Safari caches class attributes, doesn't catch changes (in 3.2)
			div.lastChild.className = "e";

			if (div.getElementsByClassName("e").length === 1) {
				return;
			}

			Expr.order.splice(1, 0, "CLASS");
			Expr.find.CLASS = function (match, context, isXML) {
				if (typeof context.getElementsByClassName !== "undefined" && !isXML) {
					return context.getElementsByClassName(match[1]);
				}
			};

			// release memory in IE
			div = null;
		})();

		function dirNodeCheck(dir, cur, doneName, checkSet, nodeCheck, isXML) {
			for (var i = 0, l = checkSet.length; i < l; i++) {
				var elem = checkSet[i];

				if (elem) {
					var match = false;

					elem = elem[dir];

					while (elem) {
						if (elem[expando] === doneName) {
							match = checkSet[elem.sizset];
							break;
						}

						if (elem.nodeType === 1 && !isXML) {
							elem[expando] = doneName;
							elem.sizset = i;
						}

						if (elem.nodeName.toLowerCase() === cur) {
							match = elem;
							break;
						}

						elem = elem[dir];
					}

					checkSet[i] = match;
				}
			}
		}

		function dirCheck(dir, cur, doneName, checkSet, nodeCheck, isXML) {
			for (var i = 0, l = checkSet.length; i < l; i++) {
				var elem = checkSet[i];

				if (elem) {
					var match = false;

					elem = elem[dir];

					while (elem) {
						if (elem[expando] === doneName) {
							match = checkSet[elem.sizset];
							break;
						}

						if (elem.nodeType === 1) {
							if (!isXML) {
								elem[expando] = doneName;
								elem.sizset = i;
							}

							if (typeof cur !== "string") {
								if (elem === cur) {
									match = true;
									break;
								}

							} else if (Sizzle.filter(cur, [elem]).length > 0) {
								match = elem;
								break;
							}
						}

						elem = elem[dir];
					}

					checkSet[i] = match;
				}
			}
		}

		if (document.documentElement.contains) {
			Sizzle.contains = function (a, b) {
				return a !== b && (a.contains ? a.contains(b) : true);
			};

		} else if (document.documentElement.compareDocumentPosition) {
			Sizzle.contains = function (a, b) {
				return !!(a.compareDocumentPosition(b) & 16);
			};

		} else {
			Sizzle.contains = function () {
				return false;
			};
		}

		Sizzle.isXML = function (elem) {
			// documentElement is verified for cases where it doesn't yet exist
			// (such as loading iframes in IE - #4833) 
			var documentElement = (elem ? elem.ownerDocument || elem : 0).documentElement;

			return documentElement ? documentElement.nodeName !== "HTML" : false;
		};

		var posProcess = function (selector, context, seed) {
			var match,
				tmpSet = [],
				later = "",
				root = context.nodeType ? [context] : context;

			// Position selectors must be done after the filter
			// And so must :not(positional) so we move all PSEUDOs to the end
			while ((match = Expr.match.PSEUDO.exec(selector))) {
				later += match[0];
				selector = selector.replace(Expr.match.PSEUDO, "");
			}

			selector = Expr.relative[selector] ? selector + "*" : selector;

			for (var i = 0, l = root.length; i < l; i++) {
				Sizzle(selector, root[i], tmpSet, seed);
			}

			return Sizzle.filter(later, tmpSet);
		};

		// EXPOSE
		// Override sizzle attribute retrieval
		Sizzle.attr = jQuery.attr;
		Sizzle.selectors.attrMap = {};
		jQuery.find = Sizzle;
		jQuery.expr = Sizzle.selectors;
		jQuery.expr[":"] = jQuery.expr.filters;
		jQuery.unique = Sizzle.uniqueSort;
		jQuery.text = Sizzle.getText;
		jQuery.isXMLDoc = Sizzle.isXML;
		jQuery.contains = Sizzle.contains;


	})();


	var runtil = /Until$/,
		rparentsprev = /^(?:parents|prevUntil|prevAll)/,
		// Note: This RegExp should be improved, or likely pulled from Sizzle
		rmultiselector = /,/,
		isSimple = /^.[^:#\[\.,]*$/,
		slice = Array.prototype.slice,
		POS = jQuery.expr.match.POS,
		// methods guaranteed to produce a unique set when starting from a unique set
		guaranteedUnique = {
			children: true,
			contents: true,
			next: true,
			prev: true
		};

	jQuery.fn.extend({
		find: function (selector) {
			var self = this,
				i, l;

			if (typeof selector !== "string") {
				return jQuery(selector).filter(function () {
					for (i = 0, l = self.length; i < l; i++) {
						if (jQuery.contains(self[i], this)) {
							return true;
						}
					}
				});
			}

			var ret = this.pushStack("", "find", selector),
				length, n, r;

			for (i = 0, l = this.length; i < l; i++) {
				length = ret.length;
				jQuery.find(selector, this[i], ret);

				if (i > 0) {
					// Make sure that the results are unique
					for (n = length; n < ret.length; n++) {
						for (r = 0; r < length; r++) {
							if (ret[r] === ret[n]) {
								ret.splice(n--, 1);
								break;
							}
						}
					}
				}
			}

			return ret;
		},

		has: function (target) {
			var targets = jQuery(target);
			return this.filter(function () {
				for (var i = 0, l = targets.length; i < l; i++) {
					if (jQuery.contains(this, targets[i])) {
						return true;
					}
				}
			});
		},

		not: function (selector) {
			return this.pushStack(winnow(this, selector, false), "not", selector);
		},

		filter: function (selector) {
			return this.pushStack(winnow(this, selector, true), "filter", selector);
		},

		is: function (selector) {
			return !!selector && (
				typeof selector === "string" ?
				// If this is a positional selector, check membership in the returned set
				// so $("p:first").is("p:last") won't return true for a doc with two "p".
				POS.test(selector) ?
				jQuery(selector, this.context).index(this[0]) >= 0 :
				jQuery.filter(selector, this).length > 0 :
				this.filter(selector).length > 0);
		},

		closest: function (selectors, context) {
			var ret = [],
				i, l, cur = this[0];

			// Array (deprecated as of jQuery 1.7)
			if (jQuery.isArray(selectors)) {
				var level = 1;

				while (cur && cur.ownerDocument && cur !== context) {
					for (i = 0; i < selectors.length; i++) {

						if (jQuery(cur).is(selectors[i])) {
							ret.push({
								selector: selectors[i],
								elem: cur,
								level: level
							});
						}
					}

					cur = cur.parentNode;
					level++;
				}

				return ret;
			}

			// String
			var pos = POS.test(selectors) || typeof selectors !== "string" ?
				jQuery(selectors, context || this.context) :
				0;

			for (i = 0, l = this.length; i < l; i++) {
				cur = this[i];

				while (cur) {
					if (pos ? pos.index(cur) > -1 : jQuery.find.matchesSelector(cur, selectors)) {
						ret.push(cur);
						break;

					} else {
						cur = cur.parentNode;
						if (!cur || !cur.ownerDocument || cur === context || cur.nodeType === 11) {
							break;
						}
					}
				}
			}

			ret = ret.length > 1 ? jQuery.unique(ret) : ret;

			return this.pushStack(ret, "closest", selectors);
		},

		// Determine the position of an element within
		// the matched set of elements
		index: function (elem) {

			// No argument, return index in parent
			if (!elem) {
				return (this[0] && this[0].parentNode) ? this.prevAll().length : -1;
			}

			// index in selector
			if (typeof elem === "string") {
				return jQuery.inArray(this[0], jQuery(elem));
			}

			// Locate the position of the desired element
			return jQuery.inArray(
				// If it receives a jQuery object, the first element is used
				elem.jquery ? elem[0] : elem, this);
		},

		add: function (selector, context) {
			var set = typeof selector === "string" ?
				jQuery(selector, context) :
				jQuery.makeArray(selector && selector.nodeType ? [selector] : selector),
				all = jQuery.merge(this.get(), set);

			return this.pushStack(isDisconnected(set[0]) || isDisconnected(all[0]) ?
				all :
				jQuery.unique(all));
		},

		andSelf: function () {
			return this.add(this.prevObject);
		}
	});

	// A painfully simple check to see if an element is disconnected
	// from a document (should be improved, where feasible).
	function isDisconnected(node) {
		return !node || !node.parentNode || node.parentNode.nodeType === 11;
	}

	// 公开方法（模板函数）-->遍历函数-->工具函数-->原生属性
	// 遍历函数负责遍历父元素、祖先元素、兄弟元素、子元素或后代元素，并返回一个或一组DOM元素
	jQuery.each({
		parent: function (elem) {
			var parent = elem.parentNode;
			// 过滤掉文档片段，nodeType为11，当父元素为11时，返回null值
			return parent && parent.nodeType !== 11 ? parent : null;
		},
		// 返回指定DOM元素的所有祖先元素
		parents: function (elem) {
			return jQuery.dir(elem, "parentNode");
		},
		parentsUntil: function (elem, i, until) {
			return jQuery.dir(elem, "parentNode", until);
		},
		// 返回DOM元素之后紧挨着的兄弟元素
		next: function (elem) {
			return jQuery.nth(elem, 2, "nextSibling");
		},
		prev: function (elem) {
			return jQuery.nth(elem, 2, "previousSibling");
		},
		nextAll: function (elem) {
			return jQuery.dir(elem, "nextSibling");
		},
		prevAll: function (elem) {
			return jQuery.dir(elem, "previousSibling");
		},
		nextUntil: function (elem, i, until) {
			return jQuery.dir(elem, "nextSibling", until);
		},
		prevUntil: function (elem, i, until) {
			return jQuery.dir(elem, "previousSibling", until);
		},
		// 返回指定DOM元素的所有兄弟元素
		siblings: function (elem) {
			return jQuery.sibling(elem.parentNode.firstChild, elem);
		},
		// 返回指定DOM元素的子元素
		children: function (elem) {
			return jQuery.sibling(elem.firstChild);
		},
		// 返回指定DOM元素的子元素，包括文本节点和注释节点，或者返回iframe元素的document对象
		contents: function (elem) {
			return jQuery.nodeName(elem, "iframe") ?
				elem.contentDocument || elem.contentWindow.document :
				jQuery.makeArray(elem.childNodes);
		}
	}, function (name, fn) {
		// name--遍历函数名，fn遍历函数
		// 定义模板函数
		jQuery.fn[name] = function (until, selector) {
			// 遍历当前jQuery元素集合，jQuery对象中可以封装多个对象--对象数组的形式
			var ret = jQuery.map(this, fn, until);

			// 用于检查遍历函数名是否以Until结尾，从而确定selector的值
			if (!runtil.test(name)) {
				selector = until;
			}

			// 过滤元素，只保留匹配选择器表达式selector的元素
			if (selector && typeof selector === "string") {
				ret = jQuery.filter(selector, ret);
			}

			// 找到的元素数组中可能会含有重复或顺序错误的元素
			ret = this.length > 1 && !guaranteedUnique[name] ? jQuery.unique(ret) : ret;

			// 倒序排序，元素按照由近到远的顺序倒着返回
			// 针对 parents，prevUntil, prevAll
			if ((this.length > 1 || rmultiselector.test(selector)) && rparentsprev.test(name)) {
				ret = ret.reverse();
			}

			return this.pushStack(ret, name, slice.call(arguments).join(","));
		};
	});

	jQuery.extend({
		filter: function (expr, elems, not) {
			if (not) {
				expr = ":not(" + expr + ")";
			}

			return elems.length === 1 ?
				jQuery.find.matchesSelector(elems[0], expr) ? [elems[0]] : [] :
				jQuery.find.matches(expr, elems);
		},

		// 负责从一个元素出发，查找某个方向上的所有元素，知道遇到document对象或匹配参数until的元素为止
		// 注意匹配参数until的元素不会包含在查找结果中
		// dir原生DOM属性名称：parentNode, nextSibling, previousSibling
		// until:选择器表达式
		dir: function (elem, dir, until) {
			var matched = [],
				cur = elem[dir];

			// nodeType === 9, 限定只在当前document中进行查找
			while (cur && cur.nodeType !== 9 && (until === undefined || cur.nodeType !== 1 || !jQuery(cur).is(until))) {
				if (cur.nodeType === 1) {
					matched.push(cur);
				}
				cur = cur[dir];
			}
			return matched;
		},

		// result--要查找的元素序号，计数从1开始，1表示起始元素，2表示第二个元素
		// 与子元素:nth-child(n)保持一致
		nth: function (cur, result, dir, elem) {
			result = result || 1;
			var num = 0;

			for (; cur; cur = cur[dir]) {
				if (cur.nodeType === 1 && ++num === result) {
					break;
				}
			}

			return cur;
		},

		// n:表示查找的起始元素，包含在返回结果中
		sibling: function (n, elem) {
			var r = [];

			for (; n; n = n.nextSibling) {
				if (n.nodeType === 1 && n !== elem) {
					r.push(n);
				}
			}

			return r;
		}
	});

	// Implement the identical functionality for filter and not
	function winnow(elements, qualifier, keep) {

		// Can't pass null or undefined to indexOf in Firefox 4
		// Set to 0 to skip string check
		qualifier = qualifier || 0;

		if (jQuery.isFunction(qualifier)) {
			return jQuery.grep(elements, function (elem, i) {
				var retVal = !!qualifier.call(elem, i, elem);
				return retVal === keep;
			});

		} else if (qualifier.nodeType) {
			return jQuery.grep(elements, function (elem, i) {
				return (elem === qualifier) === keep;
			});

		} else if (typeof qualifier === "string") {
			var filtered = jQuery.grep(elements, function (elem) {
				return elem.nodeType === 1;
			});

			if (isSimple.test(qualifier)) {
				return jQuery.filter(qualifier, filtered, !keep);
			} else {
				qualifier = jQuery.filter(qualifier, filtered);
			}
		}

		return jQuery.grep(elements, function (elem, i) {
			return (jQuery.inArray(elem, qualifier) >= 0) === keep;
		});
	}




	function createSafeFragment(document) {
		var list = nodeNames.split("|"),
			safeFrag = document.createDocumentFragment();

		if (safeFrag.createElement) {
			while (list.length) {
				safeFrag.createElement(
					list.pop()
				);
			}
		}
		return safeFrag;
	}

	var nodeNames = "abbr|article|aside|audio|canvas|datalist|details|figcaption|figure|footer|" +
		"header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",
		rinlinejQuery = / jQuery\d+="(?:\d+|null)"/g,
		rleadingWhitespace = /^\s+/,
		rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig,
		rtagName = /<([\w:]+)/,
		rtbody = /<tbody/i,
		rhtml = /<|&#?\w+;/,
		rnoInnerhtml = /<(?:script|style)/i,
		rnocache = /<(?:script|object|embed|option|style)/i,
		rnoshimcache = new RegExp("<(?:" + nodeNames + ")", "i"),
		// checked="checked" or checked
		rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
		rscriptType = /\/(java|ecma)script/i,
		rcleanScript = /^\s*<!(?:\[CDATA\[|\-\-)/,
		wrapMap = {
			option: [1, "<select multiple='multiple'>", "</select>"],
			legend: [1, "<fieldset>", "</fieldset>"],
			thead: [1, "<table>", "</table>"],
			tr: [2, "<table><tbody>", "</tbody></table>"],
			td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
			col: [2, "<table><tbody></tbody><colgroup>", "</colgroup></table>"],
			area: [1, "<map>", "</map>"],
			_default: [0, "", ""]
		},
		safeFragment = createSafeFragment(document);

	wrapMap.optgroup = wrapMap.option;
	wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
	wrapMap.th = wrapMap.td;

	// IE can't serialize <link> and <script> tags normally
	if (!jQuery.support.htmlSerialize) {
		wrapMap._default = [1, "div<div>", "</div>"];
	}

	jQuery.fn.extend({
		text: function (text) {
			if (jQuery.isFunction(text)) {
				return this.each(function (i) {
					var self = jQuery(this);

					self.text(text.call(this, i, self.text()));
				});
			}

			if (typeof text !== "object" && text !== undefined) {
				return this.empty().append((this[0] && this[0].ownerDocument || document).createTextNode(text));
			}

			return jQuery.text(this);
		},

		wrapAll: function (html) {
			if (jQuery.isFunction(html)) {
				return this.each(function (i) {
					jQuery(this).wrapAll(html.call(this, i));
				});
			}

			if (this[0]) {
				// The elements to wrap the target around
				var wrap = jQuery(html, this[0].ownerDocument).eq(0).clone(true);

				if (this[0].parentNode) {
					wrap.insertBefore(this[0]);
				}

				wrap.map(function () {
					var elem = this;

					while (elem.firstChild && elem.firstChild.nodeType === 1) {
						elem = elem.firstChild;
					}

					return elem;
				}).append(this);
			}

			return this;
		},

		wrapInner: function (html) {
			if (jQuery.isFunction(html)) {
				return this.each(function (i) {
					jQuery(this).wrapInner(html.call(this, i));
				});
			}

			return this.each(function () {
				var self = jQuery(this),
					contents = self.contents();

				if (contents.length) {
					contents.wrapAll(html);

				} else {
					self.append(html);
				}
			});
		},

		wrap: function (html) {
			var isFunction = jQuery.isFunction(html);

			return this.each(function (i) {
				jQuery(this).wrapAll(isFunction ? html.call(this, i) : html);
			});
		},

		unwrap: function () {
			return this.parent().each(function () {
				if (!jQuery.nodeName(this, "body")) {
					jQuery(this).replaceWith(this.childNodes);
				}
			}).end();
		},

		append: function () {
			return this.domManip(arguments, true, function (elem) {
				if (this.nodeType === 1) {
					this.appendChild(elem);
				}
			});
		},

		prepend: function () {
			return this.domManip(arguments, true, function (elem) {
				if (this.nodeType === 1) {
					this.insertBefore(elem, this.firstChild);
				}
			});
		},

		before: function () {
			if (this[0] && this[0].parentNode) {
				return this.domManip(arguments, false, function (elem) {
					this.parentNode.insertBefore(elem, this);
				});
			} else if (arguments.length) {
				var set = jQuery.clean(arguments);
				set.push.apply(set, this.toArray());
				return this.pushStack(set, "before", arguments);
			}
		},

		after: function () {
			if (this[0] && this[0].parentNode) {
				return this.domManip(arguments, false, function (elem) {
					this.parentNode.insertBefore(elem, this.nextSibling);
				});
			} else if (arguments.length) {
				var set = this.pushStack(this, "after", arguments);
				set.push.apply(set, jQuery.clean(arguments));
				return set;
			}
		},

		// keepData is for internal use only--do not document
		// keepData 作用在于保持关联的数据和事件
		// 遍历匹配元素集合，先移除后代元素和匹配元素关联的数据和事件，以避免内存泄漏，然后移除匹配元素
		remove: function (selector, keepData) {
			for (var i = 0, elem;
				(elem = this[i]) != null; i++) {
				// 如果传入selector，则只有在当前元素上查找到非selector相关元素时才进行移除操作
				if (!selector || jQuery.filter(selector, [elem]).length) {
					// 只有在keepData不是true的时候才这样，keepData的作用在于保持数据
					if (!keepData && elem.nodeType === 1) {
						// 先移除elem所有后代元素关联的数据和事件
						jQuery.cleanData(elem.getElementsByTagName("*"));
						// 移除elem上关联的数据和事件
						jQuery.cleanData([elem]);
					}

					// 如果有父节点，则从当前节点的父元素上移除当前元素
					if (elem.parentNode) {
						elem.parentNode.removeChild(elem);
					}
				}
			}

			return this;
		},

		empty: function () {
			for (var i = 0, elem;
				(elem = this[i]) != null; i++) {
				// Remove element nodes and prevent memory leaks
				if (elem.nodeType === 1) {
					jQuery.cleanData(elem.getElementsByTagName("*"));
				}

				// Remove any remaining nodes
				while (elem.firstChild) {
					elem.removeChild(elem.firstChild);
				}
			}

			return this;
		},

		// dataAndEvents--把原始元素关联的数据和事件复制到副本元素上
		// deepDataAndEvents--把元素元素的后代元素关联的数据和事件复制到副本元素的后代元素上
		clone: function (dataAndEvents, deepDataAndEvents) {
			dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
			deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

			return this.map(function () {
				return jQuery.clone(this, dataAndEvents, deepDataAndEvents);
			});
		},

		// 用于获取匹配元素集合中第一份元素的HTML内容，或者设置每个元素的HTML内容
		// 通过innerHTML插入的script元素不会自动执行，插入的style标签在IE9以下的浏览器中不会生效
		html: function (value) {
			if (value === undefined) {
				return this[0] && this[0].nodeType === 1 ?
					this[0].innerHTML.replace(rinlinejQuery, "") :
					null;

				// See if we can take a shortcut and just use innerHTML
			} else if (typeof value === "string" && !rnoInnerhtml.test(value) &&
				(jQuery.support.leadingWhitespace || !rleadingWhitespace.test(value)) &&
				!wrapMap[(rtagName.exec(value) || ["", ""])[1].toLowerCase()]) {

				value = value.replace(rxhtmlTag, "<$1></$2>");

				try {
					for (var i = 0, l = this.length; i < l; i++) {
						// Remove element nodes and prevent memory leaks
						if (this[i].nodeType === 1) {
							jQuery.cleanData(this[i].getElementsByTagName("*"));
							this[i].innerHTML = value;
						}
					}

					// If using innerHTML throws an exception, use the fallback method
				} catch (e) {
					this.empty().append(value);
				}

			} else if (jQuery.isFunction(value)) {
				this.each(function (i) {
					var self = jQuery(this);

					self.html(value.call(this, i, self.html()));
				});

			} else {
				// HTML代码需要修正，则先调用方法empty移除后代元素关联的数据和事件，移除子元素，然后
				// 调用方法append插入HTML内容
				this.empty().append(value);
			}

			return this;
		},

		replaceWith: function (value) {
			if (this[0] && this[0].parentNode) {
				// Make sure that the elements are removed from the DOM before they are inserted
				// this can help fix replacing a parent with child elements
				if (jQuery.isFunction(value)) {
					return this.each(function (i) {
						var self = jQuery(this),
							old = self.html();
						self.replaceWith(value.call(this, i, old));
					});
				}

				if (typeof value !== "string") {
					value = jQuery(value).detach();
				}

				return this.each(function () {
					var next = this.nextSibling,
						parent = this.parentNode;

					jQuery(this).remove();

					if (next) {
						jQuery(next).before(value);
					} else {
						jQuery(parent).append(value);
					}
				});
			} else {
				return this.length ?
					this.pushStack(jQuery(jQuery.isFunction(value) ? value() : value), "replaceWith", value) :
					this;
			}
		},

		detach: function (selector) {
			return this.remove(selector, true);
		},

		// jQuery插入元素实现的核心
		domManip: function (args, table, callback) {
			var results, first, fragment, parent,
				value = args[0],
				scripts = [];

			// We can't cloneNode fragments that contain checked, in WebKit
			if (!jQuery.support.checkClone && arguments.length === 3 && typeof value === "string" && rchecked.test(value)) {
				return this.each(function () {
					jQuery(this).domManip(args, table, callback, true);
				});
			}

			if (jQuery.isFunction(value)) {
				return this.each(function (i) {
					var self = jQuery(this);
					args[0] = value.call(this, i, table ? self.html() : undefined);
					self.domManip(args, table, callback);
				});
			}

			if (this[0]) {
				parent = value && value.parentNode;

				// If we're in a fragment, just use that instead of building a new one
				if (jQuery.support.parentNode && parent && parent.nodeType === 11 && parent.childNodes.length === this.length) {
					results = {
						fragment: parent
					};

				} else {
					results = jQuery.buildFragment(args, this, scripts);
				}

				fragment = results.fragment;

				if (fragment.childNodes.length === 1) {
					first = fragment = fragment.firstChild;
				} else {
					first = fragment.firstChild;
				}

				if (first) {
					table = table && jQuery.nodeName(first, "tr");

					for (var i = 0, l = this.length, lastIndex = l - 1; i < l; i++) {
						callback.call(
							table ?
							root(this[i], first) :
							this[i],
							// Make sure that we do not leak memory by inadvertently discarding
							// the original fragment (which might have attached data) instead of
							// using it; in addition, use the original fragment object for the last
							// item instead of first because it can end up being emptied incorrectly
							// in certain situations (Bug #8070).
							// Fragments from the fragment cache must always be cloned and never used
							// in place.
							results.cacheable || (l > 1 && i < lastIndex) ?
							jQuery.clone(fragment, true, true) :
							fragment
						);
					}
				}

				if (scripts.length) {
					jQuery.each(scripts, evalScript);
				}
			}

			return this;
		}
	});

	function root(elem, cur) {
		return jQuery.nodeName(elem, "table") ?
			(elem.getElementsByTagName("tbody")[0] ||
				elem.appendChild(elem.ownerDocument.createElement("tbody"))) :
			elem;
	}

	function cloneCopyEvent(src, dest) {

		if (dest.nodeType !== 1 || !jQuery.hasData(src)) {
			return;
		}

		var type, i, l,
			oldData = jQuery._data(src),
			curData = jQuery._data(dest, oldData),
			events = oldData.events;

		if (events) {
			delete curData.handle;
			curData.events = {};

			for (type in events) {
				for (i = 0, l = events[type].length; i < l; i++) {
					jQuery.event.add(dest, type + (events[type][i].namespace ? "." : "") + events[type][i].namespace, events[type][i], events[type][i].data);
				}
			}
		}

		// make the cloned public data object a copy from the original
		if (curData.data) {
			curData.data = jQuery.extend({}, curData.data);
		}
	}

	function cloneFixAttributes(src, dest) {
		var nodeName;

		// We do not need to do anything for non-Elements
		if (dest.nodeType !== 1) {
			return;
		}

		// clearAttributes removes the attributes, which we don't want,
		// but also removes the attachEvent events, which we *do* want
		if (dest.clearAttributes) {
			dest.clearAttributes();
		}

		// mergeAttributes, in contrast, only merges back on the
		// original attributes, not the events
		if (dest.mergeAttributes) {
			dest.mergeAttributes(src);
		}

		nodeName = dest.nodeName.toLowerCase();

		// IE6-8 fail to clone children inside object elements that use
		// the proprietary classid attribute value (rather than the type
		// attribute) to identify the type of content to display
		if (nodeName === "object") {
			dest.outerHTML = src.outerHTML;

		} else if (nodeName === "input" && (src.type === "checkbox" || src.type === "radio")) {
			// IE6-8 fails to persist the checked state of a cloned checkbox
			// or radio button. Worse, IE6-7 fail to give the cloned element
			// a checked appearance if the defaultChecked value isn't also set
			if (src.checked) {
				dest.defaultChecked = dest.checked = src.checked;
			}

			// IE6-7 get confused and end up setting the value of a cloned
			// checkbox/radio button to an empty string instead of "on"
			if (dest.value !== src.value) {
				dest.value = src.value;
			}

			// IE6-8 fails to return the selected option to the default selected
			// state when cloning options
		} else if (nodeName === "option") {
			dest.selected = src.defaultSelected;

			// IE6-8 fails to set the defaultValue to the correct value when
			// cloning other types of input fields
		} else if (nodeName === "input" || nodeName === "textarea") {
			dest.defaultValue = src.defaultValue;
		}

		// Event data gets referenced instead of copied if the expando
		// gets copied too
		dest.removeAttribute(jQuery.expando);
	}

	jQuery.buildFragment = function (args, nodes, scripts) {
		var fragment, cacheable, cacheresults, doc,
			first = args[0];

		// nodes may contain either an explicit document object,
		// a jQuery collection or context object.
		// If nodes[0] contains a valid object to assign to doc
		// 此处是因为document.ownerDocument=null,非document的DOM为其拥有的document
		if (nodes && nodes[0]) {
			doc = nodes[0].ownerDocument || nodes[0];
		}

		// Ensure that an attr object doesn't incorrectly stand in as a document object
		// Chrome and Firefox seem to allow this to occur and will throw exception
		// Fixes #8950
		if (!doc.createDocumentFragment) {
			doc = document;
		}

		// Only cache "small" (1/2 KB) HTML strings that are associated with the main document
		// Cloning options loses the selected state, so don't cache them
		// IE 6 doesn't like it when you put <object> or <embed> elements in a fragment
		// Also, WebKit does not clone 'checked' attributes on cloneNode, so don't cache
		// Lastly, IE6,7,8 will not correctly reuse cached fragments that were created from unknown elems #10501
		if (args.length === 1 && typeof first === "string" && first.length < 512 && doc === document &&
			first.charAt(0) === "<" && !rnocache.test(first) &&
			(jQuery.support.checkClone || !rchecked.test(first)) &&
			(jQuery.support.html5Clone || !rnoshimcache.test(first))) {

			cacheable = true;

			// 使用的第二次才把HTMLDOM缓存起来，第三次使用时会从缓存中读取
			// 并不是第一次使用就缓存
			cacheresults = jQuery.fragments[first];
			if (cacheresults && cacheresults !== 1) {
				fragment = cacheresults;
			}
		}

		if (!fragment) {
			fragment = doc.createDocumentFragment();
			jQuery.clean(args, doc, fragment, scripts);
		}

		if (cacheable) {
			jQuery.fragments[first] = cacheresults ? fragment : 1;
		}

		return {
			fragment: fragment,
			cacheable: cacheable
		};
	};

	jQuery.fragments = {};

	jQuery.each({
		appendTo: "append",
		prependTo: "prepend",
		insertBefore: "before",
		insertAfter: "after",
		replaceAll: "replaceWith"
	}, function (name, original) {
		jQuery.fn[name] = function (selector) {
			var ret = [],
				insert = jQuery(selector),
				parent = this.length === 1 && this[0].parentNode;

			if (parent && parent.nodeType === 11 && parent.childNodes.length === 1 && insert.length === 1) {
				insert[original](this[0]);
				return this;

			} else {
				for (var i = 0, l = insert.length; i < l; i++) {
					var elems = (i > 0 ? this.clone(true) : this).get();
					jQuery(insert[i])[original](elems);
					ret = ret.concat(elems);
				}

				return this.pushStack(ret, name, insert.selector);
			}
		};
	});

	function getAll(elem) {
		if (typeof elem.getElementsByTagName !== "undefined") {
			return elem.getElementsByTagName("*");

		} else if (typeof elem.querySelectorAll !== "undefined") {
			return elem.querySelectorAll("*");

		} else {
			return [];
		}
	}

	// Used in clean, fixes the defaultChecked property
	function fixDefaultChecked(elem) {
		if (elem.type === "checkbox" || elem.type === "radio") {
			elem.defaultChecked = elem.checked;
		}
	}
	// Finds all inputs and passes them to fixDefaultChecked
	function findInputs(elem) {
		var nodeName = (elem.nodeName || "").toLowerCase();
		if (nodeName === "input") {
			fixDefaultChecked(elem);
			// Skip scripts, get other children
		} else if (nodeName !== "script" && typeof elem.getElementsByTagName !== "undefined") {
			jQuery.grep(elem.getElementsByTagName("input"), fixDefaultChecked);
		}
	}

	// Derived From: http://www.iecss.com/shimprove/javascript/shimprove.1-0-1.js
	function shimCloneNode(elem) {
		var div = document.createElement("div");
		safeFragment.appendChild(div);

		div.innerHTML = elem.outerHTML;
		return div.firstChild;
	}

	jQuery.extend({
		clone: function (elem, dataAndEvents, deepDataAndEvents) {
			var srcElements,
				destElements,
				i,
				// IE<=8 does not properly clone detached, unknown element nodes
				clone = jQuery.support.html5Clone || !rnoshimcache.test("<" + elem.nodeName) ?
				elem.cloneNode(true) :
				shimCloneNode(elem);

			if ((!jQuery.support.noCloneEvent || !jQuery.support.noCloneChecked) &&
				(elem.nodeType === 1 || elem.nodeType === 11) && !jQuery.isXMLDoc(elem)) {
				// IE copies events bound via attachEvent when using cloneNode.
				// Calling detachEvent on the clone will also remove the events
				// from the original. In order to get around this, we use some
				// proprietary methods to clear the events. Thanks to MooTools
				// guys for this hotness.

				cloneFixAttributes(elem, clone);

				// Using Sizzle here is crazy slow, so we use getElementsByTagName instead
				srcElements = getAll(elem);
				destElements = getAll(clone);

				// Weird iteration because IE will replace the length property
				// with an element if you are cloning the body and one of the
				// elements on the page has a name or id of "length"
				for (i = 0; srcElements[i]; ++i) {
					// Ensure that the destination node is not null; Fixes #9587
					if (destElements[i]) {
						cloneFixAttributes(srcElements[i], destElements[i]);
					}
				}
			}

			// Copy the events from the original to the clone
			if (dataAndEvents) {
				cloneCopyEvent(elem, clone);

				if (deepDataAndEvents) {
					srcElements = getAll(elem);
					destElements = getAll(clone);

					for (i = 0; srcElements[i]; ++i) {
						cloneCopyEvent(srcElements[i], destElements[i]);
					}
				}
			}

			srcElements = destElements = null;

			// Return the cloned set
			return clone;
		},

		clean: function (elems, context, fragment, scripts) {
			var checkScriptType;

			context = context || document;

			// !context.createElement fails in IE with an error but returns typeof 'object'
			if (typeof context.createElement === "undefined") {
				context = context.ownerDocument || context[0] && context[0].ownerDocument || document;
			}

			var ret = [],
				j;

			for (var i = 0, elem;
				(elem = elems[i]) != null; i++) {
				if (typeof elem === "number") {
					elem += "";
				}

				if (!elem) {
					continue;
				}

				// Convert html string into DOM nodes
				if (typeof elem === "string") {
					if (!rhtml.test(elem)) {
						elem = context.createTextNode(elem);
					} else {
						// Fix "XHTML"-style tags in all browsers
						elem = elem.replace(rxhtmlTag, "<$1></$2>");

						// Trim whitespace, otherwise indexOf won't work as expected
						var tag = (rtagName.exec(elem) || ["", ""])[1].toLowerCase(),
							wrap = wrapMap[tag] || wrapMap._default,
							depth = wrap[0],
							div = context.createElement("div");

						// Append wrapper element to unknown element safe doc fragment
						if (context === document) {
							// Use the fragment we've already created for this document
							safeFragment.appendChild(div);
						} else {
							// Use a fragment created with the owner document
							// 所谓“安全”，是指不支持HTML5的浏览器也能够正确第解析和渲染未知的HTML5标签
							createSafeFragment(context).appendChild(div);
						}

						// Go to html and back, then peel off extra wrappers
						div.innerHTML = wrap[1] + elem + wrap[2];

						// Move to the right depth
						while (depth--) {
							div = div.lastChild;
						}

						// Remove IE's autoinserted <tbody> from table fragments
						if (!jQuery.support.tbody) {

							// String was a <table>, *may* have spurious <tbody>
							var hasBody = rtbody.test(elem),
								tbody = tag === "table" && !hasBody ?
								div.firstChild && div.firstChild.childNodes :

								// String was a bare <thead> or <tfoot>
								wrap[1] === "<table>" && !hasBody ?
								div.childNodes : [];

							for (j = tbody.length - 1; j >= 0; --j) {
								if (jQuery.nodeName(tbody[j], "tbody") && !tbody[j].childNodes.length) {
									tbody[j].parentNode.removeChild(tbody[j]);
								}
							}
						}

						// IE completely kills leading whitespace when innerHTML is used
						// 浏览器不支持前导空白符，手动创建一个文本节点，插入
						if (!jQuery.support.leadingWhitespace && rleadingWhitespace.test(elem)) {
							div.insertBefore(context.createTextNode(rleadingWhitespace.exec(elem)[0]), div.firstChild);
						}

						elem = div.childNodes;
					}
				}

				// Resets defaultChecked for any radios and checkboxes
				// about to be appended to the DOM in IE 6/7 (#8060)
				var len;
				if (!jQuery.support.appendChecked) {
					if (elem[0] && typeof (len = elem.length) === "number") {
						for (j = 0; j < len; j++) {
							findInputs(elem[j]);
						}
					} else {
						findInputs(elem);
					}
				}

				if (elem.nodeType) {
					ret.push(elem);
				} else {
					ret = jQuery.merge(ret, elem);
				}
			}

			if (fragment) {
				checkScriptType = function (elem) {
					return !elem.type || rscriptType.test(elem.type);
				};
				for (i = 0; ret[i]; i++) {
					if (scripts && jQuery.nodeName(ret[i], "script") && (!ret[i].type || ret[i].type.toLowerCase() === "text/javascript")) {
						scripts.push(ret[i].parentNode ? ret[i].parentNode.removeChild(ret[i]) : ret[i]);

					} else {
						if (ret[i].nodeType === 1) {
							var jsTags = jQuery.grep(ret[i].getElementsByTagName("script"), checkScriptType);

							ret.splice.apply(ret, [i + 1, 0].concat(jsTags));
						}
						fragment.appendChild(ret[i]);
					}
				}
			}

			return ret;
		},

		// 用于移除多个DOM元素关联的全部数据和事件，仅在jQuery内部使用
		// 当通过jQuery方法移除DOM元素时，jQuery必须确保关联的数据和事件也被移除，以避免内存泄漏
		// 3个关键步骤如下：
		// 1. 移除DOM元素上绑定的所有类型的事件
		// 2. 移除DOM元素上扩展的jQuery.expando属性
		// 3. 删除DOM元素关联的数据缓存对象jQuery.cache[id]
		cleanData: function (elems) {
			var data, id,
				cache = jQuery.cache,
				// 特殊事件修正对象的集合
				special = jQuery.event.special,
				deleteExpando = jQuery.support.deleteExpando;

			for (var i = 0, elem;
				(elem = elems[i]) != null; i++) {
				// noData 用来检测无法添加expando属性的特殊元素，在jQuery.Data中有定义
				// 但是这里连flash类型都不判断了，感觉有点奇怪
				if (elem.nodeName && jQuery.noData[elem.nodeName.toLowerCase()]) {
					continue;
				}

				// 上面if就是为了这里获取不到id的情况
				id = elem[jQuery.expando];

				if (id) {
					// 从jQuery.cache上获取id对饮的属性值
					data = cache[id];

					// 从这里可以看到通过jQuery绑定的事件的存储位置
					// jQuery.cache[id].events
					if (data && data.events) {
						for (var type in data.events) {
							if (special[type]) {
								jQuery.event.remove(elem, type);

								// This is a shortcut to avoid jQuery.event.remove's overhead
							} else {
								// 执行该函数并不会删除事件缓存对象data.events和主监听函数data.handle
								jQuery.removeEvent(elem, type, data.handle);
							}
						}

						// Null the DOM reference to avoid IE6/7/8 leak (#7054)
						// data.handle是该DOM元素的主监听函数，是该DOM元素上所有事件响应的统一入口
						if (data.handle) {
							data.handle.elem = null;
						}
					}

					if (deleteExpando) {
						delete elem[jQuery.expando];

					} else if (elem.removeAttribute) {
						elem.removeAttribute(jQuery.expando);
					}

					delete cache[id];
				}
			}
		}
	});

	// 执行<script>标签内容
	function evalScript(i, elem) {
		if (elem.src) {
			// 同步加载src脚本
			jQuery.ajax({
				url: elem.src,
				async: false,
				dataType: "script"
			});
		} else {
			jQuery.globalEval((elem.text || elem.textContent || elem.innerHTML || "").replace(rcleanScript, "/*$0*/"));
		}

		if (elem.parentNode) {
			elem.parentNode.removeChild(elem);
		}
	}




	var ralpha = /alpha\([^)]*\)/i,
		ropacity = /opacity=([^)]*)/,
		// fixed for IE9, see #8346
		rupper = /([A-Z]|^ms)/g,
		rnumpx = /^-?\d+(?:px)?$/i,
		rnum = /^-?\d/,
		rrelNum = /^([\-+])=([\-+.\de]+)/,

		// 通过设置样式position为absolute，以避免引起文档布局流变化
		// 通过设置样式visibility为hidden, 使得当前元素在保持不可见的同时进入文档布局流
		// 通过设置样式display为block，强制当前元素为块级元素，使得样式height，width生效，以此获取不可见元素的高度和宽度
		cssShow = {
			position: "absolute",
			visibility: "hidden",
			display: "block"
		},
		cssWidth = ["Left", "Right"],
		cssHeight = ["Top", "Bottom"],
		curCSS,

		getComputedStyle,
		currentStyle;

	// 内联样式、计算样式、类样式、坐标、尺寸
	// 用于获取匹配元素中第一个元素的计算样式，或者在每个匹配元素谁给你设置一个或多个内联样式
	jQuery.fn.css = function (name, value) {
		// Setting 'undefined' is a no-op
		if (arguments.length === 2 && value === undefined) {
			return this;
		}

		return jQuery.access(this, name, value, true, function (elem, name, value) {
			return value !== undefined ?
				jQuery.style(elem, name, value) :
				jQuery.css(elem, name);
		});
	};

	jQuery.extend({
		// Add in style property hooks for overriding the default
		// behavior of getting and setting a style property
		cssHooks: {
			opacity: {
				get: function (elem, computed) {
					if (computed) {
						// We should always get a number back from opacity
						var ret = curCSS(elem, "opacity", "opacity");
						return ret === "" ? "1" : ret;

					} else {
						return elem.style.opacity;
					}
				}
			}
		},

		// Exclude the following css properties to add px
		// 不用带px的样式名称
		cssNumber: {
			"fillOpacity": true,
			"fontWeight": true,
			"lineHeight": true,
			"opacity": true,
			"orphans": true,
			"widows": true,
			"zIndex": true,
			"zoom": true
		},

		// Add in properties whose names you wish to fix before
		// setting or getting the value
		cssProps: {
			// normalize float css property
			"float": jQuery.support.cssFloat ? "cssFloat" : "styleFloat"
		},

		// Get and set the style property on a DOM Node
		style: function (elem, name, value, extra) {
			// Don't set styles on text and comment nodes
			if (!elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style) {
				return;
			}

			// Make sure that we're working with the right name
			var ret, type, origName = jQuery.camelCase(name),
				style = elem.style,
				hooks = jQuery.cssHooks[origName];

			// origName: 通过属性style读写内联样式时，需要用驼峰格式，而读取计算样式时则需要用连字符格式
			name = jQuery.cssProps[origName] || origName;

			// Check if we're setting a value
			if (value !== undefined) {
				type = typeof value;

				// convert relative number strings (+= or -=) to relative numbers. #7345
				if (type === "string" && (ret = rrelNum.exec(value))) {
					value = (+(ret[1] + 1) * +ret[2]) + parseFloat(jQuery.css(elem, name));
					// Fixes bug #9237
					type = "number";
				}

				// Make sure that NaN and null values aren't set. See: #7116
				if (value == null || type === "number" && isNaN(value)) {
					return;
				}

				// If a number was passed in, add 'px' to the (except for certain CSS properties)
				if (type === "number" && !jQuery.cssNumber[origName]) {
					value += "px";
				}

				// If a hook was provided, use that value, otherwise just set the specified value
				if (!hooks || !("set" in hooks) || (value = hooks.set(elem, value)) !== undefined) {
					// Wrapped to prevent IE from throwing errors when 'invalid' values are provided
					// Fixes bug #5509
					try {
						style[name] = value;
					} catch (e) {}
				}

			} else {
				// If a hook was provided get the non-computed value from there
				if (hooks && "get" in hooks && (ret = hooks.get(elem, false, extra)) !== undefined) {
					return ret;
				}

				// Otherwise just get the value from the style object
				return style[name];
			}
		},

		css: function (elem, name, extra) {
			var ret, hooks;

			// Make sure that we're working with the right name
			name = jQuery.camelCase(name);
			hooks = jQuery.cssHooks[name];
			name = jQuery.cssProps[name] || name;

			// cssFloat needs a special treatment
			if (name === "cssFloat") {
				name = "float";
			}

			// If a hook was provided get the computed value from there
			if (hooks && "get" in hooks && (ret = hooks.get(elem, true, extra)) !== undefined) {
				return ret;

				// Otherwise, if a way to get the computed value exists, use that
			} else if (curCSS) {
				return curCSS(elem, name);
			}
		},

		// A method for quickly swapping in/out CSS properties to get correct calculations
		// 用于快速换进换出样式，在此期间会执行传入的回调函数，执行完回调函数之后，会恢复备份的样式值
		swap: function (elem, options, callback) {
			var old = {};

			// Remember the old values, and insert the new ones
			for (var name in options) {
				old[name] = elem.style[name];
				elem.style[name] = options[name];
			}

			callback.call(elem);

			// Revert the old values
			for (name in options) {
				elem.style[name] = old[name];
			}
		}
	});

	// DEPRECATED, Use jQuery.css() instead
	jQuery.curCSS = jQuery.css;

	// 覆盖height、width的默认读取和设置行为
	jQuery.each(["height", "width"], function (i, name) {
		jQuery.cssHooks[name] = {
			get: function (elem, computed, extra) {
				var val;

				if (computed) {
					if (elem.offsetWidth !== 0) {
						return getWH(elem, name, extra);
					} else {
						jQuery.swap(elem, cssShow, function () {
							val = getWH(elem, name, extra);
						});
					}

					return val;
				}
			},

			set: function (elem, value) {
				if (rnumpx.test(value)) {
					// ignore negative width and height values #1599
					value = parseFloat(value);

					if (value >= 0) {
						return value + "px";
					}

				} else {
					return value;
				}
			}
		};
	});

	// 覆盖opacity的默认读取和设置行为
	if (!jQuery.support.opacity) {
		jQuery.cssHooks.opacity = {
			get: function (elem, computed) {
				// IE uses filters for opacity
				return ropacity.test((computed && elem.currentStyle ? elem.currentStyle.filter : elem.style.filter) || "") ?
					(parseFloat(RegExp.$1) / 100) + "" :
					computed ? "1" : "";
			},

			set: function (elem, value) {
				var style = elem.style,
					currentStyle = elem.currentStyle,
					opacity = jQuery.isNumeric(value) ? "alpha(opacity=" + value * 100 + ")" : "",
					filter = currentStyle && currentStyle.filter || style.filter || "";

				// IE has trouble with opacity if it does not have layout
				// Force it by setting the zoom level
				style.zoom = 1;

				// if setting opacity to 1, and no other filters exist - attempt to remove filter attribute #6652
				if (value >= 1 && jQuery.trim(filter.replace(ralpha, "")) === "") {

					// Setting style.filter to null, "" & " " still leave "filter:" in the cssText
					// if "filter:" is present at all, clearType is disabled, we want to avoid this
					// style.removeAttribute is IE Only, but so apparently is this code path...
					style.removeAttribute("filter");

					// if there there is no filter style applied in a css rule, we are done
					if (currentStyle && !currentStyle.filter) {
						return;
					}
				}

				// otherwise, set new filter values
				style.filter = ralpha.test(filter) ?
					filter.replace(ralpha, opacity) :
					filter + " " + opacity;
			}
		};
	}

	jQuery(function () {
		// This hook cannot be added until DOM ready because the support test
		// for it is not run until after DOM ready
		// 覆盖marginRight的默认读取行为
		if (!jQuery.support.reliableMarginRight) {
			jQuery.cssHooks.marginRight = {
				get: function (elem, computed) {
					// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
					// Work around by temporarily setting element display to inline-block
					var ret;
					jQuery.swap(elem, {
						"display": "inline-block"
					}, function () {
						if (computed) {
							ret = curCSS(elem, "margin-right", "marginRight");
						} else {
							ret = elem.style.marginRight;
						}
					});
					return ret;
				}
			};
		}
	});

	// 浏览器提供的获取计算样式的方法
	if (document.defaultView && document.defaultView.getComputedStyle) {
		getComputedStyle = function (elem, name) {
			var ret, defaultView, computedStyle;

			name = name.replace(rupper, "-$1").toLowerCase();

			if ((defaultView = elem.ownerDocument.defaultView) &&
				(computedStyle = defaultView.getComputedStyle(elem, null))) {
				ret = computedStyle.getPropertyValue(name);
				if (ret === "" && !jQuery.contains(elem.ownerDocument.documentElement, elem)) {
					ret = jQuery.style(elem, name);
				}
			}

			return ret;
		};
	}

	// document.documentElement即HTML元素
	if (document.documentElement.currentStyle) {
		currentStyle = function (elem, name) {
			var left, rsLeft, uncomputed,
				ret = elem.currentStyle && elem.currentStyle[name],
				style = elem.style;

			// Avoid setting ret to empty string here
			// so we don't default to auto
			if (ret === null && style && (uncomputed = style[name])) {
				ret = uncomputed;
			}

			// From the awesome hack by Dean Edwards
			// http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291

			// If we're not dealing with a regular pixel number
			// but a number that has a weird ending, we need to convert it to pixels
			if (!rnumpx.test(ret) && rnum.test(ret)) {

				// Remember the original values
				left = style.left;
				rsLeft = elem.runtimeStyle && elem.runtimeStyle.left;

				// Put in the new values to get a computed value out
				if (rsLeft) {
					elem.runtimeStyle.left = elem.currentStyle.left;
				}
				style.left = name === "fontSize" ? "1em" : (ret || 0);
				ret = style.pixelLeft + "px";

				// Revert the changed values
				style.left = left;
				if (rsLeft) {
					elem.runtimeStyle.left = rsLeft;
				}
			}

			return ret === "" ? "auto" : ret;
		};
	}

	curCSS = getComputedStyle || currentStyle;

	// 用于获取元素的高度、宽度，是一个工具函数
	function getWH(elem, name, extra) {

		// Start with offset property
		var val = name === "width" ? elem.offsetWidth : elem.offsetHeight,
			which = name === "width" ? cssWidth : cssHeight,
			i = 0,
			len = which.length;

		if (val > 0) {
			if (extra !== "border") {
				for (; i < len; i++) {
					if (!extra) {
						val -= parseFloat(jQuery.css(elem, "padding" + which[i])) || 0;
					}
					if (extra === "margin") {
						val += parseFloat(jQuery.css(elem, extra + which[i])) || 0;
					} else {
						val -= parseFloat(jQuery.css(elem, "border" + which[i] + "Width")) || 0;
					}
				}
			}

			return val + "px";
		}

		// Fall back to computed then uncomputed css if necessary
		val = curCSS(elem, name, name);
		if (val < 0 || val == null) {
			val = elem.style[name] || 0;
		}
		// Normalize "", auto, and prepare for extra
		val = parseFloat(val) || 0;

		// Add padding, border, margin
		if (extra) {
			for (; i < len; i++) {
				val += parseFloat(jQuery.css(elem, "padding" + which[i])) || 0;
				if (extra !== "padding") {
					val += parseFloat(jQuery.css(elem, "border" + which[i] + "Width")) || 0;
				}
				if (extra === "margin") {
					val += parseFloat(jQuery.css(elem, extra + which[i])) || 0;
				}
			}
		}

		return val + "px";
	}

	if (jQuery.expr && jQuery.expr.filters) {
		jQuery.expr.filters.hidden = function (elem) {
			var width = elem.offsetWidth,
				height = elem.offsetHeight;

			return (width === 0 && height === 0) || (!jQuery.support.reliableHiddenOffsets && ((elem.style && elem.style.display) || jQuery.css(elem, "display")) === "none");
		};

		jQuery.expr.filters.visible = function (elem) {
			return !jQuery.expr.filters.hidden(elem);
		};
	}




	var r20 = /%20/g,
		rbracket = /\[\]$/,
		rCRLF = /\r?\n/g,
		rhash = /#.*$/,
		rheaders = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg, // IE leaves an \r character at EOL
		rinput = /^(?:color|date|datetime|datetime-local|email|hidden|month|number|password|range|search|tel|text|time|url|week)$/i,
		// #7653, #8125, #8152: local protocol detection
		rlocalProtocol = /^(?:about|app|app\-storage|.+\-extension|file|res|widget):$/,
		rnoContent = /^(?:GET|HEAD)$/,
		rprotocol = /^\/\//,
		rquery = /\?/,
		rscript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
		rselectTextarea = /^(?:select|textarea)/i,
		rspacesAjax = /\s+/,
		rts = /([?&])_=[^&]*/,
		rurl = /^([\w\+\.\-]+:)(?:\/\/([^\/?#:]*)(?::(\d+))?)?/,

		// Keep a copy of the old load method
		_load = jQuery.fn.load,

		// 异步请求AJAX
		/**
		 * 核心方法、前置过滤器、请求发送器、数据转换器、便捷方法、AJAX事件、工具方法
		 */
		/* Prefilters
		 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
		 * 2) These are called:
		 *    - BEFORE asking for a transport
		 *    - AFTER param serialization (s.data is a string if s.processData is true)
		 * 3) key is the dataType
		 * 4) the catchall symbol "*" can be used
		 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
		 */
		// 前置过滤器集
		prefilters = {},

		/* Transports bindings
		 * 1) key is the dataType
		 * 2) the catchall symbol "*" can be used
		 * 3) selection will start with transport dataType and THEN go to "*" if needed
		 */
		// 请求发送器集
		transports = {},

		// Document location
		ajaxLocation,

		// Document location segments
		ajaxLocParts,

		// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
		allTypes = ["*/"] + ["*"];

	// #8138, IE may throw an exception when accessing
	// a field from window.location if document.domain has been set
	try {
		// 当前窗口的URL
		ajaxLocation = location.href;
	} catch (e) {
		// Use the href attribute of an A element
		// since IE will modify it given document.location
		// 当a元素的href为空时，浏览器会设置a元素的href为location.href
		ajaxLocation = document.createElement("a");
		ajaxLocation.href = "";
		ajaxLocation = ajaxLocation.href;
	}

	// Segment location into parts
	ajaxLocParts = rurl.exec(ajaxLocation.toLowerCase()) || [];

	// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
	function addToPrefiltersOrTransports(structure) {

		// dataTypeExpression is optional and defaults to "*"
		return function (dataTypeExpression, func) {

			if (typeof dataTypeExpression !== "string") {
				func = dataTypeExpression;
				dataTypeExpression = "*";
			}

			if (jQuery.isFunction(func)) {
				var dataTypes = dataTypeExpression.toLowerCase().split(rspacesAjax),
					i = 0,
					length = dataTypes.length,
					dataType,
					list,
					placeBefore;

				// For each dataType in the dataTypeExpression
				for (; i < length; i++) {
					dataType = dataTypes[i];
					// We control if we're asked to add before
					// any existing element
					placeBefore = /^\+/.test(dataType);
					if (placeBefore) {
						dataType = dataType.substr(1) || "*";
					}
					list = structure[dataType] = structure[dataType] || [];
					// then we add to the structure accordingly
					list[placeBefore ? "unshift" : "push"](func);
				}
			}
		};
	}

	// Base inspection function for prefilters and transports
	function inspectPrefiltersOrTransports(structure, options, originalOptions, jqXHR,
		dataType /* internal */ , inspected /* internal */ ) {

		dataType = dataType || options.dataTypes[0];
		inspected = inspected || {};

		inspected[dataType] = true;

		var list = structure[dataType],
			i = 0,
			length = list ? list.length : 0,
			executeOnly = (structure === prefilters),
			selection;

		for (; i < length && (executeOnly || !selection); i++) {
			selection = list[i](options, originalOptions, jqXHR);
			// If we got redirected to another dataType
			// we try there if executing only and not done already
			if (typeof selection === "string") {
				if (!executeOnly || inspected[selection]) {
					selection = undefined;
				} else {
					options.dataTypes.unshift(selection);
					selection = inspectPrefiltersOrTransports(
						structure, options, originalOptions, jqXHR, selection, inspected);
				}
			}
		}
		// If we're only executing or nothing was selected
		// we try the catchall dataType if not done already
		if ((executeOnly || !selection) && !inspected["*"]) {
			selection = inspectPrefiltersOrTransports(
				structure, options, originalOptions, jqXHR, "*", inspected);
		}
		// unnecessary when only executing (prefilters)
		// but it'll be ignored by the caller in that case
		return selection;
	}

	// A special extend for ajax options
	// that takes "flat" options (not to be deep extended)
	// Fixes #9887
	function ajaxExtend(target, src) {
		var key, deep,
		// 属性context，URL直接设置到对象target中
			flatOptions = jQuery.ajaxSettings.flatOptions || {};
		for (key in src) {
			if (src[key] !== undefined) {
				// flatOptions[content] === true-->target[key] = src[key] 不做拷贝
				// 否则做深拷贝
				(flatOptions[key] ? target : (deep || (deep = {})))[key] = src[key];
			}
		}
		if (deep) {
			jQuery.extend(true, target, deep);
		}
	}

	jQuery.fn.extend({
		load: function (url, params, callback) {
			if (typeof url !== "string" && _load) {
				return _load.apply(this, arguments);

				// Don't do a request if no elements are being requested
			} else if (!this.length) {
				return this;
			}

			var off = url.indexOf(" ");
			if (off >= 0) {
				var selector = url.slice(off, url.length);
				url = url.slice(0, off);
			}

			// Default to a GET request
			var type = "GET";

			// If the second parameter was provided
			if (params) {
				// If it's a function
				if (jQuery.isFunction(params)) {
					// We assume that it's the callback
					callback = params;
					params = undefined;

					// Otherwise, build a param string
				} else if (typeof params === "object") {
					params = jQuery.param(params, jQuery.ajaxSettings.traditional);
					type = "POST";
				}
			}

			var self = this;

			// Request the remote document
			jQuery.ajax({
				url: url,
				type: type,
				dataType: "html",
				data: params,
				// Complete callback (responseText is used internally)
				complete: function (jqXHR, status, responseText) {
					// Store the response as specified by the jqXHR object
					responseText = jqXHR.responseText;
					// If successful, inject the HTML into all the matched elements
					if (jqXHR.isResolved()) {
						// #4825: Get the actual response in case
						// a dataFilter is present in ajaxSettings
						jqXHR.done(function (r) {
							responseText = r;
						});
						// See if a selector was specified
						self.html(selector ?
							// Create a dummy div to hold the results
							jQuery("<div>")
							// inject the contents of the document in, removing the scripts
							// to avoid any 'Permission Denied' errors in IE
							.append(responseText.replace(rscript, ""))

							// Locate the specified elements
							.find(selector) :

							// If not, just inject the full result
							responseText);
					}

					if (callback) {
						self.each(callback, [responseText, status, jqXHR]);
					}
				}
			});

			return this;
		},

		serialize: function () {
			return jQuery.param(this.serializeArray());
		},

		serializeArray: function () {
			return this.map(function () {
					return this.elements ? jQuery.makeArray(this.elements) : this;
				})
				.filter(function () {
					return this.name && !this.disabled &&
						(this.checked || rselectTextarea.test(this.nodeName) ||
							rinput.test(this.type));
				})
				.map(function (i, elem) {
					var val = jQuery(this).val();

					return val == null ?
						null :
						jQuery.isArray(val) ?
						jQuery.map(val, function (val, i) {
							return {
								name: elem.name,
								value: val.replace(rCRLF, "\r\n")
							};
						}) : {
							name: elem.name,
							value: val.replace(rCRLF, "\r\n")
						};
				}).get();
		}
	});

	// Attach a bunch of functions for handling common AJAX events
	jQuery.each("ajaxStart ajaxStop ajaxComplete ajaxError ajaxSuccess ajaxSend".split(" "), function (i, o) {
		jQuery.fn[o] = function (f) {
			return this.on(o, f);
		};
	});

	jQuery.each(["get", "post"], function (i, method) {
		jQuery[method] = function (url, data, callback, type) {
			// shift arguments if data argument was omitted
			if (jQuery.isFunction(data)) {
				type = type || callback;
				callback = data;
				data = undefined;
			}

			return jQuery.ajax({
				type: method,
				url: url,
				data: data,
				success: callback,
				dataType: type
			});
		};
	});

	jQuery.extend({

		getScript: function (url, callback) {
			return jQuery.get(url, undefined, callback, "script");
		},

		getJSON: function (url, data, callback) {
			return jQuery.get(url, data, callback, "json");
		},

		// Creates a full fledged settings object into target
		// with both ajaxSettings and settings fields.
		// If target is omitted, writes into ajaxSettings.
		// 用于全局设置选项的默认值，或者构造当前请求的完整选项集
		// 将setting配置到jQuery.ajaxSettings上
		ajaxSetup: function (target, settings) {
			if (settings) {
				// Building a settings object
				ajaxExtend(target, jQuery.ajaxSettings);
			} else {
				// Extending ajaxSettings
				settings = target;
				target = jQuery.ajaxSettings;
			}
			ajaxExtend(target, settings);
			return target;
		},

		ajaxSettings: {
			url: ajaxLocation,
			isLocal: rlocalProtocol.test(ajaxLocParts[1]),
			global: true,
			type: "GET",
			contentType: "application/x-www-form-urlencoded",
			processData: true,
			async: true,
			/*
			timeout: 0,
			data: null,
			dataType: null,
			username: null,
			password: null,
			cache: null,
			traditional: false,
			headers: {},
			*/

			accepts: {
				xml: "application/xml, text/xml",
				html: "text/html",
				text: "text/plain",
				json: "application/json, text/javascript",
				"*": allTypes
			},

			contents: {
				xml: /xml/,
				html: /html/,
				json: /json/
			},

			responseFields: {
				xml: "responseXML",
				text: "responseText"
			},

			// List of data converters
			// 1) key format is "source_type destination_type" (a single space in-between)
			// 2) the catchall symbol "*" can be used for source_type
			converters: {

				// Convert anything to text
				"* text": window.String,

				// Text to html (true = no transformation)
				"text html": true,

				// Evaluate text as a json expression
				"text json": jQuery.parseJSON,

				// Parse text as xml
				"text xml": jQuery.parseXML
			},

			// For options that shouldn't be deep extended:
			// you can add your own custom options here if
			// and when you create one that shouldn't be
			// deep extended (see ajaxExtend)
			flatOptions: {
				context: true,
				url: true
			}
		},

		ajaxPrefilter: addToPrefiltersOrTransports(prefilters),
		ajaxTransport: addToPrefiltersOrTransports(transports),

		// Main method
		ajax: function (url, options) {

			// If url is an object, simulate pre-1.5 signature
			/**
			 * 便于支持两种方法签名--重载的实现
			 * 1. jQuery.ajax(url, options)
			 * 2. jQuery.ajax(options)
			 */
			if (typeof url === "object") {
				options = url;
				url = undefined;
			}

			// Force options to be an object
			// 这样做，只是应对options没有传入，为undefined的情形
			// 是不是应该通过类型来判断？
			options = options || {};

			var // Create the final options object
			// 传入参数中有context则设置回调函数上下文
				s = jQuery.ajaxSetup({}, options),
				// Callbacks context
				callbackContext = s.context || s,
				// Context for global events
				// It's the callbackContext if one was provided in the options
				// and if it's a DOM node or a jQuery collection
				// 如果指定了选项context，并且它是DOM元素或jQuery集合，则全局事件的上下文为选项context
				// 此时只会在指定的元素上触发全局事件ajaxSend,ajaxSuccess,ajaxError, ajaxComplete,
				// 而且是通过方法trigger（type，data）触发的
				globalEventContext = callbackContext !== s &&
				(callbackContext.nodeType || callbackContext instanceof jQuery) ?
				jQuery(callbackContext) : jQuery.event,
				// Deferreds
				deferred = jQuery.Deferred(),
				completeDeferred = jQuery.Callbacks("once memory"),
				// Status-dependent callbacks
				// 存放了依赖于状态码的回调函数，当服务器返回响应时，状态码对应的回调函数将被执行
				statusCode = s.statusCode || {},
				// ifModified key
				// If-Modified-Since和If-None-Match，充分利用浏览器缓存
				ifModifiedKey,
				// Headers (they are sent all at once)
				// 用于存储和记录请求头
				requestHeaders = {},
				requestHeadersNames = {},
				// Response headers
				responseHeadersString,
				responseHeaders,
				// transport
				transport,
				// timeout handle
				timeoutTimer,
				// Cross-domain detection vars
				parts,
				// The jqXHR state
				state = 0,
				// To know if global events are to be dispatched
				fireGlobals,
				// Loop variable
				i,
				// Fake xhr
				jqXHR = {

					readyState: 0,

					// Caches the header
					setRequestHeader: function (name, value) {
						if (!state) {
							var lname = name.toLowerCase();
							name = requestHeadersNames[lname] = requestHeadersNames[lname] || name;
							requestHeaders[name] = value;
						}
						return this;
					},

					// Raw string
					getAllResponseHeaders: function () {
						return state === 2 ? responseHeadersString : null;
					},

					// Builds headers hashtable if needed
					getResponseHeader: function (key) {
						var match;
						if (state === 2) {
							if (!responseHeaders) {
								responseHeaders = {};
								while ((match = rheaders.exec(responseHeadersString))) {
									responseHeaders[match[1].toLowerCase()] = match[2];
								}
							}
							match = responseHeaders[key.toLowerCase()];
						}
						return match === undefined ? null : match;
					},

					// Overrides response content-type header
					// 覆盖MIME类型
					overrideMimeType: function (type) {
						if (!state) {
							s.mimeType = type;
						}
						return this;
					},

					// Cancel the request
					abort: function (statusText) {
						statusText = statusText || "abort";
						if (transport) {
							transport.abort(statusText);
						}
						done(0, statusText);
						return this;
					}
				};

			// Callback for when everything is done
			// It is defined here because jslint complains if it is declared
			// at the end of the function (which would be more logical and readable)
			// 清理本次请求用到的变量、读取响应数据、转换数据类型、执行回调函数
			function done(status, nativeStatusText, responses, headers) {

				// Called once
				if (state === 2) {
					return;
				}

				// State is "done" now
				state = 2;

				// Clear timeout if it exists
				// 清除超时定时器
				if (timeoutTimer) {
					clearTimeout(timeoutTimer);
				}

				// Dereference transport for early garbage collection
				// (no matter how long the jqXHR object will be used)
				// 解除对请求发送器的引用
				transport = undefined;

				// Cache response headers
				responseHeadersString = headers || "";

				// Set readyState
				jqXHR.readyState = status > 0 ? 4 : 0;

				var isSuccess,
					success,
					// 表示错误状态秒速或指向可能抛出的异常对象
					error,
					statusText = nativeStatusText,
					response = responses ? ajaxHandleResponses(s, jqXHR, responses) : undefined,
					lastModified,
					etag;

				// If successful, handle type chaining
				if (status >= 200 && status < 300 || status === 304) {

					// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
					if (s.ifModified) {

						if ((lastModified = jqXHR.getResponseHeader("Last-Modified"))) {
							jQuery.lastModified[ifModifiedKey] = lastModified;
						}
						if ((etag = jqXHR.getResponseHeader("Etag"))) {
							jQuery.etag[ifModifiedKey] = etag;
						}
					}

					// If not modified
					if (status === 304) {

						statusText = "notmodified";
						isSuccess = true;

						// If we have data
					} else {

						try {
							success = ajaxConvert(s, response);
							statusText = "success";
							isSuccess = true;
						} catch (e) {
							// We have a parsererror
							statusText = "parsererror";
							error = e;
						}
					}
				} else {
					// We extract error from statusText
					// then normalize statusText and status for non-aborts
					error = statusText;
					if (!statusText || status) {
						statusText = "error";
						if (status < 0) {
							status = 0;
						}
					}
				}

				// Set data for the fake xhr object
				jqXHR.status = status;
				jqXHR.statusText = "" + (nativeStatusText || statusText);

				// Success/Error
				if (isSuccess) {
					deferred.resolveWith(callbackContext, [success, statusText, jqXHR]);
				} else {
					deferred.rejectWith(callbackContext, [jqXHR, statusText, error]);
				}

				// Status-dependent callbacks
				jqXHR.statusCode(statusCode);
				statusCode = undefined;

				if (fireGlobals) {
					globalEventContext.trigger("ajax" + (isSuccess ? "Success" : "Error"),
						[jqXHR, s, isSuccess ? success : error]);
				}

				// Complete
				completeDeferred.fireWith(callbackContext, [jqXHR, statusText]);

				if (fireGlobals) {
					globalEventContext.trigger("ajaxComplete", [jqXHR, s]);
					// Handle the global AJAX counter
					if (!(--jQuery.active)) {
						jQuery.event.trigger("ajaxStop");
					}
				}
			}

			// Attach deferreds
			deferred.promise(jqXHR);
			jqXHR.success = jqXHR.done;
			jqXHR.error = jqXHR.fail;
			jqXHR.complete = completeDeferred.add;

			// Status-dependent callbacks
			jqXHR.statusCode = function (map) {
				if (map) {
					var tmp;
					if (state < 2) {
						for (tmp in map) {
							statusCode[tmp] = [statusCode[tmp], map[tmp]];
						}
					} else {
						tmp = map[jqXHR.status];
						jqXHR.then(tmp, tmp);
					}
				}
				return this;
			};

			// Remove hash character (#7531: and string promotion)
			// Add protocol if not provided (#5866: IE7 issue with protocol-less urls)
			// We also use the url parameter if available
			s.url = ((url || s.url) + "").replace(rhash, "").replace(rprotocol, ajaxLocParts[1] + "//");

			// Extract dataTypes list
			s.dataTypes = jQuery.trim(s.dataType || "*").toLowerCase().split(rspacesAjax);

			// Determine if a cross-domain request is in order
			if (s.crossDomain == null) {
				parts = rurl.exec(s.url.toLowerCase());
				s.crossDomain = !!(parts &&
					(parts[1] != ajaxLocParts[1] || parts[2] != ajaxLocParts[2] ||
						(parts[3] || (parts[1] === "http:" ? 80 : 443)) !=
						(ajaxLocParts[3] || (ajaxLocParts[1] === "http:" ? 80 : 443)))
				);
			}

			// Convert data if not already a string
			if (s.data && s.processData && typeof s.data !== "string") {
				s.data = jQuery.param(s.data, s.traditional);
			}

			// Apply prefilters
			inspectPrefiltersOrTransports(prefilters, s, options, jqXHR);

			// If request was aborted inside a prefiler, stop there
			if (state === 2) {
				return false;
			}

			// We can fire global events as of now if asked to
			fireGlobals = s.global;

			// Uppercase the type
			s.type = s.type.toUpperCase();

			// Determine if request has content
			s.hasContent = !rnoContent.test(s.type);

			// Watch for a new set of requests
			if (fireGlobals && jQuery.active++ === 0) {
				jQuery.event.trigger("ajaxStart");
			}

			// More options handling for requests with no content
			if (!s.hasContent) {

				// If data is available, append data to url
				if (s.data) {
					s.url += (rquery.test(s.url) ? "&" : "?") + s.data;
					// #9682: remove data so that it's not used in an eventual retry
					delete s.data;
				}

				// Get ifModifiedKey before adding the anti-cache parameter
				ifModifiedKey = s.url;

				// Add anti-cache in url if needed
				if (s.cache === false) {

					var ts = jQuery.now(),
						// try replacing _= if it is there
						ret = s.url.replace(rts, "$1_=" + ts);

					// if nothing was replaced, add timestamp to the end
					s.url = ret + ((ret === s.url) ? (rquery.test(s.url) ? "&" : "?") + "_=" + ts : "");
				}
			}

			// Set the correct header, if data is being sent
			if (s.data && s.hasContent && s.contentType !== false || options.contentType) {
				jqXHR.setRequestHeader("Content-Type", s.contentType);
			}

			// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
			if (s.ifModified) {
				ifModifiedKey = ifModifiedKey || s.url;
				if (jQuery.lastModified[ifModifiedKey]) {
					jqXHR.setRequestHeader("If-Modified-Since", jQuery.lastModified[ifModifiedKey]);
				}
				if (jQuery.etag[ifModifiedKey]) {
					jqXHR.setRequestHeader("If-None-Match", jQuery.etag[ifModifiedKey]);
				}
			}

			// Set the Accepts header for the server, depending on the dataType
			jqXHR.setRequestHeader(
				"Accept",
				s.dataTypes[0] && s.accepts[s.dataTypes[0]] ?
				s.accepts[s.dataTypes[0]] + (s.dataTypes[0] !== "*" ? ", " + allTypes + "; q=0.01" : "") :
				s.accepts["*"]
			);

			// Check for headers option
			for (i in s.headers) {
				jqXHR.setRequestHeader(i, s.headers[i]);
			}

			// Allow custom headers/mimetypes and early abort
			if (s.beforeSend && (s.beforeSend.call(callbackContext, jqXHR, s) === false || state === 2)) {
				// Abort if not done already
				jqXHR.abort();
				return false;

			}

			// Install callbacks on deferreds
			for (i in {
					success: 1,
					error: 1,
					complete: 1
				}) {
				jqXHR[i](s[i]);
			}

			// Get transport
			transport = inspectPrefiltersOrTransports(transports, s, options, jqXHR);

			// If no transport, we auto-abort
			if (!transport) {
				done(-1, "No Transport");
			} else {
				jqXHR.readyState = 1;
				// Send global event
				if (fireGlobals) {
					globalEventContext.trigger("ajaxSend", [jqXHR, s]);
				}
				// Timeout
				if (s.async && s.timeout > 0) {
					timeoutTimer = setTimeout(function () {
						jqXHR.abort("timeout");
					}, s.timeout);
				}

				try {
					state = 1;
					transport.send(requestHeaders, done);
				} catch (e) {
					// Propagate exception as error if not done
					if (state < 2) {
						done(-1, e);
						// Simply rethrow otherwise
					} else {
						throw e;
					}
				}
			}

			return jqXHR;
		},

		// Serialize an array of form elements or a set of
		// key/values into a query string
		param: function (a, traditional) {
			var s = [],
				add = function (key, value) {
					// If value is a function, invoke it and return its value
					value = jQuery.isFunction(value) ? value() : value;
					s[s.length] = encodeURIComponent(key) + "=" + encodeURIComponent(value);
				};

			// Set traditional to true for jQuery <= 1.3.2 behavior.
			if (traditional === undefined) {
				traditional = jQuery.ajaxSettings.traditional;
			}

			// If an array was passed in, assume that it is an array of form elements.
			if (jQuery.isArray(a) || (a.jquery && !jQuery.isPlainObject(a))) {
				// Serialize the form elements
				jQuery.each(a, function () {
					add(this.name, this.value);
				});

			} else {
				// If traditional, encode the "old" way (the way 1.3.2 or older
				// did it), otherwise encode params recursively.
				for (var prefix in a) {
					buildParams(prefix, a[prefix], traditional, add);
				}
			}

			// Return the resulting serialization
			return s.join("&").replace(r20, "+");
		}
	});

	function buildParams(prefix, obj, traditional, add) {
		if (jQuery.isArray(obj)) {
			// Serialize array item.
			jQuery.each(obj, function (i, v) {
				if (traditional || rbracket.test(prefix)) {
					// Treat each array item as a scalar.
					add(prefix, v);

				} else {
					// If array item is non-scalar (array or object), encode its
					// numeric index to resolve deserialization ambiguity issues.
					// Note that rack (as of 1.0.0) can't currently deserialize
					// nested arrays properly, and attempting to do so may cause
					// a server error. Possible fixes are to modify rack's
					// deserialization algorithm or to provide an option or flag
					// to force array serialization to be shallow.
					buildParams(prefix + "[" + (typeof v === "object" || jQuery.isArray(v) ? i : "") + "]", v, traditional, add);
				}
			});

		} else if (!traditional && obj != null && typeof obj === "object") {
			// Serialize object item.
			for (var name in obj) {
				buildParams(prefix + "[" + name + "]", obj[name], traditional, add);
			}

		} else {
			// Serialize scalar item.
			add(prefix, obj);
		}
	}

	// This is still on the jQuery object... for now
	// Want to move this to jQuery.ajax some day
	jQuery.extend({

		// Counter for holding the number of active queries
		active: 0,

		// Last-Modified header cache for next request
		lastModified: {},
		etag: {}

	});

	/* Handles responses to an ajax request:
	 * - sets all responseXXX fields accordingly
	 * - finds the right dataType (mediates between content-type and expected dataType)
	 * - returns the corresponding response
	 */
	function ajaxHandleResponses(s, jqXHR, responses) {

		var contents = s.contents,
			dataTypes = s.dataTypes,
			responseFields = s.responseFields,
			ct,
			type,
			finalDataType,
			firstDataType;

		// Fill responseXXX fields
		for (type in responseFields) {
			if (type in responses) {
				jqXHR[responseFields[type]] = responses[type];
			}
		}

		// Remove auto dataType and get content-type in the process
		while (dataTypes[0] === "*") {
			dataTypes.shift();
			if (ct === undefined) {
				ct = s.mimeType || jqXHR.getResponseHeader("content-type");
			}
		}

		// Check if we're dealing with a known content-type
		if (ct) {
			for (type in contents) {
				if (contents[type] && contents[type].test(ct)) {
					dataTypes.unshift(type);
					break;
				}
			}
		}

		// Check to see if we have a response for the expected dataType
		if (dataTypes[0] in responses) {
			finalDataType = dataTypes[0];
		} else {
			// Try convertible dataTypes
			for (type in responses) {
				if (!dataTypes[0] || s.converters[type + " " + dataTypes[0]]) {
					finalDataType = type;
					break;
				}
				if (!firstDataType) {
					firstDataType = type;
				}
			}
			// Or just use first one
			finalDataType = finalDataType || firstDataType;
		}

		// If we found a dataType
		// We add the dataType to the list if needed
		// and return the corresponding response
		if (finalDataType) {
			if (finalDataType !== dataTypes[0]) {
				dataTypes.unshift(finalDataType);
			}
			return responses[finalDataType];
		}
	}

	// Chain conversions given the request and the original response
	function ajaxConvert(s, response) {

		// Apply the dataFilter if provided
		if (s.dataFilter) {
			response = s.dataFilter(response, s.dataType);
		}

		var dataTypes = s.dataTypes,
			converters = {},
			i,
			key,
			length = dataTypes.length,
			tmp,
			// Current and previous dataTypes
			current = dataTypes[0],
			prev,
			// Conversion expression
			conversion,
			// Conversion function
			conv,
			// Conversion functions (transitive conversion)
			conv1,
			conv2;

		// For each dataType in the chain
		for (i = 1; i < length; i++) {

			// Create converters map
			// with lowercased keys
			if (i === 1) {
				for (key in s.converters) {
					if (typeof key === "string") {
						converters[key.toLowerCase()] = s.converters[key];
					}
				}
			}

			// Get the dataTypes
			prev = current;
			current = dataTypes[i];

			// If current is auto dataType, update it to prev
			if (current === "*") {
				current = prev;
				// If no auto and dataTypes are actually different
			} else if (prev !== "*" && prev !== current) {

				// Get the converter
				conversion = prev + " " + current;
				conv = converters[conversion] || converters["* " + current];

				// If there is no direct converter, search transitively
				if (!conv) {
					conv2 = undefined;
					for (conv1 in converters) {
						tmp = conv1.split(" ");
						if (tmp[0] === prev || tmp[0] === "*") {
							conv2 = converters[tmp[1] + " " + current];
							if (conv2) {
								conv1 = converters[conv1];
								if (conv1 === true) {
									conv = conv2;
								} else if (conv2 === true) {
									conv = conv1;
								}
								break;
							}
						}
					}
				}
				// If we found no converter, dispatch an error
				if (!(conv || conv2)) {
					jQuery.error("No conversion from " + conversion.replace(" ", " to "));
				}
				// If found converter is not an equivalence
				if (conv !== true) {
					// Convert with 1 or 2 converters accordingly
					response = conv ? conv(response) : conv2(conv1(response));
				}
			}
		}
		return response;
	}




	var jsc = jQuery.now(),
		jsre = /(\=)\?(&|$)|\?\?/i;

	// Default jsonp settings
	jQuery.ajaxSetup({
		jsonp: "callback",
		jsonpCallback: function () {
			return jQuery.expando + "_" + (jsc++);
		}
	});

	// Detect, normalize options and install callbacks for jsonp requests
	jQuery.ajaxPrefilter("json jsonp", function (s, originalSettings, jqXHR) {

		var inspectData = s.contentType === "application/x-www-form-urlencoded" &&
			(typeof s.data === "string");

		if (s.dataTypes[0] === "jsonp" ||
			s.jsonp !== false && (jsre.test(s.url) ||
				inspectData && jsre.test(s.data))) {

			var responseContainer,
				jsonpCallback = s.jsonpCallback =
				jQuery.isFunction(s.jsonpCallback) ? s.jsonpCallback() : s.jsonpCallback,
				previous = window[jsonpCallback],
				url = s.url,
				data = s.data,
				replace = "$1" + jsonpCallback + "$2";

			if (s.jsonp !== false) {
				url = url.replace(jsre, replace);
				if (s.url === url) {
					if (inspectData) {
						data = data.replace(jsre, replace);
					}
					if (s.data === data) {
						// Add callback manually
						url += (/\?/.test(url) ? "&" : "?") + s.jsonp + "=" + jsonpCallback;
					}
				}
			}

			s.url = url;
			s.data = data;

			// Install callback
			window[jsonpCallback] = function (response) {
				responseContainer = [response];
			};

			// Clean-up function
			jqXHR.always(function () {
				// Set callback back to previous value
				window[jsonpCallback] = previous;
				// Call if it was a function and we have a response
				if (responseContainer && jQuery.isFunction(previous)) {
					window[jsonpCallback](responseContainer[0]);
				}
			});

			// Use data converter to retrieve json after script execution
			s.converters["script json"] = function () {
				if (!responseContainer) {
					jQuery.error(jsonpCallback + " was not called");
				}
				return responseContainer[0];
			};

			// force json dataType
			s.dataTypes[0] = "json";

			// Delegate to script
			return "script";
		}
	});




	// Install script dataType
	jQuery.ajaxSetup({
		accepts: {
			script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
		},
		contents: {
			script: /javascript|ecmascript/
		},
		converters: {
			"text script": function (text) {
				jQuery.globalEval(text);
				return text;
			}
		}
	});

	// Handle cache's special case and global
	jQuery.ajaxPrefilter("script", function (s) {
		if (s.cache === undefined) {
			s.cache = false;
		}
		if (s.crossDomain) {
			s.type = "GET";
			s.global = false;
		}
	});

	// Bind script tag hack transport
	jQuery.ajaxTransport("script", function (s) {

		// This transport only deals with cross domain requests
		if (s.crossDomain) {

			var script,
				head = document.head || document.getElementsByTagName("head")[0] || document.documentElement;

			return {

				send: function (_, callback) {

					script = document.createElement("script");

					script.async = "async";

					if (s.scriptCharset) {
						script.charset = s.scriptCharset;
					}

					script.src = s.url;

					// Attach handlers for all browsers
					script.onload = script.onreadystatechange = function (_, isAbort) {

						if (isAbort || !script.readyState || /loaded|complete/.test(script.readyState)) {

							// Handle memory leak in IE
							script.onload = script.onreadystatechange = null;

							// Remove the script
							if (head && script.parentNode) {
								head.removeChild(script);
							}

							// Dereference the script
							script = undefined;

							// Callback if not abort
							if (!isAbort) {
								callback(200, "success");
							}
						}
					};
					// Use insertBefore instead of appendChild  to circumvent an IE6 bug.
					// This arises when a base node is used (#2709 and #4378).
					head.insertBefore(script, head.firstChild);
				},

				abort: function () {
					if (script) {
						script.onload(0, 1);
					}
				}
			};
		}
	});




	var // #5280: Internet Explorer will keep connections alive if we don't abort on unload
		xhrOnUnloadAbort = window.ActiveXObject ? function () {
			// Abort all pending requests
			for (var key in xhrCallbacks) {
				xhrCallbacks[key](0, 1);
			}
		} : false,
		xhrId = 0,
		xhrCallbacks;

	// Functions to create xhrs
	function createStandardXHR() {
		try {
			return new window.XMLHttpRequest();
		} catch (e) {}
	}

	function createActiveXHR() {
		try {
			return new window.ActiveXObject("Microsoft.XMLHTTP");
		} catch (e) {}
	}

	// Create the request object
	// (This is still attached to ajaxSettings for backward compatibility)
	jQuery.ajaxSettings.xhr = window.ActiveXObject ?
		/* Microsoft failed to properly
		 * implement the XMLHttpRequest in IE7 (can't request local files),
		 * so we use the ActiveXObject when it is available
		 * Additionally XMLHttpRequest can be disabled in IE7/IE8 so
		 * we need a fallback.
		 */
		function () {
			return !this.isLocal && createStandardXHR() || createActiveXHR();
		} :
		// For all other browsers, use the standard XMLHttpRequest object
		createStandardXHR;

	// Determine support properties
	(function (xhr) {
		jQuery.extend(jQuery.support, {
			ajax: !!xhr,
			// 浏览器是否支持跨域资源共享(Cross-OriginResource Sharing)
			// IE6, IE7完全不支持跨域资源共享，IE8,9通过XDomainRequest对象部分支持跨域资源共享
			// withCredentials用于指示XMLHttpRequest对象在发起跨域请求时，是否包含身份认证信息
			cors: !!xhr && ("withCredentials" in xhr)
		});
	})(jQuery.ajaxSettings.xhr());

	// Create transport if the browser can provide an xhr
	if (jQuery.support.ajax) {

		jQuery.ajaxTransport(function (s) {
			// Cross domain only allowed if supported through XMLHttpRequest
			if (!s.crossDomain || jQuery.support.cors) {

				var callback;

				return {
					send: function (headers, complete) {

						// Get a new xhr
						var xhr = s.xhr(),
							handle,
							i;

						// Open the socket
						// Passing null username, generates a login popup on Opera (#2865)
						if (s.username) {
							xhr.open(s.type, s.url, s.async, s.username, s.password);
						} else {
							xhr.open(s.type, s.url, s.async);
						}

						// Apply custom fields if provided
						if (s.xhrFields) {
							for (i in s.xhrFields) {
								xhr[i] = s.xhrFields[i];
							}
						}

						// Override mime type if needed
						if (s.mimeType && xhr.overrideMimeType) {
							xhr.overrideMimeType(s.mimeType);
						}

						// X-Requested-With header
						// For cross-domain requests, seeing as conditions for a preflight are
						// akin to a jigsaw puzzle, we simply never set it to be sure.
						// (it can always be set on a per-request basis or even using ajaxSetup)
						// For same-domain requests, won't change header if already provided.
						if (!s.crossDomain && !headers["X-Requested-With"]) {
							headers["X-Requested-With"] = "XMLHttpRequest";
						}

						// Need an extra try/catch for cross domain requests in Firefox 3
						try {
							for (i in headers) {
								xhr.setRequestHeader(i, headers[i]);
							}
						} catch (_) {}

						// Do send the request
						// This may raise an exception which is actually
						// handled in jQuery.ajax (so no try/catch here)
						xhr.send((s.hasContent && s.data) || null);

						// Listener
						callback = function (_, isAbort) {

							var status,
								statusText,
								responseHeaders,
								responses,
								xml;

							// Firefox throws exceptions when accessing properties
							// of an xhr when a network error occured
							// http://helpful.knobs-dials.com/index.php/Component_returned_failure_code:_0x80040111_(NS_ERROR_NOT_AVAILABLE)
							try {

								// Was never called and is aborted or complete
								if (callback && (isAbort || xhr.readyState === 4)) {

									// Only called once
									callback = undefined;

									// Do not keep as active anymore
									if (handle) {
										xhr.onreadystatechange = jQuery.noop;
										if (xhrOnUnloadAbort) {
											delete xhrCallbacks[handle];
										}
									}

									// If it's an abort
									if (isAbort) {
										// Abort it manually if needed
										if (xhr.readyState !== 4) {
											xhr.abort();
										}
									} else {
										status = xhr.status;
										responseHeaders = xhr.getAllResponseHeaders();
										responses = {};
										xml = xhr.responseXML;

										// Construct response list
										if (xml && xml.documentElement /* #4958 */ ) {
											responses.xml = xml;
										}
										responses.text = xhr.responseText;

										// Firefox throws an exception when accessing
										// statusText for faulty cross-domain requests
										try {
											statusText = xhr.statusText;
										} catch (e) {
											// We normalize with Webkit giving an empty statusText
											statusText = "";
										}

										// Filter status for non standard behaviors

										// If the request is local and we have data: assume a success
										// (success with no data won't get notified, that's the best we
										// can do given current implementations)
										if (!status && s.isLocal && !s.crossDomain) {
											status = responses.text ? 200 : 404;
											// IE - #1450: sometimes returns 1223 when it should be 204
										} else if (status === 1223) {
											status = 204;
										}
									}
								}
							} catch (firefoxAccessException) {
								if (!isAbort) {
									complete(-1, firefoxAccessException);
								}
							}

							// Call complete if needed
							if (responses) {
								complete(status, statusText, responses, responseHeaders);
							}
						};

						// if we're in sync mode or it's in cache
						// and has been retrieved directly (IE6 & IE7)
						// we need to manually fire the callback
						if (!s.async || xhr.readyState === 4) {
							callback();
						} else {
							handle = ++xhrId;
							if (xhrOnUnloadAbort) {
								// Create the active xhrs callbacks list if needed
								// and attach the unload handler
								if (!xhrCallbacks) {
									xhrCallbacks = {};
									jQuery(window).unload(xhrOnUnloadAbort);
								}
								// Add to list of active xhrs callbacks
								xhrCallbacks[handle] = callback;
							}
							xhr.onreadystatechange = callback;
						}
					},

					abort: function () {
						if (callback) {
							callback(0, 1);
						}
					}
				};
			}
		});
	}




	var elemdisplay = {},
		iframe, iframeDoc,
		rfxtypes = /^(?:toggle|show|hide)$/,
		rfxnum = /^([+\-]=)?([\d+.\-]+)([a-z%]*)$/i,
		timerId,
		fxAttrs = [
			// height animations
			["height", "marginTop", "marginBottom", "paddingTop", "paddingBottom"],
			// width animations
			["width", "marginLeft", "marginRight", "paddingLeft", "paddingRight"],
			// opacity animations
			["opacity"]
		],
		fxNow;

	jQuery.fn.extend({
		show: function (speed, easing, callback) {
			var elem, display;

			if (speed || speed === 0) {
				return this.animate(genFx("show", 3), speed, easing, callback);

			} else {
				for (var i = 0, j = this.length; i < j; i++) {
					elem = this[i];

					if (elem.style) {
						display = elem.style.display;

						// Reset the inline display of this element to learn if it is
						// being hidden by cascaded rules or not
						if (!jQuery._data(elem, "olddisplay") && display === "none") {
							display = elem.style.display = "";
						}

						// Set elements which have been overridden with display: none
						// in a stylesheet to whatever the default browser style is
						// for such an element
						if (display === "" && jQuery.css(elem, "display") === "none") {
							jQuery._data(elem, "olddisplay", defaultDisplay(elem.nodeName));
						}
					}
				}

				// Set the display of most of the elements in a second loop
				// to avoid the constant reflow
				for (i = 0; i < j; i++) {
					elem = this[i];

					if (elem.style) {
						display = elem.style.display;

						if (display === "" || display === "none") {
							elem.style.display = jQuery._data(elem, "olddisplay") || "";
						}
					}
				}

				return this;
			}
		},

		hide: function (speed, easing, callback) {
			if (speed || speed === 0) {
				return this.animate(genFx("hide", 3), speed, easing, callback);

			} else {
				var elem, display,
					i = 0,
					j = this.length;

				for (; i < j; i++) {
					elem = this[i];
					if (elem.style) {
						display = jQuery.css(elem, "display");

						if (display !== "none" && !jQuery._data(elem, "olddisplay")) {
							jQuery._data(elem, "olddisplay", display);
						}
					}
				}

				// Set the display of the elements in a second loop
				// to avoid the constant reflow
				for (i = 0; i < j; i++) {
					if (this[i].style) {
						this[i].style.display = "none";
					}
				}

				return this;
			}
		},

		// Save the old toggle function
		_toggle: jQuery.fn.toggle,

		toggle: function (fn, fn2, callback) {
			var bool = typeof fn === "boolean";

			if (jQuery.isFunction(fn) && jQuery.isFunction(fn2)) {
				this._toggle.apply(this, arguments);

			} else if (fn == null || bool) {
				this.each(function () {
					var state = bool ? fn : jQuery(this).is(":hidden");
					jQuery(this)[state ? "show" : "hide"]();
				});

			} else {
				this.animate(genFx("toggle", 3), fn, fn2, callback);
			}

			return this;
		},

		fadeTo: function (speed, to, easing, callback) {
			return this.filter(":hidden").css("opacity", 0).show().end()
				.animate({
					opacity: to
				}, speed, easing, callback);
		},

		animate: function (prop, speed, easing, callback) {
			var optall = jQuery.speed(speed, easing, callback);

			if (jQuery.isEmptyObject(prop)) {
				return this.each(optall.complete, [false]);
			}

			// Do not change referenced properties as per-property easing will be lost
			prop = jQuery.extend({}, prop);

			function doAnimation() {
				// XXX 'this' does not always have a nodeName when running the
				// test suite

				if (optall.queue === false) {
					jQuery._mark(this);
				}

				var opt = jQuery.extend({}, optall),
					isElement = this.nodeType === 1,
					hidden = isElement && jQuery(this).is(":hidden"),
					name, val, p, e,
					parts, start, end, unit,
					method;

				// will store per property easing and be used to determine when an animation is complete
				opt.animatedProperties = {};

				for (p in prop) {

					// property name normalization
					name = jQuery.camelCase(p);
					if (p !== name) {
						prop[name] = prop[p];
						delete prop[p];
					}

					val = prop[name];

					// easing resolution: per property > opt.specialEasing > opt.easing > 'swing' (default)
					if (jQuery.isArray(val)) {
						opt.animatedProperties[name] = val[1];
						val = prop[name] = val[0];
					} else {
						opt.animatedProperties[name] = opt.specialEasing && opt.specialEasing[name] || opt.easing || 'swing';
					}

					if (val === "hide" && hidden || val === "show" && !hidden) {
						return opt.complete.call(this);
					}

					if (isElement && (name === "height" || name === "width")) {
						// Make sure that nothing sneaks out
						// Record all 3 overflow attributes because IE does not
						// change the overflow attribute when overflowX and
						// overflowY are set to the same value
						opt.overflow = [this.style.overflow, this.style.overflowX, this.style.overflowY];

						// Set display property to inline-block for height/width
						// animations on inline elements that are having width/height animated
						if (jQuery.css(this, "display") === "inline" &&
							jQuery.css(this, "float") === "none") {

							// inline-level elements accept inline-block;
							// block-level elements need to be inline with layout
							if (!jQuery.support.inlineBlockNeedsLayout || defaultDisplay(this.nodeName) === "inline") {
								this.style.display = "inline-block";

							} else {
								this.style.zoom = 1;
							}
						}
					}
				}

				if (opt.overflow != null) {
					this.style.overflow = "hidden";
				}

				for (p in prop) {
					e = new jQuery.fx(this, opt, p);
					val = prop[p];

					if (rfxtypes.test(val)) {

						// Tracks whether to show or hide based on private
						// data attached to the element
						method = jQuery._data(this, "toggle" + p) || (val === "toggle" ? hidden ? "show" : "hide" : 0);
						if (method) {
							jQuery._data(this, "toggle" + p, method === "show" ? "hide" : "show");
							e[method]();
						} else {
							e[val]();
						}

					} else {
						parts = rfxnum.exec(val);
						start = e.cur();

						if (parts) {
							end = parseFloat(parts[2]);
							unit = parts[3] || (jQuery.cssNumber[p] ? "" : "px");

							// We need to compute starting value
							if (unit !== "px") {
								jQuery.style(this, p, (end || 1) + unit);
								start = ((end || 1) / e.cur()) * start;
								jQuery.style(this, p, start + unit);
							}

							// If a +=/-= token was provided, we're doing a relative animation
							if (parts[1]) {
								end = ((parts[1] === "-=" ? -1 : 1) * end) + start;
							}

							e.custom(start, end, unit);

						} else {
							e.custom(start, val, "");
						}
					}
				}

				// For JS strict compliance
				return true;
			}

			return optall.queue === false ?
				this.each(doAnimation) :
				this.queue(optall.queue, doAnimation);
		},

		stop: function (type, clearQueue, gotoEnd) {
			if (typeof type !== "string") {
				gotoEnd = clearQueue;
				clearQueue = type;
				type = undefined;
			}
			if (clearQueue && type !== false) {
				this.queue(type || "fx", []);
			}

			return this.each(function () {
				var index,
					hadTimers = false,
					timers = jQuery.timers,
					data = jQuery._data(this);

				// clear marker counters if we know they won't be
				if (!gotoEnd) {
					jQuery._unmark(true, this);
				}

				function stopQueue(elem, data, index) {
					var hooks = data[index];
					jQuery.removeData(elem, index, true);
					hooks.stop(gotoEnd);
				}

				if (type == null) {
					for (index in data) {
						if (data[index] && data[index].stop && index.indexOf(".run") === index.length - 4) {
							stopQueue(this, data, index);
						}
					}
				} else if (data[index = type + ".run"] && data[index].stop) {
					stopQueue(this, data, index);
				}

				for (index = timers.length; index--;) {
					if (timers[index].elem === this && (type == null || timers[index].queue === type)) {
						if (gotoEnd) {

							// force the next step to be the last
							timers[index](true);
						} else {
							timers[index].saveState();
						}
						hadTimers = true;
						timers.splice(index, 1);
					}
				}

				// start the next in the queue if the last step wasn't forced
				// timers currently will call their complete callbacks, which will dequeue
				// but only if they were gotoEnd
				if (!(gotoEnd && hadTimers)) {
					jQuery.dequeue(this, type);
				}
			});
		}

	});

	// Animations created synchronously will run synchronously
	function createFxNow() {
		setTimeout(clearFxNow, 0);
		return (fxNow = jQuery.now());
	}

	function clearFxNow() {
		fxNow = undefined;
	}

	// Generate parameters to create a standard animation
	function genFx(type, num) {
		var obj = {};

		jQuery.each(fxAttrs.concat.apply([], fxAttrs.slice(0, num)), function () {
			obj[this] = type;
		});

		return obj;
	}

	// Generate shortcuts for custom animations
	jQuery.each({
		slideDown: genFx("show", 1),
		slideUp: genFx("hide", 1),
		slideToggle: genFx("toggle", 1),
		fadeIn: {
			opacity: "show"
		},
		fadeOut: {
			opacity: "hide"
		},
		fadeToggle: {
			opacity: "toggle"
		}
	}, function (name, props) {
		jQuery.fn[name] = function (speed, easing, callback) {
			return this.animate(props, speed, easing, callback);
		};
	});

	jQuery.extend({
		speed: function (speed, easing, fn) {
			var opt = speed && typeof speed === "object" ? jQuery.extend({}, speed) : {
				complete: fn || !fn && easing ||
					jQuery.isFunction(speed) && speed,
				duration: speed,
				easing: fn && easing || easing && !jQuery.isFunction(easing) && easing
			};

			opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ? opt.duration :
				opt.duration in jQuery.fx.speeds ? jQuery.fx.speeds[opt.duration] : jQuery.fx.speeds._default;

			// normalize opt.queue - true/undefined/null -> "fx"
			if (opt.queue == null || opt.queue === true) {
				opt.queue = "fx";
			}

			// Queueing
			opt.old = opt.complete;

			opt.complete = function (noUnmark) {
				if (jQuery.isFunction(opt.old)) {
					opt.old.call(this);
				}

				if (opt.queue) {
					jQuery.dequeue(this, opt.queue);
				} else if (noUnmark !== false) {
					jQuery._unmark(this);
				}
			};

			return opt;
		},

		easing: {
			linear: function (p, n, firstNum, diff) {
				return firstNum + diff * p;
			},
			swing: function (p, n, firstNum, diff) {
				return ((-Math.cos(p * Math.PI) / 2) + 0.5) * diff + firstNum;
			}
		},

		timers: [],

		fx: function (elem, options, prop) {
			this.options = options;
			this.elem = elem;
			this.prop = prop;

			options.orig = options.orig || {};
		}

	});

	jQuery.fx.prototype = {
		// Simple function for setting a style value
		update: function () {
			if (this.options.step) {
				this.options.step.call(this.elem, this.now, this);
			}

			(jQuery.fx.step[this.prop] || jQuery.fx.step._default)(this);
		},

		// Get the current size
		cur: function () {
			if (this.elem[this.prop] != null && (!this.elem.style || this.elem.style[this.prop] == null)) {
				return this.elem[this.prop];
			}

			var parsed,
				r = jQuery.css(this.elem, this.prop);
			// Empty strings, null, undefined and "auto" are converted to 0,
			// complex values such as "rotate(1rad)" are returned as is,
			// simple values such as "10px" are parsed to Float.
			return isNaN(parsed = parseFloat(r)) ? !r || r === "auto" ? 0 : r : parsed;
		},

		// Start an animation from one number to another
		custom: function (from, to, unit) {
			var self = this,
				fx = jQuery.fx;

			this.startTime = fxNow || createFxNow();
			this.end = to;
			this.now = this.start = from;
			this.pos = this.state = 0;
			this.unit = unit || this.unit || (jQuery.cssNumber[this.prop] ? "" : "px");

			function t(gotoEnd) {
				return self.step(gotoEnd);
			}

			t.queue = this.options.queue;
			t.elem = this.elem;
			t.saveState = function () {
				if (self.options.hide && jQuery._data(self.elem, "fxshow" + self.prop) === undefined) {
					jQuery._data(self.elem, "fxshow" + self.prop, self.start);
				}
			};

			if (t() && jQuery.timers.push(t) && !timerId) {
				timerId = setInterval(fx.tick, fx.interval);
			}
		},

		// Simple 'show' function
		show: function () {
			var dataShow = jQuery._data(this.elem, "fxshow" + this.prop);

			// Remember where we started, so that we can go back to it later
			this.options.orig[this.prop] = dataShow || jQuery.style(this.elem, this.prop);
			this.options.show = true;

			// Begin the animation
			// Make sure that we start at a small width/height to avoid any flash of content
			if (dataShow !== undefined) {
				// This show is picking up where a previous hide or show left off
				this.custom(this.cur(), dataShow);
			} else {
				this.custom(this.prop === "width" || this.prop === "height" ? 1 : 0, this.cur());
			}

			// Start by showing the element
			jQuery(this.elem).show();
		},

		// Simple 'hide' function
		hide: function () {
			// Remember where we started, so that we can go back to it later
			this.options.orig[this.prop] = jQuery._data(this.elem, "fxshow" + this.prop) || jQuery.style(this.elem, this.prop);
			this.options.hide = true;

			// Begin the animation
			this.custom(this.cur(), 0);
		},

		// Each step of an animation
		step: function (gotoEnd) {
			var p, n, complete,
				t = fxNow || createFxNow(),
				done = true,
				elem = this.elem,
				options = this.options;

			if (gotoEnd || t >= options.duration + this.startTime) {
				this.now = this.end;
				this.pos = this.state = 1;
				this.update();

				options.animatedProperties[this.prop] = true;

				for (p in options.animatedProperties) {
					if (options.animatedProperties[p] !== true) {
						done = false;
					}
				}

				if (done) {
					// Reset the overflow
					if (options.overflow != null && !jQuery.support.shrinkWrapBlocks) {

						jQuery.each(["", "X", "Y"], function (index, value) {
							elem.style["overflow" + value] = options.overflow[index];
						});
					}

					// Hide the element if the "hide" operation was done
					if (options.hide) {
						jQuery(elem).hide();
					}

					// Reset the properties, if the item has been hidden or shown
					if (options.hide || options.show) {
						for (p in options.animatedProperties) {
							jQuery.style(elem, p, options.orig[p]);
							jQuery.removeData(elem, "fxshow" + p, true);
							// Toggle data is no longer needed
							jQuery.removeData(elem, "toggle" + p, true);
						}
					}

					// Execute the complete function
					// in the event that the complete function throws an exception
					// we must ensure it won't be called twice. #5684

					complete = options.complete;
					if (complete) {

						options.complete = false;
						complete.call(elem);
					}
				}

				return false;

			} else {
				// classical easing cannot be used with an Infinity duration
				if (options.duration == Infinity) {
					this.now = t;
				} else {
					n = t - this.startTime;
					this.state = n / options.duration;

					// Perform the easing function, defaults to swing
					this.pos = jQuery.easing[options.animatedProperties[this.prop]](this.state, n, 0, 1, options.duration);
					this.now = this.start + ((this.end - this.start) * this.pos);
				}
				// Perform the next step of the animation
				this.update();
			}

			return true;
		}
	};

	jQuery.extend(jQuery.fx, {
		tick: function () {
			var timer,
				timers = jQuery.timers,
				i = 0;

			for (; i < timers.length; i++) {
				timer = timers[i];
				// Checks the timer has not already been removed
				if (!timer() && timers[i] === timer) {
					timers.splice(i--, 1);
				}
			}

			if (!timers.length) {
				jQuery.fx.stop();
			}
		},

		interval: 13,

		stop: function () {
			clearInterval(timerId);
			timerId = null;
		},

		speeds: {
			slow: 600,
			fast: 200,
			// Default speed
			_default: 400
		},

		step: {
			opacity: function (fx) {
				jQuery.style(fx.elem, "opacity", fx.now);
			},

			_default: function (fx) {
				if (fx.elem.style && fx.elem.style[fx.prop] != null) {
					fx.elem.style[fx.prop] = fx.now + fx.unit;
				} else {
					fx.elem[fx.prop] = fx.now;
				}
			}
		}
	});

	// Adds width/height step functions
	// Do not set anything below 0
	jQuery.each(["width", "height"], function (i, prop) {
		jQuery.fx.step[prop] = function (fx) {
			jQuery.style(fx.elem, prop, Math.max(0, fx.now) + fx.unit);
		};
	});

	if (jQuery.expr && jQuery.expr.filters) {
		jQuery.expr.filters.animated = function (elem) {
			return jQuery.grep(jQuery.timers, function (fn) {
				return elem === fn.elem;
			}).length;
		};
	}

	// Try to restore the default display value of an element
	function defaultDisplay(nodeName) {

		if (!elemdisplay[nodeName]) {

			var body = document.body,
				elem = jQuery("<" + nodeName + ">").appendTo(body),
				display = elem.css("display");
			elem.remove();

			// If the simple way fails,
			// get element's real default display by attaching it to a temp iframe
			if (display === "none" || display === "") {
				// No iframe to use yet, so create it
				if (!iframe) {
					iframe = document.createElement("iframe");
					iframe.frameBorder = iframe.width = iframe.height = 0;
				}

				body.appendChild(iframe);

				// Create a cacheable copy of the iframe document on first call.
				// IE and Opera will allow us to reuse the iframeDoc without re-writing the fake HTML
				// document to it; WebKit & Firefox won't allow reusing the iframe document.
				if (!iframeDoc || !iframe.createElement) {
					iframeDoc = (iframe.contentWindow || iframe.contentDocument).document;
					iframeDoc.write((document.compatMode === "CSS1Compat" ? "<!doctype html>" : "") + "<html><body>");
					iframeDoc.close();
				}

				elem = iframeDoc.createElement(nodeName);

				iframeDoc.body.appendChild(elem);

				display = jQuery.css(elem, "display");
				body.removeChild(iframe);
			}

			// Store the correct default display
			elemdisplay[nodeName] = display;
		}

		return elemdisplay[nodeName];
	}




	var rtable = /^t(?:able|d|h)$/i,
		rroot = /^(?:body|html)$/i;

	//  对getBoundingClientRect方法的兼容性支持
	if ("getBoundingClientRect" in document.documentElement) {
		jQuery.fn.offset = function (options) {
			var elem = this[0],
				box;

			if (options) {
				return this.each(function (i) {
					jQuery.offset.setOffset(this, options, i);
				});
			}

			if (!elem || !elem.ownerDocument) {
				return null;
			}

			if (elem === elem.ownerDocument.body) {
				return jQuery.offset.bodyOffset(elem);
			}

			try {
				box = elem.getBoundingClientRect();
			} catch (e) {}

			var doc = elem.ownerDocument,
				docElem = doc.documentElement;

			// Make sure we're not dealing with a disconnected DOM node
			if (!box || !jQuery.contains(docElem, elem)) {
				return box ? {
					top: box.top,
					left: box.left
				} : {
					top: 0,
					left: 0
				};
			}

			var body = doc.body,
				win = getWindow(doc),
				clientTop = docElem.clientTop || body.clientTop || 0,
				clientLeft = docElem.clientLeft || body.clientLeft || 0,
				scrollTop = win.pageYOffset || jQuery.support.boxModel && docElem.scrollTop || body.scrollTop,
				scrollLeft = win.pageXOffset || jQuery.support.boxModel && docElem.scrollLeft || body.scrollLeft,
				// 距文档上坐标=距窗口上坐标+垂直滚动偏移-文档上边框厚度
				// 距文档左坐标=距窗口左坐标+水平滚动偏移-文档左边框厚度
				top = box.top + scrollTop - clientTop,
				left = box.left + scrollLeft - clientLeft;

			return {
				top: top,
				left: left
			};
		};

	} else {
		jQuery.fn.offset = function (options) {
			var elem = this[0];

			// 传入options，则设置offset
			if (options) {
				return this.each(function (i) {
					jQuery.offset.setOffset(this, options, i);
				});
			}

			// 忽略不在文档中的元素
			if (!elem || !elem.ownerDocument) {
				return null;
			}

			if (elem === elem.ownerDocument.body) {
				return jQuery.offset.bodyOffset(elem);
			}

			var computedStyle,
				offsetParent = elem.offsetParent,
				prevOffsetParent = elem,
				doc = elem.ownerDocument,
				docElem = doc.documentElement,
				body = doc.body,
				defaultView = doc.defaultView,
				prevComputedStyle = defaultView ? defaultView.getComputedStyle(elem, null) : elem.currentStyle,
				top = elem.offsetTop,
				left = elem.offsetLeft;

			while ((elem = elem.parentNode) && elem !== body && elem !== docElem) {
				if (jQuery.support.fixedPosition && prevComputedStyle.position === "fixed") {
					break;
				}

				computedStyle = defaultView ? defaultView.getComputedStyle(elem, null) : elem.currentStyle;
				top -= elem.scrollTop;
				left -= elem.scrollLeft;

				if (elem === offsetParent) {
					top += elem.offsetTop;
					left += elem.offsetLeft;

					if (jQuery.support.doesNotAddBorder && !(jQuery.support.doesAddBorderForTableAndCells && rtable.test(elem.nodeName))) {
						top += parseFloat(computedStyle.borderTopWidth) || 0;
						left += parseFloat(computedStyle.borderLeftWidth) || 0;
					}

					prevOffsetParent = offsetParent;
					offsetParent = elem.offsetParent;
				}

				if (jQuery.support.subtractsBorderForOverflowNotVisible && computedStyle.overflow !== "visible") {
					top += parseFloat(computedStyle.borderTopWidth) || 0;
					left += parseFloat(computedStyle.borderLeftWidth) || 0;
				}

				prevComputedStyle = computedStyle;
			}

			if (prevComputedStyle.position === "relative" || prevComputedStyle.position === "static") {
				top += body.offsetTop;
				left += body.offsetLeft;
			}

			if (jQuery.support.fixedPosition && prevComputedStyle.position === "fixed") {
				top += Math.max(docElem.scrollTop, body.scrollTop);
				left += Math.max(docElem.scrollLeft, body.scrollLeft);
			}

			return {
				top: top,
				left: left
			};
		};
	}

	jQuery.offset = {

		bodyOffset: function (body) {
			var top = body.offsetTop,
				left = body.offsetLeft;

			if (jQuery.support.doesNotIncludeMarginInBodyOffset) {
				top += parseFloat(jQuery.css(body, "marginTop")) || 0;
				left += parseFloat(jQuery.css(body, "marginLeft")) || 0;
			}

			return {
				top: top,
				left: left
			};
		},

		setOffset: function (elem, options, i) {
			var position = jQuery.css(elem, "position");

			// set position first, in-case top/left are set even on static elem
			if (position === "static") {
				elem.style.position = "relative";
			}

			var curElem = jQuery(elem),
				curOffset = curElem.offset(),
				curCSSTop = jQuery.css(elem, "top"),
				curCSSLeft = jQuery.css(elem, "left"),
				calculatePosition = (position === "absolute" || position === "fixed") && jQuery.inArray("auto", [curCSSTop, curCSSLeft]) > -1,
				props = {},
				curPosition = {},
				curTop, curLeft;

			// need to be able to calculate position if either top or left is auto and position is either absolute or fixed
			if (calculatePosition) {
				curPosition = curElem.position();
				curTop = curPosition.top;
				curLeft = curPosition.left;
			} else {
				curTop = parseFloat(curCSSTop) || 0;
				curLeft = parseFloat(curCSSLeft) || 0;
			}

			if (jQuery.isFunction(options)) {
				options = options.call(elem, i, curOffset);
			}

			if (options.top != null) {
				props.top = (options.top - curOffset.top) + curTop;
			}
			if (options.left != null) {
				props.left = (options.left - curOffset.left) + curLeft;
			}

			if ("using" in options) {
				options.using.call(elem, props);
			} else {
				curElem.css(props);
			}
		}
	};


	jQuery.fn.extend({

		position: function () {
			if (!this[0]) {
				return null;
			}

			var elem = this[0],

				// Get *real* offsetParent
				offsetParent = this.offsetParent(),

				// Get correct offsets
				offset = this.offset(),
				parentOffset = rroot.test(offsetParent[0].nodeName) ? {
					top: 0,
					left: 0
				} : offsetParent.offset();

			// Subtract element margins
			// note: when an element has margin: auto the offsetLeft and marginLeft
			// are the same in Safari causing offset.left to incorrectly be 0
			offset.top -= parseFloat(jQuery.css(elem, "marginTop")) || 0;
			offset.left -= parseFloat(jQuery.css(elem, "marginLeft")) || 0;

			// Add offsetParent borders
			parentOffset.top += parseFloat(jQuery.css(offsetParent[0], "borderTopWidth")) || 0;
			parentOffset.left += parseFloat(jQuery.css(offsetParent[0], "borderLeftWidth")) || 0;

			// Subtract the two offsets
			return {
				top: offset.top - parentOffset.top,
				left: offset.left - parentOffset.left
			};
		},

		// 用于获取最近的定位祖先元素，定位元素是指样式position为relative、absolute、fixed的元素
		offsetParent: function () {
			// 通过map方法遍历匹配元素集合
			return this.map(function () {
				var offsetParent = this.offsetParent || document.body;
				while (offsetParent && (!rroot.test(offsetParent.nodeName) && jQuery.css(offsetParent, "position") === "static")) {
					offsetParent = offsetParent.offsetParent;
				}
				return offsetParent;
			});
		}
	});


	// Create scrollLeft and scrollTop methods
	jQuery.each(["Left", "Top"], function (i, name) {
		var method = "scroll" + name;

		jQuery.fn[method] = function (val) {
			var elem, win;

			// 如果没有传参数$.scrollLeft()调用，则返回响应的值
			if (val === undefined) {
				elem = this[0];

				if (!elem) {
					return null;
				}

				win = getWindow(elem);

				// Return the scroll offset
				return win ? ("pageXOffset" in win) ? win[i ? "pageYOffset" : "pageXOffset"] :
					jQuery.support.boxModel && win.document.documentElement[method] ||
					win.document.body[method] :
					elem[method];
			}

			// 传入参数$.scrollLeft(100), 则调用方法进行移动
			// Set the scroll offset
			return this.each(function () {
				win = getWindow(this);

				if (win) {
					win.scrollTo(
						!i ? val : jQuery(win).scrollLeft(),
						i ? val : jQuery(win).scrollTop()
					);

				} else {
					this[method] = val;
				}
			});
		};
	});

	function getWindow(elem) {
		return jQuery.isWindow(elem) ?
			elem :
			elem.nodeType === 9 ?
			elem.defaultView || elem.parentWindow :
			false;
	}




	// Create width, height, innerHeight, innerWidth, outerHeight and outerWidth methods
	jQuery.each(["Height", "Width"], function (i, name) {

		var type = name.toLowerCase();

		// innerHeight and innerWidth
		jQuery.fn["inner" + name] = function () {
			var elem = this[0];
			return elem ?
				elem.style ?
				parseFloat(jQuery.css(elem, type, "padding")) :
				this[type]() :
				null;
		};

		// outerHeight and outerWidth
		jQuery.fn["outer" + name] = function (margin) {
			var elem = this[0];
			return elem ?
				elem.style ?
				parseFloat(jQuery.css(elem, type, margin ? "margin" : "border")) :
				this[type]() :
				null;
		};

		jQuery.fn[type] = function (size) {
			// Get window width or height
			var elem = this[0];
			if (!elem) {
				return size == null ? null : this;
			}

			if (jQuery.isFunction(size)) {
				return this.each(function (i) {
					var self = jQuery(this);
					self[type](size.call(this, i, self[type]()));
				});
			}

			if (jQuery.isWindow(elem)) {
				// Everyone else use document.documentElement or document.body depending on Quirks vs Standards mode
				// 3rd condition allows Nokia support, as it supports the docElem prop but not CSS1Compat
				var docElemProp = elem.document.documentElement["client" + name],
					body = elem.document.body;
				return elem.document.compatMode === "CSS1Compat" && docElemProp ||
					body && body["client" + name] || docElemProp;

				// Get document width or height
			} else if (elem.nodeType === 9) {
				// Either scroll[Width/Height] or offset[Width/Height], whichever is greater
				return Math.max(
					elem.documentElement["client" + name],
					elem.body["scroll" + name], elem.documentElement["scroll" + name],
					elem.body["offset" + name], elem.documentElement["offset" + name]
				);

				// Get or set width or height on the element
			} else if (size === undefined) {
				var orig = jQuery.css(elem, type),
					ret = parseFloat(orig);

				return jQuery.isNumeric(ret) ? ret : orig;

				// Set the width or height on the element (default to pixels if value is unitless)
			} else {
				return this.css(type, typeof size === "string" ? size : size + "px");
			}
		};

	});




	// Expose jQuery to the global object
	// 把jQuery对象赋值给window属性
	window.jQuery = window.$ = jQuery;

	// Expose jQuery as an AMD module, but only for AMD loaders that
	// understand the issues with loading multiple versions of jQuery
	// in a page that all might call define(). The loader will indicate
	// they have special allowances for multiple jQuery versions by
	// specifying define.amd.jQuery = true. Register as a named module,
	// since jQuery can be concatenated with other files that may use define,
	// but not use a proper concatenation script that understands anonymous
	// AMD modules. A named AMD is safest and most robust way to register.
	// Lowercase jquery is used because AMD module names are derived from
	// file names, and jQuery is normally delivered in a lowercase file name.
	// Do this after creating the global so that if an AMD module wants to call
	// noConflict to hide this version of jQuery, it will work.
	if (typeof define === "function" && define.amd && define.amd.jQuery) {
		define("jquery", [], function () {
			return jQuery;
		});
	}



})(window);