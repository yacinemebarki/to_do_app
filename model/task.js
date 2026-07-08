const mongo = require("mongoose")

const task_schema = new mongo.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    }
}, {
    timestamps: true
})

module.exports = mongo.model("Task", task_schema)