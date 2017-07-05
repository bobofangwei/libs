import tween from './tween.js';
import {
    getStyle,
    setStyle,
} from './util.js';

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
        this.easing = opts && opts.easing || tween.Linear;
        this.initProps = {};
        for (var prop in props) {
            this.propChange[prop] = {};
            if (Array.isArray(props[prop])) {
                this.propChange[prop]['from'] = this.initProps[prop] = props[prop][0];
                this.propChange[prop]['to'] = props[prop][1];
            } else {
                this.propChange[prop]['from'] = this.initProps[prop] = getStyle(this.dom, prop);
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
                setStyle(self.dom, prop, curValue);
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
export default Animation;
