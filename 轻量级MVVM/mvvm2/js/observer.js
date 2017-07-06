var Observer = {
    init: function(data) {
        if (!isObject(data)) {
            return;
        }
        this.data = data;
        this.walk();
    },
    walk: function() {
        for (var key in this.data) {
            var val = this.data[key];
            this.observe(val); //对子属性加以检测
            this.convert(key, val); //
        }
    },
    observe: function(val) {
        var ob = Object.create(Observer);
        ob.init(val);
    },
    convert: function(key, val) {
        //为每一个key都定义一个事件管理对象dep
        var self = this,
            dep = Object.create(Dep);
            dep.key=key;
        dep.init();
        Object.defineProperty(this.data, key, {
            configurable: true,
            enumerable: true,
            get: function() {
                console.log(key + '被get调用了');
                //由于需要在闭包内添加watcher，所以通过Dep定义一个全局target属性，暂存watcher, 添加完移除
                if (Dep.target) {
                    //dep.depend()——>实际上watcher.addDep(this)——>dep.addSub(watcher);
                    //之所以这样做，是因为watcher是在
                    dep.depend();
                }
                return val;
            },
            set: function(newVal) {
                if (newVal === val) {
                    return;
                }
                console.log(key + '被set调用了，赋值为' + newVal);
                //原来的对象val失去了引用，会被垃圾回收机制回收，不需要unobserve
                self.observe(newVal); //对新添加的属性加以监控
                val = newVal;
                dep.notify();
            },
        });
    },


};

//消息管理器，管理所有的订阅者sub
//sub是watcher的对象
//Dep.target也是watcher的对象
var uid = 0;
var Dep = {
    init: function() {
        this.id = uid++;
        this.subs = []; //保存所有订阅者的数组
    },
    removeSub: function(sub) { //删除订阅者
        var index = this.subs.indexOf(sub);
        if (index >= 0) {
            this.subs.splice(index, 1);
        }
    },
    addSub:function(sub){
        this.subs.push(sub);
    },
    notify: function() {
        this.subs.forEach(function(sub, index) {
            sub.update();
        });
    },
    depend: function() {
        //Dep.target是watcher对象
        //订阅者sub也是watcher对象
        Dep.target.addDep(this);
    }
};
////由于需要在闭包内添加watcher，所以通过Dep定义一个全局target属性，暂存watcher, 添加完移除
Dep.target = null;