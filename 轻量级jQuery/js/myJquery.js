(function(window, undefined) {
    var rootjQuery,
        core_version = '2.0.3',
        idExpr = /^#([\w\-]*)$/,
        //下面两个正则用于转驼峰
        rmsPrefix = /^-ms-/,
        rdashAlpha = /-([\da-z])/gi,
        rnotwhite = /\S+/g, //匹配非空白字符
        rclass = /[\t\r\n\f]/g, //匹配除了空格之外的其他空白字符
        rreturn = /\r/g,
        class2type = {},
        core_deletedIds = [],
        core_version = '2.0.3',

        _jQuery = window.jQuery,
        _$ = window.$,

        core_toString = class2type.toString,
        core_hasOwn = class2type.hasOwnProperty,
        core_trim = core_version.trim,
        core_indexOf = core_deletedIds.indexOf,
        core_push = core_deletedIds.push,
        core_concat = core_deletedIds.concat,
        core_slice = core_deletedIds.slice,
        core_strundefined = typeof undefined,

        readyList, //页面加载的ready时间中的异步队列

        //用于jQuery.camelCase转驼峰函数中
        //当replace函数只有一个匹配项时，第二个参数可以是一个函数
        //如果repalce中的正则没有捕获组，会向这个函数传递三个参数：模式的匹配项，模式匹配项在字符串中的位置，原始字符串
        //如果replace中的正则有捕获组，也会向这个函数传递三个参数，模式的匹配项，捕获组的匹配项，模式匹配项在字符串中的位置
        fcamelCase = function(all, letter) {
            return letter.toUpperCase();
        },
        jQuery = function(selector, context) {
            return new jQuery.fn.init(selector, context, rootjQuery);
        },
        //这个方法实际上就是DOMContentLoaded事件的监听函数
        compeleted = function() {
            document.removeEventListener('DOMContentListener', compeleted, false);
            jQuery.ready();
        };

    //jQuery相关实例方法和属性
    jQuery.fn = jQuery.prototype = {
        jQuery: core_version, //其实就是版本字符串2.0.3
        constructor: jQuery, //还原constructor指向
        selector: '', //含有连续的整型属性、length属性、context属性，selector属性（在jQuery.fn.init中设置），preObject属性（在pushStack中设置)
        length: 0,
        init: function(selector, context, rootjQuery) {
            var match, elem;
            //selector是选择器表达式
            if (!selector) {
                return this;
            }

            if (typeof selector === 'string') {
                match = idExpr.exec(selector);
                context = context || document;
                if (match) {
                    elem = context.getElementById(match[1]);
                    if (elem && elem.parentNode) {
                        this[0] = elem;
                        this.length = 1;
                    }
                    this.selector = selector;
                    this.context = document;
                    return this;
                } else {
                    //说明是复杂的选择器表达式，这里只考虑javascript原声方法
                    //querySelectorAll返回所有匹配元素的nodelist
                    //querySelector返回匹配的第一个元素
                    return jQuery.merge(this, context.querySelectorAll(selector));

                }
            }
            //处理selector是DOM元素的情形
            if (selector && selector.nodeType) {
                this[0] = selector;
                this.length = 1;
                this.context = selector;
                return this;
            }
            //处理selector是函数的情形
            if (jQuery.isFunction(selector)) {
                jQuery.ready.promise().done(selector);
                return this;
            }
            //处理selector是jQuery对象的情形
            if (selector.selector) {
                this.selector = selector.selector;
                this.context = selector.context;
            }
            //处理其他情形
            return jQuery.makeArray(selector, this);

        },
        //将jQuery类数组对象转换为数组
        toArray: function() {
            return core_slice.call(this);
        },
        //如果传递了参数num,代表获取下标num的DOM元素（num可以为负数）
        //如果没有传递num，则将jQuery对象转换为数组后整体返回
        get: function(num) {
            if (num == null) { //注意这里不能用!num,因为num可以为0
                return this.toArray();
            }
            return num < 0 ? this[num + this.length] : this[num];
        },
        //入栈
        pushStack: function(elems) {

            var ret = jQuery.merge(this.constructor(), elems);

            ret.prevObject = this;
            ret.context = this.context;
            return ret;
        },
        //遍历jQuery对象
        each: function(callback, args) {
            //在静态方法已经指定了callback的执行上下文
            return jQuery.each(this, callback, args);
        },

        slice: function() {
            //注意apply和call的区别                          
            return this.pushStack(core_slice.apply(this, arguments));
        },
        first: function() {
            return this.get(0);
        },
        last: function() {
            return this.get(-1);
        },
        eq: function(i) {
            var length = this.length,
                j = +i + (i < 0 ? length : 0);
            f
            return this.pushStack(j >= 0 && j < length ? [this[j]] : []);
        },
        map: function(callback) {
            //这种写法不能指定callback的执行环境，因为在静态方法jQuery.map并没有指定callback的执行上下文
            // return this.pushStack(jQuery.map(this,callback));
            return this.pushStack(jQuery.map(this, function(elem, i) {
                return callback.call(elem, i, elem);
            }));
        },
        //与pushStack方法相对应，返回栈的上一级
        end: function() {
            return this.prevObject || this.constructor();
        },
        len: function() {
            return this.length;
        },
        push: core_push,
        sort: [].sort,
        splice: [].splice,
    };
    jQuery.fn.init.prototype = jQuery.fn;


    //可接受的参数类型如下：jQuery.extend([deep],target,object1,[objectN])
    jQuery.extend = jQuery.fn.extend = function() {
        var target = arguments[0] || {}, //指向目标对象
            deep = false, //是否进行深度复制
            i = 1, //表示源对象的起始下标
            length = arguments.length, //表示参数个数；
            options, name, src, copy, copyIsArray; //options指向某个源对象，name指向源对象的某个属性名，src目标对象某个属性的原始值，copy某个源对象的某个属性的值，copyIsArray指示变量copy是否为数组        
        //首先进行参数修正
        if (typeof target === 'boolean') {
            deep = target;
            target = arguments[1] || {};
            i = 2;
        }
        //此时target就是jQuery或jQuery.fn
        if (i === length) {
            target = this;
            i--;
        }
        //处理target是字符串或者其他情形，这在深度复制中可能出现
        // if(typeof target!=='object'||!jQuery.isFunction(target)){
        //     target={};
        // }
        for (i; i < length; i++) {
            options = arguments[i];
            for (name in options) {
                src = target[name];
                copy = options[name];
                if (deep && copy && (jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)))) {
                    if (copyIsArray) {
                        copyIsArray = false;
                        clone = src && jQuery.isArray(src) ? src : [];
                    } else {
                        clone = src && jQuery.isPlainObject(src) ? src : {};
                    }
                    //递归调用
                    target[name] = jQuery.extend(deep, clone, copy);
                } else {
                    target[name] = copy;
                }
            }
        }
        return target;
    };
    //检查是否是数组或者类数组
    function isArrayLike(obj) {
        var length = obj.length,
            type = jQuery.type(obj);
        if (obj && jQuery.isWindow(obj)) {
            return false;
        }
        if (obj.nodeType === 1 && length) {
            return true;
        }

        if (type === 'array') {
            return true;
        }
        //两个条件：具有length属性
        //具有数字下标
        if (typeof length === 'number' && (length == 0 || (length > 0 && (length - 1) in obj))) {
            return true;
        }
        return false;
    }

    jQuery.extend({
        //一堆静态方法和属性
        expando: 'jQuery' + (core_version + Math.random()).replace(/\D/g, ''),
        // 该函数用于释放jQuery对于全局变量$的控制权，可选的参数deep代表是否释放对全局变量jQuery的控制权
        noConflict: function(deep) {
            if (window.$ === jQuery) {
                window.$ = _$;
            }
            if (deep && window.jQuery === jQuery) {
                window.jQuery = _jQuery;
            }
            return jQuery;
        },
        /********isReady,readyWait,holdReay,ready与加载事件有关，这里仅考虑ready***********/
        ready: function() {
            readyList.resolveWith(document, [jQuery]);
        },

        /*******/


        /****下面是一系列类型检测的静态方法*******/
        isFunction: function(obj) {
            //如果使用typeof，在有些浏览器中，正则也会返回function,因此这里采用jQuery处理后的方法，jQuery.type
            return jQuery.type(obj) === 'function';
        },
        isArray: Array.isArray,
        isWindow: function(obj) {
            return obj !== null && obj === obj.window;
        },
        //判断obj是否为数字或者数字类型的字符串,并且是有效数字
        isNumeric: function(obj) {
            return !isNaN(parseFloat(obj)) && isFinite(obj);
        },
        type: function(obj) {
            if (obj === null) {
                return String(null);
            }
            //Date，Array等类型typeof都会返回object,function、正则（部分浏览器）中 typeof都会返回function

            if (typeof obj === 'object' || typeof obj === 'function') {
                return class2type[core_toString.call(obj)] || 'object';
            }
            return typeof obj;
        },
        //判断是否为以下两种情况：1，对象字面量；2，通过new Object()创建
        isPlainObject: function(obj) {
            if (jQuery.type(obj) !== 'object' || obj.nodeType || jQuery.isWindow(obj)) {
                return false;
            }

            //如果是纯粹的对象，那么obj一定有constructor属性，并且方法hasOwnPropertyOf一定就在构造函数本身的原型中，而不用通过原型链查找得到
            if (obj.constructor && !core_hasOwn.call(obj.constructor.prototype, 'isPrototypeOf')) {
                return false;
            }
            return true;

        },
        //检查是否是空对象
        isEmptyObject: function(obj) {
            for (var name in obj) {
                return false;
            }
            return true;
        },
        /******类型检测静态方法结束********/

        error: function(msg) {
            throw new Error(msg);
        },
        //将html字符串转换为html DOM结构，
        parseHTML: function(data, context, keepScripts) {

        },
        parseJSON: JSON.parse,
        parseXML: function(data) {
            var xml, tmp;
            if (!data || typeof data !== "string") {
                return null;
            }

            // Support: IE9
            try {
                tmp = new DOMParser();
                xml = tmp.parseFromString(data, "text/xml");
            } catch (e) {
                xml = undefined;
            }

            if (!xml || xml.getElementsByTagName("parsererror").length) {
                jQuery.error("Invalid XML: " + data);
            }
            return xml;
        },
        noop: function() {},
        //用于在全局作用域执行javascript代码，这里暂略
        globalEval: function(data) {},
        //转换连字符字符串为驼峰类型
        camelCase: function(string) {
            return string.replace(rmsPrefix, 'ms-').replace(rdashAlpha, fcamelCase);
        },
        //判断elem的nodeName是否=name
        nodeName: function(elem, name) {
            return elem.nodeName && elem.nodeName.toLowerCase() == name.toLowerCase();
        },
        //jQuery遍历方法，其中args是传递给回调callback的参数，仅供jQuery内部使用；外部调用该方法时，回调的参数默认为数组下标/对象key，对应数组值/对象value
        each: function(object, callback, args) {
            var i,
                value,
                length = object.length,
                isArray = isArrayLike(object);

            if (args) { //说明是内部调用
                if (isArray) {
                    for (i = 0; i < length; i++) {
                        value = callback.call(object[i], args);
                        if (value === false) {
                            break;
                        }
                    }
                } else {
                    for (i in object) {
                        value = callback.call(object[i], args);
                        if (value === false) {
                            break;
                        }
                    }
                }
            } else {
                if (isArray) {
                    for (i = 0; i < length; i++) {
                        value = callback.call(object[i], i, object[i]);
                        if (value === false) {
                            break;
                        }
                    }
                } else {
                    for (i in object) {
                        value = callback.call(object[i], i, object[i]);
                        if (value === false) {
                            break;
                        }
                    }
                }
            }
            return object;
        },
        trim: function(str) {
            return str == null ? '' : core_trim.call(str);
        },
        //将一个类数组对象转换为真正的对象
        //results参数仅供jquery内部使用，此时在该参数的基础上添加元素
        makeArray: function(array, results) {
            var ret = results || [],
                type = jQuery.type(array);
            //undefined,null都会==null
            if (array != null) {
                //1，没有length属性，或者具有length属性，但是是以下几种情况的
                //2.如果array是string 的length表示字符串的长度
                //3.如果array是函数，其length代表函数生命时的参数个数
                //4，如果array是window对象，属性Length返回窗口中的框架(frame,iframe)个数
                if (array.length == null || type == 'string' || type == 'function' || type == 'regexp' || jQuery.isWindow(array)) {
                    core_push.call(ret, array);
                } else { //否则说明是类数组对象
                    jQuery.merge(ret, array);
                }
            }
            return ret;
        },

        inArray: function(elem, array, i) {
            return array == null ? -1 : core_indexOf.call(array, elem, i);
        },
        //用于合并两个数组的元素到第一个数组中
        //事实上，jquery源代码中第一个参数可以是数组或者类数组对象，第二个参数可以是数组、类数组对象或任何含有连续整型属性的对象
        //第一个参数是数组，最后返回数组；第一个参数是类数组，则返回类数组
        merge: function(first, second) {
            var l = second.length,
                i = first.length,
                j;
            if (typeof l == 'number') {
                for (j = 0; j < l; j++) {
                    first[i++] = second[j];
                }
            } else {
                while (second[j] != undefined) {
                    first[i++] = second[j++];
                }
            }

            first.length = i;
            return first;
        },
        //用于查找数组中满足过滤函数的元素，形成新的数组之后返回，原数组不受影响
        //如果inv未传入或者是false,元素只有在过滤函数返回true时，才会被保存在最终的结果数组中
        //如果参数inv是true，则恰好相反
        grep: function(elems, callback, inv) {
            var i,
                ret = [],
                length = elems.length,
                retVal;
            inv = !!inv;
            for (i = 0; i < length; i++) {
                retVal = !!callback.call(elems[i], i);
                if (retVal !== inv) {
                    ret.push(elems[i]);
                }
            }
            return ret;
        },
        //用于对数组中每个元素执行callback操作，并将结果形成新的数组返回
        //参数arg仅仅是jQuery内部使用
        map: function(elems, callback, arg) {
            var ret = [],
                retVal,
                i,
                length = elems.length,
                isArray = isArrayLike(elems);
            if (isArray) {
                for (i = 0; i < length; i++) {
                    retVal = callback(elems[i], i, arg); //注意不是callback.call
                    if (retVal != null) {
                        ret.push(retVal);
                    }
                }
            } else {
                for (i in elems) {
                    retVal = callback(elems[i], i, arg);
                    if (retVal != null) {
                        ret.push(retVal);
                    }
                }
            }
            //保证最终返回的是一维数组
            return core_concat.call([], ret);
        },
        guid: 1,
        //该方法用于更改函数的执行上下文
        //源代码中有两种传参形式，这里仅考虑最常见的一种
        proxy: function(fn, context) {
            if (!jQuery.isFunction(fn)) {
                return undefined;
            }
            var args = core_slice.call(arguments, 2);
            proxy = function() {
                return fn.call(context || this, core_concat.call(args, core_slice.call(arguments)));
            };
            proxy.guid = fn.guid = fn.guid || jQuery.guid++;
            return proxy;
        },
        //用一个方法同时实现get和set操作
        //如何设置或者获取由回调函数fn确定
        //这个方法的实现等用到的时候结合来看
        //参数chainable代表是设置还是获取，为true时代表设置，此时返回elems对象以便于链式操作
        //参数raw代表value的类型还是函数，如果是函数的话，利用函数调用的结果进行设置
        access: function(elems, fn, key, value, chainable, emptyGet, raw) {
            var i = 0,
                length = elems.length;
            if (jQuery.type(key) === 'object') {
                //这种情况肯定是设置
                chainable = true;
                for (i in key) {
                    jQuery.access(elems, fn, i, key[i], true, emptyGet, raw);
                }
            } else if (value !== undefined) {
                //说明是设置
                chainable = true;
                if (fn) {
                    if (!jQuery.isFunction(value)) {
                        raw = true;
                    }
                    for (; i < length; i++) {
                        fn(elems[i], key, raw ? value : value.call(elems[i], i, fn(elems[i], key)));
                    }

                }

            }
            return chainable ?
                //set
                elems :
                //get
                length ? fn(elems[0], key) : emptyGet;
        },
        now: Date.now,
        //该方法用于交换css样式，在support模块较多用到
        //要交换的样式由参数options传递
        swap: function(elem, options, callback, args) {
            var name, ret,
                old = {};
            for (name in options) {
                old[name] = elem.style[name];
                elem.style[name] = options[name];
            }
            ret = callback.call(elem, args || []);
            for (name in options) {
                elem.style[name] = old[name];
            }
            return ret;
        },

    });

    //jQuer的DOM页面加载通过回调函数列表完成
    //下面的函数：1）初始化一个回调函数列表
    //2）向DomContentLoaded注册监听事件
    jQuery.ready.promise = function(obj) {
        if (!readyList) {
            readyList = jQuery.Deferred();
            document.addEventListener('DOMContentLoaded', compeleted, false);
        }
        return readyList.promise(obj);
    };
    //目前，js中typeof的返回值有六种："number," "string," "boolean," "object," "function," 和 "undefined."
    //通过object.prototype.toString/或者{}.toString 返回值有九种：Boolean Number String Function Array Date RegExp Object Error，其中的Array,Date,RegExp,Object,Error都属于Object类型,在有些浏览器中typeof 正则会返回function
    jQuery.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(i, name) {
        class2type["[object " + name + "]"] = name.toLowerCase();
    });
    //console.log(class2type,class2type);
    rootjQuery = jQuery(document);


    /****接下来这一部分，在jQuery的源代码中，本来是Sizzle，这里暂且略过***/
    var optionsCache = {};

    function createOptions(options) {
        var object = optionsCache[options] = {};
        //\S+,匹配非空格字符
        //正则表达式如果没有g，仅匹配第一个匹配项
        jQuery.each(options.match(/\S+/g), function(i, item) {
            object[item] = true;
        });
        return object;
    }
    //参数options可以是字符串或者是对象形式，可选属性/字符串组合有
    //once:回调函数列表只能执行一次
    //memory:fire调用之后，再次add将立即触发
    //unique：同一个函数不能被重复添加到回调函数列表中
    //stopOnFlase:当某一个函数返回false时，为true的时候，回调函数列表的执行终止
    jQuery.Callbacks = function(options) {
        options = typeof options === 'string' ? optionsCache[options] || createOptions(options) : options || [];
        var list = [], //用于存储回调函数列表
            firingStart,
            once = options.once,
            memory, //初始值为undefined,只有在memory模式下，调用fire后才会被赋值,以备在add中再次调用           
            fired = false, //指示是否fire过
            firingIndex, //指向要执行的下一个回调函数的下标
            add = function(arg) {
                var type;
                jQuery.each(arg, function(i, item) {
                    type = jQuery.type(item);
                    if (type === 'function' && !(options.unique && self.has(item))) {
                        list.push(item);
                    } else if (type === 'array') {
                        add(item);
                    }
                });
            },
            fire = function(data) {
                fired = true;
                memory = options.memory && data;
                firingIndex = firingStart || 0;
                firingStart = 0; //在memory模式下，add的时候firingStart可能会被置为其他值，这里将其还原，以备下次调用fire的时候从头开始执行
                var length;

                if (!list) {
                    return;
                }

                for (length = list.length; firingIndex < length; firingIndex++) {
                    if (list[firingIndex].apply(data[0], data[1]) === false && options.stopOnFalse) {
                        break;
                    }
                }
                // if(once){
                //     if(memory){//如果通知是once和memory模式，那么在add的时候可以进行再次触发
                //         list=[];
                //     }else{//否则直接禁用
                //         self.disable();
                //     }
                // }

            },
            self = {
                add: function() {
                    if (list) {
                        var start = list.length;
                        add(arguments);
                        //如果是memory模式下的add,会导致立即触发
                        if (memory) { //memory的初始值为undefined，memory模式下调用一次fire才会被赋值，因此第一次调用add的时候不会走下面
                            firingStart = start;
                            fire(memory);
                        }
                    }
                    return this;
                },
                remove: function() {
                    if (list) {
                        var i;
                        jQuery.each(arguments, function(i, item) {
                            //jQuery.inArray(item,list,i),返回item在list中的下表，从第i位向后数，包括第i为
                            while ((i = jQuery.inArray(item, list, i)) > -1) {
                                list.splice(i, 1); //删除上的数值                                
                            }
                        });
                    }
                    return this;
                },
                //fn有值的时候，代表判断回调函数列表是否存在函数fn
                //没有参数fn的时候，代表判断回调函数列表是否为空
                has: function(fn) {
                    return fn ? jQuery.inArray(fn, list) > -1 : !!(list && list.length);
                },
                empty: function() {
                    if (list) {
                        list = [];
                    }
                    return this;
                },
                disable: function() {
                    //list就不用说了，list置为undefined之后，几乎所有的方法都不能调用
                    //memory恢复初始值undefined
                    list = memory = undefined;
                    return this;
                },
                disabled: function() {
                    return !list;
                },
                fireWith: function(context, args) {
                    if (list && !(once && fired)) {
                        args = args || []; //主要是为了处理args为undefined的情况
                        args = [context, args.slice ? args.slice() : args];
                        fire(args);
                    }
                    return this;
                },
                fire: function() {
                    self.fireWith(this, arguments);
                    return this;
                },
                fired: function() {
                    return !!fired;
                },
                //自己加的函数，供调试用
                getList: function() {
                    return list;
                }
            };
        return self;
    };

    //实现异步队列Defered,When
    //异步队列内部维护了三个回调函数列表，分别是成功，失败，消息
    jQuery.extend({
        //func参数仅内部使用，func的调用者是jQuery.Deferred的返回值，参数也是
        Deferred: function(func) {
            var doneList = jQuery.Callbacks('once memory'),
                failList = jQuery.Callbacks('once memory'),
                progressList = jQuery.Callbacks('memory'),
                state = 'pending',
                list = {
                    'resolve': doneList,
                    'reject': failList,
                    'notify': progressList
                },
                promise = {
                    done: doneList.add,
                    fail: failList.add,
                    progress: progressList.add,
                    state: function() {
                        return state;
                    },
                    //同时添加成功，失败，消息回调函数
                    then: function(doneCallback, failCallback, progressCallback) {
                        deferred.done(doneCallback).fail(failCallback).progress(progressCallback);
                    },
                    //成功，失败时，添加同一个处理函数
                    always: function() {
                        deferred.done(arguments).fail(arguments);
                    },
                    //说实话，能看懂这个源代码，但搞不太懂这个pipe是干嘛用的
                    //pipe方法在2.0.3中改名成了then方法，感觉在向ES6的promise靠拢，promise与回调的区别确实搞不太明白
                    //不过其源代码有不少知识点值得学习
                    pipe: function(fnDone, fnFail, fnProgress) {
                        //这里的newDefer,就是调用jQuery.Deferred(function(newDeferred))返回的异步队列对象，由这部分代码最终的func.apply(deferred,deferred)决定;
                        return jQuery.Deferred(function(newDefer) {

                            jQuery.each({
                                done: [fnDone, 'resolve'],
                                fail: [fnFail, 'reject'],
                                progress: [fnProgress, 'notify']
                            }, function(handler, data) {
                                //注意这三个局部变量定义的位置，只能定义在该闭包中，如果定义在jQuery.Deferred得到的只是函数最后的值，如果没有传递fnProgress,就会报出undefined的错误
                                var action = data[1],
                                    fn = data[0],
                                    returned;
                                if (jQuery.isFunction(fn)) {
                                    //通过done,fail,progress添加的方法，只有在对应的回调函数队列fire的时候才会触发
                                    deferred[handler](function() {
                                        //这里的this，arguments是调用fire/fireWith时候传递
                                        //这里的this可以通过fireWith中指定context,arguments也是fire/fireWith的时候传递的参数

                                        returned = fn.apply(this, arguments);
                                        //如果函数的返回值依旧是一个异步队列，则将jQuery.pipe返回的异步队列的成功，失败，消息回调添加到返回的retuned对应的回调列表中
                                        //如果传递的是一个真正的Promise值，这个值就会被递归展开
                                        if (returned && jQuery.isFunction(returned.promise)) {
                                            returned.promise().then(newDefer.resolve, newDefer.reject, newDefer.notify);
                                        } else {
                                            //如果函数返回值不是异步队列，则jQuery.pipe（）返回的异步队列对应状态的方法立即触发
                                            //如果传递的是一个非promise的立即值，那么promise就会使用这个值决议
                                            newDefer[action + 'With'](this === deferred ? newDefer : this, [returned]);
                                        }
                                    });
                                } else {
                                    deferred[handler](newDefer[action]);
                                }

                            });
                        }).promise();
                    },
                    //注意promise()和promise({})这两种写法是完全不同的，前者返回异步对象的只读版本，后者返回一个副本
                    promise: function(obj) {
                        return obj == null ? promise : jQuery.extend(obj, promise);
                    },
                },
                deferred = promise.promise({}),
                key;
            //为deferred添加状态改变的相关函数，与fire,fireWith相对应
            for (key in list) {
                deferred[key] = list[key].fire;
                deferred[key + 'With'] = list[key].fireWith;
            }
            deferred.done(function() {
                    state = 'resolved';
                }, failList.disable, progressList.disable)
                .fail(function() {
                    state = 'rejected';
                }, doneList.disable, progressList.disable);


            if (func) {
                //这句话决定了，通过jQuery.Deferred(func)调用的时候，func的context和参数
                func.call(deferred, deferred);
            }
            return deferred;

        },
        //这里的when有点类似于ES6中的Promise.all
        When: function(firstParam) {
            var resolveArgs = core_slice.call(arguments, 0), //用来存放成功参数
                length = resolveArgs.length,
                count = length, //维护一个计数器
                progressArgs = new Array(length), //用来存放消息参数
                i = 0,
                //只有当在只有一个参数，并且该参数是延迟对象的情况下，主延迟对象等于该第一个参数，否则新建一个主延迟对象
                deferred = length <= 1 && firstParam && jQuery.isFunction(firstParam.promise) ? firstParam : jQuery.Deferred(),
                promise = deferred.promise();
            if (length > 1) {
                for (; i < length; i++) {
                    if (resolveArgs[i] && jQuery.isFunction(resolveArgs[i].promise)) {
                        resolveArgs[i].then(resolveFunc(i), deferred.reject, progressFunc(i));
                    } else {
                        count--;
                    }
                    if (!count) {
                        deferred.resolveWith(deferred, resolveArgs);
                    }
                }
            } else if (deferred !== firstParam) { //说明只有一个或0个参数，若有一个，该参数还不是延迟对象
                //此时立即触发
                deferred.resolveWith(deferred, length ? [firstParam] : []);
            }
            //为了将参数i的值传递，这里采用闭包
            function resolveFunc(i) {
                //回调函数的参数（即返回函数中的value/arguments）是由fire/fireWith的时候进行参数指定
                return function(value) {
                    resolveArgs[i] = arguments.length > 1 ? core_slice.call(arguments) : value;
                    //每一次参数延迟对象的resolve触发，都令count的值减去一
                    if (!--count) {
                        //如果计算器变为0，那么主延迟对象的resolve方法触发
                        deferred.resolveWith(deferred, resolveArgs);
                    }
                }
            }

            function progressFunc(i) {
                return function(value) {
                    progressArgs[i] = arguments.length > 1 ? core_slice.call(arguments) : value;

                    deferred.notifyWith(promise, progressArgs);
                }
            }
            return promise;
        }

    });

    /*********数据缓存模块****************************************/
    //数据缓存模块的整体思路
    //2.0.3版本的jQuery较之于1.7.3版本，使用面向对象的写法重构了数据缓存Data模块
    //数据缓存模块的整体依据是：
    //data_user和data_priv在一次运行期间只有对应的唯一对象，所有DOM元素的缓存都基于这两个实例对象完成
    //data_user与data_priv这两个Data实例有各自的缓存对象属性cache，分别用于存储用户自定义数据和内部数据
    //以data_user为例，在向对应的data_user对应的缓存对象cache中保存数据时，会为每个DOM元素分配一个唯一的id，该id作为该DOM元素的附加属性
    //该唯一id（初始值为0，之后一次加1）会附加到DOM元素上，对应的DOM元素的属性名是data_user.expando,其对应的属性值就是id
    //同时，会把该id作为属性名添加到data_user的缓存对象属性cache中，对应的属性值是一个都object对象，该对象称为DOM元素的数据缓存对象，其中存储着属性名和属性值的映射
    //这样，通过分配唯一的id把DOM元素和该DOM元素的数据缓存对象关联起来
    //data_priv与之类似


    var data_priv, data_user,
        rbrace = /^(?:\{\s\S*\}|\[\s\S*\])$/, //匹配json字符串格式，诸如{}，或者[],不用.*进行匹配的原因是.不能匹配换行符
        rmultiDash = /([A-Z])/g; //匹配任意的大写字母


    function Data() {
        //jQuery.expando是jQuery的静态属性，对于jQuery的每次加载运行期间时唯一的
        //Math.random生成一个0-1之间的随机数
        this.expando = jQuery.expando + Math.random();
        this.cache = {};
        //这里采用访问器属性的写法
        //常用的写法是Object.defineProperty(对象，对象属性，{[[get]],[[set]],[[configurable]],})
        //这句话的目的，this.cache中的0属性是个只读属性
        Object.defineProperty(this.cache, 0, {
            get: function() {
                return {};
            }
        });
    }
    //下面可以看到，只有当accepts为false的时候，返回的id为0
    Data.uid = 1;
    Data.accepts = function(owner) {
        //只有DOM元素，document元素，以及普通的js对象可以操作数据缓存
        return owner.nodeType ? owner.nodeType === 1 || owner.nodeType === 9 : true;
    };
    Data.prototype = {
        //获取(设置)owner对应的id，如果没有，则为其this.expando对应的属性，值为id，并未其在this.expando中创建缓存对象
        key: function(owner) {
            if (!Data.accepts(owner)) {
                return 0;
            }
            var expando = this.expando,
                id = owner[expando];

            if (!id) {
                id = Data.uid++;
                //为owner定义expando属性，为了保证该属性不可遍历且只读，使用访问器属性进行定义
                //defineProperty一次只定义一个属性，接受三个参数，对象，属性名，属性描述对象
                //defineProperties可以通过描述符一次定义多个属性，接受两个参数
                //具体用法可以参照讲解http://www.tuicool.com/articles/ju26riE
                Object.defineProperty(owner, expando, {
                    value: id,
                });
            }
            if (!this.cache[id]) {
                this.cache[id] = {};
            }
            return id;
        },
        //为DOM元素对应的缓存设置数据
        //data参数可以是字符串，也可以是对象/数组,当data是对象/数组的时候，value可以不赋值
        set: function(owner, data, value) {
            var id = this.key(owner),
                //该DOM元素对应的缓存对象
                cache = this.cache[id],
                key;
            if (typeof data === 'string') {
                cache[data] = value;
            } else {
                for (key in data) {
                    cache[key] = data[key];
                }
            }
            return cache;
        },
        //获取DOM元素owner对应缓存中属性key的值
        //如果参数key不赋值，则代表去除owner对应的对象缓存
        get: function(owner, key) {
            var id = this.key(owner),
                cache;
            if (!id) {
                return undefined;
            }
            cache = this.cache[id];
            return key ? cache[key] : cache;
        },
        //设置或获取
        access: function(owner, key, value) {
            var tmp;
            if (!key || ((key && typeof key === 'string') && !value)) { //说明是获取
                //先尝试key本身，不行的话尝试转驼峰
                tmp = this.get(owner, key);
                return tmp ? tmp : this.get(owner, jQuery.camelCase(key));
            }
            //否则说明是设置
            this.set(owner, key, value);
            return value ? value : key;

        },
        //如果没有传入参数key，则移除DOM元素或者javascript元素关联的所有数据
        //如果传入了参数key,则移除关联的指定名称的数据
        //如果key是数组或者空格分割的多个数据名，则一次可以删除多个数据,删除的时候还需要尝试camel转换之后的形式
        remove: function(owner, key) {
            var i, camel, length,
                id = this.key(owner),
                cache = this.cache[id];
            if (!key) {
                this.cache[id] = {};
            } else {
                //可能是数组，可能是字符串，该字符串还可能使用空格分开
                if (typeof key === 'string') {
                    key = key.match(rnotwhite); //转换为数组形式
                }
                key = key.concat(jQuery.map(key, jQuery.camelCase));
                for (i = 0, length = key.length; i < length; i++) {
                    delete cache[key[i]];
                }
            }
        },
        //返回owner对应的缓存对象是否有值
        hasData: function(owner) {
            return !jQuery.isEmptyObject(this.cache[owner[this.expando]] || {});
        },
        //删除Owner对应的缓存对象（注意不是讲缓存对象置为空数组）
        discard: function(owner) {
            if (owner[this.expando]) {
                delete this.cache[owner[this.expando]];
            }
        }
    };
    data_user = new Data();
    data_priv = new Data();
    jQuery.extend({
        acceptData: Data.accepts,
        //同事查看用户自定义缓存和私有缓存
        hasData: function(elem) {
            return data_user.hasData(elem) || data_priv.hasData(elem);
        },
        //操作用户自定义数据
        data: function(elem, name, data) {
            return data_user.access(elem, name, data);
        },
        removeData: function(elem, name) {
            data_user.remove(elem, name);
        },
        _data: function(elem, name, data) {
            return data_priv.access(elem, name, data);
        },
        _removeData: function(elem, name) {
            data_priv.remove(elem, name);
        },
        //下面这两个get方法在jquery源代码中没有，这里加上，便于测试
        get: function(elem, key) {
            return data_user.get(elem, key);
        },
        _get: function(elem, key) {
            return data_priv.get(elem, key);
        }
    });
    //这部分操作的都是用户自定义数据
    jQuery.fn.extend({
        data: function(key, value) {
            //在这一步中，jQuery的源代码考虑了
            jQuery.each(this, function() {
                jQuery.data(this, key, value);
                //console.log(jQuery.get(this));
                //console.log($(this).getData());
            });

        },
        removeData: function(key) {
            //别忘了，jquery对象是类数组
            jQuery.each(this, function() {
                //    data_user.remove(this,key);
                jQuery.removeData(this, key);
            });
        },
        //下面的getData方法也是为了测试方便加上的，在jQuery源代码中没有
        getData: function(key) {
            //下面这种写法不对，注意结合jQuery.each源代码看就知道，get到的值并没有返回        
            // jQuery.each(this,function(){                
            //     jQuery.get(this,key);
            // });
            //根据jQuery的思路，获取的时候，获得的总是首个
            return jQuery.get(this[0], key);
        }
    });
    //jQuery的源代码中用于处理html5中的data属性，这里暂不考虑
    function dataAttr(elem, key, data) {

    }

    //搞清楚构造函数(包括普通函数)，构造函数的原型，实例之间的关系
    //javascript中每个函数都有一个prototype属性，指向其原型对象
    //原型对象有一个constructor属性，指向对应的构造函数
    //每个实例对象有一个隐形属性，在chrome中是_proto_，指向原型对象，注意这个属性是介于实例和原型对象之间的


    /************************jQuery队列Queue模块**********************************/
    //jQuery的队列模块基于数据缓存模块,异步回调和数组实现
    //jQuery的队列为动画模块等提供基础功能，其队列中的元素都是函数；jQuery将其单独提取了一个命名空间，说明程序员也可以发挥自己的想法创建出非动画队列
    //在队列模块中，通过数组存储函数，通过数组方法.push()和.shift()来实现入队和出队操作，通过.call来执行函数
    //和普通队列不同的是，除了支持IFIO之外，出队的函数还可以自动调用，其调用的上下文是DOM元素elem，参数是next,数据缓存中的typeHooks对象，这些在dequeue中被指定
    //对于动画队列，入队的动画函数会自动调用方法.dequeue()出队并且执行，对于非动画队列，则需要手动调用方法.dequeue()
    //数组作为内部数据存储在关联的数据缓存对象，数据名称为队列名称加字符串“queue”
    //如果没有传入队列名称，则默认为标准动画fx;
    //队列模块会在队列名称后自动加上后缀queue，表示这是一个队列
    //这部分的数据缓存对象结构是：data-priv——>DOM元素的连续数字ID——>1)[type]queue:[队列函数列表]，
    //2)typequeueHooks:
    //A)empty，对应一个callbacks回调函数，该回调函数在队列函数列表执行完毕的时候被调用，执行的操作包括:a）清楚缓存typequeue和typequeueHooks;
    //b)如果还调用了promise，则为hooks的empty对应的回调函数callbacks添加了令监控计数器count减1的操作；
    //c)如果还调用了delayed,会为[type]queueHooks添加stop属性，用于终止timeout延时计算器    

    //队列模块的代码结构    
    jQuery.extend({
        //该方法用于返回或者修改匹配元素关联的函数队列，根据传入参数的不同，函数实现的功能也有所不同
        //这是一个低级方法，外部调用的时，应该用.queue替换
        //queue(elem,[type])返回匹配元素关联的函数队列
        //queue(elem,type,newQueue)参数data是函数数组，此时用newQueue替换当前队列
        //queue(elem,type,callback())参数data是函数，此时将callback添加到当前的函数队列中
        queue: function(elem, type, data) {
            var type = type || 'fx' + queue,
                queue = data_priv.get(elem, type);
            if (data) {
                //说明是设置操作
                if (!queue || jQuery.isArray(data)) {
                    //必须使用jQuery.makeArray，针对!queue且data是function的情况
                    data_priv.access(elem, type, jQuery.makeArray(data));
                } else {
                    queue.push(data);
                }
            }
            return queue || [];
        },
        //jQuery中的队列不同于队列定义的是，jQuery的队列不仅支持函数的入队和出队操作，出队的函数还会自动调用
        dequeue: function(elem, type) {
            var type = type || 'fx',
                queue = jQuery.queue(elem, type),
                hooks = jQuery._queueHooks(elem, type),
                startLength = queue.length,
                fn = queue.shift(),
                //不能令next=jQuery.dequeue，因为不能指定参数啊啊啊
                next = function() {
                    jQuery.dequeue(elem, type);
                };
            //这个inprogress搞不太懂，回头结合动画effects模块一起看吧
            if (fn === 'inprogress') {
                fn = queue.shift();
                startLength--;
            }

            if (fn) {
                //同样，inprogress搞不懂，看动画模块如何让inprogress出队吧
                if (type === 'fx') {
                    queue.unshift('inprogress');
                }
                //取消hooks上的定时器，这个依旧搞不太懂，结合delay一起看吧
                delete hooks.stop;
                //先不考虑动画和延时

                fn.call(elem, next, hooks);
            }
            //注意上面fn.call之后startLength并没有-1
            //测试的结果是，只有在队列已经为空的情况下，再次调用dequeue进行出队，才会触发缓存清除的empty操作
            if (!startLength && hooks) {
                hooks.empty.fire();
            }

        },
        _queueHooks: function(elem, type) {
            var hookKey = type + 'queueHooks';
            return data_priv.get(elem, hookKey) || data_priv.access(elem, hookKey, {
                empty: jQuery.Callbacks('once memory').add(function() {
                    data_priv.remove(elem, [type + 'queue', hookKey]);
                    console.log('empty call');
                })
            });
        }
    });
    jQuery.fn.extend({
        //.queue([queuename]);返回第一个匹配元素关联的函数队列
        //.queue([queueName],newQueue);修改匹配元素关联的函数队列，使用函数数组newQueue替换当前队列
        //.queue([queueName],callback(next，hooks))；修改匹配元素关联的函数队列，添加callback到队列中
        //如果queueName省略，则默认是动画队列fx
        queue: function(type, data) {
            var setter = 2;
            if (typeof type !== 'string') {
                //进行参数修正
                data = type;
                type = 'fx';
                setter--;
            }
            //靠，这种判断是获取还是设置的点子是怎么想出来的
            if (arguments.length < setter) {
                //说明是获取操作，根据jQuery的思想，获取的时候，仅获取首个
                return jQuery.queue(this[0], type);
            }
            //否则说明是设置操作，根据jQuery的思想，设置的时候，进行遍历设置
            if (data) {
                this.each(function(i, item) {
                    var queue = jQuery.queue(this, type, data);
                    //确定添加了hooks
                    jQuery._queueHooks(this, type);
                    //如果是动画队列，那么首次入队的时候回自动出队执行，不必手动调用dequeue，唉，这点结合动画模块来看吧
                    if (type === 'fx' && queue[0] !== 'inprogress') {
                        jQuery.dequeue(this, type);
                    }
                });
            }

        },
        dequeue: function(type) {
            this.each(function() {
                jQuery.dequeue(this, type);
            });
        },
        //使得队列中下一个函数延迟执行
        delay: function(time, type) {
            time = jQuery.fx ? jQuery.fx.speeds[time] || time : time;
            type = type || 'fx';
            //next和hooks的参数赋值是在dequeue的fn.call中，还记得么？
            return this.queue(type, function(next, hooks) {
                var timerId = setTimeout(next, time);
                hooks.stop = function() {
                    clearTimeout(timerId);
                }
            });
        },
        clearQueue: function(type) {
            this.queue(type || 'fx', []);
        },
        //针对每一个匹配元素，对其添加监控，当所有匹配元素的type队列中的函数都执行完毕时，调用Promise的done添加的成功回调函数
        promise: function(type, obj) {
            var elems = this,
                count = 0,
                i = elems.length,
                defered = jQuery.Deferred(),
                hook;
            if (typeof type !== 'string') {
                obj = type;
                type = undefined;
            }
            type = type || 'fx';

            function resolve() {
                if (!(--count)) {
                    //如果计数器count变为0
                    defered.resolveWith(elems, [elems]);
                }
            }

            //添加监控
            while (i--) {
                hook = elems[i] && data_priv.get(elems[i], type + 'queueHooks');
                if (hook && hook.empty) {
                    count++;
                    hook.empty.add(resolve);
                }
            }
            //这里为毛要调用一次呢?
            // resolve();
            return defered.promise(obj);

        }
    });
    //如果某个html属性对应的DOM属性的值是布尔值，则称该html属性为布尔型html属性，其属性值是小写的属性名
    //布尔属性主要出现在表单元素上，常见的有radio,checkbox 上的checked属性，option的selected属性；文本域，文本区，密码域的readOnly属性，select元素上的multiple属性等
    //所有的表单元素都有disabled属性
    //一般js设置DOM属性，令一个布尔属性是否发挥作用，通常直接设置true/false，如input.disabled=true;
    //然而，在html中只要设置了这个属性，不管它的值是什么，哪怕属性值是字符串flase,甚至哪怕只有个属性名，都认为他的值是true
    //早期的xhtml规范要求html中，布尔属性的属性名和属性值都写成一样，而在html5规范中，只要求写属性名即可
    //由于html规范要求所有写在标签内的属性名都转换为小写，但在js中设置DOM属性则要求驼峰式，如readonly对应readOnly,庆幸的是这样的属性没有几个
    //因此对于布尔属性的设置和读取需要特殊处理
    //在chrome下测试的结果是，对于布尔属性，html与DOM属性会联动发生变化，一个的修改会影响到另一个
    var rboolean = /^(?:autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected)$/i;

    /***********jQuery的属性操作模块*********************************/
    jQuery.fn.extend({
        //1..att
        attr: function(name, value) {
            return jQuery.access(this, jQuery.attr, name, value, arguments.length > 1);
        },
        removeAttr: function(name) {
            return this.each(function() {
                jQuery.removeAttr(this, name);
            });
        },

        prop: function(name, value) {
            return jQuery.access(this, jQuery.prop, name, value, arguments.length > 1);
        },
        removeProp: function(name) {
            return this.each(function() {
                delete this[jQuery.propFix[name] || name];
            });
        },
        //addClass为每个匹配元素增添一个或者多个类样式，通过修改DOM元素的className属性来完成
        //其核心技巧是现在待添加的类样式和当前类样式的前后分别加空格，然后检查字符串方法indexOf()的返回值，来决定是添加还是忽略
        //该方法用法有两种：
        //.addClass(className),className是一个或者多个空格分割的类样式的字符串
        //.addClass(function(index,currentClass));参数是一个函数，返回一个或多个空格分割的类样式的字符串。函数接受两个参数：当前元素在集合中的下标，当前的类样式
        addClass: function(value) {
            var i = 0,
                j = 0,
                len = this.length,
                curElem,
                classNames, className, curClass;
            if (value && jQuery.isFunction(value)) {
                return this.each(function(i) {
                    jQuery(this).addClass(value.call(this, i, this.className));
                });
            }
            for (; i < len; i++) {
                curElem = this[i];
                j = 0;
                //不能这样写，这样的话，第一个元素循环完成就退出了
                // if(jQuery.isFunction(value)){
                //     return jQuery(curElem).addClass(value.call(curElem,i,curElem.className));
                // }

                if (typeof value === 'string') {
                    classNames = (value || "").match(rnotwhite) || [];
                    curClass = curElem.nodeType === 1 && curElem.className ? (' ' + curElem.className + ' ').replace(rclass, ' ') : ' ';
                    while ((className = classNames[j++])) {
                        if (curClass.indexOf(' ' + className + ' ') < 0) {
                            curClass += className + ' ';
                        }
                    }
                }
                curElem.className = jQuery.trim(curClass);
            }
            return this;

        },
        //removeClass用于从匹配元素集合中的每个元素上移除一个或多个一个或者全部类演示
        //该方法通过修改className属性来完成，其核心技巧是先在待移除的类样式和当前类样式前后先加上空格，然后用字符串replace()逐个从当前类样式中移除
        //该方法有三种用法
        //.removeClass(className),参数className是一个或多个空格分开的字符串类样式
        //.removeClass(function(index,class)),参数是一个函数，返回一个或者多个空格分开的字符串类样式，该函数接收两个参数：当前元素在集合中的下标，当前类样式
        //.removeClass()移除当前匹配元素的所有类样式
        removeClass: function(value) {
            var i,
                len = this.length,
                curElem,
                j = 0,
                clazz, classNames,
                curClass;
            if (value && jQuery.isFunction(value)) {
                return this.each(function(i) {
                    jQuery(this).removeClass(value.call(this, i, this.className));
                });
            }

            for (i = 0; i < len; i++) {
                curElem = this[i];

                if (arguments.length === 0) {
                    curElem.className = '';
                    continue;
                }
                //不能这么写，对于循环的第二个元素来说，value就不是期望的值了
                //
                // if(jQuery.isFunction(value)){
                //     value=value.call(i,curElem.className);
                // }
                // 
                j = 0;
                curClass = curElem.nodeType === 1 && curElem.className ? curElem.className.replace(rclass, ' ') : '';
                if (typeof value === 'string') {
                    classNames = (value || '').match(rnotwhite) || [];
                    while (clazz = classNames[j++]) {
                        // console.log('1', ' '+curClass+' ');
                        // console.log('2', ' '+clazz+' ');
                        // console.log((' '+curClass+' ').indexOf(' '+clazz+' '));
                        if ((' ' + curClass + ' ').indexOf(' ' + clazz + ' ') >= 0) {
                            curClass = (' ' + curClass + ' ').replace(' ' + clazz + ' ', ' ');
                        }
                    }
                }
                curElem.className = jQuery.trim(curClass);
            }
            return this;
        },
        //用于为匹配元素集合中的每个元素添加或移除（即切换）一个或者多个类样式，添加或移除的行为依赖于匹配元素是否含有指定的类样式以及参数stateVal的值
        //该方法有五种用法
        //.toggle(class),切换一个或者多个类样式，如果匹配元素包含指定的类样式，则移除，否则则添加
        //.toggle(className,stateVal),切换一个或者多个类样式，由参数stateVal的值决定是添加还是移除，如果是true则添加，如果是false则移除
        //.toggle();切换全部的类样式，如果匹配元素含有类样式，则移除，否则则尝试回复
        //.toggleClass(stateVal)切换全部类样式，有stateVal决定是添加还是移除。如果是false，则总是移除，如果是ture，此时等同于.toggleClass()
        //.toggleClass(function(index,class,stateVal),[stateVal]),待切换的类样式由一个函数决定，该函数接受3个参数：元素下标，当前类样式和参数stateVal
        toggleClass: function(value, stateVal) {
            var type = typeof value,
                curElem;
            if (type === 'string' && typeof stateVal === 'boolean') {
                return stateVal ? this.addClass(value) : this.removeClass(value);
            }
            if (jQuery.isFunction(value)) {
                return this.each(function(i) {
                    return jQuery(this).toggleClass(value.call(this, i, this.className, stateVal), stateVal);
                });
            }
            return this.each(function() {
                if (type === 'string') {
                    var self = jQuery(this),
                        classNames,
                        clazz,
                        i, len,
                        j = 0;
                    classNames = (value || '').match(rnotwhite) || [];
                    for (i = 0, len = classNames.length; i < len; i++) {
                        while (clazz = classNames[j++]) {
                            if (self.hasClass(clazz)) {
                                self.removeClass(clazz);
                            } else {
                                self.addClass(clazz);
                            }
                        }
                    }
                } else if (type === core_strundefined || type === 'boolean') {
                    if (this.className) {
                        data_priv.set(this, '_className_', this.className);
                    }
                    //否则全部删除或者尝试恢复
                    this.className = (type === core_strundefined || value === false) ? '' : data_priv.get(this, '_className_');
                }


            });


        },
        //检测元素是否包含指定的类样式,参数value是单独一个类样式对应的字符串
        //核心技巧是在当前类样式和待查找的类样式前后都加上空格
        hasClass: function(value) {
            var i = 0,
                curElem,
                curClass,
                len = this.length;
            if (typeof value === 'string') {
                for (i; i < len; i++) {
                    curElem = this[i];
                    curClass = curElem && curElem.className ? curElem.className.replace(rclass, ' ') : '';
                    if ((' ' + curClass + ' ').indexOf(' ' + value + ' ') >= 0) {
                        return true;
                    }
                }
            }
            return false;
        },
        val: function(value) {
            var i, curElem, len;
            if (value === undefined) {
                return this[0].value;
            } else {
                for (i = 0, len = this.length; i < len; i++) {
                    curElem = this[i];
                    if (value !== undefined) {
                        curElem.value = value;
                    }
                }
            }
            return this;
        }
    });
    jQuery.extend({
        //在下面的代码中还有将驼峰式转换为小写的代码
        propFix: {
            'for': 'htmlFor',
            'class': 'className'
        },
        //jQuery的源代码为了解决兼容性，在这里本来有几个属性，分别是valHooks,attrHooks,propHooks以及propFix
        //自己的代码不想在兼容性上浪费太多精力，因此删除了上述hooks
        //仅仅保留了对于布尔属性的处理

        //该方法用于获取/设置元素的html属性。是对原声的getAttribute和setAttribute的封装
        //function(elem,name,value)为设置
        //function(elem,name)为获取
        attr: function(elem, name, value) {
            //文本节点：nodeType=3;注释节点nodeType=8;属性节点nodeType=2
            var nType = elem.nodeType,
                ret;
            if (!elem || nType === 3 || nType === 8 || nType === 2) {
                return;
            }
            name = name.toLowerCase();
            hook = rboolean.test(name) ? boolhook : null;
            if (value) {
                //说明是设置
                if (hook && 'set' in hook && (ret = hook.set(elem, name, value)) !== undefined) {
                    return ret;
                } else {
                    elem.setAttribute(name, '' + value);
                    return value;
                }
            } else {
                //说明是获取
                if (hook && 'get' in hook && (ret = hook.get(elem, name, value)) !== undefined) {
                    return ret;
                } else {
                    ret = elem.getAttribute(name, value);
                    return ret === null ? undefined : ret;
                }
            }
        },

        //removeAttr用于从DOM元素上移除一个或者多个html属性
        //多个html属性可以使用空格分开
        //对于布尔属性，还会同时设置其DOM属性为false
        removeAttr: function(elem, name) {
            var attrNames = name && name.match(rnotwhite),
                i = 0,
                curAttr,
                propName;
            if (attrNames && elem.nodeType === 1) {
                while (curAttr = attrNames[i++]) {
                    propName = jQuery.propFix[curAttr] || curAttr;
                    if (rboolean.test(curAttr)) {
                        //设置dom属性的时候，需要注意html属性一律采用小写字母，DOM属性则采用驼峰式,因此需要propFix转换
                        elem[propName] = false;
                    }
                    elem.removeAttribute(curAttr);
                }
            }

        },

        //获取或者设置DOM元素的DOM属性
        prop: function(elem, name, value) {
            var name = jQuery.propFix[name] || name,
                nType = elem.nodeType;
            if (!elem || nType === 2 || nType === 3 || nType === 8) {
                return;
            }
            if (value !== undefined) {
                elem[name] = value;
                return value;
            } else {
                return elem[name];
            }
        },

    });
    var boolhook = {
        set: function(elem, name, value) {
            if (value === false) {
                elem.removeAttribute(name);
            } else {
                elem.setAttribute(name, name);
            }
            return name;
        },
        //在html中更改布尔属性，浏览器引擎一般会自动更改对应的DOM属性，反之亦然
        get: function(elem, name) {
            var property = jQuery.prop(elem, name);
            return property !== false || elem.getAttribute(name) != null ? name.toLowerCase() : undefined;
        }
    };
    jQuery.each([
        "tabIndex",
        "readOnly",
        "maxLength",
        "cellSpacing",
        "cellPadding",
        "rowSpan",
        "colSpan",
        "useMap",
        "frameBorder",
        "contentEditable"
    ], function() {
        jQuery.propFix[this.toLowerCase()] = this;
    });

    /***************jQuery的事件操作模块**************************/
    //定义了一些正则
    var rkeyEvent = /^key/,
        rmouseEvent = /^(?:mouse|contextmenu)|click/,
        rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
        rtypenamespace = /^([^.]*)(?:\.(.+)|)$/; //匹配命名空间

    function returnTrue() {
        return true;
    }

    function returnFalse() {
        return false;
    }

    //jQuery事件操作模块，（自己的代码中忽略了委托的实现,以及自定义参数data的实现）

    jQuery.event = {
        //该方法用于为DOM元素绑定一个或多个类型的监听函数
        //绑定事件时，方法调用链为.one/delegate/live/事件便捷方法()——>.on()——>jQuery.event.add()——>addEventListener()

        //参数elem:待绑定事件的DOM元素
        //参数types:事件类型字符串，多个类型之间使用空格分开；一个事件类型可以含有一个或者多个命名空间，多个命名空间使用句号隔开，如click.bobo.leishao
        //参数handler:待绑定的事件监听函数 
        add: function(elem, types, handler) {
            if (!elem || elem.nodeType === 3 || elem.nodeType === 8) {
                return;
            }
            var eventHandler, handlers, handleObj, elemData, events,
                t, type, namespaces, tmp;
            if (!handler.guid) {
                handler.guid = jQuery.guid++;
            }
            //data_priv有保护机制，就算没有，也会返回{}
            elemData = data_priv.get(elem);
            eventHandler = elemData['handler'];
            if (!eventHandler) {
                eventHandler = elemData['handler'] = function(event) {
                    // console.log('arguments',arguments);
                    // 下面语句中apply的上下文不能是elem,因为最后为了防止内存泄漏elem被置空了，这样display执行时候的上下文就不能绑定的DOM元素，而是window了
                    //return jQuery.event.dispatch.apply(elem,arguments);
                    event.bindTarget = eventHandler.elem;
                    return jQuery.event.dispatch.apply(eventHandler.elem, [event]);
                }
            }
            eventHandler.elem = elem;
            events = elemData['events'];
            if (!events) {
                events = elemData['events'] = {};
            }

            types = (types || '').match(rnotwhite) || [];
            t = types.length;
            while (t--) {
                tmp = (types[t] || '').match(rtypenamespace) || [];
                type = tmp[1];
                namespaces = (tmp[2] || '').split('.').sort();
                if (!type) {
                    continue;
                }
                //将监听函数封装为监听函数对象，感觉主要是为了实现对命名空间的支持
                //相关的属性，在one——>on——>jQuery.off(event)中会用到,在dispatch将hanleObj作为event的属性，event.handleObj=handleObj
                handleObj = {
                    handler: handler,
                    type: type,
                    namespace: namespaces.join('.'),
                    guid: handler.guid,
                };
                handlers = events[type];
                if (!handlers) {
                    handlers = events[type] = [];
                    if (elem.addEventListener) {
                        //如果是首次添加某种类型的监听函数，则注册对应事件
                        elem.addEventListener(type, eventHandler, false);
                    }
                }
                handlers.push(handleObj);
            }
            console.log('调用jQuery.event.add之后，对应元素的时间缓存对象:');
            console.log(elemData);
            elem = null;
        },

        remove: function(elem, types, handler) {
            var handlers, events, eventHandler,
                t, temp, type, namespaces, namespace_re,
                i, len;
            events = data_priv.get(elem, 'events');
            eventHandler = data_priv.get(elem, 'handler');
            if (!events) {
                return;
            }
            types = (types || '').match(rnotwhite) || [];
            t = types.length;
            while (t--) {
                tmp = (types[t] || '').match(rtypenamespace) || [];
                type = tmp[1];
                namespaces = (tmp[2] || '').split('.').sort();
                namespace_re = tmp[2] && new RegExp("(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)");
                if (!type) {
                    //此时没有事件类型，但是可能有命名空间
                    for (type in events) {
                        jQuery.event.remove(elem, type + types[t], handler);
                    }
                    continue;
                }
                handlers = events[type] || [];
                for (i = 0, len = handlers.length; i < len; i++) {
                    handleObj = handlers[i];
                    if ((!namespace_re || namespace_re.test(handleObj.namespace)) && (!handler || handler.guid === handleObj.guid)) {
                        handlers.splice(i, 1);
                    }
                }
                if (!handlers.length) {
                    delete events[type];
                    if (elem.removeEventListtener) {
                        elem.removeEventListtener(type, eventHandler);
                    }
                }

            }
            if (jQuery.isEmptyObject(events)) {
                data_priv.remove(elem, 'events');
                data_priv.remove(elem, 'handler');
            }
            console.log('调用off——>remove之后，元素的事件缓存对象：');
            console.log(data_priv.get(elem));

        },

        //参数elem:DOM元素
        //参数type:事件类型字符串,需要考虑对命名空间的支持
        trigger: function(elem, type) {
            var handlers, handleObj,
                tmp, namespace,
                i, len, t,
                event,
                eventPath = [],
                cur, old;

            tmp = type.match(rtypenamespace);
            type = tmp[1];
            namespace = tmp[2] && tmp[2].split('.').sort().join('.');
            event = jQuery.Event(type);

            event.namespace = namespace;
            event.namespace_re = namespace ?
                new RegExp("(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)") :
                null;


            //构造冒泡路径
            cur = elem;
            while (cur) {
                eventPath.push(cur);
                cur = cur.parentNode;
            }
            //这里的路径貌似是以document终结，实际上在源代码中，还处理了window的情形
            for (i = 0, len = eventPath.length; i < len && !event.isPropagationStopped(); i++) {
                cur = eventPath[i];
                handler = (data_priv.get(elem, 'events') || {})[type] && data_priv.get(cur, 'handler');
                //handler是主监听函数
                if (handler) {
                    event.target = cur;
                    handler.apply(cur, [event]);
                }
            }
            return event.result;
        },
        //主监听函数是真正绑定到元素上的监听函数，所有类型的事件将共享此监听函数，主监听函数负责事件和执行监听函数，内部通过jQuery.event.dispatch(event)实现
        //当浏览器触发事件时，方法调用链是：主监听函数——>jQuery.event.dispatch()()——>监听函数；
        //当手动触发事件时，方法调用链是：事件便捷方法——>trigger/triggerHandler()——>jQuery.event.trigger()——>主监听函数——>jQuery.event.dispatch()——>监听函数
        //参数event：事件对象；如果是由浏览器触发，则参数event是原生事件对象，后面的代码会将它封装为jQuery事件对象；如果事件时手动触发的，则参数event是jQuery事件对象
        //dispatch就是主监听函数的函数体
        //因为调用的时候，通过jQuery.event.dispatch.apply(elem,arguments);因此dispatch中的this就是绑定事件的DOM元素
        dispatch: function(event) {
            var elemData, handleObj, handlers,
                type, t, ret;
            type = event.type;
            //console.log(this);
            //console.log(data_priv.get(this,'events')['click']);
            handlers = (data_priv.get(this, 'events') || {})[type] || [];
            t = handlers.length;
            event.result = undefined;
            while (t--) {
                handleObj = handlers[t];
                //手动触发trigger支持命名空间，这里需要增加对命名空间的支持 
                if (!event.namespace_re || event.namespace_re.test(handleObj.namespace)) {
                    //这点很重要
                    //在one的实现中，.off(event);其中的信息都是从event.handleObj中实现的
                    event.handleObj = handleObj;
                    ret = handleObj.handler.apply(this, arguments);
                    if (ret != undefined) {
                        event.result = ret;
                        if (ret === false) {
                            event.preventDefault();
                            event.stopPropagation();
                        }
                    }
                }

            }
            return event.result;
        },
        //props包含了鼠标和键盘专属的共有属性
        //在js事件标准中，currentTarget是绑定事件的元素，target是触发事件的元素
        props: "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),
        fixHooks: {},
        keyHooks: {
            //char:字符串型，表示一个按键产生的可打印字符码（标准化）
            //charCode:数值型，表示一个按键可产生的可打印字符码
            //key:字符串型，表示按键产生的一个较低层次的“虚拟按键码”（标准化）
            //keyCode:数值型，表示按键产生的一个较低层次的“虚拟按键码”（未标准化，但浏览器支持）
            //当键盘事件被触发时，which事件属性通常和keyCode具有相同的取值,在IE9+的浏览器中一般都支持
            //在鼠标事件被触发时，which事件属性通常指示哪个鼠标键被按下
            props: "char charCode key keyCode".split(" "),
            //filter方法用于修正某些不兼容属性
            filter: function(event, original) {
                if (event.which == null) {
                    event.which = event.charCode || event.keyCode;
                }
                return event;
            }
        },
        mouseHooks: {
            //button：指示哪个鼠标按键被按下，左、中、右键分别为0,1,2
            //buttons:指示哪个鼠标按键被按下，用于指示更多的按键，默认值，左，中，右分别为0,1,2,4
            //clientX,clientY:分别表示鼠标指针针对于窗口左上方的X，Y坐标
            //offsetX,offsetY:分别表示相对于事件源左上角的X，Y坐标
            //pageX,pageY：分别表示鼠标指针在整个文档的X，Y坐标
            //screenX,screenY:分别表示鼠标指针相对于显示屏左上角的X，Y坐标
            //fromElement,toElement前者表示mouseover事件中鼠标离开的元素，后者表示mouseout中鼠标进入的文档元素，相当于relatedTarget
            //relatedTarget：表示与事件的目标元素相关的元素，对于mouseenter和mouseover来说，表示鼠标离开的元素；对于mouseleave和mouseout来说，表示鼠标进入的元素。对于其他事件类型来说，这个属性没有用
            props: "button buttons clientX clientY offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
            filter: function(event, original) {
                var eventDoc, body, doc,
                    button = original.button;

                //如果浏览器不支持文档坐标pageX和pageY,则进行手动计算，计算公式如下：
                //距文档左坐标pageX=距窗口左坐标clientX+水平滚动位移-文档左边框厚度
                //距文档上坐标pageY=距窗口上坐标clientY+垂直滚动位移-文档上边框厚度

                if (event.pageX == null && event.clientX != null) {
                    eventDoc = event.target.ownerDocument || document;
                    doc = eventDoc.documentElement;
                    body = eventDoc.body;

                    event.pageX = original.clientX + (doc && doc.scrollLeft || body && body.scollLeft || 0) - (doc && doc.clientLeft || body && body.clientLeft || 0);
                    event.pageY = original.clientY + (doc && doc.scrollTop || body && body.scrollTop || 0) - (doc && doc.clientTop || body && body.clientTop || 0);

                }
                //增添which属性，左键1，中键2，右键3
                if (!event.which && button !== undefined) {
                    event.which = (button & 1 ? 1 : (button & 2 ? 3 : (button & 4 ? 2 : 0)));
                }
                return event;
            }
        },
        //该方法用于把原生事件对象封装为jQuery事件对象，该方法会调用构造函数jQuery.Event(src,props)创建一个新的jQuery事件对象，然后把大部分原生事件对象的属性赋值到jQuery事件对象上，并对一些不兼容属性进行修正
        //当浏览器触发事件时，方法调用链是：主监听函数——>jQuery.event.dispatch()——>jQuery.event.fix()——>jQuery.Event()
        //参数event可以是jQuery原生事件对象或者jQuery对象       
        fix: function(event) {
            //如果是jQuery事件对象
            if (event[jQuery.expando]) {
                return event;
            }
            var copy, prop,
                originalEvent = event,
                type = event.type,
                fixHook = this.fixHooks[type];
            if (!fixHook) {
                this.fixHooks[type] = fixHook = rkeyEvent.test(type) ?
                    this.keyHooks :
                    rmouseEvent.test(type) ? this.mouseHooks : {};
            }
            copy = fixHook.props ? this.props.concat(fixHook.props) : this.props;
            event = jQuery.Event(originalEvent);
            i = copy.length;
            while (i--) {
                prop = copy[i];
                event[prop] = originalEvent[prop];
            }
            if (!event.target) {
                event.target = document;
            }
            if (event.target.nodeType === 3) {
                event.target = event.target.parentNode;
            }
            return fixHook.filter ? fixHook.filter(event, originalEvent) : event;
        },
    };

    //之所以在原生js的Event对象上重新封装一个jQuery的Event对象
    //js下的Event对象是只读的，即不可以修改，而jQuery为了支持浏览器兼容和功能扩展，需要一个可以修改的Event事件对象
    //jQuery的事件系统由三部分构成：jQuery.Event构造函数，原型对象jQuery.Event.prototype,事件修正方法jQuery.event.fix
    //jQuery的事件对象会将原生js的Event对象的大部分属性都复制过来

    //jQuery.Event用于创建一个jQuery事件，创建的时候new操作符是可选的
    //当浏览器触发事件时，方法调用链为:主监听函数——>jQuery.event.dispatch()——>jQuery.event.fix()——>jQuery.Event()
    //当手动触发事件时，方法调用链为：事件便捷方法——>trigger/triggerHandler()——>jQuery.Event

    //参数src:可以是原生事件类型，自定义事件类型;原生事件对象或者jQuery事件对象
    //参数props可选的javascript对象，其中的属性将被设置到新创建的jQuery事件对象上   
    jQuery.Event = function(src, props) {
        //省略new操作符
        if (!(this instanceof jQuery.Event)) {
            return new jQuery.Event(src, props);
        }

        //如果src是原生javascript事件对象
        if (src && src.type) {
            this.originalEvent = src;
            this.type = src.type;
        } else {
            this.type = src;
        }
        if (props) {
            jQuery.extend(this, props);
        }
        //修正时间戳，事件属性timestamp指示了浏览器创建事件的时间，单位是毫秒
        this.timeStamp = src && src.timeStamp || jQuery.now();
        //在构造函数的开头使用instanceof来检测当前对象是否是jQuery事件对象，不过在jQuery事件系统的其他部分，则通过检测标记jQuery.expando是否为true来判断，
        //因为instanceof需要检查原型链，而判断一个属性是否存在则高效的多
        this[jQuery.expando] = true;
    };
    jQuery.Event.prototype = {
        isDefaultPrevented: returnFalse,
        isPropagationStopped: returnFalse,
        isImmediatePropagationStopped: returnFalse,
        preventDefault: function() {
            var e = this.originalEvent;
            this.isDefaultPrevented = returnTrue;
            if (e && e.preventDefault) {
                e.preventDefault();
            }
        },
        stopPropagation: function() {
            var e = this.originalEvent;
            this.isPropagationStopped = returnTrue;
            if (e && e.stopPropagation) {
                e.stopPropagation();
            }
        },
        stopImmediatePropagation: function() {
            this.isImmediatePropagationStopped = returnTrue;
            this.stopPropagation();
        },
    };
    jQuery.fn.extend({
        //.on(events,[,data],handler[eventObj])方法用于为匹配元素绑定一个或多个事件监听函数，内部通过调用jQuery.event.add来实现
        //当绑定事件时，方法调用链为.one/delegate/live/事件便捷方法()——>.on()——>jQuery.event.add()——>addEventListener()——>data-priv
        /*****自己的代码中，尚不考虑事件代理*****/
        //参数types:事件类型字符串，多个事件类型使用空格分开，事件类型可以包含一个或多个命名空间，多个命名空间通过.隔开。这个参数可以是javascript事件类型，也可以是用户自定义事件。除了字符串之外，该参数还可以是对象，属性名是字符串，属性值是监听函数
        //参数selector:一个选择器表达式字符串，用于事件代理。如果selector是null或者未传入，绑定的是普通事件，当直接在匹配元素上触发事件或者事件从后代冒泡到匹配元素时，监听函数被触发。否则如果提供了selector，则匹配元素为代理元素
        //只有当事件冒泡到匹配元素时，才会用selector匹配冒泡路径上的后代元素，然后在后代元素上执行监听函数
        /*****end*****/
        //自己的代码中，不考虑自定义数据data
        //参数data:传递给事件监听函数的自定义数据，可以是任何类型。但是如果data是字符串，selector就必须明确指定为null或undefined，这样data和selector两个参数才不会混淆
        //参数data会被附加到监听对象(handleObj)的属性data上，当事件触发时，监听对象的属性data会附件到jQuery事件对象的属性data上
        //参数fn：待绑定的监听函数，(该参数可以是布尔值false,此时会被修正为returnFalse函数,自己的代码中不考虑这一点)
        //参数One：仅在内部使用，为方法.one提供支持，当方法.one调用时候，该参数会赋值为1，后续代码会将监听函数重新封装为一个只会执行一次的新监听函数        
        on: function(types, fn, one) {
            var origFn;
            if (one === 1) {
                //基本思路，触发一次后，将对应类型的监听函数删除
                origFn = fn;
                //通过add添加的函数，只有在被触发dispatch的时候才会被调用
                fn = function(event) {
                    var ret = origFn.apply(this, arguments);
                    //删除绑定的此条监听函数
                    jQuery().off(event);
                    return ret;
                }
                fn.guid = origFn.guid || (origFn.guid = jQuery.guid++);
            }
            return this.each(function() {
                jQuery.event.add(this, types, fn);
            });

        },
        one: function(types, fn) {
            return this.on(types, fn, 1);
        },
        //方法.off(type,[fn])用于移除匹配元素集合中每个元素上绑定的一个或多个类型的监听函数
        //当移除事件时，方法的调用链是.unbind/die()——>.off()——>jQuery.event.remove()——>data_priv/removeEventListtener
        //参数types可以是jQuery事件对象，也可以是事件类型字符串
        //在one方法的实现中，events就是jQuery事件对象
        off: function(types, fn) {
            var handleObj;
            //在one方法的实现中，使用了jQuery().off(event)的写法
            //types具有preventDefault属性，说明是事件对象；同时又具有handleObj属性，说明是正在被dispatch分发的事件对象
            //types.handleObj中包含了移除事件所需要的相关信息
            if (types && types.preventDefault && types.handleObj) {
                handleObj = types.handleObj;
                jQuery(types.bindTarget).off(handleObj.namespace ? handleObj.type + '.' + handleObj.namespace : handleObj.type,
                    handleObj.handler);
                return this;
            }

            return this.each(function() {
                jQuery.event.remove(this, types, fn);
            });

        },
        //在所有匹配元素上手动触发事件，并且模拟冒泡行为
        //手动触发事件的时候，方法的调用链是事件便捷方法——>.trigger()/.triggerHandler()——>jQuery.event.trigger()——>主监听函数——>jQuery.event.dispatch()——>事件监听函数
        trigger: function(type) {
            return this.each(function() {
                jQuery.event.trigger(this, type);
            });
        },

    });

    //实现相关的事件便捷方法
    jQuery.each(("blur focus focusin focusout load resize scroll unload click dblclick " +
        "mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
        "change select submit keydown keypress keyup error contextmenu").split(" "), function(i, name) {
        jQuery.fn[name] = function(fn) {
            //如果提供了监听函数，则绑定监听函数，通过.on方法来实现
            //如果没有提供监听函数，则手动触发，通过调用trigger来实现
            return arguments.length > 0 ? this.on(name, fn) : this.trigger(name);
        }
        if (rkeyEvent.test(name)) {
            jQuery.event.fixHooks[name] = jQuery.event.keyHooks;
        }
        if (rmouseEvent.test(name)) {

            jQuery.event.fixHooks[name] = jQuery.event.mouseHooks;
        }
    });
    window.jQuery = window.$ = jQuery;
})(window);
