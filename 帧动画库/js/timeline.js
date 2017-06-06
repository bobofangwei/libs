var Timeline = (function(window, undefined) {

    var DEDAULT_INTERVAL = 1000 / 60;
    //动画开始（进行中)
    var STATE_START = 1;
    //动画停止
    var STATE_STOP = 2;
    //初始化
    var STATE_INITIAL = 0;

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

    var Timeline = {
        init: function() {
            this.state = STATE_INITIAL;
            this.reqId = 0;
        },
        /**
         * 时间轴每次回调执行的函数
         * @param  {Number} time 从动画开始到当前执行时间
         */
        onenterFrame: function(time) {},

        /**
         * 动画开始
         * @param {Number} 每次回调的间隔时长
         */
        start: function(interval) {
            if (this.state === STATE_START) {
                return;
            }
            this.state = STATE_START;
            this.interval = interval || DEDAULT_INTERVAL;
            this.__startTimeline(+new Date());
        },
        /**
         * 时间轴动画启动函数
         * @param  {Number} startTime 动画开始事件
         */
        __startTimeline: function(startTime) {
            this.startTime = startTime;
            //记录上一次回调的时间戳
            var lastTick = +new Date();
            var self = this;
            nextTick();
            /**
             * 每一帧执行的函数
             */
            function nextTick() {
                var now = +new Date();
                self.reqId = requestAnimationFrame(nextTick);

                //requestAnimation大约17ms执行一次
                //有时候不需要如此高频率的执行
                //只有当前时间和上一次的时间间隔>设置的interva
                //本次才可以执行
                if (now - lastTick >= self.interval) {
                    self.onenterFrame(now - self.startTime);
                    lastTick = now;
                }
            }
            nextTick.interval = this.interval;

        },

        /**
         * 动画停止
         */
        stop: function() {
            if (this.state !== STATE_START) {
                return;
            }
            this.state = STATE_STOP;
            //如果动画开始过，记录动画从开始到现在是将长度
            if (this.startTime) {
                this.dur = (+new Date()) - this.startTime;
            }
            cancelAnimationFrame(this.reqId);
        },

        /**
         * 重新开始动画
         * @return {[type]} [description]
         */
        restart: function() {
            if (this.state === STATE_START) {
                return;
            }
            if (!this.dur || !this.interval) {
                return;
            }
            this.state = STATE_START;
            //无缝连接动画
            this.__startTimeline(+newDate() - this.dur);
        },

    };
    return Timeline;

})(window);
