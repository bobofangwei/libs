import FrameAnimation from './frameAnimation';
import Timeline from './timeline.js';

function getById(id) {
    return document.getElementById(id);
}

var imgs = ['../asserts/rabbit-big.png', '../asserts/rabbit-lose.png', '../asserts/rabbit-win.png'];
//第一个动画，兔子一直在原地走动
function anim1() {
    var anim = Object.create(FrameAnimation);
    anim.init();
    var rabit1 = getById('rabit1');
    var rightRunningMap = ["0 -854", "-174 -852", "-349 -852", "-524 -852", "-698 -851", "-873 -848"];

    anim.loadImages(imgs).changePosition(rabit1, rightRunningMap, imgs[0]).repeatForever();
    anim.start(300);
    var running = true;
    rabit1.addEventListener('click', function() {
        if (running) {
            console.log('用户点击了stop');
            anim.stop();
        } else {
            anim.restart();
        }
        running = !running;
    });
}
anim1();

//第三个动画，兔子做出胜利的手势
function anim3() {
    var rabit3 = getById('rabit3');
    var rabbitWinPositions = ["0 0", "-198 0", "-401 0", "-609 0", "-816 0", "0 -96", "-208 -97", "-415 -97", "-623 -97", "-831 -97", "0 -203", "-207 -203", "-415 -203", "-623 -203", "-831 -203", "0 -307", "-206 -307", "-414 -307", "-623 -307"];
    console.log(rabbitWinPositions.length);
    var anim = Object.create(FrameAnimation);
    anim.init();
    anim.loadImages(imgs).changePosition(rabit3, rabbitWinPositions, imgs[2]).then(function() {
        console.log('rabit win!');
    });
    anim.start(300);
}
anim3();

//第四个动画，兔子失败
function anim4() {
    var rabit4 = getById('rabit4');
    var rabbitLoseMap = ["0 0", "-163 0", "-327 0", "-491 0", "-655 0", "-819 0", "0 -135", "-166 -135", "-333 -135", "-500 -135", "-668 -135", "-835 -135", "0 -262"];
    var anim = Object.create(FrameAnimation);
    anim.init();
    anim.loadImages(imgs).changePosition(rabit4, rabbitLoseMap, imgs[1]).then(function() {
        console.log('rabit lose!');
    });
    anim.start(300);
}
anim4();

//第二个动画，兔子向右走
function anim2() {
    var rabit2 = getById('rabit2');
    var rightRunningMap = ["0 -854", "-174 -852", "-349 -852", "-524 -852", "-698 -851", "-873 -848"];
    var leftRunningMap = ["0 -373", "-175 -376", "-350 -377", "-524 -377", "-699 -377", "-873 -379"];
    var rabbitWinPositions = ["0 0", "-198 0", "-401 0", "-609 0", "-816 0", "0 -96", "-208 -97", "-415 -97", "-623 -97", "-831 -97", "0 -203", "-207 -203", "-415 -203", "-623 -203", "-831 -203", "0 -307", "-206 -307", "-414 -307", "-623 -307"];
    var anim = Object.create(FrameAnimation);
    anim.init();
    var right = true;
    var initLeft = 100;
    var endLeft = 400;
    var frames = 6; // 无论是向右走还是向左走的动作都是有6帧
    var curFrame = 0;
    var curLeft = initLeft;
    var speed = 1;
    var ratio = 30; //控制步长，将时间同比缩小的有一个比例
    var position;
    // 通过right（闭包）来控制前进的方向
    // 第一次向右边走
    // 调用repeat实现向左走
    anim.loadImages(imgs).enterFrame(function(next, time) {
        if (right) {
            position = rightRunningMap[curFrame].split(' ');
            curLeft = Math.min(initLeft + time / ratio * speed, endLeft);
            if (curLeft >= endLeft) {
                right = false;
                curFrame = 0;
                next();
                return;
            }
        } else {
            position = leftRunningMap[curFrame].split(' ');
            curLeft = Math.max(endLeft - time / ratio * speed, initLeft);
            if (curLeft <= initLeft) {
                right = true;
                curFrame = 0;
                next();
                return;
            }

        }
        if (++curFrame >= frames) {
            curFrame = 0;
        }
        rabit2.style.backgroundImage = 'url(' + imgs[0] + ')';
        rabit2.style.left = curLeft + 'px';
        rabit2.style.backgroundPosition = position[0] + 'px ' + position[1] + 'px';
    }).repeat(1).wait(2000).changePosition(rabit2, rabbitWinPositions, imgs[2]);
    anim.start(200);
}
anim2();
