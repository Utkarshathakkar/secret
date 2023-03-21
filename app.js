require('dotenv').config();


const express=require("express");
const mongoose=require("mongoose");
const bodyparser=require("body-parser");
const ejs=require("ejs");
const path=require("path");
const encryption=require("mongoose-encryption");
const app=express();


const staticpath=path.join(__dirname ,'public');
mongoose.connect("mongodb://127.0.0.1:27017/signinform",{useNewurlparser:true})
.then(() =>{
    console.log("connection successful");
}).catch(() =>{
    console.log("some error occured");
});


const itemschema=new mongoose.Schema({
    email:String,
    password:String
});

var secret="My name is thakkar utkarsh";
itemschema.plugin(encryption,{secret:secret,encryptedFields:["password"]});




const Model=new mongoose.model("Model",itemschema);


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(bodyparser.urlencoded({extended:false}));
app.use(express.static(staticpath));

app.get("/",(req,res) =>{
    res.render('home');

});
app.get("/login",(req,res) =>{
    res.render('login');
    
});

app.get("/register",(req,res) =>{
    res.render('register');

});

app.post("/register",(req,res) =>{
    const newuser=new Model({
        email:req.body.username,
        password:req.body.password
    });

  const insertdocument=  async ()=>{
       const result=await  Model.insertMany([newuser]) ;
  }
  insertdocument();


});
app.post("/login",(req,res)=>{
   const username=req.body.username;
   const password=req.body.password;

   const finddocument=async ()=>{
      const result= await Model.findOne({email:username});
      if(result.password===password){
        res.render("secrets");
      }
   };
   finddocument();
});


app.listen(8000, () =>{
    console.log("the server is started at port number 8000");
});