var isArray=Array.isArray;
var isObject=function(val){
    return Object.prototype.toString.call(val,null)==='[object Object]';
};
var define=function(obj,key,val,enumerable){
    Object.defineProperty(obj,key,val,{
        value:val,
        enumerable:!!enumerable,
        writable:true,
        configurable:true
    });
};
function hasClass(elem,className){
    return (' '+elem.className+' ').indexOf(' '+className+' ')>=0;
}

function addClass(elem,className){
    if(hasClass(elem,className)){
        return;
    }
    elem.className+=' '+className;
}
function removeClass(elem,className){
    if(hasClass(elem,className)){
        var oldClass=''+elem.className+' ';
        elem.className=oldClass.replace(' '+className+' ',' ');
    }
}
 
