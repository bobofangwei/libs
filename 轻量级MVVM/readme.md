# 写在前面
通过逐行实现一个轻量级的MVVM库，探讨热门MVVM框架如vue的实现原理，解答以下问题：
1. 什么是MVVM？
2. 什么是双向绑定？
3. MVVM如何实现双向数据绑定？
4. MVVM中层次较深的属性更改，是如何如冒泡般向上传递的？
5. MVVM中的指令如{{}},v-text等是如何解析的？
6. MVVM框架Vue源码简单分析  
[源代码](https://github.com/bobofangwei/libs/tree/master/%E8%BD%BB%E9%87%8F%E7%BA%A7MVVM)  
需要指出的是，本代码实现探究的这些问题仅是MVVM框架最本质同时也是最基础的部分特性，整体来说相对简陋，远未覆盖一个完整MVVM库的方方面面，其他诸如数组，组件，计算属性,过渡等等在这里暂不做探讨。  

本实现提供了两种MVVM实现的简单版本：
1. MVVM1文件夹中相关代码是MVVM框架的一种简化实现，重点探讨了双向数据绑定、深层属性更改向上传递的原理，指令解析方面仅探讨了{{}}这一种指令；
2. MVVM2文件夹中相关代码是借鉴了vue源代码的架构，实现了与Vue类似的简化版的Observer,Compile,Watcher等对象，以及Dep，Render等

## 一、什么是MVVM？
所谓MVVM是指M(model,数据)-V(view,视图)-VM(view-model),MVVM的起源可以追溯到后台的相关设计理念。  
分层架构诸如MVC，在后台架构设计中屡见不鲜，前端的MVVM也是借鉴了后端MVC，MVP等分层设计思想，关于三者的区别可以参见阮一峰大牛的这篇博客：  
[MVC,MVP与MVVM](http://www.ruanyifeng.com/blog/2015/02/mvcmvp_mvvm.html)
## 二、什么是双向绑定？
双向数据绑定是MVVM最本质的特性。  
### 何谓双向数据绑定？
双向绑定是指model（数据）和view（视图）之间的双向绑定，该双向绑定是通过view-model(数据视图）来完成的。通过双向数据绑定，用户在视图上的修改能够自动同步到数据模型中，同样的，数据模型中的值发生了变化，也能立刻同步到视图中去。  
### 双向数据绑定有何优势？
双向数据绑定的优点是减少了绝大部分的dom操作，整体的编程思想也由原来的命令式代码转为更为关注数据本身。以传统前端开发中两类最常见的数据流为例：
1. 向后台请求数据——>获得数据——>根据后台返回的数据更新对应的DOM结构，有了双向数据绑定，更新DOM结构这样的操作就省略了
2. 在表单操作中，用户交互——>获得表单dom的value——>执行对应操作。有了双向数据绑定，用户在前端完成输入后，不需要手动获取表单dom的value，几乎不用任何操作，就可以拿到用户输入数据放在数据模型中

## 三、如何实现双向数据绑定？
1. **从数据到视图的绑定**：根本思路是基于ES5新出的特性`defineProperty`，结合发布——订阅模式，利用访问器属性`getter`和`setter`截取数据更新的时机，进行数据劫持，在数据发生变更时，发布消息给订阅者，触发相应的监听回调。相关代码片段如下：
```
  Object.defineProperty(this.data, key, {
        enumerable: true,
        configurable: true,
        get: function() {
            return value;
        },
        set: function(newValue) {
            if (value === newValue) {
                return;
            }
            // console.log('调用了set:设置', key + '的新值为' + newValue + ',原来的值是' + value);
            // console.log('set函数执行时的回调函数列表：' + self._cbs);
            self.notify(key
, value,newValue);
            //如果重新设置的newValue是对象的话，需要对该对象加以监听
            //self.unObserve(key, value);
            self.observe(key, newValue);
            value = newValue;
        }
    });
};
```

2. **从视图到数据的绑定**：监听对应表单元素的input或者change事件，当value发生变化时，设置model的值。代码片段如下：
```
if (dir === 'model') {
    el.addEventListener('input', function(e) {
        var value = this.value;
        self._setVMVal(vm, props, value);
    }, false);
}
```
## 四、MVVM中层次较深的属性更改，是如何向上传递的？
诸如`{name:{firstName:bobo}}`希望`firstname`的改变能够向上传递给`name`，那么是如何实现的呢？  
MVVM1下的实现代码中给了一种可行的方法（虽然vue源代码是基于另一种机制，此留待后续讨论），其基本思想是每一个属性的观察者observer对象设置一个属性parent，指向其父属性的观察者对象（有点职责链的思想），当子属性的值发生变化时，沿着职责链递归调用各级属性observer的notify方法。相关代码如下：
```
Observer.observe = function(key, val) {
    //如果深层的value是
    var ob = Object.create(Observer);
    ob.setup(val);
    ob.parent = {
        'ob': this,
        'key': key,
    };

};

Observer.pathDelimiter = '\b';
Observer.notify = function(key, oldValue, newValue) {
    this.emit(key, oldValue, newValue);
    if (this.parent) {
        var ob = this.parent.ob,
            parentKey = this.parent.key;
        // path = parentKey + Observer.pathDelimiter + path;
        //如果想要观察路径，可以打印path
        //递归调用，使得事件向上传递
        ob.notify(key, oldValue, newValue);
    }
}


```

## 五、MVVM中的指令如{{}},v-text等是如何解析的？
简单地说，首先对模板文档进行指令解析。针对每一条指令，为其在相关的属性下注册一条监听函数，具体监听函数的实现由指令代表的语意而定，当属性值重新设置时，发布消息给订阅者，触发对应属性下所有的事件监听函数。
在vue的源代码中，更是将指令执行动作封装为了一个watcher对象。
以MVVM1下对`{{}}`指令的解析来说，相关代码片段如下：
```
var Vue = (function() {
    //完成dom渲染
    var Renders = {
        textRender: {
            update: function(el, value) {
                if (!el.template) {
                    el.template = el.data;
                }
                el.data = el.template.replace(/\{\{([\w\.]+)\}\}/, value);

            }
        }
    };

    var Vue = {
        init: function(option) {
            this.$el = typeof option.el === 'string' ? document.querySelector(option.el) : el;
            this.data = option.data;
            this.$observer = Object.create(Observer);
            this.$observer.setup(this.data);
            this.compile(this.$el);
            // console.log('mvvm:_cbs', this.$observer._cbs);
        },
        //解析相关指令
        compile: function(el) {
            var children = el.childNodes;
            for (var i = 0, len = children.length; i < len; i++) {
                var child = children[i];
                //如果是文本节点
                if (child.nodeType && child.nodeType === 3) {
                    this.compileTextNode(child);
                }
                if (child.childNodes && child.childNodes.length) {
                    this.compile(child);
                }
            }
        },
        compileTextNode(el) {
            var regResult = el.data.match(/\{\{([\w\.]+)\}\}/),
                props, value;
            if (!regResult) {
                return;
            }
            props = regResult[1];
            value = this.getVMval(props);
            Renders.textRender.update(el, value);
            //增加对该属性的监听，对props路径上的每一个属性都要添加监听
            var propsArr = props.split('.');
            this.$observer.$watch(propsArr[propsArr.length - 1], function(oldValue, newValue) {
                Renders.textRender.update(el, newValue);
            });
        },
        getVMval: function(props) {
            var propArr = props.split('.'),
                result;
            for (var i = 0, len = propArr.length; i < len; i++) {
                if (i === 0) {
                    result = this.data[propArr[i]];
                } else {
                    result = result[propArr[i]];
                }

            }
            return result;
        },
        //根据指令，执行对应的渲染操作

    };
    return Vue;
})();
```
## 六、MVVM框架Vue源码简单分析
Vue是通过数据劫持的方式进行双向绑定的，要实现双向绑定，必须实现以下几点：
1. **实现一个数据监听器Observer**，为数据对象model的每一个属性都进行监听，如有变动可拿到最新值通知订阅者，触发相应的监听回调；
2. **实现一个指令解析器Compile**,对每个元素节点的指令进行扫描和解析，如v-text,v-on,{{}},v-model等等。根据指令模板替换数据，以及根据指令模板的语义实现属性更改时需触发的对应的监听函数；
3. **为每一个指令建立对应的watcher**，用于订阅并受到每个属性变动的通知，执行指令绑定的响应回调函数，从而更新视图，这是沟通Observer和Compile的桥梁
4. **MVVM入口函数**，整合上述所有对象  
源代码结构如下：  
![Vue源代码基本架构](https://github.com/bobofangwei/libs/blob/master/%E8%BD%BB%E9%87%8F%E7%BA%A7MVVM/MVVM%E6%9E%B6%E6%9E%84.png)    
更多分析可参见这篇博客：
[剖析Vue原理&实现双向绑定MVVM](https://segmentfault.com/a/1190000006599500)  
当然，最有效的途径还是阅读本目录MVVM2文件夹的源代码，获得更深体会


