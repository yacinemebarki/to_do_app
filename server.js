require("dotenv").config()

const express = require("express")
const mongo = require("mongoose")
const path = require("path")
const bycrypt = require("bcrypt")
const mailer = require("nodemailer")

const User = require("./model/user")
const Task = require("./model/task")

const app = express()
app.use(express.static("template", {
    index: false
}))
app.use(express.json())

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "template", "main.html"))
})

const transporter = mailer.createTransport({
    service: "gmail",
    auth:{
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
    }
})

async function send_mail(to, subject, text){
    try{
        await transporter.sendMail({
            from: process.env.EMAIL,
            to: to,
            subject: subject,
            text: text
        })      
    }catch(err){
        console.log(err)
    }
}

function generate_number(){
    let min = 9
    let max = 100
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const codes = new Map()
async function  verify(email){
    let number = generate_number()
    codes.set(email, number)
    let subject = "code verfication"
    let text = ` the verfication code is ${number} you should enter it`

    send_mail(email, subject, email)

    return number 
}

app.post("/verify", (req, res) => {
    const { email, code } = req.body

    const savedCode = codes.get(email)

    if (savedCode == code) {
        codes.delete(email)

        return res.json({
            success: true,
            message: "Verification successful."
        })
    }

    res.json({
        success: false,
        message: "Wrong verification code."
    })
})

mongo.connect(process.env.URI)
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err))

app.post("/sign_in", async (req, res) => {
    const {email, password} = req.body
    try{
        const user = await User.findOne({ email: email })

        if(!user){
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }
        const match = await bycrypt.compare(password, user.password)

        if(!match){
            return res.status(401).json({
                message: "Invalid email or passsword"
            })
        }

        res.json({
            success: true,
            message: "login successful"
        })
    }catch(err){
        console.log(err)
        res.status(500).json({
            message: "server error"
        })
    }
})

app.post("/sign_up", async (req, res) => {
    const {password, email, user_name} = req.body

    const exist = await User.findOne({email: email})
    if(exist){
        return res.status(400).json({
            message: "a user with that email exist"
        })
    }
    
    const result = await verify(email)
    
    if(!result){
        res.json({
            success: false,
            messgae: "fiald to send the code"
        })
    }else{
        res.json({
            success: true,
            message: "code send successful",
        })
    }
})

app.post("/add_user", (req, res) => {

})

const port = process.env.PORT
app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})