import loadImages from './loadImages';
import Timeline from './timeline.js';

const STATE_INITAL = 'inital';
const STATE_START = 'start';
const STATE_STOP = 'stop';
const TASK_SYNC = 'sync'; //所谓同步任务，是不需要开启定时器执行的，图片加载，事件等，在这里不被视为异步任务
const TASK_ASYNC = 'async'; //所谓异步任务，是需要开启定时器执行的，也就是需要开启timeline

var FrameAnimation = {
    init: function() {
        this.taskQueue = [];
        this.timeline = Object.create(Timeline);
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
            loadImages(imgList, next);
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

export default FrameAnimation;
