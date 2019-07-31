const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const moment = require('moment');
const path = require('path');
const app = express();
const upload = multer({dest:'uploads/'})
app.set('view engine','ejs');
app.set('views', path.join(__dirname, 'views'));

mongoose.connect('mongodb://localhost/user',{useNewUrlParser : "true"})
	.then(()=>console.log("Connected to mongoDb"))
	.catch(()=>console.log("Failed to open"));

const schema = {
	image:{data:Buffer ,content-type : String},
	content:String
}

const data = mongoose.model('blog',schema);


//read and render data from database
app.get('/', async (req , res)=>
{
	let cont =  await data.find();
	res.render('index',{cont:cont});
} );

app.post('/upload' , upload.single('avatar'), async function(req , res ,next)
{
	let d = new data({
		image:req.file , 
		content: req.body
	});
	await d.save();
}

app.listen(3000,()=>console.log("server on"));