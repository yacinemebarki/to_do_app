require("dotenv").config()

const express = require("express")
const mongo = require("mongoose")
const path = require("path")
const bycrypt = require("bcrypt")

const User = require("./model/user")
const Task = require("./model/task")

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


const port = process.env.PORT
app.listen(port, () => {
    console.log(`Server running on port ${port}`)
});