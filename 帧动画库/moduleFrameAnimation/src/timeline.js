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
export default Timeline;
