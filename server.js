require("dotenv").config()

const express = require("express")
const mongo = require("mongoose")
const path = require("path")
const bycrypt = require("bcrypt")
const mailer = require("nodemailer")

const User = require("./model/user")
const Task = require("./model/task")

const app = express()
app.use(express.static("public", {
    index: false
}))
app.use(express.json())

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "main.html"))
})

mongo.connect(process.env.URI)
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err))

const transporter = mailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
    }
})

//sign up
async function send_mail(to, subject, text) {
    try {
        await transporter.sendMail({
            from: process.env.EMAIL,
            to: to,
            subject: subject,
            text: text
        })
    } catch (err) {
        console.log(err)
    }
}

function generate_number() {
    let min = 9
    let max = 100
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const codes = new Map()
const sign_up_data = new Map()

async function verify(email) {
    let number = generate_number()
    codes.set(email, number)
    let subject = "code verfication"
    let text = ` the verfication code is ${number} you should enter it`

    send_mail(email, subject, text)

    return number
}

app.post("/verify", async (req, res) => {
    const { email, code } = req.body
    
    const savedCode = codes.get(email)
    const parsedCode = parseInt(code)

    if (savedCode === parsedCode) {
        codes.delete(email)
        const userData = sign_up_data.get(email)

        if (!userData) {
            return res.status(400).json({
                success: false,
                message: "No pending verification request for this email."
            })
        }

        if (userData.type === "up") {
            try {
                const hashedPassword = await bycrypt.hash(userData.password, 10)
                const newUser = new User({
                    user_name: userData.user_name,
                    email: email,
                    password: hashedPassword,
                    point: 0
                })

                await newUser.save()
                sign_up_data.delete(email)

                return res.json({
                    success: true,
                    message: "Verification successful. Account created!"
                })
            } catch (err) {
                console.log(err)
                return res.status(500).json({
                    success: false,
                    message: "Error creating account"
                })
            }
        }

        if (userData.type === "in") {
            try {
                const user = await User.findOne({ email })
                if (!user) {
                    sign_up_data.delete(email)
                    return res.status(400).json({
                        success: false,
                        message: "User does not exist."
                    })
                }

                const passwordMatch = await bycrypt.compare(userData.password, user.password)
                if (!passwordMatch) {
                    sign_up_data.delete(email)
                    return res.status(400).json({
                        success: false,
                        message: "Incorrect password or email"
                    })
                }

                sign_up_data.delete(email)
                return res.json({
                    success: true,
                    message: "Verification successful."
                })
            } catch (err) {
                console.log(err)
                sign_up_data.delete(email)
                return res.status(500).json({
                    success: false,
                    message: "Error verifying sign in."
                })
            }
        }

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



app.post("/sign_up", async (req, res) => {
    const { password, email, user_name } = req.body

    const exist = await User.findOne({ email: email })
    if (exist) {
        return res.status(400).json({
            message: "a user with that email exist",
            success: false
        })
    }
    const type = "up"
    sign_up_data.set(email, { password, user_name , type})

    const result = await verify(email)

    if (!result) {
        sign_up_data.delete(email)
        res.json({
            success: false,
            message: "failed to send the code"
        })
    } else {
        res.json({
            success: true,
            message: "code send successful. Please verify your email.",
            email: email
        })
    }
})

//sign in
app.post("/sign_in", async (req, res) => {
    const { password, email } = req.body

    const exist = await User.findOne({ email: email })
    if (!exist) {
        return res.status(400).json({
            message: "you must sign up first",
            success: false
        })
    }
    const type = "in"
    sign_up_data.set(email, {password, type})

    const result = await verify(email)

    if (!result) {
        sign_up_data.delete(email)
        res.json({
            success: false,
            message: "failed to send the code"
        })
    } else {
        res.json({
            success: true,
            message: "code send successful. Please verify your email.",
            email: email
        })
    }
})


app.post("/user", async (req, res) => {
    const {email} = req.body

    try {
        const user = await User.findOne( { email: email })
        const tasks = await Task.find({ email: email})
        console.log(user.user_name)        
        res.json({
            user_name: user.user_name,
            point: user.point,
            task: tasks
        })
    }catch(err){
        console.log(err)
    }
})

app.post("/add_task", async(req, res) => {
    const {email, time, title, des, status} = req.body

    try{
        const exist = await Task.findOne({email: email, title: title, time: time})
        if(exist){
            res.json({
                success: false,
                message: "this task exist"
            })
        }
        const task = new Task({
            title: title,
            description: des,
            time: time,
            status: status,
            email: email                      
        })
        await task.save()
        return res.json({
            success: true,
            message: "task add success"
        })
        console.log("task add success")
    }catch(err){
        console.log(err)
    }
})

app.post("/remove_task", async(req, res) => {
    const {email, title, time} = req.body
    try{
        await Task.deleteOne({
            email: email,
            title: title,
            time: time
        })
        return res.json({
            success: true,
            message: "task removed success"
        })
        console.log("deleted")
    }catch(err){
        console.log(err)
    }
})

const port = process.env.PORT
app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})