// inherit
function Foo() {}
Foo.a = 'Foo';
let f = new Foo();
console.log(f.__proto__ === Foo.prototype);
console.log(Foo.a);
console.log(f.a);

// bind this
function FooThis(params) {
	this.params = params;
}
let fThis = new FooThis('this');
console.log(FooThis.params);
console.log(fThis.params);

// return
function FooReturn(){
	return 'Hello, Return!';
}

let fReturn = new FooReturn();
console.log(fReturn);

function FooReturn1(){
	return {}
}
let fReturn1 = new FooReturn1();
console.log(fReturn1);

console.log(fReturn.__proto__ === FooReturn.prototype);
console.log(fReturn1.__proto__ === FooReturn1.prototype);
