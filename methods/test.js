const db = require('./dbcon.js');


const myFun = async ()=>{ 
    console.log(await db.update({email: 'anujv962dcs@gmail.com'},{name: 'aman verma',contact: '9889447117'}))
}

myFun();