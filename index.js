const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const moment = require('moment');
const path = require('path');
const app = express();
const upload = multer({dest:'public/uploads/'})
app.set('view engine','ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static('public'));


mongoose.connect('mongodb://localhost/user',{useNewUrlParser : "true"})
	.then(()=>console.log("Connected to mongoDb"))
	.catch(()=>console.log("Failed to open"));

const schema = {
	image:String,
	title:String,
	category:String,
	body:String
}

const data = mongoose.model('blog',schema);


//read and render data from database
app.get('/', async (req , res)=>
{
	let cont =  await data.find();
	res.render('index',{cont:cont});
} );

app.post('/upload' , upload.single('pic'), async function(req , res ,next)
{
	let body = req.body.content.replace("<p>","").replace("</p>" , "").replace("public/","");
	let imagePath = req.file.path.replace("public","");
	let d = new data({
		image:imagePath, 
		title: req.body.title,
		category:req.body.category,
		body:body
	});
	await d.save();
	res.send("Done");
});

app.get('/appPost' , (req , res)=>{
	res.render('addPost');
})

app.listen(3000,()=>console.log("server on"));