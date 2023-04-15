const array = [2,2,3,4,5];
const dup = Array.from(new Set(array));
console.log(dup);

let mysymbl = Symbol('raklesh');
let mysymbl2 = Symbol('rakesh');

let obj = {
    [mysymbl] : 'mysymbol',
    [mysymbl2] : function(){
        return true;
    },
    a:5
}

console.log(obj[mysymbl]);


console.log(Object.getOwnPropertyNames(obj));
console.log(Object.getOwnPropertySymbols(obj));



var fun = function(){
   return true; 
}

let fun2 = ()=>2+3;

console.log(fun2());


var myObj = {

    run: function() {
        
        return () =>  //notice the syntax. 
            console.log(this);
    }

}

myObj.run()();

'use strict'

var function2 = function(){
    console.log(this);
}


let function3 = ()=>{
    console.log(this)
};


function3();


var objectr1 = {

    'name' : 'rakesh'


}


var person = {
    fullName: function() {
      return this.firstName + " " + this.lastName;
    }
  }
  var person1 = {
    firstName:"John",
    lastName: "Doe",
  }
  var person2 = {
    firstName:"Mary",
    lastName: "Doe",
  }
 console.log( person.fullName.call(person2));  // Will return "John Doe" 


 console.log(Math.max(...[3,8,10]));

 const getdata = ()=>{
     return new Promise((resolve,reject)=>{
         setTimeout(()=>{
            resolve('data');
         },3000)
     })
 }
  

 const data = async ()=>{
     let main = await getdata();
 }


 let obj2 = {
     a : 1,
     b :3
 }

 let obj3 = [1,4,7];

 for(let h of  obj3){
     console.log(h);
 }