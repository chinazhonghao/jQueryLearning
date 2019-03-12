let proto = {};
let createdObject = Object.create(proto);
console.log(createdObject.__proto__ === proto);

let obj = {};
Object.defineProperties(obj, {
    "name": {
        value: "Cat",
        enumerable: true
    }
});
console.log(obj);

let createdObject2 = Object.create({}, {
    "name": {
        value: "Cat",
        enumerable: true
    }
});
console.log(createdObject2.hasOwnProperty("name"));