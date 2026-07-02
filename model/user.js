const mongo = require("mongoose")

const user_schema = new mongo.Schema({
    user_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    point: {
        type: Number,
        required: true
    },
    image: {
        type: String
    }
}, {
    timestamps: true
})

module.exports = mongo.model("User", user_schema)