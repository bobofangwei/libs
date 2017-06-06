var Animation = (function(window, undefined) {
    //初始化状态
    var STATE_INITIAL = 0;
    //动画启动状态
    var STATE_START = 1;
    //动画终止状态
    var STATE_STOP = 2;

    //同步任务
    var TASK_SYNC = 0;
    var TASK_ASYNC = 1;

    //封装一个函数，用于执行回调函数
    function next(callback) {
        callback && callback();
    }

    var Animation = {
        init: function() {
            this.taskQueue = [];
            this.index = 0;
            this.state = STATE_INITIAL;
            this.timeline = Object.create(Timeline);
            this.timeline.init();
        },

        /**
         * 实现图片预加载 
         * @param  {Array} imgList 图片数组
         * @return {Animation}         返回this，链式调用
         */
        loadImages: function(imgList) {
            //后面改为模块儿化的写法
            var loadImage = window.loadImage;
            var taskFn = function(next) {
                loadImage(imgList.slice(0), next);
            };
            var type = TASK_SYNC;
            return this._add(taskFn, type);
        },

        /**
         * 添加一个异步定时任务，通过定时改变图片背景位置，实现帧动画
         * @param  {dom对象} ele       
         * @param  {Array} positions 背景位置数组
         * @param  {string} imgUrl    图片地址
         * @return {Animation}           this
         */
        changePosition: function(ele, positions, imgUrl) {
            var len = positions.length;
            var taskFn;
            var type;
            if (len) {
                var self = this;
                taskFn = function(next, time) {
                    if (imgUrl) {
                        ele.style.backgroundImage = 'url(' + imgUrl + ')';
                    }
                    //这一句貌似有问题，再次启动的时候不能回到第一帧
                    //|0相当于向下取整，等同于Math.floor
                    var index = Math.min(time / self.interval | 0, len - 1);
                    var position = positions[index].split(' ');
                    //改变dom对象背景图片位置
                    ele.style.backgroundPosition = position[0] + 'px ' + position[1] + 'px';
                    if (index === len - 1) {
                        next();
                    }
                    type = TASK_ASYNC;

                };
            } else {
                taskFn = next;
                type = TASK_SYNC;
            }
            return this._add(taskFn, type);
        },

        /**
         * 添加一个异步定时任务，通过定时改变img标签src属性，实现帧动画
         * @param   ele     
         * @param  imgList 
         * @return         
         */
        changeSrc: function(ele, imgList) {
            var len = imgList.length;
            var taskFn;
            var type;
            if (len) {
                var self = this;
                taskFn = function(next, time) {
                    var index = Math.min(time / self.interval | 0, len - 1);
                    ele.src = imgList[index];
                    if (index === len - 1) {
                        next();
                    }
                };
                type = TASK_ASYNC;

            } else {
                taskFn = next;
                type = TASK_SYNC;
            }
            this._add(taskFn, type);
        },

        /**
         * 高级用法，添加一个异步定时执行任务
         * 该任务自定义动画每帧执行的任务函数
         * @param  {Function} taskFn 
         * @return {Animation}        
         */
        erterFrame: function(taskFn) {
            return this._add(taskFn, TASK_ASYNC);
        },

        /**
         * 添加一个同步任务，在上一个任务完成后执行回调
         * @param  {Function} callback 回调函数
         * @return {Animation}          this
         */
        then: function(callback) {
            var taskFn = function(next) {
                callback();
                next();
            };
            var type = TASK_SYNC;
            return this._add(taskFn, type);
        },

        /**
         * 开始执行任务
         * @param  {Number} interval 定时任务执行间隔，单位ms
         * @return {Animation}        this
         */
        start: function(interval) {
            if (this.state === STATE_START) {
                return this;
            }
            if (!this.taskQueue.length) {
                return this;
            }
            this.state = STATE_START;
            this.interval = interval;
            this._runTask();
            return this;
        },

        /**
         * 添加一个同步任务，该任务回退到上一个任务
         * 实现重复上一个任务的效果，可以定义重复次数
         * @param  {Number} times 重复次数
         * @return {Animation}    this
         */
        repeat: function(times) {
            var self = this;
            var taskFn = function() {
                if (typeof times === 'undefined') {
                    //无限循环上一个任务
                    self.index--;
                    self._runTask();
                    return;
                }
                if (times) {
                    times--;
                    self.index--;
                    self._runTask();
                } else {
                    //达到重复次数
                    var task = self.taskQueue[self.index];
                    self._next(task);
                }
            }
            var type = TASK_SYNC;
            return this._add(taskFn, type);
        },

        /**
         * repeat的一个友好接口，实现无限重复
         * @return {Animation} this
         */
        repeatForever: function() {
            return this.repeat();
        },

        /**
         * 设置当前任务结束后到下一个任务开始前的等待时长
         * @param  {Number} time 等待时长
         * @return {Animation}    this
         */
        wait: function(time) {
            if (this.taskQueue && this.taskQueue.length > 0) {
                this.taskQueue[this.taskQueue.length - 1].wait = time;
            }

            return this;
        },

        /**
         * 暂停当前异步定时任务
         * @return {Animation}    this
         */
        pause: function() {
            if (this.state === STATE_START) {
                this.state = STATE_STOP;
                this.timeline.stop();
                return this;
            }
            return this;
        },

        /**
         * 重新执行上一次暂停的异步任务
         * @return {Animation}    this
         */
        restart: function() {
            if (this.state === STATE_STOP) {
                this.state = STATE_START;
                this.timeline.restart();
                return this;
            }
            return this;
        },

        /**
         * 释放资源，如计时器等
         * @return {Animation}    this
         */
        dispose: function() {
            if(this.state!==STATE_INITIAL){
                this.state=STATE_INITIAL;
                this.taskQueue=null;
                this.timeline.stop();
                this.timeline=null;
                return this;
            }
            return this;
        },
        /**
         * 添加一个任务到任务列表中
         * @param {Function} taskFn 任务方法
         * @param {String} type   任务类型
         */
        _add: function(taskFn, type) {
            this.taskQueue.push({
                type: type,
                taskFn: taskFn
            });
            return this;
        },
        /**
         * 执行任务
         */
        _runTask: function() {
            if (!this.taskQueue || this.state !== STATE_START) {
                return;
            }
            //任务执行完毕
            if (this.index === this.taskQueue.length) {
                this.dispose();
                return;
            }
            //获取当前任务
            var task = this.taskQueue[this.index];
            if (task.type === TASK_SYNC) {
                this._syncTask(task);
            } else {
                this._asyncTask(task);
            }
        },
        /**
         * 执行同步任务
         */
        _syncTask: function(task) {

            var self = this;
            var next = function() {
                //切换到下一个任务
                self._next(task);
            };
            var taskFn = task.taskFn;
            taskFn(next);
        },
        /**
         * 执行异步任务
         */
        _asyncTask: function(task) {
            var self = this;
            //time表示从动画开始到现在执行的时间
            //enterFrame定义每一帧执行的回调函数
            var enterFrame = function(time) {
                var taskFn = task.taskFn;
                var next = function() {
                    //停止当前任务
                    self.timeline.stop();
                    //执行下一个任务
                    self._next(task);
                };
                taskFn(next, time);
            };
            this.timeline.onenterFrame = enterFrame;
            this.timeline.start(this.interval);
        },
        /**
         * 切换到下一个任务,支持如果当前位置需要等待，则延迟执行
         * @param task 当前任务
         */
        _next: function(task) {
            this.index++;
            var self = this;
            task.wait ? setTimeout(function() {
                self._runTask();
            }, task.wait) : this._runTask();
        }
    };
    return Animation;
})(window);
