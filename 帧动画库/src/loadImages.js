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
export default loadImage;
