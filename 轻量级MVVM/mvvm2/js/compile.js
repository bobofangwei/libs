//compile要做的事情是解析模板view，将模板中的变量替换为数据，渲染页面视图；
//将每个指令对应的节点绑定更新函数，添加监听数据的订阅者，一旦数据有变动，收到通知，更新视图
var Compile = {
    init: function(el, vm) {
        this.$vm = vm;
        this.$el = this.isElementNode(el) ? el : document.querySelector(el);
        if (this.$el) {
            this.$fragment = this.node2Fragment(this.$el);
            //使用fragment使得要更新的页面从页面暂时脱离，可以提高性能
            //解析页面
            this.compile(this.$fragment);
            this.$el.appendChild(this.$fragment);
        }
    },
    isElementNode: function(el) {
        return el.nodeType && el.nodeType === 1;
    },
    isTextNode: function(el) {
        return el.nodeType && el.nodeType === 3;
    },
    node2Fragment: function(el) {
        var fragment = document.createDocumentFragment();
        while (el.firstChild) {
            //appendChild相当于移动节点
            fragment.appendChild(el.firstChild);
        }
        return fragment;
    },
    compile: function(el) {
        var childs = el.childNodes;

        for (var i = 0, len = childs.length; i < len; i++) {
            var child = childs[i];
            if (this.isElementNode(child)) {
                this.compileNode(child);
            } else if (this.isTextNode(child) && child.data.match(/\{\{(.+)\}\}/)) {
                this.compileText(child, this.$vm, RegExp.$1);
            }
            if (child.childNodes && child.childNodes.length) {
                this.compile(child);
            }
        }
    },
    //解析文本节点
    compileText: function(el, vm, props) {
        this.bind(el, vm, props, 'text');
    },
    //解析元素节点
    compileNode: function(el) {
        var attrs = el.attributes,
            self = this;
        [].slice.call(attrs).forEach(function(attr, i) {
            var attrName = attr.name;
            //指令的形式诸如：v-text,v-html,v-class,v-model
            //事件指令的形式诸如：v-on:click,v-on:keyup等
            if (self.isDirective(attrName)) {

                var dir = attrName.slice(2),
                    props = attr.value;
                if (self.isEventDirective(dir)) {
                    self.eventHandler(el, self.$vm, props, dir);
                } else {
                    self.bind(el, self.$vm, props, dir);

                }
            }
        });

    },
    eventHandler: function(el, vm, props, dir) {
        //v-on:click的形式
        var eventType = dir.split(':')[1],
            fn = vm.methods && vm.methods[props];
        //这里尚不明白为啥将事件处理函数执行的上下文确定成了vm   
        //参数e，自动传给了fn 
        el.addEventListener(eventType, fn.bind(vm), false);
    },
    /*
     * @param el：对应的元素
     * @param vm：对应的vue（MVVM）实例
     * @param props:对应data中的属性路径
     * @dir:对应vue中的指令，有text,class,html,model等
     */
    //这里暂停，因为对于model的处理比较特殊
    bind: function(el, vm, props, dir) {

        var updater = Updaters[dir + 'Updater'],
            self = this;
        //执行首次更新
        //首次更新的时候，Model和class不涉及oldvalue的值
        updater && updater(el, this._getVMVal(vm, props));
        //如果是modal还需要监听对应元素的input事件
        //input与keyup的区别，
        if (dir === 'model') {
            el.addEventListener('input', function(e) {
                var value = this.value;
                self._setVMVal(vm, props, value);
            }, false);
        }
        //对每一个vm指令指定的属性，进行监听，创建其对应的订阅者watcher
        var watcher=Object.create(Watcher);

        watcher.init(vm,props,function(value,oldValue){
            //参数el在这个地方传递
            //参数value,oldValue在watcher中赋值
            updater&&updater(el,value,oldValue);
        });
    },
    //判断属性是否是指令
    isDirective: function(attrName) {
        return attrName.indexOf('v-') === 0;
    },
    isEventDirective: function(dir) {
        return dir.indexOf('on') === 0;
    },
    _getVMVal: function(vm, props) {
        var val = vm.data,
            propArr = props.split('.');
        propArr.forEach(function(k) {
            val = val[k];
        });
        return val;
    },
    _setVMVal: function(vm, props, value) {
        var val = vm.data,
            propArr = props.split('.');
        propArr.forEach(function(k, i) {
            if (i === propArr.length-1) {
                val[k] = value;
            } else {
                val = val[k];
            }
        });
    },


};


//真正的页面渲染操作，处理页面更新
var Updaters = {
    textUpdater: function(node, value) {
        node.textContent = typeof value === 'undefined' ? '' : value;
    },
    htmlUpdater: function(node, value) {
        node.innerHTML = typeof value === 'undefined' ? '' : value;
    },
    classUpdater: function(node, value, oldValue) {
        if (oldValue) {
            removeClass(node, oldValue);
        }
        addClass(node, value);
    },
    modelUpdater: function(node, value, oldValue) {
        node.value = typeof value === 'undefined' ? '' : value;
    }

};