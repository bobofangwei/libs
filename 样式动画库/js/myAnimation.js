var Animation = (function(window, undefined) {
    //定义相关常量
    var DEDAULT_INTERVAL = 1000 / 60;
    var STATE_INITAL = 0;
    var STATE_START = 1;
    var STATE_STOP = 2;
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
    //时间戳获取的兼容处理
    var nowtime = function() {
        if (typeof performance !== 'undefined' && performance.now) {
            return performance.now();
        }
        return Date.now ? Date.now() : (new Date()).getTime();
    };
    //timeline动态渲染的实现
    var Timeline = {
        init: function() {
            this.state = STATE_INITAL;
            this.reqId = null;
        },
        /**
         * 计时动画的启动函数
         * @param  {int} interval 动画渲染的启动函数
         */
        start: function(interval) {
            if (this.state === STATE_START) {
                return;
            }
            this.state = STATE_START;
            this.interval = interval || DEDAULT_INTERVAL;
            this.__startTimeline(nowtime());
            return this;
        },

        /**
         * 每一帧动画渲染的具体操作，通常由外部传入
         * @param  {int} time 动画运行到现在的执行时间
         */
        renderFrame: function(time) {},
        /**
         * 启动动画
         * @param  {int} startTime 如果动画从开始播放，那么startTime等于当前事件，
         * 如果是暂停一段时间再播放，那么starttime为nowtime-已经播出的时间
         */
        __startTimeline: function(startTime) {
            this.startTime = startTime;
            var lastTime = nowtime();
            var self = this;
            nextTick();

            function nextTick(timestamp) {
                var now = timestamp || nowtime();
                self.reqId = requestAnimationFrame(nextTick);
                if (now - lastTime < this.interval) {
                    return;
                }
                self.renderFrame.call(self, now - self.startTime);
                lastTime = now;
            }
        },
        stop: function() {
            if (this.state !== STATE_START) {
                return;
            }
            this.state = STATE_STOP;
            if (this.startTime) {
                this.dur = nowtime() - this.startTime;
            }

            if (this.reqId) {
                cancelAnimationFrame(this.reqId);
                this.reqId = null;
            }
        },
        /**
         * 停止后继续上次的动画，延续上次的动画间隔和动画执行事件
         */
        restart: function() {
            if (this.state === STATE_START) {
                return;
            }
            if (!this.dur || !this.interval) {
                return;
            }
            this.state = STATE_START;
            this.__startTimeline(nowtime() - this.dur);
        }

    };

    //Animation的实现
    var Animation = {
        init: function() {},
        anim: function() {},
        repeat:function(){},
        repeatForever:function(){},
        wait:function(){},
        pause:function(){},
        restart:function(){},
        dispose:function(){},
        _add:function(){},
        _runTask:function(){},
    };
    return Animation;

})(window);
