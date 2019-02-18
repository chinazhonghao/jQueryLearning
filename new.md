## JavaScript new运算符

### 语法

```
new constructor[([arguments])]
```

* ```constructor```：一个指定对象实例的类型的类或者函数
* ```arguments```：一个用来被constructor调用的参数列表

创建一个对象类型，需要创建一个指定其名称和属性的函数

### 当我们使用new时会发生什么

以```let f = new Foo(...);```为例：

* 一个继承自Foo.prototype的新对象被创建
	```
	function Foo() {}
	Foo.a = 'Foo';
	let f = new Foo();
	console.log(f.__proto__ === Foo.prototype); // true
	console.log(Foo.a); // Foo
	console.log(f.a); // undefined
	```
	* 也就是说 f.__proto__指向了Foo.prototype属性
	* 由此可以看出继承的实质是：新对象继承了其父对象的prototype属性，没有继承其父对象的其他属性
* 使用指定的参数调用构造函数Foo，并**将this绑定到新创建的对象**
	```
	function FooThis(params) {
		this.params = params;
	}
	let fThis = new FooThis('this');
	console.log(FooThis.params); // undefined
	console.log(fThis.params); // this
	```
	* 可以看到，在```new FooThis('this')```的过程中，this就是fThis，最终在fThis对象上绑定了属性params
* 由构造函数返回的对象就是new表达式的结果。如果构造函数没有显式返回对象，则返回继承自Foo.prototype的对象
	* 使用new来创建对象时，如果return的非对象会忽略返回值
	* 如果return的是对象，则返回该对象--该对象并没有继承构造函数的prototype属性
	```
	function FooReturn(){
		return 'Hello, Return!';
	}
	
	let fReturn = new FooReturn();
	console.log(fReturn); // FooReturn {}
	
	function FooReturn1(){
		return {}
	}
	let fReturn1 = new FooReturn1();
	console.log(fReturn1); // {}
	
	console.log(fReturn.__proto__ === FooReturn.prototype); // true
	console.log(fReturn1.__proto__ === FooReturn1.prototype); // false
	```