const db = require('./methods/dbcon.js');
const express = require('express');
const bodyParser = require('body-parser');
const path = require("path")
const multer = require("multer")
var cors = require('cors');
const jwt = require('jsonwebtoken');


const app = express();
const port = process.env.PORT || 3001;

// app.set("views",path.join(__dirname,"views"))
// app.set("view engine","ejs")
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors());


var storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "uploads")
	},
	filename: function (req, file, cb) {
	cb(null, file.fieldname + "-" + Date.now()+".jpg")
	}
})
const maxSize = 1 * 1000 * 1000;
var upload = multer({
	storage: storage,
	limits: { fileSize: maxSize },
	fileFilter: function (req, file, cb){
		var filetypes = /jpeg|jpg|png/;
		var mimetype = filetypes.test(file.mimetype);
		var extname = filetypes.test(path.extname(
					file.originalname).toLowerCase());
		if (mimetype && extname) {
			return cb(null, true);
		}
		cb("Error: File upload only supports the "
				+ "following filetypes - " + filetypes);
	}
}).single("mypic");

app.post("/uploadProfilePicture",function (req, res, next) {
	upload(req,res,function(err) {
		if(err) {
			res.send({status:'-1',result:err})
		}
		else {
			res.send({status:'1',result:"Success, Image uploaded!"})
		}
	})
})
app.post('/insertNewUser',async (req,res)=>{
    const {name,email,contact,gender,password} = req.body;
    const findRes = await db.fetch({email:email});
    if( findRes.length> 0 )
    res.send({status:'-1',result:findRes[0].email+' Already Exist'})
    else
    {
        res.send({status:'1',result:await db.insert({name,email,contact,gender,password})})
    }
})
app.post('/getUserData',async (req,res)=>{
    console.log(req.body)
    const {email,password} = req.body;
    const findRes = await db.fetch({email,password});
    if( findRes.length> 0 )
    {
        const token =  await jwt.sign({email:findRes[0].email},'ABCEFGHIJKLMNOPQRSTUVWXYZQWERTY');
        findRes[0].token = token;
        res.send({status:'1',result:findRes[0]})
    } 
    else
    res.send({status:'-1',result:'Invalid User Credential'})
})

app.post('/validateToken',async (req,res)=>{
    try {
        console.log(req.body)
        const {token} = req.body;
        const verData = await jwt.verify(token,'ABCEFGHIJKLMNOPQRSTUVWXYZQWERTY')
        const findRes = await db.fetch({email:verData.email});
        res.send({status:'1',result:findRes[0]})
    } catch (err) {
        res.send({status:'-1',result:'Something went wrong'})
    }
})

app.post('/updateUserData',async (req,res)=>{
    const {name,email,contact,gender,password} = req.body;
    const updateRes = await db.update({email:email},{name,contact,gender,password});
    console.log(updateRes)
    if( updateRes.acknowledged == true)
    res.send({status:'1',result:updateRes})
    else
    {
        res.send({status:'-1',result:updateRes})
    }
})

app.listen(port,(req,res)=>{
    console.log('http://localhost:'+port)
})