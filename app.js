require('dotenv').config();
const express=require("express");
const mongoose=require("mongoose");
const bodyparser=require("body-parser");
const ejs=require("ejs");
const path=require("path");
const bcrypt=require("bcrypt");
const saltround=10;
//
const encrypt=require("mongoose-encryption");
const app=express();
 // console.log(process.env.API_KEY);

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


//itemschema.plugin(encrypt,{secret:process.env.SECRET,encryptedFields:["password"]});

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

    bcrypt.hash(req.body.password,saltround,(err,hash)=>{
        const newuser=new Model({
            email:req.body.username,
            password:hash
        });
    
      const insertdocument=  async ()=>{
        await  Model.insertMany([newuser]) ;
        res.render('secrets');
      }
      insertdocument()
    });
    


});
app.post("/login",(req,res)=>{
   const username=req.body.username;
   const password=req.body.password

   const finddocument=async ()=>{
      const result= await Model.findOne({email:username});
      bcrypt.compare(password,result.password,(err,result)=>{
        if(result===true){
            res.render('secret');
        }
      })
   };
   finddocument();
});


app.listen(8000, () =>{
    console.log("the server is started at port number 8000");
});