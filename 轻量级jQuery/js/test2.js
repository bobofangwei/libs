//测试jQuery.isWIndow
// console.log(jQuery.isWindow(window));
// console.log(jQuery.isWindow(document));

//测试Jquery.error
// jQuery.error('test error');
// 
// // 测试jQuery.camelCase
// console.log(jQuery.camelCase('-ms-backgrond'));
// console.log(jQuery.camelCase('-webkit-backgrond'));

//测试isArrayLike
// var div=document.getElementsByTagName('div');
// console.log(div);
// console.log(div.nodeType);
// 
// 测试jQuery.each
// jQuery.each({'key1':'value1','key2':'value2'},function(index,value){
//     console.log(index,value);
// })

//测试类型相关函数
// var str='1a3';
// var a=function(){};
// console.log(jQuery.type(str));
// console.log(jQuery.isNumeric(str));
// console.log(jQuery.type(new Date()));
// console.log(jQuery.type([1,2]));
// console.log(jQuery.type(new Object()));
// console.log(jQuery.type(/\w+/));
// console.log(jQuery.type(a));


//测试jQuery.trime
// var str=" abc ";
// console.log(jQuery.trim(str).length);

// var arr=[1,2,3,4,3];
// console.log(arr.indexOf(3,3));
// console.log(jQuery.inArray(3,arr));

//测试jQuery.merge
// console.log(jQuery.merge([1,2],[2,3]));
// console.log(jQuery.merge({0:1,1:2,length:2},[1,3]));
// console.log(jQuery.merge({0:1,1:2,length:2},{0:2,length:1}));

// console.log(undefined==null);
// console.log(false==null);
// console.log(''==null);

//测试jQuery.makeArray
// var divs=document.getElementsByTagName('div');
// console.log(jQuery.makeArray(divs));
// var likeArr={0:1,1:3,length:2};
// console.log(jQuery.makeArray(likeArr));

//测试jQuery.grep
// var arr=[3,1,6,2];
// var ret=jQuery.grep(arr,function(i){
//     //console.log(String(this));
//     return arr[i]>2;
// });
// console.log(ret);

//测试jQuery.map
//console.log([].concat(1,3,[1,3])); 

// console.log(jQuery.map([1,3],function(i){
//     return this+1;
// }));

//测试proxy
// var a={1:'2'};
// function fn(){
//     console.log(this[1]);

// }
// fn();
// var fn2=jQuery.proxy(fn,a,3);
// fn2();

//测试swap
// var div=document.getElementById('div1');
// jQuery.swap(div,{'color':'red'},function(){
//     console.log(this.style.color);
// });
// console.log(div.style.color);

//开始测试jQuery实例相关方法和属性
//var a=jQuery('#div1');
// console.log(a);
// //console.log(a.toArray());  
// console.log(a.get(0));
//var divs=document.getElementsByTagName('div');

// console.log(a.pushStack(divs));
// a.each(function(){
//     console.log(arguments);
// });
// a.each(function(){
//     console.log(arguments);
// },'myArg');
// console.log(a.slice(2));
// console.log(a.get(0));
// console.log(a.first());
// console.log(a.last());
//console.log(a.eq(0));

//测试jQuery.fn.map
// function fn(){
//     console.log(arguments);
// }

// a.map(fn);

// // console.log($('#div2').pushStack(a).end());

// console.log(a.push());
/***回调函数部分的测试***/
// console.log('once memory'.match(/\S+/g));
// console.log(jQuery.createOptions('once unique'));
// var callback=jQuery.callbacks();
// var fn1=function(){
//     console.log('fn1',arguments);
//     return false;
// };
// var fn2=function(){
//     console.log('fn2',arguments);
// };
//测试普通模式下的各种方法
// callback.add(fn1);
// callback.add(fn2);
// callback.fire('参数'); 
// callback.remove(fn1);
// callback.fire('remove fn1之后fire');
// console.log(callback.has());
// console.log(callback.has(fn1));
// console.log(callback.has(fn2));
//测试参数stopOnFalse
// var callback2=jQuery.callbacks('stopOnFalse');
// callback2.add(fn1);
// callback2.add(fn2);
// callback2.fire();

//测试参数unique
// var callback2=jQuery.callbacks('unique');
// callback2.add(fn1);
// callback2.add(fn2);
// callback2.add(fn1);
// callback2.fire();

//测试参数once和memory
// var callback2=jQuery.callbacks('once memory');
// callback2.add(fn1);
// callback2.add(fn2);
// callback2.fire();
// callback2.add(fn1);
// callback2.add(fn2);
// console.log(callback2.getList());
// callback2.fire();
// 
// 测试异步队列
// var defer1=jQuery.Deferred();
// var defer2=jQuery.Deferred();
// console.log(defer1===defer2);
// var fnDone=function(){
//     console.log('fnDone',arguments);
// };
// var fnFail=function(){
//     console.log('fnFail',arguments);
// }
// var fnProgress=function(){
//     console.log('fnProgress',arguments);
// }
// var defer1=jQuery.Deferred();
// console.log(defer1);
// defer1.done(fnDone);
// defer1.resolve('resolve arguments');
// console.log(defer1.state());
// defer1.fail(fnFail);
// defer1.reject('reject arguments');
// console.log(defer1.state());
// defer1.progress(fnProgress);
// defer1.notify('notify args');
// defer1.notify('notify1 args');
// defer1.then(fnDone,fnFail,fnProgress);
// defer1.resolve('resolve args');
// console.log(defer1.state());
// defer1.reject('reject args');
// defer1.notify('notify args');
//defer1.always(fnDone);
//defer1.resolve('resolve args');
//测试pipe
// var defer1=jQuery.Deferred();
// var fn1=function(args){
//     console.log('fn1',args);
//     return args*2;
// };
// var fn2=function(args){
//     console.log('fn2',args);
// }
// var defer1=jQuery.Deferred();
// var defer2=defer1.pipe(fn1);
// defer1.done(fn1);
// defer2.done(fn2);
// defer1.resolve(1);

//测试异步队列中的when
// var defer1=jQuery.Deferred();
// var defer2=jQuery.Deferred();
// defer1.done(function(){
//     console.log('defer1 done',arguments);
// });
// defer2.done(function(){
//     console.log('defer2 done',arguments);
// });
// defer1.progress(function(){
//     console.log('defer1 progress',arguments);
// });
// defer2.progress(function(){
//     console.log('defer2 progress',arguments);
// });
// defer1.fail(function(){
//     console.log('defer1 fail',arguments);
// });
// defer2.fail(function(){
//     console.log('defer2 fail',arguments);
// });
// var Defer=jQuery.When(defer1,defer2);
// Defer.done(function(){
//     console.log('Defer done',arguments);
// });
// Defer.fail(function(){
//     console.log('Defer Fail',arguments);
// });
// Defer.progress(function(){
//     console.log('Defer progress',arguments);
// });
// // defer1.notify('defer1 notify');
// // defer2.notify('defer2' ,'notify');
 

// defer2.reject('defer2 ','fail');
//  var a={};
//  Object.defineProperties(a,{
//     'key1':{
//         'value':10
//     }
//  });
// a['key1']=20;
// console.log(a['key1']);

//测试jQueyr.camelCase
// var key='a';
// console.log(key.match(/\S+/g));
// 
// 测试数据缓存模块
// 
//var myData=new Data();
// console.log(myData);
// console.log(window.nodeType);
// console.log(Data.accepts(window));
//var div=document.getElementById('div1');
// myData.key(div); 
// console.log(div[myData.expando]);
// console.log(myData.cache);
//myData.set(div,{'name':'bobo','age':'26'});
// console.log(myData);
// myData.set(div,{'name':'leishao','age':'24'});
// console.log(myData);
// console.log(myData.get(div));
// console.log(myData.get(div,'name'));
// console.log(myData.get(div,'age'));
// console.log(myData.access(div));
// console.log(myData.access(div,'-name-1'));
// console.log(myData.access(div,'Name1','leishao'));
// console.log(myData.access(div,'-name-1'));

// myData.remove(div,'name');
// console.log(myData.get(div));
// console.log(myData.hasData(div));
// myData.remove(div);
// console.log(myData.get(div));
// console.log(myData.hasData(div));
// myData.discard(div);
// console.log(div[myData.expando]);
// console.log(myData.get(div));
// 
 
// jQuery.data(div,'sex','female');
// console.log(jQuery.get(div));
// jQuery.removeData(div,'sex');
// console.log(jQuery.get(div));

// jQuery._data(div,'sex','female');
// console.log(jQuery._get(div));
// jQuery._removeData(div,'sex');
// console.log(jQuery._get(div));

// var $div=$('#div1');
// console.log($div);
// $div.data('name','bobo');
// console.log($div.getData());
//console.log($div.getData());
//console.log($div.getData('name'));
// $div.removeData('name');
// console.log($div.getData());
 
/********测试jQuery的队列模块********/
// var fn1=function(next,hooks){
//     console.log('fn1',arguments); 
     
// };
// var fn2=function(next,hooks){
//     console.log('fn2',arguments);
   
// };
//var fns=[fn1,fn2];
// var div=document.getElementById('div1');
// jQuery.queue(div,'bobo',fn1);
// jQuery.queue(div,'bobo',fn2);
// var queue=jQuery.queue(div,'bobo');
// console.log(queue);
// jQuery.dequeue(div,'bobo');

//测试.queue,.dequeue,.delay,.clearQueue,.promise

// var $lis=$('li');
// $lis.queue('bobo',fn1);
 
// $lis.queue('bobo',fn2);
 
// $lis.dequeue('bobo');
// $lis.dequeue('bobo');

// var $div=$('#div1');
// $div.queue('bobo',fn1);
// $div.delay(3000,'bobo');
// $div.queue('bobo',fn2);
// // $div.dequeue('bobo');
// // $div.dequeue('bobo');
// $div.clearQueue('bobo');
// console.log($div.queue());

//测试队列模块的promise
// var $li=$('.a');
// $li.queue('bobo',fn1);
// $li.promise('bobo').done(function(){
//     console.log('promise done',arguments);
// });
// $li.dequeue('bobo');
// $li.dequeue('bobo');
// console.log($li.length);

/*****测试属性模块****/
// var div=document.getElementById('div1');
// div['name']='bobo';

// console.log(div.getAttribute('name'));
// console.log(div.name);

// var input=document.getElementById('input1');
// input.removeAttribute('disabled');
// console.log(input.className);
//+将日期转换为毫秒计数的整数 
// console.log(+new Date());   //1478656394234
// console.log(+new Date('2016/11/11 0:00'));  //1478793600000

// //将其他类型的数据转换为数字类型（多为字符串转换为数字）
// console.log(+'');   //0
// console.log(+true); //1
// console.log(+false);    //0
// console.log(+undefined);    //NaN
// console.log(+null); //0
// console.log(+NaN);  //NaN
// console.log(+'123');    //123
// console.log(+'012');    //12
// console.log(+'1xy');    //NaN

//属性操作模块测试
// var input=document.getElementById('input1');
// jQuery.attr(input,'name','bobo');
// jQuery.attr(input,'disabled','1');
// //对于表单元素，chrome会自动为其添加disabled属性
// console.log(jQuery.attr(input,'name'));
// console.log(jQuery.attr(input,'disabled'));

// var div1=document.getElementById('div1');
// jQuery.prop(div1,'name','bobo');
// console.log("jQuery.prop('name')");

// console.log(jQuery.prop(div1,'name'));
// 
// 测试.attr和.removeAttr
// $('#div1').attr('name','bobo');
// console.log($('#div1').attr('name'));

 // $('li').attr('disabled','1');
 //  $('li').removeAttr('disabled');
 //  console.log($('li').len());
 // console.log($('li').attr('disabled'));
 // 
 // $('li').prop('readonly','bobo');
 // console.log($('li').prop('readOnly'));
 // $('li').removeProp('readonly');
 // console.log($('li').prop('readOnly'));

//  //测试几个class相关的类

// $('li').addClass('a');
// //$('li').addClass('a  b');
// $('li').addClass(function(i,rawClass){
//     return rawClass+i;
// });
// console.log($('li')[0].className);

// console.log($('li')[1].className);
// $('li').removeClass(function(i,rawClass){
//     return 'a'+i;
// });
//$('li').removeClass();
// $('li').removeClass('a a0');
// 测试toggleClass
// $('li').toggleClass('b',true);
// $('li').toggleClass('a',false);
// $('li').toggleClass('b',false);
//  $('li').toggleClass('a',true);
 // $('li').toggleClass('a');
 // $('li').toggleClass('b');

//  $('li').toggleClass('a a0');
// $('li').toggleClass(true);
// console.log($('li')[0].className);
// console.log($('li')[1].className);

// var input=$('#input1');
// console.log(input.val());
// rtypenamespace = /^([^.]*)(?:\.(.+)|)$/;
// var str='bobo.leishao.click';
// console.log(rtypenamespace.exec(str));
// var namespaces=['bobo','leishao'];
// var tmp = new RegExp( "(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)" );
// console.log('bobo.leishao'.match(tmp));
// console.log('.bobo.leishao'.match(tmp));
// console.log('xianlei.bobo.xianlei.leishao.weibo'.match(tmp));
// 
// 测试事件模块
// $('#btn').on('click ',function(){
//     console.log('打开');
// });
// $('#btn').on('click ',function(){
//     console.log('关闭');
// });
//console.log(document.parentNode);
// $(document).on('click.bobo',function(e){
//     console.log('document触发');
// });
// var fn=function(e){
//     console.log(e.target+'click触发');
// }
// $('#btn').on('click mouseenter',fn);
// $('body').on('click',fn);
//$('#btn').on('click.bobo mouseenter.bobo',fn);
//测试事件删除
// $('#btn').off('.bobo',fn);

//测试one方法，即仅执行一次的事件
//测试one方法
//$('#btn').one('click',fn);
//测试时间冒泡
// $('#ul1').on('click',function(){
//     console.log('ul1 click');
// });
//测试事件手动触发
// $('#btn').trigger('click');
// var i;
// for(i=0;i<5;i++){
//     setTimeout(function(i){
//         console.log(i);
//     },1000);
// }
// var i;
// for(i=0;i<5;i++){
//     (function(){
//         var j=i;//得到一个副本
//         setTimeout(function(){
//             console.log(j);
//         },1000);
//     })();
// }

// //或者进一步简化
// //形参传递本质上是传递只的一个副本；
// //作用域冒泡到ITFE，找到了参数j，就不再向上冒泡
// for(i=0;i<5;i++){
//     (function(j){
//         //此时形参命名为j，还是叫i都无所谓
//         setTimeout(function(){
//             console.log(j);
//         },1000);
//     })(i);
// }
// 
//var foo=(function(){
//     function change(){
//         console.log('change');
//     }
//     function identify(){
//         console.log('identify');
//     }
//     return{
//         change:change,
//         identify:identify,
//     }
// })();
// 
// 尝试实现简单的模块加载器
// var MyModules=(function(){
//     var modules=[]
//     //参数name:模块名称
//     //参数deps:依赖的模块名称
//     //impl:名为name的模块实现
//     var define=function define(name,deps,impl){
//         var i=0;
//         for(i;i<deps.length;i++){
//             deps[i]=modules[deps[i]];
//         }
//         modules[name]=impl.apply(impl,deps);
//     };
//     var get =function(name){
//         return modules[name];
//     };
//     return {
//         define:define,
//         get:get
//     }
// })();

// //调用
// MyModules.define('bar',[],function(){
//     function hello(){
//         return 'hello';
//     }
//     return {
//         hello:hello,
//     };
// });
// MyModules.define('foo',['bar'],function(){
//     function awesome(){
//        console.log('foo'+bar.hello()); 
//     }
//     return{
//         awesome:awesome,
//     }    
// })
// var bar=MyModules.get('bar');
// var foo=MyModules.get('foo');
// foo.awesome();
 
// function mixin(sourceObj,targetObj){
//     for(var key in sourceObj){
//         if(!(key in targetObj)){
//             targetObj[key]=sourceObj[key];
//         }
//     }
// }

//组合式继承
// function SuperType(name){
//     this.name=name;
// }
// SuperType.prototype.sayName=function(){
//     return 'name'+this.name;
// };
// function SubType(name,age){
//     SuperType.call(this,name);
//     this.age=age;
// }
// SubType.prototype=new SuperType();

// SubType.prototype.sayAge=function(){
//     console.log('age:'+this.age);
// }

// var instance=new SubType('bobo',28);
// instance.sayName();//输出bobo
// instance.sayAge();//输出28

// //Object.create()的polyFill代码
// if(!Object.create){
//     Object.create=function(obj){
//         function Foo(){};
//         Foo.prototype=obj;
//         return new Foo();
//     };   
// }

//基于类的写法
// function SuperType(name){
//     this.name=name;
// }
// SuperType.prototype.getName=function(){
//     return this.name;
// }

// function SubType(name,age){
//     SuperType.call(this,name);
//     this.age=age;
// }
// SubType.prototype=Object.create(SuperType.prototype);
// SubType.prototype.getAge=function(){
//     return this.age;
// };
// SubType.prototype.sayHello=function(){
//     var name=this.getName();
//     return 'hello '+name;
// };


// //测试
// var instance=new SubType('bobo',28);
// console.log(instance.sayHello());//输出hello bobo
// console.log(instance.getAge());//输出28

// //采用基于委托的写法
// var superObj={
//     init:function(name){
//         this.name=name;
//     },
//     getName:function(){
//         return this.name;
//     }
// };
// var subObj=Object.create(superObj);
//不能像下面这么写了
//对象字面量的写法会创建一个新对象赋值给subObj,原来的关联就不存在了
// subObj={
//     setup:function(name,age){
//         this.init(name);
//         this.age=age;
//     },
//     sayHello:function(){
//         var name=this.getName();
//         return 'hello '+name;
//     },
//     getAge:function(){
//         return this.age;
//     }

// };
 
//只能这么写
// subObj.setup=function(name,age){
//     this.init(name);
//     this.age=age;
// };
// subObj.sayHello=function(){
//     return 'hello '+this.name;
// };
// subObj.getAge=function(){
//     return this.age;
// };
// var b1=Object.create(subObj);
// b1.setup('bobo',28);
// console.log(b1.sayHello()); //hello bobo
// console.log(b1.getAge()); //28

// var b2=Object.create(subObj);
// b2.setup('leishao',27);
// console.log(b2.sayHello()); //hello leishao
// console.log(b2.getAge()); //27

//测试事件快捷方法
// $('#btn').click(function(){
//     console.log('click');
// });

//测试ready事件
//     rootjQuery = jQuery(document);
//     completed=function(){
//         //防止重复触发
//         document.removeEventListener('DOMContentLoaded',completed,false);
//         jQuery.ready();
// //     };
// jQuery.fn.extend({
//     init: function( selector, context, rootjQuery ) {      

//         // Handle HTML strings
//         if ( typeof selector === "string" ) {
             
//         } else if ( jQuery.isFunction( selector ) ) {
//             return rootjQuery.ready( selector );
//         } 
//     },
//     ready: function( fn ) {
//         // Add the callback
//         jQuery.ready.promise().done( fn );
//         return this;
//     },   
// });
// jQuery.extend({
    

//     // Handle when the DOM is ready
//     ready: function( wait ) {        

//         // If there are functions bound, to execute
//         readyList.resolveWith( document, [ jQuery ] );

//         // Trigger any bound ready events
//         // if ( jQuery.fn.trigger ) {
//         //     jQuery( document ).trigger("ready").off("ready");
//         // }
//     },
// });
// jQuery.ready.promise = function( obj ) {
//     if ( !readyList ) {

//         readyList = jQuery.Deferred();

//         // Catch cases where $(document).ready() is called after the browser event has already occurred.
//         // we once tried to use readyState "interactive" here, but it caused issues like the one
//         // discovered by ChrisS here: http://bugs.jquery.com/ticket/12282#comment:15
//         if ( document.readyState === "complete" ) {
//             // Handle it asynchronously to allow scripts the opportunity to delay ready
//             setTimeout( jQuery.ready );

//         } else {

//             // Use the handy event callback
//             document.addEventListener( "DOMContentLoaded", completed, false );
 
//         }
//     }
//     return readyList.promise( obj );
// };
// 
// 测试时间便捷方法
// 
// $('#btn').click(function(){
//     console.log('click');
// });

 
