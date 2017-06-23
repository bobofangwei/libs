/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__loadImages__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__timeline_js__ = __webpack_require__(2);



const STATE_INITAL = 'inital';
const STATE_START = 'start';
const STATE_STOP = 'stop';
const TASK_SYNC = 'sync'; //所谓同步任务，是不需要开启定时器执行的，图片加载，事件等，在这里不被视为异步任务
const TASK_ASYNC = 'async'; //所谓异步任务，是需要开启定时器执行的，也就是需要开启timeline

var FrameAnimation = {
    init: function() {
        this.taskQueue = [];
        this.timeline = Object.create(__WEBPACK_IMPORTED_MODULE_1__timeline_js__["a" /* default */]);
        timeline.init();
        this.index = 0;
        this.state = STATE_INITAL;
    },
    start: function(interval) {
        if (this.state !== STATE_INITAL) {
            return;
        }
        if (!this.taskQueue.length) {
            return;
        }
        this.state = STATE_START;
        this._runTask();
        return this;
    },
    //仅对异步任务有效
    pause: function() {
        if (this.state !== STATE_START) {
            return;
        }
        this.state = STATE_STOP;
        this.timeline.stop();
        return this;
    },
    //仅对异步任务有效
    restart: function() {
        if (this.state !== STATE_STOP) {
            return;
        }
        this.state = STATE_START;
        this.timeline.restart();
        return this;
    },
    dispose: function() {
        this.taskQueue = null;
        this.timeline.stop();
        this.timeline = null;
        this.index = 0;
        return this;
    },
    _add: function(taskFn, type) {
        this.taskQueue.push({
            type: type,
            taskFn: taskFn
        });
        return this;
    },
    _next: function() {
        this.index++;
        if (this.index >= this.taskQueue.length) {
            return;
        }
        this._runTask();
    },
    //执行任务队列中当前index的任务
    //队列并不会自发从头执行到尾
    _runTask: function() {
        if (this.index >= this.taskQueue.length) {
            this.dispose();
            return;
        }
        var task = this.taskQueue[this.index];
        if (task.type === TASK_SYNC) {
            this._runSyncTask(task.taskFn);
        } else if (task.type === TASK_ASYNC) {
            this._runAsyncTask(task.taskFn);
        }

    },
    _runSyncTask: function(taskFn) {
        var self = this;

        function next() {
            self._next();
        }
        taskFn(next);
    },
    _runAsyncTask: function(taskFn) {
        var self = this;

        function next() {
            self.timeline.stop();
            self._next();
        }
        this.timeline.onEnterFrame = function(time) {
            taskFn(next, time);
        }
        this.timeline.start(this.interval);
    }

};
var getFrameAnimation = function() {
    var frameAnimation = Object.create(FrameAnimation);
    frameAnimation.init();
};


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var _id = 0;
const STATE_LOADING = 'loading';
const STATE_SUCCESS = 'success';
const STATE_ERROR = 'error';
/**
 * 异步加载图片
 * @param  {Array}   imgs     待加载的图片src数组[src1,src2,..., srcN]
 * @param  {Function} callback 所有图片成功加载之后的回调
 * @param  {int}   timeout  加载超时时长
 */
function loadImage(imgs, callback, timeout) {
    var count = 0;
    var isTimeout = false;
    var timeoutId = 0;
    var success = true;
    for (var i = 0, len = imgs.length; i < len; i++) {
        var item = {};
        item.src = imgs[i];
        item.img = new Image();
        item.img.src = item.src;
        item.img.onerror = errorHandler(item);
        item.img.onload = loadHandler(item);
        item.status = STATE_LOADING;
        item.id = '_img_' + (++_id);
        window[item.id] = item;
        count++;
    }
    if (!count) {
        callback(success);
    }
    if (timeout) {
        timeoutId = setTimeout(timeoutHandler, timeout);
    }

    function loadHandler(item) {
        return function() {
            success = success && true;
            item.status = STATE_SUCCESS;
            done(item);
        };
    }

    function errorHandler(item) {
        return function() {
            success = false;
            item.status = STATE_ERROR;
            done(item);
        };
    }

    function timeoutHandler() {
        isTimeout = true;
        callback(false);
    }

    function done(item) {
        count--;
        item.img.onload = item.img.onerror = null;
        delete window[item.id];
        if (!count && !isTimeout) {
            //这里的callback可能为true(代表加载成功)，也可能为false
            callback(success);
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        }

    }
}
/* unused harmony default export */ var _unused_webpack_default_export = (loadImage);


/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// 该模块用于处理异步请求
const STATE_INITAL = 'inital';
const STATE_START = 'start';
const STATE_STOP = 'stop';
const DEFAULT_INTERVAL = 20;
/**
 * raf
 */
var requestAnimationFrame = (function() {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        //所有都不支持，用setTimeout兼容
        function(callback) {
            return window.setTimeout(callback, (callback.interval || DEFAULT_INTERVAL)); // make interval as precise as possible.
        };
})();

/**
 * cancel raf
 */
var cancelAnimationFrame = (function() {
    return window.cancelAnimationFrame ||
        window.webkitCancelAnimationFrame ||
        window.mozCancelAnimationFrame ||
        window.oCancelAnimationFrame ||
        function(id) {
            window.clearTimeout(id);
        };
})();

var Timeline = {
    init: function() {
        this.reqId = 0;
        this.state = STATE_INITAL;
    },
    start: function(interval) {
        if (this.state !== STATE_INITAL) {
            return;
        }
        this.interval = interval || DEFAULT_INTERVAL;
        this.state = STATE_START;
        this.startTime = +new Date();
        this.__startTimeline(this.startTime);

    },
    // 参数time为动画开始执行到现在执行的时间
    // time在startTime中传递
    onEnterFrame: function(time) {},
    stop: function() {
        if (this.state !== STATE_START) {
            return;
        }
        this.state = STATE_STOP;
        this.passedTime = (+new Date()) - this.startTime;
        cancelAnimationFrame(this.reqId);
    },
    restart: function() {
        if (this.state !== STATE_STOP) {
            return;
        }
        this.state = STATE_START;
        if (!this.passedTime || !this.interval) {
            return;
        }
        this.__startTimeline((+new Date()) - this.passedTime);
    },
    __startTimeline: function(startTime) {
        var self = this;
        var lastTime = +new Date();
        nextTick();

        function nextTick() {
            var curTime = +new Date();
            if (curTime - lastTime >= self.interval) {
                lastTime = curTime;
                self.onEnterFrame(curTime - startTime);
            }
            self.reqId = requestAnimationFrame(nextTick);
        }
    }

};
/* harmony default export */ __webpack_exports__["a"] = (Timeline);


/***/ })
/******/ ]);