# Animation.js

封装基本的javascript动画库
1. 支持链式调用
2. 支持预定义动画序列
3. 支持直接到达动画终点
4. 支持动画反转  
[DEMO](https://bobofangwei.github.io/libs/%E6%A0%B7%E5%BC%8F%E5%8A%A8%E7%94%BB%E5%BA%93/build/index.html)

## 一、用法介绍
### 初始化
```
var anim = Object.create(Animation);
anim.init('#div2');
```
### 接口介绍
+ `animate(props,[opts])`:动画启动的入口函数
    + 参数`props`：Object类型，对象的key为动画属性，如left,width等。对象的value可以是数值类型或者数组类型，如果是数值类型，则代表动画结束时的属性值，如果是数组类型，数组中两个元素分别定义动画开始值、结束值
    + 参数opts：Object类型，此参数可选，定义动画的相关配置项，包括：
        + `duration`:动画持续时长
        + `easing`:动画缓动函数
        + `next`:动画执行完毕的回调
+ `reverse()`:动画反转，回到动画开始前的状态
+ `fininsh()`:直接到达动画的最终状态
+ `stop()`:停止动画
+ `runSequence([animList])`:执行预定义动画序列
    参数`animList`代表预定义的动画序列，数组类型，数组成员为Object类型，数组成员示例如下：
    ```
    {
        el: '#div4',//定义动画作用的dom元素
        p: { 'left': 300, 'opacity': '0.2' },//定义动画结束状态
        o: { 'diration': 2000 }//定义动画相关配置
    }
    ```


## 二、实现心得
1. 动画库实现的一个难点在于动画队列自执行的时序控制，本实现中借鉴了jQuery队列的思想，利用shift/unshift标志位RUNNING,来控制动画队列的入队和出队，之前也尝试过基于回调和isRuning标志变量，逐步思考和优化的过程可以参见此篇博客：  
[循序渐进，完善javascript动画库](http://www.cnblogs.com/bobodeboke/p/6736406.html)
2. 动画本身是一个异步执行的过程，很自然地想到能否和promise相结合，这方面的探讨，同样可参见上述博客
3. 可以将此基本动画库的实现与帧动画库的实现进行对比
    + 基本动画库每一次NextTick的操作，由动画缓动函数确定样式当前值，更新对应的样式属性；而帧动画库每一次nextTick的操作，则由用户自定义，常见的如更改背景图片的位置等等
    + 基本动画库样式重绘（nextTick）调用的频率高，一般采用浏览器默认的reqeustAnimationFrame的频率；而帧动画库两帧之间的间隔，一般由用户根据实际情况传入，一般情况下远大于reqeustAnimationFrame的频率
    + 基本动画库动画队列中每一个动画任务执行完成的时机通过比较passedTime与duration，出队和入队操作由系统整体控制，动画队列中的每一个动画任务函数无需处理。而帧动画库需要由动画任务函数自行判断动画完成时机，调用next函数执行下一个动画人物
    + 此基本动画库中的动画任务执行之前自动出队，而帧动画库为了实现repeat的效果，动画队列中始终持有每一个动画任务函数，需要在整个动画队列中的动画任务都执行完毕时，调用dispose释放系统资源
## 三、待改进之处
+ 此基本动画库目前仅支持`opacity`属性和属性值单位为px的相关属性，尚不支持`color,backgroundColor`等样式
+ 此基本动画库目前尚不支持transform动画效果
