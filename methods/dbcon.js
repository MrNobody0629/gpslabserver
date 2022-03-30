var MongoClient = require('mongodb').MongoClient;

const  dburl = 'mongodb+srv://Anujv965:Anujv965@cluster0.chjxj.mongodb.net/mydb?retryWrites=true&w=majority';


const insert = async (query)=>{
    const con = await MongoClient.connect(dburl);
    const data = await con.db("mydb").collection("users").insertOne(query);
    console.log(data)
    return data;
}

const fetch = async (query)=>{
    const con = await MongoClient.connect(dburl);
    const data = await con.db("mydb").collection("users").find(query).toArray();
    console.log(data)
    return data;
}
const fetchLike = async (query)=>{
    const con = await MongoClient.connect(dburl);
    const data = await con.db("mydb").collection("users").find(query);
    console.log(data)
    return data;
}

const remove = async (query)=>{
    const con = await MongoClient.connect(dburl);
    const data = await con.db("mydb").collection("users").deleteOne(query);
    console.log(data)
    return data;
}

const update = async (query,newData)=>{
    const con = await MongoClient.connect(dburl);
    const data = await con.db("mydb").collection("users").updateOne(query,{$set:newData});
    console.log(data)
    return data;
}

module.exports = {insert,fetch,remove,update,fetchLike};