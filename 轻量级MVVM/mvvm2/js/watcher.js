/**
 * 用于实现消息订阅者
 * @type {Object}
 */
var Watcher = {
    /**
     * 
     * @param  {MVVM}   vm     
     * @param  {options.data对应的属性，如a.b}   props vm指令指定的需要监听的model的属性
     * @param  {回调函数，是updates成员，如textUpdater等} cb    [description]
     * @return  
     */
    init: function(vm, props, cb) {
        this.cb = cb;
        this.$vm = vm;
        this.props = props;
        //dep是消息订阅器
        this.depIdMap = {};
        this.value = this.get();
    },
    //在接收到消息时，执行update操作
    update: function() {
        //之前的值
        var oldValue = this.value;
        var value = this.get();
        if (value !== oldValue) {
            this.value = value;
            this.cb.call(this.vm, value, oldValue);
        }
    },
    /**
     * 在执行getVMval操作的时候，会触发对应监测数据的get方法
     * 在get方法里，调用了Dep.target.addDep(dep)操作，这以操作是指就是dep.addSub(watcher),也就是将watcher添加到dep对应的订阅者列表中
     * @return {[type]} [description]
     */
    get: function() {
        Dep.target = this;
        var value = this.getVMVal();
        Dep.target = null;
        return value;
    },
    getVMVal: function() {
        var val = this.$vm.data;
        this.props.split('.').forEach(function(k, i) {
            val = val[k];
        });
        return val;
    },
    // 1. 每次调用update的时候会触发相应属性的getter
    // getter里面会触发dep.depend()，继而触发这里的addDep
    // 2. 假如相应属性的dep.id已经在当前watcher的depIds里，说明不是一个新的属性
    // 则不需要将当前watcher添加到该属性的dep里
    // 3. 假如相应属性是新的属性，则将当前watcher添加到新属性的dep里
    // 如通过 vm.child = {name: 'a'} 改变了 child的值为一个对象，child.name 就是个新属性
    // 则需要将当前watcher(child.name)加入到新的 child.name 的dep里
    // 因为此时 child.name 是个新值，之前的 setter、dep 都已经失效，如果不把 watcher 加入到新的 child.name 的dep中
    // 通过 child.name = xxx 赋值的时候，对应的 watcher 就收不到通知，等于失效了
    // 4. 每个子属性的watcher在添加到子属性的dep的同时，也会添加到父属性的dep
    // 监听子属性的同时监听父属性的变更，这样，父属性改变时，子属性的watcher也能收到通知进行update
    // 这一步是在 this.get() --> this.getVMVal() 里面完成，forEach时会从父级开始取值，间接调用了它的getter
    // 触发了addDep(), 在整个forEach过程，当前wacher都会加入到每个父级过程属性的dep
    // 例如：当前watcher的是'child.child.name', 那么child, child.child, child.child.name这三个属性的dep都会加入当前watcher
    addDep: function(dep) {
        if (!this.depIdMap.hasOwnProperty(dep.id)) {
            dep.addSub(this);
            this.depIdMap[dep.id] = dep;
        }

    }
};