# FrameAnimation
[DEMO](https://bobofangwei.github.io/libs/%E5%B8%A7%E5%8A%A8%E7%94%BB%E5%BA%93/build/index.html)  
## 写在前面
1. 本动画库用于实现帧动画，所谓帧动画，是指通过改变雪碧图背景图片的位置，或者图片的src来实现类似gif动图的效果
2. 其源代码和相关素材主要参考了
[animtion](https://bobofangwei.github.io/libs/%E5%B8%A7%E5%8A%A8%E7%94%BB%E5%BA%93/build/index.html)，因此本帧动画库严格来说并非原创，重点在于通过阅读他人源代码,在逐行动手实现的过程中，思考，总结，进而有所收获和升华的过程
3. 为在js中引入模块机制，本帧动画库基于ebpack进行打包

## 调用方法
以下为两个示例,其效果可以参见[DEMO](https://github.com/bobofangwei/libs/tree/master/%E5%B8%A7%E5%8A%A8%E7%94%BB%E5%BA%93)  
1. 一般帧动画都是结合雪碧图实现，动画执行的过程就是更改背景图片位置的过程（每一个图片位置对应一帧），可参考如下示例：
```
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
```
2. 对于单纯地更改背景图片位置不能实现的帧动画，可以利用onEnterFrame这一高级接口自定义每一帧的行为：
```
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
    var ratio = 30; //控制步长，将时间同比缩小的一个比例
    var position;
    // 通过right（闭包）来控制前进的方向
    // 第一次向右边走
    // 调用repeat（1）实现向左走
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
```


## 对外接口
1. `loadImages(imgList)`:图片预加载
2. `changePosition(ele,positions,imgUrl)`：按照一定的时间间隔（时间间隔在start函数中传入）更改背景图片的位置
3. `changeSrc(ele,imgList)`:按照一定时间间隔更改背景图片
4. `enterFrame(taskFn)`:高级用法，自定义定时器执行的每一帧的动作，taskFn有两个参数next(执行下一个动画函数),time(当前动画函数从开始到现在执行的时长）
5. `then(callback)`:插入一个同步执行的函数
6. `wait(time)`:延迟time时长再执行
7. `start(interval)`:帧动画启动函数，预定好执行顺序的帧动画必须调用此方法才可启动，interval为两帧之间的间隔
8. `stop()`:停止帧动画的执行
9. `pause()`：暂停帧动画的执行
10. `restart()`:重启帧动画
11. `repeat([times])`:重复执行上一个帧动画times次，如果times为undefined代表无限重复
12. `repeatForever()`:无限重复执行上一个帧动画的便捷入口，等同于`repeat()`

## 实现心得
一、此帧动画库与样式动画库比较：
1. 此帧动画库的动画需要事先调用上述相关接口方法，预定义动画的执行顺序，再统一调用start方法启动执行，这和样式动画库自动执行动画队列是不同的；
2. 样式动画库的实现中，动画队列在执行完毕后，自动从队列中删除，本帧动画库为了实现repeat()接口，在所有动画都执行完毕时，才清空队列
3. 样式动画库在每一个动画执行完毕后，由程序判断每一个动画函数执行完毕的时机（队列中动画函数对此不作判断），再调用下一个动画函数的出队方法，动画队列执行过程是自动的；而此帧动画库需要在每一个动画函数中手动判断动画停止的时机，手动调用next()方法，来执行下一个动画
4. 代码实现中的不少技巧很具有借鉴意义：
+ 为每个对象定义对应的常量state，如为frameAnimation定义init,start,stop; 为图片预加载定义ok,error,loading等状态
+ 函数队列，将next作为参数传入每一个待执行的函数中，以此来控制函数队列的执行，在jQuery的源代码中，不少地方也有类似的应用

二、其他
1. 如何实现图片预加载
2. 如何实现动画的重复执行、延迟执行
3. 基于requestAnimationFrame和cancelAnimationFrame实现动画时，如何自定义定时器的执行间隔
4. 动画暂停后重启的实现  

  
  