## jquery学习笔记

### 原型链

jQuery中代码

```
jQuery.fn = jQuery.prototype = {}
```

### [JavaScript中原型链](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Inheritance_and_the_prototype_chain)

* JavaScript语言是动态的，ES6中虽然引入class关键字，但是JavaScript任然是基于原型链的。
* 关于继承，JavaScript只有一种结构：对象；每个实例对象都有一个私有属性(__proto__)指向它的原型对象(prototype)。该原型对象也有自己的原型对象(__proto__)，层层向上直到一个对象的原型对象为null，其中：**null没有原型，作为这个原型链中的最后一个环节**

#### 继承属性

* JavaScript对象有一个指向一个原型对象的链。当试图访问一个对象的属性时，它不仅仅在该对象上搜寻，还会搜寻该对象的原型，以及**该对象的原型的原型**，依次层层向上搜索，直到找到一个名字匹配的属性或者到达原型链的末尾
* 从ES6开始可以通过Object.getPrototypeOf()和Object.setPrototypeOf俩操作实例对象中的[[Prototype]]；这个等同于**浏览器实现的非标准属性__proto__**(对原型概念的实现)
* 如果一个对象的prototype没有显示的声明过或定义过，那么__proto__的默认值就是Object.prototype，而Object.prototype也会有一个__proto__，这个就是原型链的终点，被设置为null

### __proto__和prototype区别

* 每个对象都具有一个名为__proto__的属性
* 每个函数都具有一个名为prototype的方法(方法也是对象，因此prototype也具有__proto__属性）
* 每个对象的__proto__属性指向自身构造函数的prototype
	```
	function F(){}
	let fn = new F();
	console.log(fn.__proto__ === F.prototype); // true
	```
