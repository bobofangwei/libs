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
