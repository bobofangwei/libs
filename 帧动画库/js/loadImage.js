var loadImage = (function(window, undefined) {
    var id = 0;
    var STATUS_LOADING = 'loading';
    var STATUS_LOADED = 'loaded';
    var STATUS_ERROR = 'error';

    function __getId() {
        return ++id;
    }
    /**
     * 预加载图片函数
     * @param  {Array|Object}   images   加载图片的数组或者对象
     * @param  {Function} callback 所有图片加载完成后的回调
     * @param  {Number}   timeout  加载超时时长
     */
    function loadImage(images, callback, timeout) {
        //加载图片的计数器
        var count = 0;
        //全部图片加载完成的一个标志位
        var success = true;
        //超时timer的计数器
        var timeoutId = 0;
        //是否加载超时的标志位
        var isTimeout = false;

        for (var key in images) {
            if (!images.hasOwnProperty(key)) {
                continue;
            }
            //期望格式是object:{src:xxx}
            var item = images[key];
            //格式修正
            if (typeof key === 'string') {
                item = images[key] = {
                    src: item
                };
            }
            if (!item || !item.src) {
                continue;
            }
            count++;
            item.id = '__img__' + key + __getId();
            //设置在window下，便于回收资源
            item.img = window[item.id] = new Image();
            doLoad(item);
        }
        //遍历完成如果计数器为0，直接调用回调
        if (!count) {
            callback(success)
        } else if (timeout) {
            timeoutId = setTimeout(onTimeout, timeout);
        }
        /**
         * 超时函数
         * @return {[type]} [description]
         */
        function onTimeout() {
            isTimeout = true;
            callback(false);
        }

        /**
         * 真正进行图片加载
         * @param  {Object} item 图片元素对象
         */
        function doLoad(item) {
            item.status = STATUS_LOADING;
            var img = item.img;
            img.src = item.src;
            //图片加载成功回调
            img.onload = function() {
                success = success && true;
                item.status = STATUS_LOADED;
                document.body.appendChild(img);
                done();
            };
            //图片加载失败回调
            img.onerror = function() {
                success = false;
                item.status = STATUS_ERROR;
                done();
            };

            function done() {
                img.onload = img.onerror = null;
                try {
                    delete window[item.id];
                } catch (e) {

                }
                //每张图片加载完成，计数器-1
                //当所有图片加载完成并且没有超时的情况下
                //清楚超时定时器，执行回调函数
                if (!--count && !isTimeout) {
                    clearTimeout(timeoutId);
                    callback(success);
                }

            }
        }

    }
    return loadImage;

})(window);
