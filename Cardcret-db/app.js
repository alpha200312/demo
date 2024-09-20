const cookieParser = require("cookie-parser")
const express=require("express")
const app=express()
const jwt=require("jsonwebtoken")
app.set("view engine","ejs")
const bcrypt=require("bcrypt")
app.use(cookieParser())
const path=require("path")
const usermodel=require("./models/user")

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static(path.join(__dirname,"public")))
app.post("/back",(req,res)=>{
res.render("in")
})

app.get("/",(req,res)=>{
    res.render("in")
})
app.post("/create",(req,res)=>{
    let{username,email,password,age}=req.body;
    bcrypt.genSalt(10,(err,salt)=>{
        bcrypt.hash(password,salt,async( err,hash)=>{

            let creteduser=await usermodel.create({
                username,
                email,
                password:hash,
                age
            })
            const token=jwt.sign({email},"secret");
            res.cookie("token",token)
            res.redirect("/login")
        })
    })
})

app.get("/logout",(req,res)=>{
res.cookie("token","")
res.redirect("/")
})
app.get("/login",(req,res)=>{
    res.render("login")
})
app.post("/login",async(req,res)=>{
let user=await usermodel.findOne({email:req.body.email});
if(!user) return res.send("something went wrong");
    
    bcrypt.compare(req.body.password,user.password,function(err,result){
        if(result) {
            const token=jwt.sign({email:user.email},"secret");
        res.cookie("token",token)
            res.send("you can login")
        }
        else res.send("something is wrong")
    })
})

app.listen(3000)



/// create user account
///mongoose
///model
///usercreate=passs=hash   jwt token=>cookie
//.login =>token=>decrypt=>email
