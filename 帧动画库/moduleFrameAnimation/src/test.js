import FrameAnimation from './frameAnimation';

function getById(id) {
    return document.getElementById(id);
}

var imgs = ['../asserts/rabbit-big.png', '../asserts/rabbit-lose.png', '../asserts/rabbit-win.png'];

function anim1() {
    var anim = Object.create(FrameAnimation);
    anim.init();
    var rabit1 = getById('rabit1');
    var rightRunningMap = ["0 -854", "-174 -852", "-349 -852", "-524 -852", "-698 -851", "-873 -848"];
    anim.loadImages(imgs.splice(0, 1)).changePosition(rabit1, rightRunningMap).repeat();
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
