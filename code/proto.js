function F(){}
let fn = new F();
console.log(fn.__proto__ === F.prototype);