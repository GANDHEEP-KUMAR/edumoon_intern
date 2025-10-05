let firstDiv = document.getElementById("hello");
console.log(firstDiv);
let secondDiv = document.getElementsByClassName("hello-class");
console.log(secondDiv);
let thirdDiv = document.querySelector("#hello");
console.log(thirdDiv);
console.log(thirdDiv.classList);
// document.getElementById("hello") === document.querySelector("#hello");
let fourthDiv = document.querySelectorAll(".hello-class");
console.log(thirdDiv.innerHTML);

const button = document.getElementById("myButton");
console.log(button);
// all the user-actions work on events.

button.addEventListener("click", function() {
    console.log("Clicked");
    alert("Button was clicked!");
})

const inputField = document.getElementById("myInput");
console.log(inputField);
// debugger
inputField?.addEventListener("change", function() {
    console.log("Input changed", inputField.value);
});


const arr = [];
console.log(arr);
console.log(arr.length);

arr.push("Hello");
arr.push("World");
arr.push(1);
arr.push(20.0);
arr.push(true);

console.log(arr);
console.log(arr.length);

console.log(arr[1]);
arr[1] = "World2";
console.log(arr[1]);

console.log(arr[10]);

console.log("Iterating through the array:");
for (let i = 0; i < arr.length; i++) {
    // 0 to 4
    console.log(arr[i]);
}

console.log("Iterating through the array with forEach:");
console.log(arr.forEach(function(item) {
    console.log("Item is", item);
}));

const mapData = arr.map(function(item) {
    return item;
})
console.log("Mapped data:", mapData);

//            0  1  2  3  4
const data = [1, 2, 3, 4, 5];

console.log(data.map(function(item){ return item * 2; }));

const filteredData = data.filter(function(item, index) {
    return index % 2 === 0;
});
console.log("Filtered data:", filteredData);

const indexValue = data.findIndex(function(item) {
    return item === 3;
});
console.log("Finded index:", indexValue);

const findedValue = arr.find(function(item) {
    return item === "World23";
});
console.log("Finded value:", findedValue);


const findedValue2 = arr.find(function(item) {
    return item.includes("Wo");
});
console.log("Finded value 2:", findedValue2);

const myObject = {
    name: "John",
    age: 30,
    isActive: true,
    hobbies: ["reading", "gaming", "coding"]
};
const myObject2 = {
    name1: "John Deo",
    age1: 30,
    isActive1: false,
    hobbies1: ["reading", "gaming", "coding"]
};
console.log("My object:", myObject);
console.log("My object name:", myObject.name);
console.log("My object age:", myObject.age);
console.log("My object hobbies:", myObject.hobbies);

const dataArray = [myObject, myObject2];
console.log("Data array:", dataArray);

console.log(dataArray.map(function(item) { return item.name; }));
console.log(dataArray.filter(function(item) { return item.isActive; }));

const targetObject = { ...myObject, ...myObject2 };
console.log("Target object:", targetObject);

myObject.name = "Jane";
console.log("Updated myObject:", myObject);
myObject["name"] = "Jane Doe";
console.log("Updated myObject with bracket notation:", myObject);

function greet() {
    console.log("Hello, World!");
}

myObject.greet = greet;
console.log("My object with greet function:", myObject);

// destruct an object
const { name, age, isActive, hobbies } = myObject;
console.log("Destructured name:", name);
console.log("Destructured age:", age);
console.log("Destructured isActive:", isActive);
console.log("Destructured hobbies:", hobbies);

// JSON - JavaScript Object Notation
const jsonString = JSON.stringify(myObject); // Convert object to JSON string
console.log("JSON string:", jsonString);
const jsonString1 = `{"name": "Jane Doe","age":30,"isActive":true,"hobbies":["reading","gaming","coding"]}`;
console.log(JSON.parse(jsonString1)); // Convert JSON string to object

// const localStorageData = localStorage.getItem("edumoon");
// console.log("Local Storage Data:", localStorageData);
localStorage.setItem("edumoon", JSON.stringify(myObject));
const localStorageData2 = localStorage.getItem("edumoon");
console.log("Local Storage Data 2:", localStorageData2);
console.log("Local Storage Data 2 as object:", JSON.parse(localStorageData2));
