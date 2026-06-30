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
    stauts: {
        type: Boolean,
        required: true
    },
    user: {
        type: mongo.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, {
    timestamps: true
})

module.exports = mongo.model("Task", task_schema)