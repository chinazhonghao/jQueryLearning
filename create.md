## 探索Object.create

### 语法

```Object.create(proto, [propertiesObject])```

#### 参数介绍

* proto
	* 新创建对象的原型对象
* propertiesObject
	* 可选参数。该参数表示将要添加到新创建对象的可枚举属性（自身定义的属性，而不是其原型链上的枚举属性）
	* 对应于**Object.defineProperties()**的第二个参数
* 返回值
	* 带着指定的原型对象和属性的新对象
* 异常
	* 如果propertiesObject被指定为一个非对象的类型，会抛出TypeError异常

### 返回值

* 返回值是一个Object
* 返回值的原型也就是Object.__proto__被指定为proto

#### 代码示例

```
let proto = {};
let createdObject = Object.create(proto);
console.log(createdObject.__proto__ === proto);
```

* 打印结果为: true

### 第二个参数: propertiesObject

#### Object.defineProperties

##### 语法

```Object.defineProperties(obj, props)```

##### 参数

* obj
	* 在obj上定义或修改属性对象
* props: 由以下键构成的对象
	* configurable: 表示该属性是否可以从对象中删除
	* enumerable: 表示该属性是否可以被枚举
	* value: 该属性的值
	* writable: 该属性的值是否可以改变
	* get: 作为该属性的getter函数
	* set: 作为属性的setter函数

##### 代码示例

```
let obj = {};
Object.defineProperties(obj, {
    "name": {
        value: "Cat",
        enumerable: true
    }
});
console.log(obj);
```

* 打印结果为: {name: 'Cat'}

### Object.create带propertiesObject参数

```
let createdObject2 = Object.create({}, {
    "name": {
        value: "Cat",
        enumerable: true
    }
});
console.log(createdObject2.hasOwnProperty("name"));
```

* 打印结果: true
* 可以看出定义的参数是新对象的自身的属性