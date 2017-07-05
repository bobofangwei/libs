
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
export { requestAnimationFrame, cancelAnimationFrame, getStyle, setStyle };
