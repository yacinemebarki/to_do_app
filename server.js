require("dotenv").config()

const express = require("express")
const mongo = require("mongoose")
const path = require("path")
const bycrypt = require("bcrypt")
const mailer = require("nodemailer")

const User = require("./model/user")
const Task = require("./model/task")

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

const app = express()
app.use(express.static("template"))
app.use(express.json())

mongo.connect(process.env.URI)
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err))

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "template", "main.html"))
})

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

app.post("/sing_up", async (req, res) => {
    const {password, email, user_name} = req.body

    const exist = await User.findOne({email: email})
    if(exist){
        return res.status(400).json({
            message: "a user with that email exist"
        })
    }

    let random = generate_number()

    
})


const port = process.env.PORT
app.listen(port, () => {
    console.log(`Server running on port ${port}`)
});