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
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__animation_js__ = __webpack_require__(1);


var getById = function(id) {
    return document.getElementById(id);
};
getById('btn1').addEventListener('click', function() {
    var anim = Object.create(__WEBPACK_IMPORTED_MODULE_0__animation_js__["a" /* default */]);
    anim.init('#div1');
    anim.animate({ 'left': 300, 'opacity': 0.2 }, { duration: 2000 });
});
getById('btn2').addEventListener('click', function() {
    var anim = Object.create(__WEBPACK_IMPORTED_MODULE_0__animation_js__["a" /* default */]);
    anim.init('#div2');
    anim.animate({ 'left': 300 }, { duration: 2000 }).animate({ 'left': 150 });
});
getById('btn3').addEventListener('click', function() {
    var anim = Object.create(__WEBPACK_IMPORTED_MODULE_0__animation_js__["a" /* default */]);
    anim.init('#div3');
    anim.animate({ 'left': 300 }, { duration: 2000 }).reverse();
});
getById('btn4').addEventListener('click', function() {
    var anim = Object.create(__WEBPACK_IMPORTED_MODULE_0__animation_js__["a" /* default */]);
    anim.init();
    var animSeq = [{
        el: '#div4',
        p: { 'left': 300, 'opacity': '0.2' },
        o: { 'diration': 2000 }
    }, {
        el: '#div4',
        p: { 'height': 300 },
    }];
    anim.runSequence(animSeq);
});
getById('btn5').addEventListener('click', function() {
    var anim = Object.create(__WEBPACK_IMPORTED_MODULE_0__animation_js__["a" /* default */]);
    anim.init('#div5');
    anim.animate({ 'left': 300 }, { duration: 2000 }).finish();
});


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__tween_js__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__util_js__ = __webpack_require__(3);



//定义相关常量

//默认动画执行时长
const DEFAULT_DURATION = 1000;
const STATE_INITAL = 0;
const STATE_START = 1;
const STATE_STOP = 2;
const RUNNING = 'RUNNING';


var requestAnimationFrame = (function() {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        function(callback) {
            return window.setTimeout(callback, callback.interval || DEDAULT_INTERVAL);
        }
})();

var cancelAnimationFrame = (function() {
    return window.cancelAnimationFrame ||
        window.webkitCancelRequestAnimationFrame ||
        window.mozCancelRequestAnimationFrame ||
        window.oCancelRequestAnimationFrame ||
        function(timeId) {
            return window.clearTimeout(timeId);
        }
})();


var Animation = {
    init: function(el) {
        if (el) {
            this.dom = el.nodeType === 1 ? el : document.querySelector(el);
        }
        this.taskQueue = [];
        this.state = STATE_INITAL;
        this.reqId = null;
        this.toEnd = false;
        return this;
    },
    initAnim: function(props, opts) {
        this.propChange = {};
        this.duration = opts && opts.duration || DEFAULT_DURATION;
        this.easing = opts && opts.easing || __WEBPACK_IMPORTED_MODULE_0__tween_js__["a" /* default */].Linear;
        this.initProps = {};
        for (var prop in props) {
            this.propChange[prop] = {};
            if (Array.isArray(props[prop])) {
                this.propChange[prop]['from'] = this.initProps[prop] = props[prop][0];
                this.propChange[prop]['to'] = props[prop][1];
            } else {
                this.propChange[prop]['from'] = this.initProps[prop] = __WEBPACK_IMPORTED_MODULE_1__util_js__["a" /* getStyle */](this.dom, prop);
                this.propChange[prop]['to'] = props[prop];
            }
        }
        return this;
    },
    animate: function(props, opts) {
        var self = this;
        this.enqueue(function() {
            self.initAnim(props, opts);
            self.play(opts);
        });
        return this;
    },
    //从结束状态再回到初始状态
    reverse: function() {
        if (!this.initProps || !this.duration) {
            alert('尚未调用任何动画，不能反转');
            return;
        }
        this.animate(this.initProps, {
            duration: this.duration
        });
    },
    enqueue: function(fn) {
        this.taskQueue.push(fn);
        if (this.taskQueue[0] !== RUNNING) {
            this.dequeue();
        }
        return this;
    },
    dequeue: function() {
        while (this.taskQueue.length) {
            var task = this.taskQueue.shift();
            if (typeof task === 'function') {
                task.call(null);
                this.taskQueue.unshift(RUNNING);
                break;
            }
        }
        return this;
    },
    finish: function() {},
    stop: function() {
        if (this.state !== STATE_START) {
            return;
        }
        this.state = STATE_STOP;
        cancelAnimationFrame(this.reqId);
        this.reqId = null;
        return this;
    },
    play: function(opts) {
        if (this.state === STATE_START) {
            return;
        }
        var startTime = +new Date();
        var self = this;
        this.state = STATE_START;
        nextTick();

        function nextTick() {
            var curTime = +new Date();
            var passedTime = Math.min(curTime - startTime, self.duration);
            self.reqId = requestAnimationFrame(nextTick);
            if (passedTime >= self.duration) {
                self.stop();
                //下一个出队
                self.dequeue();
                if (opts && opts.next) {
                    opts.next.call(null);
                }
                return;
            }
            if (self.toEnd) {
                passedTime = self.duration;
                self.stop();
            }
            for (var prop in self.propChange) {
                var curValue = self.easing(passedTime, self.propChange[prop]['from'], self.propChange[prop]['to'] - self.propChange[prop]['from'], self.duration);
                console.log(prop + ':' + passedTime, curValue);
                __WEBPACK_IMPORTED_MODULE_1__util_js__["b" /* setStyle */](self.dom, prop, curValue);
            }
        }
        return this;

    },
    /**
     * 执行预定义动画序列
     * @param  {Array} animSequence 实现定义好的动画序列列表，其中每个元素为对象类型，可以包含三个属性el（执行动画的dom元素），p(动画属性)，o(动画选项)
     */
    runSequence: function(animSequence) {
        for (var index = 0, len = animSequence.length - 1; index < len; index++) {
            if (!animSequence[index]['o']) {
                animSequence[index]['o'] = {};
            }
            //注意这里需要使用闭包
            animSequence[index]['o']['next'] = (function(index) {
                return function() {
                    var nextItem = animSequence[index + 1];
                    var anim = Object.create(Animation);
                    anim.init(nextItem.el);
                    anim.animate(nextItem.p, nextItem.o);
                };
            })(index);

        }
        var anim = Object.create(Animation);
        anim.init(animSequence[0].el);
        anim.animate(animSequence[0].p, animSequence[0].o);
    },
    // 直接到达当前动画的最终状态
    finish: function() {
        this.toEnd = true;
    }



};
/* harmony default export */ __webpack_exports__["a"] = (Animation);


/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/**
 *Tween 各种缓动效果
 */
var tween = {
    Linear: function(t, b, c, d) {
        return c * t / d + b;
    },
    Quad: {
        easeIn: function(t, b, c, d) {
            return c * (t /= d) * t + b;
        },
        easeOut: function(t, b, c, d) {
            return -c * (t /= d) * (t - 2) + b;
        },
        easeInOut: function(t, b, c, d) {
            if ((t /= d / 2) < 1) return c / 2 * t * t + b;
            return -c / 2 * ((--t) * (t - 2) - 1) + b;
        }
    },
    Cubic: {
        easeIn: function(t, b, c, d) {
            return c * (t /= d) * t * t + b;
        },
        easeOut: function(t, b, c, d) {
            return c * ((t = t / d - 1) * t * t + 1) + b;
        },
        easeInOut: function(t, b, c, d) {
            if ((t /= d / 2) < 1) return c / 2 * t * t * t + b;
            return c / 2 * ((t -= 2) * t * t + 2) + b;
        }
    },
    Quart: {
        easeIn: function(t, b, c, d) {
            return c * (t /= d) * t * t * t + b;
        },
        easeOut: function(t, b, c, d) {
            return -c * ((t = t / d - 1) * t * t * t - 1) + b;
        },
        easeInOut: function(t, b, c, d) {
            if ((t /= d / 2) < 1) return c / 2 * t * t * t * t + b;
            return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
        }
    },
    Quint: {
        easeIn: function(t, b, c, d) {
            return c * (t /= d) * t * t * t * t + b;
        },
        easeOut: function(t, b, c, d) {
            return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
        },
        easeInOut: function(t, b, c, d) {
            if ((t /= d / 2) < 1) return c / 2 * t * t * t * t * t + b;
            return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
        }
    },
    Sine: {
        easeIn: function(t, b, c, d) {
            return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
        },
        easeOut: function(t, b, c, d) {
            return c * Math.sin(t / d * (Math.PI / 2)) + b;
        },
        easeInOut: function(t, b, c, d) {
            return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
        }
    },
    Expo: {
        easeIn: function(t, b, c, d) {
            return (t == 0) ? b : c * Math.pow(2, 10 * (t / d - 1)) + b;
        },
        easeOut: function(t, b, c, d) {
            return (t == d) ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
        },
        easeInOut: function(t, b, c, d) {
            if (t == 0) return b;
            if (t == d) return b + c;
            if ((t /= d / 2) < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
            return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
        }
    },
    Circ: {
        easeIn: function(t, b, c, d) {
            return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
        },
        easeOut: function(t, b, c, d) {
            return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
        },
        easeInOut: function(t, b, c, d) {
            if ((t /= d / 2) < 1) return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
            return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
        }
    },
    Elastic: {
        easeIn: function(t, b, c, d, a, p) {
            if (t == 0) return b;
            if ((t /= d) == 1) return b + c;
            if (!p) p = d * .3;
            if (!a || a < Math.abs(c)) {
                a = c;
                var s = p / 4;
            } else var s = p / (2 * Math.PI) * Math.asin(c / a);
            return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
        },
        easeOut: function(t, b, c, d, a, p) {
            if (t == 0) return b;
            if ((t /= d) == 1) return b + c;
            if (!p) p = d * .3;
            if (!a || a < Math.abs(c)) {
                a = c;
                var s = p / 4;
            } else var s = p / (2 * Math.PI) * Math.asin(c / a);
            return (a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b);
        },
        easeInOut: function(t, b, c, d, a, p) {
            if (t == 0) return b;
            if ((t /= d / 2) == 2) return b + c;
            if (!p) p = d * (.3 * 1.5);
            if (!a || a < Math.abs(c)) {
                a = c;
                var s = p / 4;
            } else var s = p / (2 * Math.PI) * Math.asin(c / a);
            if (t < 1) return -.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
            return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * .5 + c + b;
        }
    },
    Back: {
        easeIn: function(t, b, c, d, s) {
            if (s == undefined) s = 1.70158;
            return c * (t /= d) * t * ((s + 1) * t - s) + b;
        },
        easeOut: function(t, b, c, d, s) {
            if (s == undefined) s = 1.70158;
            return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
        },
        easeInOut: function(t, b, c, d, s) {
            if (s == undefined) s = 1.70158;
            if ((t /= d / 2) < 1) return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
            return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
        }
    },
    Bounce: {
        easeIn: function(t, b, c, d) {
            return c - Tween.Bounce.easeOut(d - t, 0, c, d) + b;
        },
        easeOut: function(t, b, c, d) {
            if ((t /= d) < (1 / 2.75)) {
                return c * (7.5625 * t * t) + b;
            } else if (t < (2 / 2.75)) {
                return c * (7.5625 * (t -= (1.5 / 2.75)) * t + .75) + b;
            } else if (t < (2.5 / 2.75)) {
                return c * (7.5625 * (t -= (2.25 / 2.75)) * t + .9375) + b;
            } else {
                return c * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375) + b;
            }
        },
        easeInOut: function(t, b, c, d) {
            if (t < d / 2) return Tween.Bounce.easeIn(t * 2, 0, c, d) * .5 + b;
            else return Tween.Bounce.easeOut(t * 2 - d, 0, c, d) * .5 + c * .5 + b;
        }
    }
};
/* harmony default export */ __webpack_exports__["a"] = (tween);


/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export requestAnimationFrame */
/* unused harmony export cancelAnimationFrame */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return getStyle; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return setStyle; });

//获取元素属性
var getStyle = function(dom, prop) {
    if (prop === 'opacity' && dom.style.filter) {
        return window.style.filter.match(/(\d+)/)[1];
    }
    var tmp = window.getComputedStyle ? window.getComputedStyle(dom, null)[prop] : dom.currentStyle[prop];
    return prop === 'opacity' ? parseFloat(tmp, 10) : parseInt(tmp, 10);
};
//设置元素属性
var setStyle = function(dom, prop, value) {
    if (prop === 'opacity') {
        dom.style.filter = '(opacity(' + parseFloat(value / 100) + '))';
        dom.style.opacity = value;
        return;
    }
    dom.style[prop] = parseInt(value, 10) + 'px';
};



/***/ })
/******/ ]);