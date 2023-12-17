const mongoose = require("mongoose");


const userSchema = new mongoose.Schema({
    smebId: {
        type: Number
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    gender:{
        type: String,
        required: true,
    },
    mobile:{
        type: String,
        required: true
    },
    photo: String,
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
        default: "member",
        enum: ["member", "life time member", "general secretary", "admin", "admin secretary", "president"]
    },
    whatsapp: String,
    telegram: String,
    status: {
        type: String,
        default: "admin secretary",
        enum: ["admin secretary", "general secretary", "president", "active"]
    },
    agreeWithCondition: {
        type: Boolean,
        required: true,
        default: true
    },
    emailVerified:{
        type: Boolean,
        default: false
    },
    payments:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Payment"
    }],
    posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post"
    }],
    forums: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Forum"
    }],
},{
    timestamps: true
});

const User = mongoose.model("User", userSchema);

module.exports = User