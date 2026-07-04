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

        if (userData) {
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


app.post("/sign_in", async (req, res) => {
    const { email, password } = req.body
    try {
        const user = await User.findOne({ email: email })

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }
        const match = await bycrypt.compare(password, user.password)

        if (!match) {
            return res.status(401).json({
                message: "Invalid email or passsword"
            })
        }

        res.json({
            success: true,
            message: "login successful"
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "server error"
        })
    }
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
    sign_up_data.set(email, { password, user_name })

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

const port = process.env.PORT
app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})