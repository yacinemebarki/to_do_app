require("dotenv").config()

const express = require("express")
const mongo = require("mongoose")

const user = require("./model/user")
const task = require("./model/task")

const app = express()
app.use(express.static("template"))
app.use(express.json())

mongo.connect(process.env.URI)
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err))

const port = process.env.PORT
app.listen(port, () => {
    console.log(`Server running on port ${port}`)
});