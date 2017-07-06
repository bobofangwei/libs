//基本思路：
//html中定义的每一个指令v-[direction]=prop，对应着一个prop值发生改变的时候（对prop调用set时），应当调用的direction对应的回调，
//该回调集成在消息订阅者watcher中，（即watcher.update方法）
//可见html中定义的指令的个数和消息订阅watcher的个数相等，是一对一的,这个关系定义在compile.js中
//observer检查各级各个属性，并为各个属性定义一个消息订阅管理器dep，dep可以添加消息订阅者若干个watcher,在set调用的时候，依次调用watcher.update
//可见，dep的个数和属性（包括各级属性）的个数是一对一的，这个关系定义在ovserver.js中
//比较麻烦的是dep和watcher的关联，一个dep（或者说一个属性）可能对应多个watcher，如html中出现v-model=name,同时也有v-text=name等
//watcher与dep的关联在watcher.js和observer.js中实现
//假设针对v-text=name.fristName这样的一条指令
//watcher在get操作中，不仅仅为firstName对应的dep添加回调warcher）
//同时还是props路径上的各级属性（包括name，firstName）对应的dep添加回调watcher
//这是因为父属性的重新赋值，同样会引起子属性的改变，需要调用对应的回调
//试想如果操作name={firstName:1}, 改变了 name.firstName 的值，name.firstName 就是个新属性，则需要将当前watcher(name.firstName)加入到新的 属性的dep里
//其他大部分操作get可能只是取值，无需重复添加wather到dep中，这是addDep中进行判断的原因
//可见，此版本的MVVM并不是通过类似子属性改变冒泡到父属性这样的机制
//而是为指令路径上的每一级属性，都添加相同回调，不论哪一级属性发生改变，都会导致回调触发
var MVVM = {
    init: function(options) {
        this.$opstions = options;
        this.data = options.data; //需要对数据加以监听
        this.methods = options.methods; //事件处理函数是不监听的
        var ob = Object.create(Observer);
        ob.init(this.data); //对data加以监控
        var self = this;
        Object.keys(this.data).forEach(function(key) {
            self._proxy(key);
        });
        this.$compile = Object.create(Compile);
        this.$compile.init(options.el, this);

    },
    //可以使用vm.prop直接访问，不需要通过vm.data.prop访问
    _proxy: function(key) {
        //var data={data:{a:1,b:{bb:2}}};
        //var vue=Object.create(MVVM); vue.init(data);
        //这种代理看起来似乎只能get或者set一级子属性,如vue.b,不能实现vue.b.bb
        //然而事实上是可以的，因为vue.b.bb事实上也是先执行了vue.b的get操作，既然能够得到vue.b，那么自然也能够得到vue.b.bb
        //同理，vue.b.bb=3;这种赋值操作，也是先进行了vue.b的get操作，再执行了针对bb的set操作
        var self = this;
        Object.defineProperty(this, key, {
            enumerable: true,
            configurable: true,
            get: function() {
                return self.data[key];
            },
            set: function(newVal) {
                self.data[key] = newVal;
            },
        });
    },
};