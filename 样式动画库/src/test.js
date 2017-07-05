import Animation from './animation.js';

var getById = function(id) {
    return document.getElementById(id);
};
getById('btn1').addEventListener('click', function() {
    var anim = Object.create(Animation);
    anim.init('#div1');
    anim.animate({ 'left': 300, 'opacity': 0.2 }, { duration: 2000 });
});
getById('btn2').addEventListener('click', function() {
    var anim = Object.create(Animation);
    anim.init('#div2');
    anim.animate({ 'left': 300 }, { duration: 2000 }).animate({ 'left': 150 });
});
getById('btn3').addEventListener('click', function() {
    var anim = Object.create(Animation);
    anim.init('#div3');
    anim.animate({ 'left': 300 }, { duration: 2000 }).reverse();
});
getById('btn4').addEventListener('click', function() {
    var anim = Object.create(Animation);
    anim.init();
    var animSeq = [{
        el: '#div4',
        p: { 'left': 300, 'opacity': '0.2' },
        o: { 'diration': 2000 }
    }, {
        el: '#div4',
        p: { 'height': 300 },
    }];
    anim.runSequence(animSeq);
});
getById('btn5').addEventListener('click', function() {
    var anim = Object.create(Animation);
    anim.init('#div5');
    anim.animate({ 'left': 300 }, { duration: 2000 }).finish();
});
