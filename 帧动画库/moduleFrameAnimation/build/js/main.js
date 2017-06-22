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
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__loadImages__ = __webpack_require__(1);

var imgs = ['https://gss0.bdstatic.com/5bVWsj_p_tVS5dKfpU_Y_D3/res/r/image/2017-05-16/bfe803a94c949fe78ba634b51bf2395c.jpg'];
__WEBPACK_IMPORTED_MODULE_0__loadImages__["a" /* default */](imgs, function() {
    console.log('加载完毕');
});


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var _id = 0;
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
        item.id = '_img_' + (++_id);
        item.img.onload = loadHandler(item);
        item.img.onerror = errorHandler(item);        
        window[item.id] = item;
        count++;
    }
    if (!count) {
        done(success);
    }
    if (timeout) {
        timeoutId = setTimeout(timeoutHandler, timeout);
    }

    function loadHandler(item) {
        success = success && true;
        done(item);
    }

    function errorHandler(item) {
        success = false;
        done(item);
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
/* harmony default export */ __webpack_exports__["a"] = (loadImage);


/***/ })
/******/ ]);