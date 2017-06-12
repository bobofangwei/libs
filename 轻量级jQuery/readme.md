# 轻量级jQuery
## 一、概况
该轻量级的jQuery是通过阅读jQuery源代码，舍弃了源代码中
+ 对兼容性的大部分处理
+ 和sizzele有关的逻辑
+ 对部分复杂的逻辑进行了简化

实现的jQuery的部分模块。

## 二、模块组成
整体而言，该版本的轻量级jQuery,基本上参照jQuery源代码的实现方式，逐行进行了剖析和实现，目前的版本包括以下模块：
+ jQuery初始化模块
+ jQuery静态属性和方法模块
+ jQuery实例属性和方法模块
+ jQuery回调函数callbacks模块
+ jQuery异步回调defered模块
+ jQueyr数据缓存Data模块
+ jQuery队列模块
+ jQuery属性操作模块
+ jQuery事件模块

而对于jQuery中其他同样很重要的模块，由于时间的原因，尚没有深入研究，这些模块包括：
+ 选择器sizzle模块
+ DOM遍历模块
+ DOM操作模块
+ 样式操作模块
+ 异步请求Ajax模块
+ 动画Animation模块
+ 位置相关模块

这些模块，尤其是动画模块，ajax模块，其重要性不言而喻，相信能从中学到不少东西，留待后续时间允许的条件下一一补充。

## 三、源代码阅读及实现心得
以下是自己在jQuery源代码阅读和轻量级jQuery实现过程中总结的部分心得，大部分发表在自己阅读过程中撰写的博客上，这里整理如下：
1. [jQuery总体结构及jQuery构造函数](http://www.cnblogs.com/bobodeboke/p/5938847.html)  
这部分主要介绍了jQuery整体概况，模块组成，并解决了自己之前一个疑惑：  
为什么jQuery实例可不通过new直接调用其相关方法？
2. [jQuery静态方法和属性](http://www.cnblogs.com/bobodeboke/p/5941097.html)  
这部分封装了jQuery的一些静态公共方法，诸如jQuery.extend,jQuery.makeArray,jQuery.merge,jQuery.isPlainObject，类型判断等等。对于后续自己工程中实现类似功能，有很大的借鉴意义。
3. [jQuery实例方法及属性](http://www.cnblogs.com/bobodeboke/p/5950816.html)
4. [jQuery回调模块callbacks](http://www.cnblogs.com/bobodeboke/p/5978837.html)
5. [jQuery异步队列模块defered](http://www.cnblogs.com/bobodeboke/p/5994453.html)
6. [jQuery异步队列中的when](http://www.cnblogs.com/bobodeboke/p/5997509.html)  
建议4,5,6这三个模块结合起来看，可以说这算是ES6中promise的前身。由于ES6promise的具体实现并未开源，也可以从jQuery对promise和Defered的封装中窥见一些其中的实现原理。而且这部分的具体实现中有很多巧妙的思路，十分具有借鉴意义。
7. [jQuery数据缓存模块Data](http://www.cnblogs.com/bobodeboke/p/6014247.html)  
数据缓存模块是Jquery中很多其他模块，诸如动画模块，事件处理模块的基础。
8. [jQuery队列模块](http://www.cnblogs.com/bobodeboke/p/6014247.html)  
jQuery队列模块中的很多思想，诸如封装next作为回调的参数，利用inprogress判断动画是否在执行，在自己后续利用javascript封装动画库的过程中，发现有不少jQuery源代码中思想的影子。
9. [jQuery属性操作模块](http://www.cnblogs.com/bobodeboke/p/6039550.html)
10. [jQuery事件模块](http://www.cnblogs.com/bobodeboke/p/6060060.html)  
为了实现事件代理、事件模拟触发、支持事件命名空间等功能，jQuery事件模块对事件监听函数的处理十分巧妙。任何类型的事件绑定的是同一个主监听函数eventHandler,并基于事件缓存，实现了对元素上绑定的所有事件的集中管理。

## 四、关于阅读源码这种学习方式的反思
其实对于新手，不太建议这种方法，自己的实际经验告诉我。对于水平尚未达到一定境界的大部分前端开发人员而言，哪怕读懂了每一句代码含义，对于之所以这么设计的原因，往往并没有自己所认为的那样真正理解，还有待于结合实际经验，才能真正融会贯通。以我为例，jQuery中的很多模块，诸如回调和异步，是自己在学习ES6promise的过程中才读懂作者如此封装的深意。而队列模块的很多设计，也是在自己基于javascript封装动画库的过程中，才恍然大悟。这也是自己暂且搁置后续模块的阅读，将重心转移的一个原因，不过希望后续，自己能继续将这个jQuery源码阅读和实现系列一一补齐。



