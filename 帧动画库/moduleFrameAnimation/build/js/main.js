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
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__frameAnimation__ = __webpack_require__(1);


function getById(id) {
    return document.getElementById(id);
}

var imgs = ['../asserts/rabbit-big.png', '../asserts/rabbit-lose.png', '../asserts/rabbit-win.png'];

function anim1() {
    var anim = Object.create(__WEBPACK_IMPORTED_MODULE_0__frameAnimation__["a" /* default */]);
    anim.init();
    var rabit1 = getById('rabit1');
    var rightRunningMap = ["0 -854", "-174 -852", "-349 -852", "-524 -852", "-698 -851", "-873 -848"];
    anim.loadImages(imgs.splice(0, 1)).changePosition(rabit1, rightRunningMap).repeat();
    anim.start(300);
    var running = true;
    rabit1.addEventListener('click', function() {
        if (running) {
            console.log('用户点击了stop');
            anim.stop();
        } else {
            anim.restart();
        }
        running = !running;
    });
}

anim1();


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__loadImages__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__timeline_js__ = __webpack_require__(3);



const STATE_INITAL = 'inital';
const STATE_START = 'start';
const STATE_STOP = 'stop';
const TASK_SYNC = 'sync'; //所谓同步任务，是不需要开启定时器执行的，图片加载，事件等，在这里不被视为异步任务
const TASK_ASYNC = 'async'; //所谓异步任务，是需要开启定时器执行的，也就是需要开启timeline

var FrameAnimation = {
    init: function() {
        this.taskQueue = [];
        this.timeline = Object.create(__WEBPACK_IMPORTED_MODULE_1__timeline_js__["a" /* default */]);
        this.timeline.init();
        this.index = 0;
        this.state = STATE_INITAL;
    },
    //预加载图片
    //虽然预加载图片是异步加载的，但是系统后台自发的异步加载
    //并不需要调用timeline，因此类型为sync
    loadImages: function(imgList) {
        //next在_runTask方法中给参数赋值
        var taskFn = function(next) {
            __WEBPACK_IMPORTED_MODULE_0__loadImages__["a" /* default */](imgList, next);
        };
        return this._add(taskFn, TASK_SYNC);
    },
    //改变图片背景位置，实现帧动画
    //图片的每一种位置状态，对应onEnterFrame中的一帧动作
    //需要调用timeline完成，因此type为Asycn
    changePosition: function(ele, positions, imgUrl) {
        var len = positions.length;
        var self = this;
        var taskFn = function(next, time) {
            if (imgUrl) {
                ele.style.backgroundImage = 'url(' + imgUrl + ')';
            }
            //|0相当于向下取整
            // console.log('time', time);
            var index = Math.min(time / self.interval | 0, len);
            console.log('index-1', index-1);
            var positionArr = positions[index-1].split(' ');
            ele.style.backgroundPosition = positionArr[0] + 'px ' + positionArr[1] + 'px';
            if (index >= len) {
                next();
            }
        };
        var type = TASK_ASYNC;
        return this._add(taskFn, type);
    },
    //改变背景图片链接
    //每一份链接，对应onEnterFrame中的一帧动作
    //需要调用timeline完成，因此time为Async
    changeSrc: function(ele, imgList) {
        var len = imgList.length;
        var self = this;
        var taskFn = function(next, time) {
            var index = Math.min(time / self.interval | 0, len - 1);
            ele.style.backgroundImage = 'url(' + imgList[index] + ')';
            if (index >= len - 1) {
                next();
            }
        };
        var type = TASK_ASYNC;
        return this._add(taskFn, type);
    },
    //高级用法，用于自定义每一帧要做的事情
    enterFrame: function(taskFn) {
        return this._add(taskFn, TASK_SYNC);
    },
    then: function(callback) {
        var taskFn = function(next) {
            callback();
            next();
        };
        return this._add(taskFn, TASK_SYNC);
    },
    start: function(interval) {
        if (this.state !== STATE_INITAL) {
            return;
        }
        if (!this.taskQueue.length) {
            return;
        }
        this.interval = interval;
        this.state = STATE_START;
        this._runTask();
        return this;
    },
    stop: function() {
        if (this.state === STATE_START) {
            this.timeline.stop();
            this.state = STATE_STOP;
        }
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
    //重复上一个任务
    //times为任务重复的次数
    repeat: function(times) {
        var self = this;
        var taskFn = function(next, time) {
            if (typeof times === 'undefined') {
                //说明重复无限次
                //初始很疑惑，為什麼僅添加了一個taskFn卻能无限次循环
                //添加taskFn之后，taskQueue的长度加一
                //执行taskFn时，taskFn内部将index--，因此再次执行上一个任务
                //而当上一个任务执行完毕（假设上一个任务是changePostion),会调用next()方法
                //next方法会另index++，同时再次执行taskFn，而taskFn内部又将index--
                //以此反复执行，就形成了无限次循环的效果
                self.index--;
                self._runTask();
                return;
            }
            if (times) {
                times--;
                self.index--;
                self._runTask();
            } else {
                //达到重复次数，则跳转到下一个任务
                // var task = self.taskQueue[self.index];
                self._next();
            }
        };
        var type = TASK_SYNC;
        return this._add(taskFn, type);
    },
    //无线重复上一个任务
    repeatForever: function() {
        this.repeat();
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
        // console.log('taskQueue index', this.index);
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
        };
        // console.log('__runAsync');
        this.timeline.start(this.interval);
    }

};

/* harmony default export */ __webpack_exports__["a"] = (FrameAnimation);


/***/ }),
/* 2 */
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
/* harmony default export */ __webpack_exports__["a"] = (loadImage);


/***/ }),
/* 3 */
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
        if (this.state === STATE_START) {
            return;
        }
        console.log('执行start');
        this.interval = interval || DEFAULT_INTERVAL;
        this.state = STATE_START;
        this.startTime = +new Date();
        this.__startTimeline(this.startTime);

    },
    // 参数time为动画开始执行到现在执行的时间
    // time在startTime中传递
    onEnterFrame: function(time) {},
    stop: function() {
        console.log('进入stop', this.state === STATE_START);
        if (this.state !== STATE_START) {
            return;
        }
        console.log('执行stop');
        this.state = STATE_STOP;
        this.passedTime = (+new Date()) - this.startTime;
        cancelAnimationFrame(this.reqId);
        this.reqId = null;
    },
    restart: function() {
        if (this.state !== STATE_STOP) {
            return;
        }
        if (!this.passedTime || !this.interval) {
            return;
        }
        this.state = STATE_START;
        this.__startTimeline((+new Date()) - this.passedTime);
    },
    __startTimeline: function(startTime) {
        var self = this;
        var lastTime = +new Date();
        this.startTime = startTime;
        nextTick();
        // console.log('startTime', startTime);

        function nextTick() {
           // self.stop();
            var curTime = +new Date();
            if (curTime - lastTime >= self.interval) {
                lastTime = curTime;
                self.onEnterFrame(curTime - self.startTime);
            }
            self.reqId = requestAnimationFrame(nextTick);
        }
    }

};
/* harmony default export */ __webpack_exports__["a"] = (Timeline);


/***/ })
/******/ ]);